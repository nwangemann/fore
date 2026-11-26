import { parseForecast } from './forecast';
import { clockLabel, hourLabel, minutesBetween, weekdayLabel } from './localTime';

const sample = {
  timezone: 'America/Chicago',
  current: { time: '2026-11-25T20:30', temperature_2m: 40.8, is_day: 0, weather_code: 3 },
  hourly: {
    time: ['2026-11-25T19:00', '2026-11-25T20:00', '2026-11-25T21:00', '2026-11-25T22:00'],
    temperature_2m: [41, 40, 39, 38],
    precipitation_probability: [0, 5, 10, 20],
    weather_code: [3, 3, 3, 61],
    is_day: [0, 0, 0, 0],
  },
  daily: { time: ['2026-11-25'], temperature_2m_max: [45], temperature_2m_min: [33] },
};

describe('parseForecast', () => {
  it('starts the hours at the current hour', () => {
    const f = parseForecast(sample, 2);
    expect(f.hours.map((h) => h.time)).toEqual(['2026-11-25T20:00', '2026-11-25T21:00']);
    expect(f.current.isDay).toBe(false);
    expect(f.days[0]?.high).toBe(45);
  });

  it('rejects a response without sections', () => {
    expect(() => parseForecast({ current: {} })).toThrow();
  });
});

describe('local time labels', () => {
  it('reads place-local times without the device time zone', () => {
    expect(hourLabel('2026-11-25T00:00')).toBe('Midnight');
    expect(hourLabel('2026-11-25T13:00')).toBe('1 pm');
    expect(clockLabel('2026-11-25T07:04')).toBe('7:04 am');
    expect(clockLabel('2026-11-25T12:30')).toBe('12:30 pm');
    expect(weekdayLabel('2026-11-25')).toBe('Wed');
    expect(minutesBetween('2026-11-25T07:00', '2026-11-25T16:30')).toBe(570);
  });
});
