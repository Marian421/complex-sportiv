const dayjs = require("dayjs");

const checkValidCancel = (reservationDate, startTime) => {
  const [hour, minute, second = 0] = startTime.split(":").map(Number);

  const reservationDateTime = dayjs(reservationDate)
    .set("hour", hour)
    .set("minute", minute)
    .set("second", second || 0);

  const currentDateTime = dayjs();

  const timeDifference = reservationDateTime.diff(currentDateTime, "minute");

  return timeDifference > 30;
};

module.exports = checkValidCancel;
