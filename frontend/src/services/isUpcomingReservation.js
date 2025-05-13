import dayjs from 'dayjs';

const isUpcomingReservation = (reservationDate) => {
  const now = dayjs();
  const reservationTime = dayjs(reservationDate);

  // if the reservation is less than 30 minutes away => false
  return reservationTime.diff(now, 'minutes') >= 30;
};

export default isUpcomingReservation;
