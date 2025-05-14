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

        const [hour, minute, second = 0] = reservation.start_time.split(":").map(Number);

        const resDate = dayjs(reservation.reservation_date)
            .set('hour', hour)
            .set('minute', minute)
            .set('second', second);

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
                return resDate.isBefore(today, 'minutes');
            case "upcoming":
                return resDate.isAfter(today, 'minutes');
            default:
                console.error("Invalid date filter:", dateFilter);
                return true; 
        }
    });
};

export default filterDates;

