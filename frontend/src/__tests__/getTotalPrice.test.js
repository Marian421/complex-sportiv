import { describe } from "node:test";
import getTotalPrice from "../services/getTotalPrice";

describe("getTotalPrice", () => {
    it("should handle string", () => {
        const price = '50';
        const result = getTotalPrice(price);

        expect(result).toBe("75.00"); // 55.00 + 25.00
    })

    it("should handle a number", () => {
        const price = 55;
        const result = getTotalPrice(price);

        expect(result).toBe("82.50"); // 55.00 + 27.50
    })

    it("should work for other durations", () => {
        const price = 50;
        const result = getTotalPrice(price, 2);

        expect(result).toBe("100.00"); // 50.00 + 50.00
    })

    it("should throw error", () => {
        const price = "invalid";

        expect(() => getTotalPrice(price))
        .toThrow("Invalid input: pricePerHour and duration must be valid numbers.");
    })
})