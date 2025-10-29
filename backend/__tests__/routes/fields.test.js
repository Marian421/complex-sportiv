const request = require("supertest");
const app = require("../../app");
const pool = require("../../db");
const jwt = require("jsonwebtoken");
const sendResetEmail = require("../../emails/sendResetEmail");
const generateResetCode = require("../../utils/generateResetCode");
const authenticateToken = require("../../middleware/authenticateToken");
const checkAdminRole = require("../../middleware/checkAdminRole");
const getAvailableSlots = require("../../utils/getAvailableSlots");
const sendReservationConfirmation = require("../../emails/sendReservationEmail");

jest.mock("../../emails/sendReservationEmail");
jest.mock("../../utils/getAvailableSlots");
jest.mock("../../db");
jest.mock("multer", () => {
  const multer = jest.fn(() => ({
    single: jest.fn(() => (req, res, next) => {
      req.file = { filename: "test-image.jpg" }; // <-- add this line
      next();
    }),
  }));

  multer.diskStorage = jest.fn(() => ({}));
  return multer;
});
jest.mock("jsonwebtoken");
jest.mock("../../emails/sendResetEmail");
jest.mock("../../utils/generateResetCode");
jest.mock("../../middleware/authenticateToken", () => (req, res, next) => {
  req.user = { userId: 1, role: "admin", email: "test@example@gmail.com" };
  next();
});
jest.mock("../../middleware/checkAdminRole", () => (req, res, next) => next());

describe("Fields routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("GET /fields/", () => {
    it("should be succesfull", async () => {
      const mockFields = [
        { id: 1, name: "field 1", description: "description 1" },
        { id: 2, name: "field 2", description: "description 2" },
      ];
      pool.query.mockResolvedValueOnce({
        rowCount: 2,
        rows: mockFields,
      });

      const res = await request(app).get("/fields/");

      expect(res.statusCode).toBe(200);
      expect(res.body).toStrictEqual(mockFields);
      expect(pool.query).toHaveBeenCalledWith("SELECT * FROM FIELDS");
    });

    it("should handle query error", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      const res = await request(app).get("/fields/");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Server error while fetching fields");
    });
  });

  describe("POST /fields/add", () => {
    it("should add fields succesfully", async () => {
      const mockRows = [
        {
          id: 1,
          name: "Field Name",
          description: "Some description",
          location: "somewhere",
          price_per_hour: 50,
          image_path: "/uploads/fields/test-image.jpg",
        },
      ];

      pool.query.mockResolvedValueOnce({
        rowCount: 1,
        rows: mockRows,
      });

      const res = await request(app)
        .post("/fields/add")
        .field("name", "Field Name")
        .field("description", "Some description")
        .field("location", "Somewhere")
        .field("price_per_hour", 50)
        .attach("image", Buffer.from("test"), "test-image.jpg");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockRows[0]);
    });

    it("should fail to add field", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      const res = await request(app)
        .post("/fields/add")
        .field("name", "Field Name")
        .field("description", "Some description")
        .field("location", "Somewhere")
        .field("price_per_hour", 50)
        .attach("image", Buffer.from("test"), "test-image.jpg");

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe("Error adding field");
    });
  });

  describe("GET /:fieldId/availability", () => {
    it("should return the available slots", async () => {
      const row = [{ slot_id: 1, slot_name: "9am - 10:30am", isBooked: false }];
      const fieldId = "123";
      const date = "2024-04-08";

      getAvailableSlots.mockResolvedValueOnce(row);

      const res = await request(app)
        .get(`/fields/${fieldId}/availability`)
        .query({ date });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(row);
    });
    it("should return an empty array for wrong input", async () => {
      const fieldId = "wrongId";
      const date = "2024-04-08";

      getAvailableSlots.mockResolvedValueOnce([]);

      const res = await request(app)
        .get(`/fields/${fieldId}/availability`)
        .query({ date });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
      expect(getAvailableSlots).toHaveBeenCalledWith(fieldId, date);
    });
    it("should throw error if query fails", async () => {
      const fieldId = "123";
      const date = "2024-04-08";

      getAvailableSlots.mockRejectedValueOnce(new Error("Database Error"));

      const res = await request(app)
        .get(`/fields/${fieldId}/availability`)
        .query({ date });

      expect(res.statusCode).toBe(500);
      expect(getAvailableSlots).toHaveBeenCalledWith(fieldId, date);
      expect(res.body.message).toBe("Error fetching availability");
    });
  });

  describe("POST /book/:fieldId/:slot_id", () => {
    it("should return that the slot is booked", async () => {
      const fieldId = "1";
      const slot_id = "1";
      const date = "2025-04-08";

      pool.query.mockResolvedValueOnce({ rowCount: 1 });

      const res = await request(app)
        .post(`/fields/book/${fieldId}/${slot_id}`)
        .query({ date });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Slot is unavailable");
    });

    it("should make the reservation but fail to send the email", async () => {
      const fieldId = "1";
      const slot_id = "1";
      const date = "2025-04-08";

      pool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({
          rows: [{ field_name: "name of field", slot_name: "name of slot" }],
        });

      sendReservationConfirmation.mockResolvedValueOnce(0);

      const res = await request(app)
        .post(`/fields/book/${fieldId}/${slot_id}`)
        .query({ date });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe(
        "Reservation created but failed to send confirmation email",
      );
      expect(sendReservationConfirmation).toHaveBeenCalledWith(
        "test@example@gmail.com",
        "name of field",
        date,
        "name of slot",
      );
    });

    it("should make the reservation and send the email", async () => {
      const fieldId = "1";
      const slot_id = "1";
      const date = "2025-04-08";

      pool.query
        .mockResolvedValueOnce({ rowCount: 0 })
        .mockResolvedValueOnce({
          rows: [{ field_name: "name of field", slot_name: "name of slot" }],
        });

      sendReservationConfirmation.mockResolvedValueOnce(1);

      const res = await request(app)
        .post(`/fields/book/${fieldId}/${slot_id}`)
        .query({ date });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("Reservation made and email sent");
      expect(sendReservationConfirmation).toHaveBeenCalledWith(
        "test@example@gmail.com",
        "name of field",
        date,
        "name of slot",
      );
    });
  });
});
