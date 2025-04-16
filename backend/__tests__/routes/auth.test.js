const request = require('supertest');
const app = require('../../app');
const pool = require('../../db');
const hash = require('../../utils/hash');
const jwt = require('jsonwebtoken');
const sendResetEmail = require('../../emails/sendResetEmail');
const generateResetCode = require('../../utils/generateResetCode');
const authenticateToken = require('../../middleware/authenticateToken');


jest.mock('../../db');
jest.mock('../../utils/hash');
jest.mock('jsonwebtoken');
jest.mock('../../emails/sendResetEmail');
jest.mock('../../utils/generateResetCode');
jest.mock('../../middleware/authenticateToken', () => (req, res, next) => {
  req.user = { userId: 1 };
  next();
});

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      pool.query
        .mockResolvedValueOnce({ rowCount: 0 }) // no user exists
        .mockResolvedValueOnce({ rows: [{ id: 1, name: "John Doe", email: "john@example.com", password: "hashedPassword" }] }); // inserted user

      hash.encrypt.mockReturnValue("hashedPassword");

      const res = await request(app).post('/auth/register').send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123"
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("john@example.com");
      expect(pool.query).toHaveBeenCalledTimes(2);
    });

    it("should return error if user already exists", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app).post('/auth/register').send({
        name: "Jane",
        email: "jane@example.com",
        password: "pass123"
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("user already registered");
    });
  });

  describe("POST /auth/login", () => {
    it("should log in successfully with valid credentials", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, email: "john@example.com", password: "hashedPassword", role: "user" }] });
      hash.compare.mockReturnValue(true);
      jwt.sign.mockReturnValue("fake-jwt-token");

      const res = await request(app).post('/auth/login').send({
        email: "john@example.com",
        password: "password123"
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("logged in succesfully");
      expect(res.body.token).toBe("fake-jwt-token");
    });

    it("should return invalid password", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1, email: "john@example.com", password: "hashedPassword" }] });
      hash.compare.mockReturnValue(false);

      const res = await request(app).post('/auth/login').send({
        email: "john@example.com",
        password: "wrongpassword"
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("invalid password");
    });

    it("should return invalid email", async () => {
        pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });

        const res = await request(app).post('/auth/login').send({
            email: "wrong email",
            password: "goodPassword"
        })
        
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("email not found");
    })
  });

  describe("POST /auth/reset", () => {
    it("user not found by the email", async () => {
        pool.query.mockResolvedValueOnce({rowCount: 0});
  
        const res = await request(app).post('/auth/reset').send({
            email: "wrong email"
        });
  
        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("User not found");
    });

    it("should send email succesfully", async () => {
      pool.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 123 }] });

      generateResetCode.mockReturnValue('ABCDEF');
      sendResetEmail.mockResolvedValueOnce(true);

      const res = await request(app).post('/auth/reset').send({
        email: "example@.com"
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Email sent successfully");
      expect(sendResetEmail).toHaveBeenCalledWith(
        "example@.com",
        expect.stringContaining("ABCDEF")
      );
      expect(generateResetCode).toHaveBeenCalledTimes(1);
    });
    
    it("failed to send email", async () => {
      pool.query
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 1 }] })
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 123 }] });

      generateResetCode.mockReturnValue('ABCDEF');
      sendResetEmail.mockResolvedValueOnce(false);

      const res = await request(app).post('/auth/reset').send({
        email: "example@.com"
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Failed to send reset email. Try again later.");
      expect(sendResetEmail).toHaveBeenCalledWith(
        "example@.com",
        expect.stringContaining("ABCDEF")
      );
      expect(generateResetCode).toHaveBeenCalledTimes(1);
    });

  });

  describe("POST /auth/verify-reset-code", () => {
    it("Invalid or expired code", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app).post('/auth/verify-reset-code').send({
        code: "fakeCode"
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Invalid or expired reset code.");
    });

    it("it should be a valid code", async () => {
      pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ user_id: 2}] });

      jwt.sign.mockReturnValue('resetToken');

      const res = await request(app).post('/auth/verify-reset-code').send({
        code: "fakeCode"
      })

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Code is valid, proceed with password reset.");
      expect(res.body.resetToken).toBe("resetToken");
    });
      
  });

  describe("POST /auth/reset-password", () => {
    it("should not find the user", async () => {

      hash.encrypt.mockReturnValue('hashedPassword');

      pool.query.mockResolvedValueOnce({ rowCount: 0 });

      const res = await request(app).post("/auth/reset-password").send({
        newPassword: "newPassword",
        userId: 1
      });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("User not found");

    });

    it("should reset the password", async () => {
      pool.query
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({})

      hash.encrypt.mockReturnValue('hashedPassword');

      const res = await request(app).post("/auth/reset-password").send({
        newPassword: "newPassword",
        userId: 1
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Password successfully updated!");
    })
  })
});
