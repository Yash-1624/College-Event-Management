const crypto = require("crypto");

const razorpay = require("../config/razorpay");


// ========================================
// CREATE RAZORPAY ORDER
// ========================================

const createRazorpayOrder = async ({
    amount,
    receipt,
    notes = {}
}) => {

    const order =
        await razorpay.orders.create({

            amount:
                Math.round(
                    Number(amount) * 100
                ),

            currency: "INR",

            receipt,

            notes

        });


    return order;
};


// ========================================
// VERIFY RAZORPAY PAYMENT
// ========================================

const verifyRazorpayPayment = ({
    orderId,
    paymentId,
    signature
}) => {

    const body =
        `${orderId}|${paymentId}`;


    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");


    return (
        expectedSignature === signature
    );
};


module.exports = {
    createRazorpayOrder,
    verifyRazorpayPayment
};