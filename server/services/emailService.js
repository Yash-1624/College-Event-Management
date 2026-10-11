const transporter = require("../config/mail");

// =====================================================
// COMMON EMAIL SENDER
// =====================================================
const sendEmail = async (options) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      "SMTP_USER or SMTP_PASS is missing in the server environment."
    );
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  const result = await transporter.sendMail({
    from,
    ...options,
  });

  console.log("Email sent successfully:", {
    messageId: result.messageId,
    to: options.to,
    subject: options.subject,
  });

  return result;
};

// =====================================================
// ESCAPE HTML CONTENT
// =====================================================
const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// =====================================================
// SIGNUP EMAIL VERIFICATION OTP
// =====================================================
const sendOTPEmail = async (email, name, otp) => {
  if (!email || !otp) {
    throw new Error("Email and verification OTP are required.");
  }

  const studentName = name || "Student";
  const safeName = escapeHtml(studentName);
  const safeOtp = escapeHtml(otp);

  return sendEmail({
    to: email,
    subject: "College Event Management - Email Verification OTP",
    text: `Hello ${studentName},

Your email verification OTP is: ${otp}

This OTP expires in 10 minutes. Do not share it with anyone.

College Event Management Team`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:auto;padding:24px;color:#172033;">
        <h2>Email Verification</h2>
        <p>Hello ${safeName},</p>
        <p>Use the following OTP to verify your College Event Management account:</p>
        <div style="background:#f1f5f9;padding:20px;text-align:center;border-radius:10px;margin:20px 0;">
          <h1 style="font-size:32px;letter-spacing:8px;margin:0;color:#2857d8;">${safeOtp}</h1>
        </div>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p>Do not share this OTP with anyone.</p>
        <p>Regards,<br />College Event Management Team</p>
      </div>
    `,
  });
};

// =====================================================
// PASSWORD RESET OTP EMAIL
// =====================================================
const sendPasswordResetEmail = async (email, name, otp) => {
  if (!email || !otp) {
    throw new Error("Email and password reset OTP are required.");
  }

  const studentName = name || "Student";
  const safeName = escapeHtml(studentName);
  const safeOtp = escapeHtml(otp);

  return sendEmail({
    to: email,
    subject: "College Event Management - Password Reset OTP",
    text: `Hello ${studentName},

Your password reset OTP is: ${otp}

This OTP expires in 10 minutes. If you did not request a password reset, ignore this email.

College Event Management Team`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:600px;margin:auto;padding:24px;color:#172033;">
        <h2>Password Reset</h2>
        <p>Hello ${safeName},</p>
        <p>Use the following OTP to reset your password:</p>
        <div style="background:#f1f5f9;padding:20px;text-align:center;border-radius:10px;margin:20px 0;">
          <h1 style="font-size:32px;letter-spacing:8px;margin:0;color:#2857d8;">${safeOtp}</h1>
        </div>
        <p>This OTP expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request a password reset, you can ignore this email.</p>
        <p>Do not share this OTP with anyone.</p>
        <p>Regards,<br />College Event Management Team</p>
      </div>
    `,
  });
};

// =====================================================
// AUTH CONTROLLER COMPATIBILITY FUNCTIONS
// =====================================================
const sendVerificationOTP = async (email, otp) => {
  return sendOTPEmail(email, "Student", otp);
};

const sendPasswordResetOTP = async (email, otp) => {
  return sendPasswordResetEmail(email, "Student", otp);
};

