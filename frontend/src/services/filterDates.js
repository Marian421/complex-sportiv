import dayjs from "dayjs";

const today = dayjs();

const filterDates = (reservations, dateFilter) => {
    if (!Array.isArray(reservations) || reservations.length === 0) {
        console.error("No reservations to filter.");
        return [];
    }

    return reservations.filter((reservation) => {
        if (!reservation || !reservation.reservation_date) {
            console.error("Invalid reservation:", reservation);
            return false;
        }

        const resDate = dayjs(reservation.reservation_date);

        if (!resDate.isValid()) {
            console.error("Invalid date format:", reservation.reservation_date);
            return false;
        }

        switch (dateFilter) {
            case "all":
                return true;
            case "today":
                return resDate.isSame(today, 'day');
            case "past":
                return resDate.isBefore(today, 'day');
            case "upcoming":
                return resDate.isAfter(today, 'day');
            default:
                console.error("Invalid date filter:", dateFilter);
                return true; 
        }
    });
};

export default filterDates;

