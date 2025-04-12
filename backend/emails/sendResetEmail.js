const sendEmail = require('./sendEmail');

const sendResetEmail = async (to, code) => {
  const subject = "Reset Your Password";
  const text = `Click on this link to proceed: ${code}. It will expire in 10 minutes.`;
  const html = `<p>Click on this link to proceed: <strong>${code}</strong><br>It will expire in 10 minutes.</p>`;
  
  return await sendEmail(to, subject, text, html);
};

module.exports = sendResetEmail;
