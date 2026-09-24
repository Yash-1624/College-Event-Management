const mongoose = require("mongoose");

const Registration = require("../models/Registration");
const Payment = require("../models/Payment");

const {
    createRazorpayOrder,
    verifyRazorpayPayment
} = require("../services/paymentService");


// ========================================
// CREATE PAYMENT / RAZORPAY ORDER
// ========================================

const createPayment = async (req, res) => {

    try {

        const {
            registrationId
        } = req.body;


        // ========================================
        // VALIDATE REGISTRATION ID
        // ========================================

        if (
            !registrationId ||
            !mongoose.Types.ObjectId.isValid(
                registrationId
            )
        ) {

            return res.status(400).json({
                success: false,
                message: "Invalid registration ID."
            });
        }


        // ========================================
        // FIND REGISTRATION
        // ========================================

        const registration =
            await Registration.findById(
                registrationId
            )
                .populate("event")
                .populate("student");


        if (!registration) {

            return res.status(404).json({
                success: false,
                message: "Registration not found."
            });
        }


        // ========================================
        // CHECK OWNERSHIP
        // ========================================

        if (
            registration.student._id.toString() !==
            req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({
                success: false,
                message:
                    "You are not allowed to pay for this registration."
            });
        }


        // ========================================
        // ALREADY CONFIRMED
        // ========================================

        if (
            registration.registrationStatus ===
            "Confirmed"
        ) {

            const existingPayment =
                await Payment.findOne({
                    registration:
                        registration._id
                });


            return res.status(200).json({

                success: true,

                alreadyPaid: true,

                payment:
                    existingPayment,

                registration

            });
        }


        // ========================================
        // CHECK EVENT
        // ========================================

        if (!registration.event) {

            return res.status(400).json({
                success: false,
                message:
                    "Event information not found for this registration."
            });
        }


        // ========================================
        // GET EVENT FEE
        // ========================================

        const eventFee =
            Number(
                registration.event.fee
            ) || 0;


        if (eventFee < 0) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid event fee."
            });
        }


        // ========================================
        // FIND / CREATE PAYMENT RECORD
        // ========================================

        let payment =
            await Payment.findOne({
                registration:
                    registration._id
            });


        if (!payment) {

            payment =
                await Payment.create({

                    registration:
                        registration._id,

                    student:
                        registration.student._id,

                    amount:
                        eventFee,

                    currency:
                        "INR",

                    paymentMethod:
                        "RAZORPAY",

                    gateway:
                        "RAZORPAY",

                    status:
                        "Pending"

                });

        } else {

            // Keep payment information synchronized
            payment.amount = eventFee;
            payment.currency = "INR";
            payment.gateway = "RAZORPAY";

            await payment.save();
        }


        // ========================================
        // FREE EVENT
        // ========================================

        if (eventFee === 0) {

            payment.status =
                "Successful";

            payment.transactionId =
                `FREE-${Date.now()}`;

            payment.paymentMethod =
                "FREE";

            await payment.save();


            registration.payment.status =
                "Successful";

            registration.payment.paymentId =
                payment._id;

            registration.registrationStatus =
                "Confirmed";

            await registration.save();


            // Generate ticket for free event
            let ticket = null;

            try {

                const {
                    createTicket
                } =
                    require(
                        "../services/ticketService"
                    );


                ticket =
                    await createTicket({
                        registrationId:
                            registration._id
                    });

            } catch (ticketError) {

                console.error(
                    "Free event ticket creation error:",
                    ticketError
                );
            }


            return res.status(200).json({

                success: true,

                freeEvent: true,

                payment,

                registration,

                ticket

            });
        }


        // ========================================
        // CREATE RAZORPAY ORDER
        // ========================================

        console.log(
            "Creating Razorpay order..."
        );

        console.log(
            "Amount:",
            eventFee
        );

        console.log(
            "Registration:",
            registration.registrationId
        );

        console.log(
            "Razorpay Key ID loaded:",
            process.env.RAZORPAY_KEY_ID
                ? "YES"
                : "NO"
        );

        console.log(
            "Razorpay Secret loaded:",
            process.env.RAZORPAY_KEY_SECRET
                ? "YES"
                : "NO"
        );


        const order =
            await createRazorpayOrder({

                amount:
                    eventFee,

                receipt:
                    registration.registrationId,

                notes: {

                    registrationId:
                        registration._id.toString(),

                    eventId:
                        registration.event._id.toString(),

                    studentId:
                        registration.student._id.toString()

                }

            });


        // ========================================
        // SAVE RAZORPAY ORDER
        // ========================================

        payment.razorpayOrderId =
            order.id;

        payment.status =
            "Pending";

        await payment.save();


        // ========================================
        // UPDATE REGISTRATION PAYMENT
        // ========================================

        registration.payment.status =
            "Pending";

        registration.payment.paymentId =
            payment._id;

        await registration.save();


        // ========================================
        // SEND RESPONSE
        // ========================================

        return res.status(200).json({

            success: true,

            message:
                "Razorpay order created successfully.",

            payment,

            registration,

            razorpay: {

                keyId:
                    process.env.RAZORPAY_KEY_ID,

                orderId:
                    order.id,

                amount:
                    order.amount,

                currency:
                    order.currency

            }

        });

    } catch (error) {

        // ========================================
        // DETAILED ERROR LOG
        // ========================================

        console.error(
            "========================================"
        );

        console.error(
            "CREATE RAZORPAY PAYMENT ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "Full Error:",
            error
        );

        console.error(
            "========================================"
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Unable to create payment."

        });
    }
};


