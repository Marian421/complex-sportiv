import dayjs from 'dayjs';

const isUpcomingReservation = (reservationDate) => {
  return dayjs(reservationDate).isAfter(dayjs(), 'hour');
};

export default isUpcomingReservation;
