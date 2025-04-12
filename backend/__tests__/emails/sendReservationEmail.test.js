const sendEmail = require("../../emails/sendEmail");
const sendReservationEmail = require("../../emails/sendReservationEmail");

jest.mock("../../emails/sendEmail");

describe('sendResetEmail', () => {
    test('call with correct parameters', async () => {
        const email = "test@example.com";
        const fieldName = 'fieldName';
        const date = '2025.08.08';
        const slotName = '9 am - 10:30 am';
        const subject = "Reservation Confirmation";
        const text = `Your reservation for ${fieldName} on ${date} at ${slotName} has been made successfully.`;
        const html = `<p>Your reservation for <strong>${fieldName}</strong> on <strong>${date}</strong> at <strong>${slotName}</strong> has been made successfully.</p>`;

        sendEmail.mockResolvedValue(1);

        const result = await sendReservationEmail(email, fieldName, date, slotName);
        
        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail).toHaveBeenCalledWith(email, subject, text, html);
        expect(result).toBe(1);
    })

    test('email sending failure', async () => {
        sendEmail.mockResolvedValueOnce(0);
        
        const email = "test@example.com";
        const fieldName = 'fieldName';
        const date = '2025.08.08';
        const slotName = '9 am - 10:30 am';

        const result = await sendReservationEmail(email, fieldName, date, slotName);

        expect(result).toBe(0);
    })
})