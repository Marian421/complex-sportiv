const nodemailer = require("nodemailer");

console.log('EMAIL_USER:', process.env.EMAIL_USER); // Debug
console.log('EMAIL_PASS:', process.env.EMAIL_PASS); // Debug

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error.message, error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    console.log('Sending email to:', to); // Debug
    const info = await transporter.sendMail({
      from: `"sports_booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent, message ID:', info.messageId);
    return info.accepted.length > 0 ? 1 : 0;
  } catch (err) {
    console.error('Email error:', err.message, err);
    throw err; // Propagate error
  }
};

module.exports = sendEmail;
