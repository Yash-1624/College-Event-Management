const crypto = require("crypto");
const QRCode = require("qrcode");

const Ticket = require("../models/Ticket");
const Registration = require("../models/Registration");
const User = require("../models/User");
const Event = require("../models/Event");


// =====================================================
// GENERATE UNIQUE TICKET ID
// =====================================================
const generateTicketId = () => {
    return (
        "TKT-" +
        Date.now() +
        "-" +
        crypto
            .randomBytes(4)
            .toString("hex")
            .toUpperCase()
    );
};


// =====================================================
// CREATE TICKET
// =====================================================
const createTicket = async ({
    registrationId
}) => {

    // -------------------------------------------------
    // FIND REGISTRATION
    // -------------------------------------------------
    const registration =
        await Registration.findById(
            registrationId
        );

    if (!registration) {
        throw new Error(
            "Registration not found."
        );
    }


    // -------------------------------------------------
    // IF TICKET ALREADY EXISTS
    // -------------------------------------------------
    const existingTicket =
        await Ticket.findOne({
            registration:
                registration._id
        });

    if (existingTicket) {
        return existingTicket;
    }


    // -------------------------------------------------
    // PAYMENT MUST BE CONFIRMED
    // -------------------------------------------------
    if (
        registration.registrationStatus !==
        "Confirmed"
    ) {
        throw new Error(
            "Ticket can only be generated after successful payment."
        );
    }


    // -------------------------------------------------
    // FIND STUDENT
    // -------------------------------------------------
    const student =
        await User.findById(
            registration.student
        );

    if (!student) {
        throw new Error(
            "Student not found."
        );
    }


    // -------------------------------------------------
    // FIND EVENT
    // -------------------------------------------------
    const event =
        await Event.findById(
            registration.event
        );

    if (!event) {
        throw new Error(
            "Event not found."
        );
    }


    // -------------------------------------------------
    // GET COLLEGE PID
    // -------------------------------------------------
    const collegePid =
        student.collegePid;


    if (!collegePid) {
        throw new Error(
            "Student College PID is missing."
        );
    }


    // -------------------------------------------------
    // GENERATE TICKET ID
    // -------------------------------------------------
    const ticketId =
        generateTicketId();


    // -------------------------------------------------
    // QR PAYLOAD
    //
    // These details will be encoded
    // inside the QR code.
    // -------------------------------------------------
    const qrPayload =
        JSON.stringify({

            ticketId:

                ticketId,

            collegePid:

                collegePid,

            studentName:

                student.fullName,

            eventName:

                event.name
        });


    // -------------------------------------------------
    // GENERATE QR CODE
    // -------------------------------------------------
    const qrCode =
        await QRCode.toDataURL(
            qrPayload
        );


    // -------------------------------------------------
    // CREATE TICKET
    // -------------------------------------------------
    const ticket =
        await Ticket.create({

            ticketId:

                ticketId,

            registration:

                registration._id,

            student:

                student._id,

            event:

                event._id,

            collegePid:

                collegePid,

            studentName:

                student.fullName,

            eventName:

                event.name,

            qrCode:

                qrCode,

            qrPayload:

                qrPayload,

            entryStatus:

                "Not Entered",

            enteredAt:

                null,

            scannedBy:

                null
        });


    return ticket;
};


// =====================================================
// GET TICKET BY REGISTRATION
// =====================================================
const getTicketByRegistration =
    async (
        registrationId
    ) => {

        return await Ticket.findOne({
            registration:
                registrationId
        })

            .populate(
                "student",
                "fullName collegePid email mobileNumber collegeName yearSemester"
            )

            .populate(
                "event",
                "name category date location"
            )

            .populate(
                "scannedBy",
                "fullName email role"
            );
    };


module.exports = {

    createTicket,

    getTicketByRegistration,

    generateTicketId
};