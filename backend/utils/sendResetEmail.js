const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

sendResetEmail = async (to, code) => {
    try {
        const info = await transporter.sendMail({
            from: `"sports_booking" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Reset Your Password",
            text: `Your reset code is: ${code}. This code will expire in 10 minutes.`,
            html: `<p>Your reset code is: <strong>${code}</strong><br>This code will expire in 10 minutes.</p>`,
        });
        return info.accepted.length > 0 ? 1 : 0;
    } catch(err) {
        console.error(message.err);
    }
};

module.exports = sendResetEmail;
