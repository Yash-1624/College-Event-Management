const User =
    require("../models/User");

const Event =
    require("../models/Event");

const Registration =
    require("../models/Registration");

const Payment =
    require("../models/Payment");


/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS
|--------------------------------------------------------------------------
|
| GET /api/admin/students
|
*/

exports.getStudents =
    async (
        req,
        res,
        next
    ) => {

        try {

            const students =
                await User.find({
                    role: "student"
                })
                    .select(
                        "-password -otp -otpExpiresAt"
                    )
                    .sort({
                        createdAt: -1
                    });


            res.json({
                students
            });

        } catch (error) {

            next(error);

        }
    };


/*
|--------------------------------------------------------------------------
| GET STUDENT BY ID
|--------------------------------------------------------------------------
|
| GET /api/admin/students/:id
|
*/

exports.getStudentById =
    async (
        req,
        res,
        next
    ) => {

        try {

            const student =
                await User.findOne({
                    _id:
                        req.params.id,

                    role:
                        "student"
                })
                    .select(
                        "-password -otp -otpExpiresAt"
                    );


            if (!student) {

                return res
                    .status(404)
                    .json({
                        message:
                            "Student not found."
                    });

            }


            const registrations =
                await Registration.find({
                    student:
                        student._id
                })
                    .populate(
                        "event",
                        "name category date"
                    )
                    .populate(
                        "payment",
                        "status transactionId amount"
                    );


            res.json({
                student,
                registrations
            });

        } catch (error) {

            next(error);

        }
    };


/*
|--------------------------------------------------------------------------
| GET ADMIN STATISTICS
|--------------------------------------------------------------------------
|
| GET /api/admin/stats
|
*/

exports.getStats =
    async (
        req,
        res,
        next
    ) => {

        try {

            const [
                totalStudents,
                totalEvents,
                activeEvents,
                totalRegistrations,
                successfulPayments,
                pendingPayments,
                upcomingEvents
            ] =
                await Promise.all([

                    User.countDocuments({
                        role:
                            "student"
                    }),

                    Event.countDocuments(),

                    Event.countDocuments({
                        status: {
                            $in: [
                                "Published",
                                "Registration Open"
                            ]
                        }
                    }),

                    Registration.countDocuments(),

                    Payment.countDocuments({
                        status:
                            "Successful"
                    }),

                    Payment.countDocuments({
                        status:
                            "Pending"
                    }),

                    Event.countDocuments({

                        date: {
                            $gte:
                                new Date()
                        },

                        status: {
                            $nin: [
                                "Cancelled",
                                "Completed"
                            ]
                        }

                    })

                ]);


            res.json({

                stats: {

                    totalStudents,

                    totalEvents,

                    activeEvents,

                    totalRegistrations,

                    successfulPayments,

                    pendingPayments,

                    upcomingEvents

                }

            });

        } catch (error) {

            next(error);

        }
    };


/*
|--------------------------------------------------------------------------
| GET ALL PAYMENTS
|--------------------------------------------------------------------------
|
| GET /api/admin/payments
|
| Returns all payment transactions for
| the Admin Manage Payments page.
|
*/

exports.getPayments =
    async (
        req,
        res,
        next
    ) => {

        try {

            const payments =
                await Payment.find()

                    /*
                     * Student information
                     */
                    .populate(
                        "student",
                        "fullName email mobileNumber collegeName yearSemester"
                    )

                    /*
                     * Event information
                     */
                    .populate(
                        "event",
                        "name category date location fee"
                    )

                    /*
                     * Registration information
                     */
                    .populate(
                        "registration",
                        "registrationId participationType teamName numberOfMembers registrationStatus"
                    )

                    /*
                     * Latest payments first
                     */
                    .sort({
                        createdAt: -1
                    });


            res.json({

                payments

            });

        } catch (error) {

            console.error(
                "Get all payments error:",
                error
            );

            next(error);

        }
    };