/**
 * What's normal for a place and date, from past years of the Open-Meteo archive.
 * Everything here is metric: °C, mm and km/h, whatever units the UI shows.
 */
export type DailyRecord = {
  date: string;
  high: number;
  low: number;
  precip: number;
  windMax: number;
};

export type Normal = {
  high: number;
  low: number;
  /** Share of days with at least 1 mm of precipitation, 0–100. */
  wetChance: number;
  windMax: number;
};

export const ARCHIVE_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'wind_speed_10m_max',
] as const;

export const NORMAL_YEARS = 10;
const WINDOW_DAYS = 7;
const WET_MM = 1;

type Raw = { daily?: Record<string, (number | string | null)[] | undefined> };

export function parseArchive(json: unknown): DailyRecord[] {
  const d = (json as Raw).daily;
  if (!d?.time) throw new Error('Archive response has no daily values');
  const out: DailyRecord[] = [];
  d.time.forEach((date, i) => {
    const high = d.temperature_2m_max?.[i];
    const low = d.temperature_2m_min?.[i];
    if (typeof date !== 'string' || typeof high !== 'number' || typeof low !== 'number') return;
    const precip = d.precipitation_sum?.[i];
    const wind = d.wind_speed_10m_max?.[i];
    out.push({
      date,
      high,
      low,
      precip: typeof precip === 'number' ? precip : 0,
      windMax: typeof wind === 'number' ? wind : 0,
    });
  });
  return out;
}

/** Day of year, 0–365, ignoring the year. */
function dayOfYear(date: string): number {
  const m = Number(date.slice(5, 7));
  const d = Number(date.slice(8, 10));
  return Math.round((Date.UTC(2001, m - 1, d) - Date.UTC(2001, 0, 1)) / 86400000);
}

/** Averages every past year's days within a week either side of `date`. */
export function normalFor(records: DailyRecord[], date: string): Normal | null {
  const target = dayOfYear(date);
  const near = records.filter((r) => {
    const gap = Math.abs(dayOfYear(r.date) - target);
    return Math.min(gap, 365 - gap) <= WINDOW_DAYS;
  });
  if (near.length < 30) return null;
  const mean = (f: (r: DailyRecord) => number) => near.reduce((n, r) => n + f(r), 0) / near.length;
  return {
    high: mean((r) => r.high),
    low: mean((r) => r.low),
    wetChance: mean((r) => (r.precip >= WET_MM ? 100 : 0)),
    windMax: mean((r) => r.windMax),
  };
}

/** Date range for the archive request: the last full NORMAL_YEARS calendar years. */
export function archiveRange(today: string): { start: string; end: string } {
  const year = Number(today.slice(0, 4));
  return { start: `${year - NORMAL_YEARS}-01-01`, end: `${year - 1}-12-31` };
}
