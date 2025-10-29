const isBooked = require("../../utils/isBooked");

const mockData = [
  {
    slot_id: 1,
    slot_name: "9 am - 10:30 am",
    isBooked: true,
  },
  {
    slot_id: 2,
    slot_name: "10:30 am - 12 am",
    isBooked: false,
  },
];

test("first slot to be true", () => {
  expect(isBooked(mockData, 1)).toBe(true);
});

test("second slot to be true", () => {
  expect(isBooked(mockData, 2)).toBe(false);
});

test("handles string slot_id correctly", () => {
  expect(isBooked(mockData, "2")).toBe(false);
});
