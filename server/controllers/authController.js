const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");

const User =
    require("../models/User");

const generateOTP =
    require("../utils/generateOTP");

const {
    sendOTPEmail,
    sendPasswordResetEmail
} =
    require("../services/emailService");


const createToken =
    (id) =>

        jwt.sign(
            {
                id
            },

            process.env.JWT_SECRET,

            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN ||
                    "7d"
            }
        );


const publicUser =
    (user) => ({

        id:
            user._id,

        fullName:
            user.fullName,

        collegePid:
            user.collegePid,

        email:
            user.email,

        mobileNumber:
            user.mobileNumber,

        collegeName:
            user.collegeName,

        yearSemester:
            user.yearSemester,

        role:
            user.role,

        isEmailVerified:
            user.isEmailVerified,

        createdAt:
            user.createdAt

    });


/*
|--------------------------------------------------------------------------
| SIGNUP
|--------------------------------------------------------------------------
*/

exports.signup =
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

                mobileNumber,

                email,

                password,

                confirmPassword

            } =
                req.body;


            if (
                !fullName ||
                !collegePid ||
                !collegeName ||
                !yearSemester ||
                !mobileNumber ||
                !email ||
                !password
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "All signup fields are required."

                    });

            }


            if (
                password !==
                confirmPassword
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Passwords do not match."

                    });

            }


            if (
                password.length <
                6
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Password must be at least 6 characters."

                    });

            }


            // ========================================
            // NORMALIZE USER DATA
            // ========================================

            const normalizedEmail =
                String(email)
                    .toLowerCase()
                    .trim();


            const normalizedPid =
                String(collegePid)
                    .trim()
                    .toUpperCase();


            /*
             * Normalize mobile number.
             *
             * This removes spaces, -, +, etc.
             *
             * Example:
             *
             * 98765 43210
             * 98765-43210
             *
             * Both become:
             * 9876543210
             */

            let normalizedMobile =
                String(mobileNumber)
                    .replace(/\D/g, "");


            /*
             * If Indian number is entered as:
             *
             * 919876543210
             *
             * convert it to:
             *
             * 9876543210
             */

            if (
                normalizedMobile.length === 12 &&
                normalizedMobile.startsWith("91")
            ) {

                normalizedMobile =
                    normalizedMobile.slice(2);

            }


            // ========================================
            // MOBILE NUMBER VALIDATION
            // ========================================

            if (
                normalizedMobile.length !== 10
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Please enter a valid 10-digit mobile number."

                    });

            }


            /*
             * Indian mobile numbers normally start
             * from 6, 7, 8 or 9.
             */

            if (
                !/^[6-9]\d{9}$/.test(
                    normalizedMobile
                )
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Please enter a valid mobile number."

                    });

            }


            /*
             * Check email.
             */

            const existingEmail =
                await User.findOne({

                    email:
                        normalizedEmail

                });


            if (
                existingEmail
            ) {

                return res
                    .status(409)
                    .json({

                        message:
                            existingEmail.isEmailVerified

                                ? "Email is already registered."

                                : "Email exists but is not verified. Request a new OTP."

                    });

            }


            /*
             * Check College PID.
             */

            const existingPid =
                await User.findOne({

                    collegePid:
                        normalizedPid

                });


            if (
                existingPid
            ) {

                return res
                    .status(409)
                    .json({

                        message:
                            "This College PID is already registered."

                    });

            }


            /*
             * Check MOBILE NUMBER.
             *
             * A new user cannot use a mobile
             * number that already exists.
             */

            const existingMobile =
                await User.findOne({

                    mobileNumber:
                        normalizedMobile

                });


            if (
                existingMobile
            ) {

                return res
                    .status(409)
                    .json({

                        message:
                            "This mobile number is already registered. Please use another mobile number."

                    });

            }


            // ========================================
            // HASH PASSWORD
            // ========================================

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );


            const otp =
                generateOTP();


            // ========================================
            // CREATE USER
            // ========================================

            const user =
                await User.create({

                    fullName:
                        String(fullName).trim(),

                    collegePid:
                        normalizedPid,

                    collegeName:
                        String(collegeName).trim(),

                    yearSemester:
                        String(yearSemester).trim(),

                    mobileNumber:
                        normalizedMobile,

                    email:
                        normalizedEmail,

                    password:
                        hashedPassword,

                    otp,

                    otpExpiresAt:
                        new Date(
                            Date.now() +
                            10 *
                            60 *
                            1000
                        )

                });


            // ========================================
            // SEND OTP EMAIL
            // ========================================

            try {

                await sendOTPEmail(
                    user.email,
                    user.fullName,
                    otp
                );

            } catch (
            mailError
            ) {

                await User.findByIdAndDelete(
                    user._id
                );


                return res
                    .status(500)
                    .json({

                        message:
                            "Account could not be created because OTP email could not be sent. Check SMTP settings."

                    });

            }


            res
                .status(201)
                .json({

                    message:
                        "Signup successful. OTP sent to your email.",

                    email:
                        user.email

                });

        } catch (
        error
        ) {

            /*
             * Duplicate database protection.
             */

            if (
                error.code ===
                11000
            ) {

                if (
                    error.keyPattern
                        ?.collegePid
                ) {

                    return res
                        .status(409)
                        .json({

                            message:
                                "This College PID is already registered."

                        });

                }


                if (
                    error.keyPattern
                        ?.email
                ) {

                    return res
                        .status(409)
                        .json({

                            message:
                                "Email is already registered."

                        });

                }


                if (
                    error.keyPattern
                        ?.mobileNumber
                ) {

                    return res
                        .status(409)
                        .json({

                            message:
                                "This mobile number is already registered. Please use another mobile number."

                        });

                }

            }


            next(error);

        }

    };