// ========================================
// VERIFY RAZORPAY PAYMENT
// ========================================

const verifyPayment = async (req, res) => {

    try {

        const {

            registrationId,

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = req.body;


        // ========================================
        // VALIDATE PAYMENT DATA
        // ========================================

        if (
            !registrationId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Incomplete payment information."

            });
        }


        // ========================================
        // VALIDATE REGISTRATION ID
        // ========================================

        if (
            !mongoose.Types.ObjectId.isValid(
                registrationId
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid registration ID."

            });
        }


        // ========================================
        // FIND REGISTRATION
        // ========================================

        const registration =
            await Registration.findById(
                registrationId
            )
                .populate("event")
                .populate("student");


        if (!registration) {

            return res.status(404).json({

                success: false,

                message:
                    "Registration not found."

            });
        }


        // ========================================
        // VERIFY OWNERSHIP
        // ========================================

        if (
            registration.student._id.toString() !==
            req.user._id.toString() &&
            req.user.role !== "admin"
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Payment verification not allowed."

            });
        }


        // ========================================
        // FIND PAYMENT
        // ========================================

        const payment =
            await Payment.findOne({

                registration:
                    registration._id

            });


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment record not found."

            });
        }


        // ========================================
        // VERIFY ORDER ID
        // ========================================

        if (
            payment.razorpayOrderId &&
            payment.razorpayOrderId !==
            razorpay_order_id
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Razorpay order ID does not match."

            });
        }


        // ========================================
        // VERIFY SIGNATURE
        // ========================================

        const valid =
            verifyRazorpayPayment({

                orderId:
                    razorpay_order_id,

                paymentId:
                    razorpay_payment_id,

                signature:
                    razorpay_signature

            });


        if (!valid) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment signature verification failed."

            });
        }


        // ========================================
        // SAVE PAYMENT
        // ========================================

        payment.status =
            "Successful";

        payment.paymentMethod =
            "RAZORPAY";

        payment.gateway =
            "RAZORPAY";

        payment.transactionId =
            razorpay_payment_id;

        payment.razorpayOrderId =
            razorpay_order_id;

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;


        await payment.save();


        // ========================================
        // CONFIRM REGISTRATION
        // ========================================

        registration.payment.status =
            "Successful";

        registration.payment.paymentId =
            payment._id;

        registration.registrationStatus =
            "Confirmed";


        await registration.save();


        // ========================================
        // GENERATE EVENT ENTRY TICKET
        // ========================================

        let ticket = null;


        try {

            const {
                createTicket
            } =
                require(
                    "../services/ticketService"
                );


            ticket =
                await createTicket({

                    registrationId:
                        registration._id

                });

        } catch (ticketError) {

            console.error(
                "Ticket creation error:",
                ticketError
            );

            // Payment remains successful.
            // Ticket can be generated again later.
        }


        // ========================================
        // RESPONSE
        // ========================================

        return res.status(200).json({

            success: true,

            message:
                "Payment successful.",

            payment,

            registration,

            ticket

        });

    } catch (error) {

        // ========================================
        // DETAILED ERROR LOG
        // ========================================

        console.error(
            "========================================"
        );

        console.error(
            "VERIFY RAZORPAY PAYMENT ERROR"
        );

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "Full Error:",
            error
        );

        console.error(
            "========================================"
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Payment verification failed."

        });
    }
};


// ========================================
// EXPORT
// ========================================

module.exports = {

    createPayment,

    verifyPayment

};