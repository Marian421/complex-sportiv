const getSlotName = require("../../utils/getSlotName");

const mockData = [
  {
    slot_id: 1,
    slot_name: "9 am - 10:30 am",
    isBooked: true,
  },
  {
    slot_id: 2,
    slot_name: "10:30 am - 12 am",
    isBooked: true,
  },
];

test("first slot name", () => {
  expect(getSlotName(mockData, 1)).toBe("9 am - 10:30 am");
});

test("second slot name", () => {
  expect(getSlotName(mockData, 2)).toBe("10:30 am - 12 am");
});

test("return false for non-existent slot id", () => {
  expect(getSlotName(mockData, 999)).toBe(false);
});

test("handles string slot_id correctly", () => {
  expect(getSlotName(mockData, "2")).toBe("10:30 am - 12 am");
});
