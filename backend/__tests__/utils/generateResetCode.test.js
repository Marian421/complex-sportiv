const generateResetCode = require("../../utils/generateResetCode");

describe("generateResetCode", () => {
  test("should return a string of correct length", () => {
    const code = generateResetCode();
    expect(typeof code).toBe("string");
    expect(code).toHaveLength(64);
  });

  test("should return unique values on multiple calls", () => {
    const code1 = generateResetCode();
    const code2 = generateResetCode();
    expect(code1).not.toBe(code2);
  });
});
