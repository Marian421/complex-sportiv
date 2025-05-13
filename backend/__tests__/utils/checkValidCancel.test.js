const checkValidCancel = require('../../utils/checkValidCancel');
const dayjs = require('dayjs');

describe('checkValidCancel', () => {

  const generateTestInput = (minutesFromNow) => {
    const targetDateTime = dayjs().add(minutesFromNow, 'minute');
    const reservationDate = targetDateTime.startOf('day').toISOString();
    const startTime = targetDateTime.format('HH:mm:ss');
    return { reservationDate, startTime };
  };

  it('should return false if cancellation is within 30 minutes of reservation', () => {
    const { reservationDate, startTime } = generateTestInput(10); 
    expect(checkValidCancel(reservationDate, startTime)).toBe(false);
  });

  it('should return true if cancellation is more than 30 minutes before reservation', () => {
    const { reservationDate, startTime } = generateTestInput(45); 
    expect(checkValidCancel(reservationDate, startTime)).toBe(true);
  });

  it('should return false if cancellation is exactly 30 minutes before reservation', () => {
    const { reservationDate, startTime } = generateTestInput(30); 
    expect(checkValidCancel(reservationDate, startTime)).toBe(false);
  });

  it('should return false if reservation is in the past', () => {
    const { reservationDate, startTime } = generateTestInput(-5); 
    expect(checkValidCancel(reservationDate, startTime)).toBe(false);
  });

  it('should return true if reservation is tomorrow', () => {
    const targetDateTime = dayjs().add(1, 'day').hour(12).minute(0).second(0);
    const reservationDate = targetDateTime.startOf('day').toISOString();
    const startTime = targetDateTime.format('HH:mm:ss');

    expect(checkValidCancel(reservationDate, startTime)).toBe(true);
  });

});
