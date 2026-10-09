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

const getPayments = async (req, res) => {
  try {
    // Fetch payments and populate student information only.
    // Payment schema does not contain an "event" field.
    const payments = await Payment.find()
      .populate(
        "student",
        "fullName email mobileNumber collegePid collegeName yearSemester"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Get registration and event details separately.
    const paymentsWithDetails = await Promise.all(
      payments.map(async (payment) => {
        let registration = null;
        let event = null;

        if (payment.registration) {
          registration = await Registration.findById(
            payment.registration
          ).lean();

          if (registration?.event) {
            event = await Event.findById(registration.event)
              .select("name category date location fee")
              .lean();
          }
        }

        return {
          ...payment,
          registration,
          event,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: paymentsWithDetails.length,
      payments: paymentsWithDetails,
    });
  } catch (error) {
    console.error("GET ADMIN PAYMENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments.",
      error: error.message,
    });
  }
};

module.exports.getPayments = getPayments;
