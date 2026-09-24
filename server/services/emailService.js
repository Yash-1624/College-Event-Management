const transporter = require("../config/mail");

const sendOTPEmail = async (
  email,
  name,
  otp
) => {
  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to: email,

    subject:
      "College Event Management - Email Verification OTP",

    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Email Verification</h2>
        <p>Hello ${name},</p>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `
  });
};


const sendPasswordResetEmail = async (
  email,
  name,
  otp
) => {
  await transporter.sendMail({
    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to: email,

    subject:
      "College Event Management - Password Reset OTP",

    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Password Reset</h2>
        <p>Hello ${name},</p>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      </div>
    `
  });
};


// =====================================================
// REGISTRATION CONFIRMATION EMAIL
// =====================================================
const sendRegistrationConfirmationEmail = async ({
  email,
  student,
  event,
  registration,
  payment,
  ticket
}) => {

  const teamHtml =
    registration.participation.type === "Team"
      ? `
        <p>
          <strong>Team:</strong>
          ${registration.participation.teamName}
        </p>

        <p>
          <strong>Team Members:</strong>
          ${registration.participation.numberOfMembers}
        </p>
      `
      : "";


  // ---------------------------------------------------
  // QR EMAIL SECTION
  // ---------------------------------------------------
  const ticketHtml = ticket
    ? `
      <div style="
        margin-top:30px;
        padding:25px;
        border:2px solid #2857d8;
        border-radius:15px;
        text-align:center;
        background:#f8faff;
      ">

        <h2 style="color:#172033;">
          Event Entry QR Ticket
        </h2>

        <p>
          Show this QR code at the
          event entrance.
        </p>

        <img
          src="cid:event-entry-qr"
          alt="Event Entry QR Code"
          width="280"
          height="280"
          style="
            display:block;
            margin:20px auto;
          "
        />

        <p>
          <strong>Ticket ID:</strong>
          ${ticket.ticketId}
        </p>

        <p>
          <strong>College PID:</strong>
          ${ticket.collegePid}
        </p>

        <p>
          <strong>Student:</strong>
          ${ticket.studentName}
        </p>

        <p>
          <strong>Event:</strong>
          ${ticket.eventName}
        </p>

        <p style="
          color:#16733a;
          font-weight:bold;
        ">
          Entry Status: Not Entered
        </p>

      </div>
    `
    : `
      <div style="
        margin-top:25px;
        padding:15px;
        border:1px solid #f6c7c3;
        border-radius:8px;
        background:#fff0ef;
        color:#a51d14;
      ">
        QR ticket could not be generated.
      </div>
    `;


  const attachments = [];


  // ---------------------------------------------------
  // ATTACH QR IMAGE
  // ---------------------------------------------------
  if (ticket?.qrCode) {

    const base64Image =
      ticket.qrCode.replace(
        /^data:image\/png;base64,/,
        ""
      );


    attachments.push({

      filename:
        "event-entry-qr.png",

      content:
        base64Image,

      encoding:
        "base64",

      cid:
        "event-entry-qr"
    });
  }


  await transporter.sendMail({

    from:
      process.env.SMTP_FROM ||
      process.env.SMTP_USER,

    to: email,

    subject:
      `Registration Successful - ${event.name}`,

    attachments,

    html: `
      <div style="
        font-family:Arial,sans-serif;
        line-height:1.6;
        max-width:700px;
        margin:auto;
        color:#172033;
      ">

        <h1>
          Registration Successful
        </h1>

        <p>
          Congratulations
          <strong>${student.fullName}</strong>!
        </p>


        <h2>
          Student Information
        </h2>

        <p>
          <strong>Name:</strong>
          ${student.fullName}
        </p>

        <p>
          <strong>College PID:</strong>
          ${student.collegePid || "-"}
        </p>

        <p>
          <strong>College:</strong>
          ${student.collegeName}
        </p>

        <p>
          <strong>Year/Semester:</strong>
          ${student.yearSemester}
        </p>

        <p>
          <strong>Email:</strong>
          ${student.email}
        </p>

        <p>
          <strong>Mobile:</strong>
          ${student.mobileNumber}
        </p>


        <h2>
          Event Information
        </h2>

        <p>
          <strong>Event:</strong>
          ${event.name}
        </p>

        <p>
          <strong>Category:</strong>
          ${event.category}
        </p>

        <p>
          <strong>Date:</strong>
          ${new Date(
      event.date
    ).toLocaleString()}
        </p>

        <p>
          <strong>Location:</strong>
          ${event.location}
        </p>


        <h2>
          Participation
        </h2>

        <p>
          <strong>Type:</strong>
          ${registration.participation.type}
        </p>

        ${teamHtml}


        <h2>
          Registration & Payment
        </h2>

        <p>
          <strong>Registration ID:</strong>
          ${registration.registrationId}
        </p>

        <p>
          <strong>Transaction ID:</strong>
          ${payment.transactionId}
        </p>

        <p>
          <strong>Payment Status:</strong>
          ${payment.status}
        </p>

        <p>
          <strong>Amount:</strong>
          ₹${payment.amount}
        </p>


        ${ticketHtml}


        <p style="
          margin-top:30px;
          color:#657086;
          font-size:13px;
        ">
          Please keep this email and QR ticket
          safely. You will need to show the QR
          code at the event entrance.
        </p>

      </div>
    `
  });
};


module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendRegistrationConfirmationEmail
};