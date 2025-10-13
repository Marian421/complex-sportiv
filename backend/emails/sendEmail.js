const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  try {
    const msg = {
      to,
      from: 'herciumarian8@gmail.com', // must be verified in SendGrid
      subject,
      text,
      html,
    };
    const result = await sgMail.send(msg);
    console.log('Email sent successfully');
    return result[0].statusCode === 202 ? 1 : 0;
  } catch (error) {
    console.error('Email send error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = sendEmail;

