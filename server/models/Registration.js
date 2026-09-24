const mongoose =
    require("mongoose");


const registrationSchema =
    new mongoose.Schema(

        {
            registrationId: {
                type: String,
                required: true,
                unique: true
            },


            student: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "User",

                required: true
            },


            event: {
                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Event",

                required: true
            },


            // ===============================================
            // STUDENT INFORMATION SNAPSHOT
            // ===============================================
            studentInformation: {

                fullName: {
                    type: String,
                    required: true
                },

                collegePid: {
                    type: String,
                    required: true,
                    trim: true,
                    uppercase: true
                },

                collegeName: {
                    type: String,
                    required: true
                },

                yearSemester: {
                    type: String,
                    required: true
                }
            },


            // ===============================================
            // CONTACT INFORMATION
            // ===============================================
            contactInformation: {

                mobileNumber: {
                    type: String,
                    required: true
                },

                email: {
                    type: String,
                    required: true
                }
            },


            // ===============================================
            // PARTICIPATION
            // ===============================================
            participation: {

                type: {
                    type: String,

                    enum: [
                        "Individual",
                        "Team"
                    ],

                    required: true
                },

                teamName: {
                    type: String,
                    default: ""
                },

                numberOfMembers: {
                    type: Number,
                    default: 1
                }
            },


            // ===============================================
            // CONFIRMATIONS
            // ===============================================
            confirmations: {

                informationCorrect: {
                    type: Boolean,
                    required: true
                },

                agreedToRules: {
                    type: Boolean,
                    required: true
                }
            },


            // ===============================================
            // PAYMENT
            // ===============================================
            payment: {

                status: {
                    type: String,
                    default: "Pending"
                },

                paymentId: {
                    type:
                        mongoose.Schema.Types.ObjectId,

                    ref: "Payment",

                    default: null
                }
            },


            // ===============================================
            // REGISTRATION STATUS
            // ===============================================
            registrationStatus: {

                type: String,

                enum: [
                    "Pending Payment",
                    "Confirmed",
                    "Cancelled",
                    "Completed"
                ],

                default:
                    "Pending Payment"
            }
        },

        {
            timestamps: true
        }
    );


// ===============================================
// PREVENT DUPLICATE EVENT REGISTRATION
// ===============================================
registrationSchema.index(
    {
        student: 1,
        event: 1
    },
    {
        unique: true
    }
);


module.exports =
    mongoose.model(
        "Registration",
        registrationSchema
    );