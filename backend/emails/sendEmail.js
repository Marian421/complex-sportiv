const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"sports_booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    return info.accepted.length > 0 ? 1 : 0;
  } catch (err) {
    console.error(err.message);
    return 0;
  }
};

module.exports = sendEmail;
