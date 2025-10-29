const pool = require("../../db");
const getAvailableSlots = require("../../utils/getAvailableSlots");

jest.mock("../../db", () => ({
  query: jest.fn(),
}));

describe("getAvailableSlots", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("returns available slots when query succeeds", async () => {
    const mockResult = {
      rows: [
        { slot_id: 1, slot_name: "9am - 10:30am", isBooked: false },
        { slot_id: 2, slot_name: "10:30am - 12am", isBooked: true },
      ],
    };

    pool.query.mockResolvedValue(mockResult);

    const result = await getAvailableSlots(1, "2024-04-12");

    expect(result).toEqual(mockResult.rows);
    expect(pool.query).toHaveBeenCalledTimes(1);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [
      1,
      "2024-04-12",
    ]);
  });

  test("returns an empty array when no slots are found", async () => {
    const mockResult = { rows: [] };

    pool.query.mockResolvedValue(mockResult);

    const result = await getAvailableSlots(2, "2024-05-01");

    expect(result).toEqual([]);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  test("throws an error when the query fails", async () => {
    console.error = jest.fn();
    const errorMessage = new Error("Database error");

    pool.query.mockRejectedValue(errorMessage);

    await expect(getAvailableSlots(1, "2024-04-12")).rejects.toThrow(
      "Database error",
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
    console.error.mockRestore();
  });
});
