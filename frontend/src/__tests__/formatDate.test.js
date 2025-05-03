
import formatDate from '../services/formatDate';

describe('formatDate', () => {
  it('should format ISO date string to DD-MM-YYYY', () => {
    const input = '2025-04-24T21:00:00.000Z';
    const output = formatDate(input);
    expect(output).toBe('25-04-2025');
  });

  it('should return Invalid Date for invalid input', () => {
    const input = 'invalid-date';
    const output = formatDate(input);
    expect(output).toBe('Invalid Date'); 
  });
});