/*
|--------------------------------------------------------------------------
| VERIFY EMAIL
|--------------------------------------------------------------------------
*/

exports.verifyEmail =
    async (
        req,
        res,
        next
    ) => {

        try {

            const {
                email,
                otp
            } =
                req.body;


            const user =
                await User
                    .findOne({

                        email:
                            email
                                ?.toLowerCase()
                                .trim()

                    })
                    .select(
                        "+otp +otpExpiresAt"
                    );


            if (
                !user
            ) {

                return res
                    .status(404)
                    .json({

                        message:
                            "User not found."

                    });

            }


            if (
                user.isEmailVerified
            ) {

                return res.json({

                    message:
                        "Email is already verified."

                });

            }


            if (
                !user.otp ||
                !user.otpExpiresAt ||
                user.otpExpiresAt <
                new Date()
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "OTP is expired. Please resend OTP."

                    });

            }


            if (
                user.otp !==
                otp
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Invalid OTP."

                    });

            }


            user.isEmailVerified =
                true;

            user.otp =
                undefined;

            user.otpExpiresAt =
                undefined;


            await user.save();


            res.json({

                message:
                    "Email verified successfully. You can now login."

            });

        } catch (
        error
        ) {

            next(error);

        }

    };


/*
|--------------------------------------------------------------------------
| RESEND OTP
|--------------------------------------------------------------------------
*/

exports.resendOTP =
    async (
        req,
        res,
        next
    ) => {

        try {

            const email =
                req.body.email
                    ?.toLowerCase()
                    .trim();


            const user =
                await User
                    .findOne({
                        email
                    })
                    .select(
                        "+otp +otpExpiresAt"
                    );


            if (
                !user
            ) {

                return res
                    .status(404)
                    .json({

                        message:
                            "User not found."

                    });

            }


            if (
                user.isEmailVerified
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Email is already verified."

                    });

            }


            const otp =
                generateOTP();


            user.otp =
                otp;

            user.otpExpiresAt =
                new Date(
                    Date.now() +
                    10 *
                    60 *
                    1000
                );


            await user.save();


            await sendOTPEmail(
                user.email,
                user.fullName,
                otp
            );


            res.json({

                message:
                    "New OTP sent."

            });

        } catch (
        error
        ) {

            next(error);

        }

    };


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

exports.login =
    async (
        req,
        res,
        next
    ) => {

        try {

            const {
                email,
                password
            } =
                req.body;


            const user =
                await User
                    .findOne({

                        email:
                            email
                                ?.toLowerCase()
                                .trim()

                    })
                    .select(
                        "+password"
                    );


            if (
                !user ||
                !(
                    await bcrypt.compare(
                        password || "",
                        user.password
                    )
                )
            ) {

                return res
                    .status(401)
                    .json({

                        message:
                            "Invalid email or password."

                    });

            }


            if (
                user.role ===
                "student" &&
                !user.isEmailVerified
            ) {

                return res
                    .status(403)
                    .json({

                        message:
                            "Please verify your email before login."

                    });

            }


            res.json({

                token:
                    createToken(
                        user._id
                    ),

                user:
                    publicUser(
                        user
                    )

            });

        } catch (
        error
        ) {

            next(error);

        }

    };


/*
|--------------------------------------------------------------------------
| ME
|--------------------------------------------------------------------------
*/

exports.me =
    async (
        req,
        res
    ) => {

        res.json({

            user:
                publicUser(
                    req.user
                )

        });

    };


/*
|--------------------------------------------------------------------------
| FORGOT PASSWORD
|--------------------------------------------------------------------------
*/

exports.forgotPassword =
    async (
        req,
        res,
        next
    ) => {

        try {

            const email =
                req.body.email
                    ?.toLowerCase()
                    .trim();


            const user =
                await User
                    .findOne({
                        email
                    })
                    .select(
                        "+otp +otpExpiresAt"
                    );


            if (
                !user
            ) {

                return res
                    .status(404)
                    .json({

                        message:
                            "User not found."

                    });

            }


            const otp =
                generateOTP();


            user.otp =
                otp;

            user.otpExpiresAt =
                new Date(
                    Date.now() +
                    10 *
                    60 *
                    1000
                );


            await user.save();


            await sendPasswordResetEmail(
                user.email,
                user.fullName,
                otp
            );


            res.json({

                message:
                    "Password reset OTP sent."

            });

        } catch (
        error
        ) {

            next(error);

        }

    };


/*
|--------------------------------------------------------------------------
| RESET PASSWORD
|--------------------------------------------------------------------------
*/

exports.resetPassword =
    async (
        req,
        res,
        next
    ) => {

        try {

            const {
                email,
                otp,
                newPassword
            } =
                req.body;


            if (
                !newPassword ||
                newPassword.length <
                6
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "New password must be at least 6 characters."

                    });

            }


            const user =
                await User
                    .findOne({

                        email:
                            email
                                ?.toLowerCase()
                                .trim()

                    })
                    .select(
                        "+password +otp +otpExpiresAt"
                    );


            if (
                !user
            ) {

                return res
                    .status(404)
                    .json({

                        message:
                            "User not found."

                    });

            }


            if (
                !user.otpExpiresAt ||
                user.otpExpiresAt <
                new Date() ||
                user.otp !==
                otp
            ) {

                return res
                    .status(400)
                    .json({

                        message:
                            "Invalid or expired OTP."

                    });

            }


            user.password =
                await bcrypt.hash(
                    newPassword,
                    12
                );

            user.otp =
                undefined;

            user.otpExpiresAt =
                undefined;


            await user.save();


            res.json({

                message:
                    "Password reset successfully."

            });

        } catch (
        error
        ) {

            next(error);

        }

    };