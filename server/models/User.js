const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true
        },

        /*
         * College PID / Student PID
         */
        collegePid: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        collegeName: {
            type: String,
            required: true,
            trim: true
        },

        yearSemester: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: [
                "student",
                "admin"
            ],
            default: "student"
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        otp: {
            type: String,
            select: false
        },

        otpExpiresAt: {
            type: Date,
            select: false
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "User",
        userSchema
    );