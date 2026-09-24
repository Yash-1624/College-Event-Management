const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        registration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Registration",
            required: true,
            unique: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        currency: {
            type: String,
            default: "INR"
        },

        paymentMethod: {
            type: String,
            default: "RAZORPAY"
        },

        gateway: {
            type: String,
            default: "RAZORPAY"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Successful",
                "Failed"
            ],
            default: "Pending"
        },

        transactionId: {
            type: String,
            default: ""
        },

        razorpayOrderId: {
            type: String,
            default: ""
        },

        razorpayPaymentId: {
            type: String,
            default: ""
        },

        razorpaySignature: {
            type: String,
            default: "",
            select: false
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Payment",
        paymentSchema
    );