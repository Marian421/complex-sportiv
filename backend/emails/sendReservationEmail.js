const sendEmail = require('./sendEmail');

const sendReservationConfirmation = async (to, fieldName, date, slotName) => {
  const subject = "Reservation Confirmation";
  const text = `Your reservation for ${fieldName} on ${date} at ${slotName} has been made successfully.`;
  const html = `<p>Your reservation for <strong>${fieldName}</strong> on <strong>${date}</strong> at <strong>${slotName}</strong> has been made successfully.</p>`;

  return await sendEmail(to, subject, text, html);
};

module.exports = sendReservationConfirmation;
