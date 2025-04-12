const sendEmail = require("../../emails/sendEmail");
const sendResetEmail = require("../../emails/sendResetEmail");

jest.mock("../../emails/sendEmail");

describe('sendResetEmail', () => {
    test('call with correct parameters', async () => {
        const email = "test@example.com";
        const subject = "Reset Your Password";
        const code = '123456';
        const text = `Click on this link to proceed: ${code}. It will expire in 10 minutes.`;
        const html = `<p>Click on this link to proceed: <strong>${code}</strong><br>It will expire in 10 minutes.</p>`;

        sendEmail.mockResolvedValue(1);

        const result = await sendResetEmail(email, code);
        
        expect(sendEmail).toHaveBeenCalledTimes(1);
        expect(sendEmail).toHaveBeenCalledWith(email, subject, text, html);
        expect(result).toBe(1);
    })

    test('email sending failure', async () => {
        sendEmail.mockResolvedValueOnce(0);
        
        const email = 'test@example.com';
        const code = '123456';

        const result = await sendResetEmail(email, code);

        expect(result).toBe(0);
    })
})
