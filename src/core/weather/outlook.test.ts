import type { Hour } from './forecast';
import { bestTeeTime, nowcastLine, rainOutlook, rangeLabel } from './outlook';

const hour = (h: number, over: Partial<Hour> = {}): Hour => ({
  time: `2026-11-25T${String(h % 24).padStart(2, '0')}:00`.replace('25T', h >= 24 ? '26T' : '25T'),
  temperature: 60,
  feelsLike: 60,
  precipChance: 0,
  precipitation: 0,
  code: 3,
  isDay: h % 24 >= 7 && h % 24 < 17,
  windSpeed: 5,
  pressure: 1015,
  ...over,
});

describe('rangeLabel', () => {
  it('shares the am/pm suffix only when both ends have it', () => {
    expect(rangeLabel(4, 9)).toBe('4–9 am');
    expect(rangeLabel(10, 14)).toBe('10 am–2 pm');
    expect(rangeLabel(11, 12)).toBe('11 am–noon');
    expect(rangeLabel(23, 27)).toBe('11 pm–3 am');
  });
});

describe('rainOutlook', () => {
  it('times a rain spell and its peak', () => {
    const hours = Array.from({ length: 18 }, (_, i) =>
      hour(
        18 + i,
        i >= 10 && i <= 14
          ? { precipChance: 90, precipitation: i === 12 ? 0.2 : 0.05, code: 63 }
          : {},
      ),
    );
    expect(rainOutlook(hours, 'imperial')).toBe('Rain 4–9 am, heaviest around 6 am. Dry after.');
  });

  it('says when current rain stops', () => {
    const hours = Array.from({ length: 18 }, (_, i) =>
      hour(8 + i, i < 2 ? { precipChance: 80 } : {}),
    );
    expect(rainOutlook(hours, 'imperial')).toBe('Rain until 10 am. Dry after.');
  });

  it('reports a dry spell', () => {
    expect(rainOutlook([hour(8), hour(9)], 'imperial')).toBe('Dry for the next 18 hours.');
  });
});

describe('nowcastLine', () => {
  const slot = (p: number) => ({ time: '', precipitation: p });
  it('counts minutes to a change', () => {
    expect(nowcastLine([slot(0.1), slot(0.1), slot(0), slot(0)])).toBe(
      'Rain easing in about 30 min.',
    );
    expect(nowcastLine([slot(0), slot(0), slot(0), slot(0.2)])).toBe(
      'Rain starting in about 45 min.',
    );
    expect(nowcastLine([slot(0), slot(0)])).toBeNull();
  });
});

describe('bestTeeTime', () => {
  it('picks the driest daylight pair and rolls over to tomorrow after dark', () => {
    const today = Array.from({ length: 10 }, (_, i) =>
      hour(8 + i, { precipChance: i === 4 || i === 5 ? 0 : 70 }),
    );
    expect(bestTeeTime(today, 'imperial')).toMatchObject({ label: 'noon–2 pm', when: 'today' });
    const evening = Array.from({ length: 24 }, (_, i) => hour(18 + i));
    expect(bestTeeTime(evening, 'imperial')?.when).toBe('tomorrow');
    const sun = { sunrise: '2026-11-26T07:23', sunset: '2026-11-26T16:31' };
    const late = evening.map((h) =>
      h.time.endsWith('15:00') || h.time.endsWith('16:00') ? h : { ...h, precipChance: 90 },
    );
    const days = [{ date: '2026-11-26', ...sun } as never];
    // 3–5 pm would run past sunset, so the window shifts to end by 4 pm.
    expect(bestTeeTime(late, 'imperial', days)?.label).toBe('2–4 pm');
  });
});
