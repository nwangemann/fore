import type { Normal } from '../climate/normals';
import type { Units } from '../units';
import { condition } from './codes';
import type { Day } from './forecast';

/** How a day plays, as a golf score against par. */
export type DayScore = {
  /** Strokes over par: negative is good. `null` means play is suspended. */
  strokes: number | null;
  label: string;
};

export const toC = (t: number, units: Units) => (units === 'imperial' ? ((t - 32) * 5) / 9 : t);
export const toKmh = (s: number, units: Units) => (units === 'imperial' ? s * 1.609 : s);
export const toMm = (p: number, units: Units) => (units === 'imperial' ? p * 25.4 : p);
/** A temperature difference in °C, expressed in the display unit. */
export const deltaFromC = (d: number, units: Units) => (units === 'imperial' ? (d * 9) / 5 : d);

/**
 * Scores a day for being outside. With a `normal`, par is what's usual for this place
 * and date, so a mild winter day can be under par. Without one, a fixed ideal is used.
 * The thresholds are taste, not science; tune them here.
 */
export function scoreDay(day: Day, units: Units, normal?: Normal | null): DayScore {
  const mood = condition(day.code).mood;
  if (mood === 'storm') return { strokes: null, label: 'Weather delay' };
  const strokes = normal ? relative(day, units, normal) : absolute(day, units);
  return { strokes, label: scoreLabel(strokes) };
}

function relative(day: Day, units: Units, normal: Normal): number {
  const high = toC(day.high, units);
  const mood = condition(day.code).mood;
  let s = 0;

  const warmth = high - normal.high;
  if (warmth >= 6) s -= 2;
  else if (warmth >= 3) s -= 1;
  else if (warmth <= -6) s += 2;
  else if (warmth <= -3) s += 1;

  const wet = day.precipChance >= 50 && toMm(day.precipSum, units) >= 1;
  const usuallyWet = normal.wetChance >= 50;
  if (wet) s += usuallyWet ? 1 : 2;
  else if (day.precipChance < 30 && usuallyWet) s -= 1;

  const extraWind = toKmh(day.windMax, units) - normal.windMax;
  if (extraWind >= 25) s += 2;
  else if (extraWind >= 12) s += 1;

  if (mood === 'snow') s += 1;
  if (mood === 'clear' && s <= 0) s -= 1;
  // Normal for the season can still be miserable: never under par below 5 °C or above 35 °C.
  if (high < 5 || high > 35) s = Math.max(s, 0);
  return s;
}

function absolute(day: Day, units: Units): number {
  const mood = condition(day.code).mood;
  const high = toC(day.high, units);
  const wind = toKmh(day.windMax, units);
  let s = 0;

  if (high >= 18 && high <= 26) s -= 1;
  else if (high < 4 || high > 35) s += 2;
  else if (high < 10 || high > 31) s += 1;

  if (day.precipChance >= 60) s += 2;
  else if (day.precipChance >= 30) s += 1;

  if (wind > 40) s += 2;
  else if (wind > 25) s += 1;

  if (mood === 'snow') s += 2;
  if (mood === 'clear' && s <= 0) s -= 1;
  return s;
}

export function scoreLabel(strokes: number): string {
  if (strokes <= -2) return 'Eagle';
  if (strokes === -1) return 'Birdie';
  if (strokes === 0) return 'Par';
  if (strokes === 1) return 'Bogey';
  if (strokes === 2) return 'Double bogey';
  return 'Snowman';
}

/** Scorecard notation: "-1", "E", "+2", or "—" when play is suspended. */
export function scoreMark(score: DayScore): string {
  if (score.strokes === null) return '—';
  if (score.strokes === 0) return 'E';
  return score.strokes > 0 ? `+${score.strokes}` : `${score.strokes}`;
}

/** Index of the lowest-scoring day; the earliest wins a tie. Null if every day is delayed. */
export function bestDay(scores: DayScore[]): number | null {
  let best: number | null = null;
  scores.forEach((s, i) => {
    if (s.strokes === null) return;
    const b = best === null ? null : scores[best]?.strokes;
    if (b === null || b === undefined || s.strokes < b) best = i;
  });
  return best;
}

/** Plain-language hints for the hero card. */
export function caddieNotes(
  current: { windGusts: number; uvIndex: number; feelsLike: number; temperature: number },
  units: Units,
): string[] {
  const notes: string[] = [];
  const gust = toKmh(current.windGusts, units);
  if (gust > 45) notes.push('Gale on the links. Club up two, maybe three.');
  else if (gust > 30) notes.push('Breezy. Keep the ball flight low.');
  if (current.uvIndex >= 6) notes.push('High UV. Sunscreen before the first tee.');
  const gap = toC(current.feelsLike, units) - toC(current.temperature, units);
  if (gap <= -4) notes.push('Wind chill bites. Layer up.');
  if (gap >= 4) notes.push('Muggy. Hydrate between holes.');
  return notes;
}
