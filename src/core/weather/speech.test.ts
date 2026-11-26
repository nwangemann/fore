import { weekdayName } from './localTime';
import { hourCellLabel, scorecardDayLabel, strokesPhrase } from './speech';

describe('scorecardDayLabel', () => {
  it('reads a day as one sentence', () => {
    expect(
      scorecardDayLabel({
        name: weekdayName('2026-11-28'),
        high: 52.4,
        low: 43.6,
        precipChance: 17,
        score: { strokes: -1, label: 'Birdie' },
      }),
    ).toBe('Saturday, high 52, low 44, rain 17 percent, one under par');
  });
});

describe('strokesPhrase', () => {
  it('says even, over, under and delayed the way a golfer would', () => {
    expect(strokesPhrase({ strokes: 0, label: 'Par' })).toBe('even par');
    expect(strokesPhrase({ strokes: 2, label: 'Double bogey' })).toBe('two over par');
    expect(strokesPhrase({ strokes: -3, label: 'Eagle' })).toBe('three under par');
    expect(strokesPhrase({ strokes: null, label: 'Weather delay' })).toBe('weather delay');
  });
});

describe('hourCellLabel', () => {
  it('leaves out rain when there is none', () => {
    expect(hourCellLabel({ time: 'Now', sky: 'Clear', temperature: 47.6, precipChance: 0 })).toBe(
      'Now, clear, 48 degrees',
    );
    expect(hourCellLabel({ time: '3 pm', sky: 'Rain', temperature: 50, precipChance: 40 })).toBe(
      '3 pm, rain, 50 degrees, rain 40 percent',
    );
  });
});
