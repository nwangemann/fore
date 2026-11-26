import type { Normal } from '../climate/normals';
import type { Day } from './forecast';
import { bestDay, scoreDay, scoreMark } from './score';

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

const november: Normal = { high: 11, low: 5, wetChance: 60, windMax: 18 };

describe('scoreDay without normals', () => {
  it('rates a warm, clear, calm day an eagle', () => {
    expect(scoreDay(day({}), 'imperial')).toEqual({ strokes: -2, label: 'Eagle' });
  });

  it('treats the same day the same in either unit system', () => {
    expect(scoreDay(day({ high: 22.2, windMax: 8 }), 'metric').strokes).toBe(-2);
  });

  it('suspends play for thunderstorms', () => {
    expect(scoreMark(scoreDay(day({ code: 95 }), 'imperial'))).toBe('—');
  });
});

describe('scoreDay against the seasonal normal', () => {
  it('lets an ordinary dry autumn day be under par', () => {
    const s = scoreDay(
      day({ code: 3, high: 52, precipChance: 15, windMax: 8 }),
      'imperial',
      november,
    );
    expect(s.strokes).toBe(-1);
  });

  it('charges less for rain where rain is usual', () => {
    const wet = day({ code: 63, high: 52, precipChance: 90, precipSum: 0.3, windMax: 8 });
    expect(scoreDay(wet, 'imperial', november).strokes).toBe(1);
    expect(scoreDay(wet, 'imperial', { ...november, wetChance: 20 }).strokes).toBe(2);
  });

  it('never goes under par in the cold', () => {
    const s = scoreDay(day({ code: 0, high: 38 }), 'imperial', { ...november, high: -2 });
    expect(s.strokes).toBe(0);
  });
});

describe('bestDay', () => {
  it('takes the earliest lowest score and skips delays', () => {
    const marks = [1, null, -1, -1].map((strokes) => ({ strokes, label: '' }));
    expect(bestDay(marks)).toBe(2);
  });
});