// =====================================================
// REGISTRATION CONFIRMATION EMAIL
// =====================================================
const sendRegistrationConfirmationEmail = async ({
  email,
  student = {},
  event = {},
  registration = {},
  payment = {},
  ticket = null,
}) => {
  if (!email) {
    throw new Error("Recipient email is required for registration confirmation.");
  }

  const participation = registration.participation || {};
  const studentName = student.fullName || "Student";
  const eventName = event.name || "Registered Event";
  const safe = escapeHtml;

  // ---------------------------------------------------
  // TEAM INFORMATION
  // ---------------------------------------------------
  const isTeam = participation.type === "Team";
  const teamName = participation.teamName || "-";
  const numberOfMembers = participation.numberOfMembers ?? "-";

  const teamHtml = isTeam
    ? `
      <p><strong>Team:</strong> ${safe(teamName)}</p>
      <p><strong>Team Members:</strong> ${safe(numberOfMembers)}</p>
    `
    : "";

  const teamText = isTeam
    ? `
Team: ${teamName}
Team Members: ${numberOfMembers}
`
    : "";

  // ---------------------------------------------------
  // QR TICKET HTML
  // ---------------------------------------------------
  const ticketHtml = ticket
    ? `
      <div style="margin-top:30px;padding:25px;border:2px solid #2857d8;border-radius:15px;text-align:center;background:#f8faff;">
        <h2 style="color:#172033;">Event Entry QR Ticket</h2>
        <p>Show this QR code at the event entrance.</p>
        <img
          src="cid:event-entry-qr"
          alt="Event Entry QR Code"
          width="280"
          height="280"
          style="display:block;margin:20px auto;max-width:100%;"
        />
        <p><strong>Ticket ID:</strong> ${safe(ticket.ticketId || "-")}</p>
        <p><strong>College PID:</strong> ${safe(ticket.collegePid || student.collegePid || "-")}</p>
        <p><strong>Student:</strong> ${safe(ticket.studentName || studentName)}</p>
        <p><strong>Event:</strong> ${safe(ticket.eventName || eventName)}</p>
        <p style="color:#16733a;font-weight:bold;">Entry Status: Not Entered</p>
      </div>
    `
    : `
      <div style="margin-top:25px;padding:15px;border:1px solid #f6c7c3;border-radius:8px;background:#fff0ef;color:#a51d14;">
        QR ticket details are not available in this email.
      </div>
    `;

  // ---------------------------------------------------
  // QR IMAGE ATTACHMENT
  // ---------------------------------------------------
  const attachments = [];

  if (ticket?.qrCode) {
    const qrMatch = ticket.qrCode.match(
      /^data:image\/(png|jpeg|jpg);base64,(.+)$/i
    );

    if (qrMatch) {
      const imageType =
        qrMatch[1].toLowerCase() === "jpg" ? "jpeg" : qrMatch[1].toLowerCase();

      attachments.push({
        filename: imageType === "jpeg" ? "event-entry-qr.jpg" : "event-entry-qr.png",
        content: Buffer.from(qrMatch[2], "base64"),
        contentType: `image/${imageType}`,
        cid: "event-entry-qr",
      });
    } else {
      console.warn("Ticket QR code is not a supported PNG/JPEG data URL.");
    }
  }

  // ---------------------------------------------------
  // REGISTRATION AND PAYMENT DETAILS
  // ---------------------------------------------------
  const registrationId = registration.registrationId || registration._id || "-";
  const transactionId = payment.transactionId || "-";
  const paymentStatus = payment.status || "Pending";
  const amount =
    payment.amount !== undefined && payment.amount !== null
      ? `₹${payment.amount}`
      : "Not available";

  const eventDate = event.date
    ? new Date(event.date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      })
    : "Not specified";

  // ---------------------------------------------------
  // PLAIN TEXT VERSION
  // ---------------------------------------------------
  const text = `
Registration Successful

Congratulations ${studentName}!

STUDENT INFORMATION
Name: ${studentName}
College PID: ${student.collegePid || "-"}
College: ${student.collegeName || "-"}
Year/Semester: ${student.yearSemester || "-"}
Email: ${student.email || email}
Mobile: ${student.mobileNumber || "-"}

EVENT INFORMATION
Event: ${eventName}
Category: ${event.category || "-"}
Date: ${eventDate}
Location: ${event.location || "-"}

PARTICIPATION
Type: ${participation.type || "-"}
${teamText}
REGISTRATION AND PAYMENT
Registration ID: ${registrationId}
Transaction ID: ${transactionId}
Payment Status: ${paymentStatus}
Amount: ${amount}

Please keep this email for your records.
College Event Management Team
  `.trim();

  // ---------------------------------------------------
  // SEND REGISTRATION EMAIL
  // ---------------------------------------------------
  return sendEmail({
    to: email,
    subject: `Registration Successful - ${eventName}`,
    text,
    attachments,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:700px;margin:auto;padding:20px;color:#172033;">
        <h1>Registration Successful</h1>
        <p>Congratulations <strong>${safe(studentName)}</strong>!</p>

        <h2>Student Information</h2>
        <p><strong>Name:</strong> ${safe(studentName)}</p>
        <p><strong>College PID:</strong> ${safe(student.collegePid || "-")}</p>
        <p><strong>College:</strong> ${safe(student.collegeName || "-")}</p>
        <p><strong>Year/Semester:</strong> ${safe(student.yearSemester || "-")}</p>
        <p><strong>Email:</strong> ${safe(student.email || email)}</p>
        <p><strong>Mobile:</strong> ${safe(student.mobileNumber || "-")}</p>

        <h2>Event Information</h2>
        <p><strong>Event:</strong> ${safe(eventName)}</p>
        <p><strong>Category:</strong> ${safe(event.category || "-")}</p>
        <p><strong>Date:</strong> ${safe(eventDate)}</p>
        <p><strong>Location:</strong> ${safe(event.location || "-")}</p>

        <h2>Participation</h2>
        <p><strong>Type:</strong> ${safe(participation.type || "-")}</p>
        ${teamHtml}

        <h2>Registration &amp; Payment</h2>
        <p><strong>Registration ID:</strong> ${safe(registrationId)}</p>
        <p><strong>Transaction ID:</strong> ${safe(transactionId)}</p>
        <p><strong>Payment Status:</strong> ${safe(paymentStatus)}</p>
        <p><strong>Amount:</strong> ${safe(amount)}</p>

        ${ticketHtml}

        <p style="margin-top:30px;color:#657086;font-size:13px;">
          Please keep this email and your QR ticket safely.
          Show your QR code at the event entrance if required.
        </p>

        <p>Regards,<br />College Event Management Team</p>
      </div>
    `,
  });
};

// =====================================================
// EXPORT ALL EMAIL FUNCTIONS
// =====================================================
module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  sendVerificationOTP,
  sendPasswordResetOTP,
  sendRegistrationConfirmationEmail,
};
