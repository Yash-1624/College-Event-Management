const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        // ===============================================
        // UNIQUE TICKET ID
        // ===============================================
        ticketId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        // ===============================================
        // REGISTRATION
        // ===============================================
        registration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Registration",
            required: true,
            unique: true
        },

        // ===============================================
        // STUDENT
        // ===============================================
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // ===============================================
        // EVENT
        // ===============================================
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        // ===============================================
        // COLLEGE PID
        // ===============================================
        collegePid: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
        },

        // ===============================================
        // STUDENT NAME
        // ===============================================
        studentName: {
            type: String,
            required: true,
            trim: true
        },

        // ===============================================
        // EVENT NAME
        // ===============================================
        eventName: {
            type: String,
            required: true,
            trim: true
        },

        // ===============================================
        // QR IMAGE
        // ===============================================
        qrCode: {
            type: String,
            required: true
        },

        // ===============================================
        // DATA STORED INSIDE QR
        // ===============================================
        qrPayload: {
            type: String,
            required: true
        },

        // ===============================================
        // ENTRY STATUS
        // ===============================================
        entryStatus: {
            type: String,
            enum: [
                "Not Entered",
                "Entered"
            ],
            default: "Not Entered"
        },

        // ===============================================
        // ENTRY TIME
        // ===============================================
        enteredAt: {
            type: Date,
            default: null
        },

        // ===============================================
        // WHO SCANNED THE QR
        // ===============================================
        scannedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "Ticket",
        ticketSchema
    );