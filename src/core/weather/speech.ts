import type { DayScore } from './score';

/**
 * Sentences for screen readers. The dashboard draws numbers in a grid; these say
 * the same thing in one breath per hour or per day.
 */

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const say = (n: number) => words[n] ?? String(n);

/** "one under par", "even par", "two over par", or "weather delay". */
export function strokesPhrase(score: DayScore): string {
  const s = score.strokes;
  if (s === null) return 'weather delay';
  if (s === 0) return 'even par';
  return `${say(Math.abs(s))} ${s < 0 ? 'under' : 'over'} par`;
}

/** "Saturday, high 52, low 44, rain 17 percent, one under par" */
export function scorecardDayLabel(day: {
  name: string;
  high: number;
  low: number;
  precipChance: number;
  score: DayScore;
}): string {
  return [
    day.name,
    `high ${Math.round(day.high)}`,
    `low ${Math.round(day.low)}`,
    `rain ${Math.round(day.precipChance)} percent`,
    strokesPhrase(day.score),
  ].join(', ');
}

/** "3 pm, light rain, 48 degrees, rain 40 percent"; the rain part is left out at 0. */
export function hourCellLabel(hour: {
  time: string;
  sky: string;
  temperature: number;
  precipChance: number;
}): string {
  const rain = Math.round(hour.precipChance);
  return [
    hour.time,
    hour.sky.toLowerCase(),
    `${Math.round(hour.temperature)} degrees`,
    rain > 0 ? `rain ${rain} percent` : null,
  ]
    .filter(Boolean)
    .join(', ');
}
