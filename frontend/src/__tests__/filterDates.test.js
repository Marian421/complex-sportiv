import filterDates from "../services/filterDates";
import dayjs from "dayjs";


describe("filterDates", () => {
    const today = dayjs().add(30, "minutes");
    const tomorrow = today.add(1, 'day');
    const yesterday = today.subtract(1, 'day');

    const reservations = [
        {
            id: 1,
            reservation_date: today
        },
        {
            id: 2,
            reservation_date: tomorrow
        },
        {
            id: 3,
            reservation_date: yesterday
        }
    ];

    it("should return all entries", () => {
        expect(filterDates(reservations, "all")).toEqual(reservations);
    })

    it("should return upcoming reservations", () => {
        expect(filterDates(reservations, "upcoming")[0]).toEqual(reservations[0]);
        expect(filterDates(reservations, "upcoming")[1]).toEqual(reservations[1]);
    })

    it("should return yesterday date", () => {
        expect(filterDates(reservations, "past")[0]).toEqual(reservations[2]);
    })

    it("should return today's date", () => {
        expect(filterDates(reservations, "today")[0]).toEqual(reservations[0]);
    })

    it("should return empty array for invalid filter", () => {
        expect(filterDates(reservations, "invalid")).toEqual(reservations);
    })

    it("should handle empty reservations", () => {
        expect(filterDates([], 'today')).toEqual([]);
    })

    it('should return an empty array if reservation date is invalid', () => {
        const invalidReservations = [
        { id: 1, reservation_date: 'invalid-date' },
        { id: 2, reservation_date: null },
        ];

        const result = filterDates(invalidReservations, 'all');
        expect(result).toEqual([]);
    });

    it('should handle null or undefined reservation', () => {
        const invalidReservations = [
        { id: 1, reservation_date: today.format('YYYY-MM-DD') },
        null,
        { id: 2, reservation_date: tomorrow },
        ];

        const result = filterDates(invalidReservations, 'all');
        expect(result).toEqual([
        { id: 1, reservation_date: today.format('YYYY-MM-DD') },
        { id: 2, reservation_date: tomorrow },
        ]);
    });
})