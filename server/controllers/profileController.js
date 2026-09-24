/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

exports.getProfile =
    async (
        req,
        res
    ) => {

        const u =
            req.user;


        res.json({

            profile: {

                id:
                    u._id,

                fullName:
                    u.fullName,

                collegePid:
                    u.collegePid,

                collegeName:
                    u.collegeName,

                yearSemester:
                    u.yearSemester,

                mobileNumber:
                    u.mobileNumber,

                email:
                    u.email,

                role:
                    u.role,

                isEmailVerified:
                    u.isEmailVerified

            }

        });

    };


/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

exports.updateProfile =
    async (
        req,
        res,
        next
    ) => {

        try {

            const {

                fullName,

                collegePid,

                collegeName,

                yearSemester,

                mobileNumber

            } =
                req.body;


            if (
                !fullName ||
                !collegePid ||
                !collegeName ||
                !yearSemester ||
                !mobileNumber
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Profile fields are required."

                    });

            }


            const normalizedPid =
                collegePid
                    .trim()
                    .toUpperCase();


            /*
             * Check whether another student
             * already uses this PID.
             */
            const existing =
                await require(
                    "../models/User"
                ).findOne({

                    collegePid:
                        normalizedPid,

                    _id: {
                        $ne:
                            req.user._id
                    }

                });


            if (
                existing
            ) {

                return res
                    .status(409)
                    .json({

                        message:
                            "This College PID is already being used by another student."

                    });

            }


            req.user.fullName =
                fullName.trim();


            req.user.collegePid =
                normalizedPid;


            req.user.collegeName =
                collegeName.trim();


            req.user.yearSemester =
                yearSemester.trim();


            req.user.mobileNumber =
                mobileNumber.trim();


            await req.user.save();


            res.json({

                message:
                    "Profile updated successfully."

            });

        } catch (
        error
        ) {

            if (
                error.code ===
                11000
            ) {

                return res
                    .status(409)
                    .json({

                        message:
                            "This College PID is already registered."

                    });

            }


            next(error);

        }

    };