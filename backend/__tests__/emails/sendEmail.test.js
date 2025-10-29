const nodemailer = require("nodemailer");
const sendEmail = require("../../emails/sendEmail");

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ accepted: ["test@example.com"] }),
  }),
}));

describe("sendEmail", () => {
  test("should send an email with correct data", async () => {
    const email = "test@example.com";
    const subject = "Welcome to sports booking";
    const body = "Thank you for registering";
    const html = "<p>Thank you for registering</p>";

    const info = await sendEmail(email, subject, body, html);

    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        subject,
        text: body,
        html,
      }),
    );
    expect(info).toBe(1);
  });

  test("email sending failure", async () => {
    nodemailer
      .createTransport()
      .sendMail.mockResolvedValueOnce({ accepted: [] });

    const email = "test@example.com";
    const subject = "Welcome to sports booking";
    const body = "Thank you for registering";
    const html = "<p>Thank you for registering</p>";

    const result = await sendEmail(email, subject, body, html);

    expect(result).toBe(0);
  });
});
