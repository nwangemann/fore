import type { Units } from '../units';
import { condition } from './codes';
import type { Day } from './forecast';

/** How a day plays, as a golf score against par. */
export type DayScore = {
  /** Strokes over par: negative is good. `null` means play is suspended. */
  strokes: number | null;
  label: string;
};

const toC = (t: number, units: Units) => (units === 'imperial' ? ((t - 32) * 5) / 9 : t);
const toKmh = (s: number, units: Units) => (units === 'imperial' ? s * 1.609 : s);

/**
 * Scores a day for being outside: warm, dry, calm and bright is under par.
 * The thresholds are taste, not science; tune them in one place here.
 */
export function scoreDay(day: Day, units: Units): DayScore {
  const mood = condition(day.code).mood;
  if (mood === 'storm') return { strokes: null, label: 'Weather delay' };

  const high = toC(day.high, units);
  const wind = toKmh(day.windMax, units);
  let strokes = 0;

  if (high >= 18 && high <= 26) strokes -= 1;
  else if (high < 4 || high > 35) strokes += 2;
  else if (high < 10 || high > 31) strokes += 1;

  if (day.precipChance >= 60) strokes += 2;
  else if (day.precipChance >= 30) strokes += 1;

  if (wind > 40) strokes += 2;
  else if (wind > 25) strokes += 1;

  if (mood === 'snow') strokes += 2;
  if (mood === 'clear' && strokes <= 0) strokes -= 1;

  return { strokes, label: scoreLabel(strokes) };
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

/** Plain-language hints for the hero card. */
export function caddieNotes(
  current: {
    windSpeed: number;
    windGusts: number;
    uvIndex: number;
    feelsLike: number;
    temperature: number;
  },
  today: Day | undefined,
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
  if (today && today.precipChance >= 50) notes.push('Rain likely today. Waterproofs in the bag.');
  return notes;
}
