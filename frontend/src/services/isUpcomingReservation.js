import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const isUpcomingReservation = (reservationDate, timeInterval = "6:00 PM - 7:30 PM") => {
  const now = dayjs();
  const reservationDay = dayjs(reservationDate).format("YYYY-MM-DD");
  const [startTime] = timeInterval.split(" - ");

  const fullDateTime = `${reservationDay} ${startTime}`;

  const reservationTime = dayjs(fullDateTime, "YYYY-MM-DD h:mm A");

  // if the reservation is less than 30 minutes away => false
  return reservationTime.diff(now, 'minutes') >= 30;
};

export default isUpcomingReservation;
