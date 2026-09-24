const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        // ========================================
        // EVENT INFORMATION
        // ========================================

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        // Custom category
        // No enum because admin can create
        // any category.
        category: {
            type: String,
            required: true,
            trim: true
        },

        date: {
            type: Date,
            required: true
        },

        location: {
            type: String,
            required: true,
            trim: true
        },


        // ========================================
        // REGISTRATION DATES
        // ========================================

        registrationStartDate: {
            type: Date,
            required: true
        },

        registrationEndDate: {
            type: Date,
            required: true
        },


        // ========================================
        // PARTICIPATION TYPE
        // ========================================

        participationType: {
            individual: {
                type: Boolean,
                default: true
            },

            team: {
                type: Boolean,
                default: false
            }
        },


        // ========================================
        // TEAM SETTINGS
        // ========================================

        teamSettings: {
            enabled: {
                type: Boolean,
                default: false
            },

            minMembers: {
                type: Number,
                default: 2
            },

            maxMembers: {
                type: Number,
                default: 5
            }
        },


        // ========================================
        // EVENT STATUS
        // ========================================

        status: {
            type: String,

            enum: [
                "Draft",
                "Published",
                "Registration Open",
                "Registration Closed",
                "Completed",
                "Cancelled"
            ],

            default: "Draft"
        },


        // ========================================
        // EVENT FEE
        // ========================================

        fee: {
            type: Number,
            default: 0,
            min: 0
        },


        // ========================================
        // CREATED BY ADMIN
        // ========================================

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
);


module.exports = mongoose.model(
    "Event",
    eventSchema
);