const nodemailer = require("nodemailer");

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

// Create SMTP transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify SMTP configuration when the server starts
transporter
  .verify()
  .then(() => {
    console.log("SMTP connection verified successfully.");
  })
  .catch((error) => {
    console.error("SMTP connection verification failed:", {
      code: error.code,
      command: error.command,
      message: error.message,
    });
  });

// Use the configured sender address in emailService.js
transporter.senderAddress = SMTP_FROM;

module.exports = transporter;
