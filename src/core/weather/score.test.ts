import type { Day } from './forecast';
import { scoreDay, scoreMark } from './score';

const day = (over: Partial<Day>): Day => ({
  date: '2026-06-01',
  code: 0,
  high: 72,
  low: 55,
  sunrise: '',
  sunset: '',
  precipChance: 0,
  precipSum: 0,
  uvMax: 5,
  windMax: 5,
  ...over,
});

describe('scoreDay', () => {
  it('rates a warm, clear, calm day an eagle', () => {
    expect(scoreDay(day({}), 'imperial')).toEqual({ strokes: -2, label: 'Eagle' });
  });

  it('treats the same day the same in either unit system', () => {
    expect(scoreDay(day({ high: 22.2, windMax: 8 }), 'metric').strokes).toBe(-2);
  });

  it('punishes cold, wet, windy days', () => {
    const s = scoreDay(day({ code: 63, high: 38, precipChance: 90, windMax: 30 }), 'imperial');
    expect(s.strokes).toBe(6);
    expect(s.label).toBe('Snowman');
  });

  it('suspends play for thunderstorms', () => {
    const s = scoreDay(day({ code: 95 }), 'imperial');
    expect(scoreMark(s)).toBe('—');
  });
});
