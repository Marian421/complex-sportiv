import isUpcomingReservation from '../services/isUpcomingReservation';
import dayjs from 'dayjs';

describe('isUpcomingReservation', () => {
  it('should return true if the reservation date is in the future', () => {
    const futureDate = dayjs().add(1, 'day').toISOString(); 
    expect(isUpcomingReservation(futureDate)).toBe(true);
  });

  it('should return false if the reservation date is today', () => {
    const today = dayjs().toISOString(); 
    expect(isUpcomingReservation(today)).toBe(false);
  });

  it('should return true if the reservation date is later today', () => {
    const today = dayjs().add(40, 'minutes').toISOString(); 
    expect(isUpcomingReservation(today)).toBe(true);
  });

  it('should return false if the reservation date is in the past', () => {
    const pastDate = dayjs().subtract(1, 'day').toISOString(); 
    expect(isUpcomingReservation(pastDate)).toBe(false);
  });
});
