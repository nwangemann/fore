import { hourKey } from './localTime';

export type Current = {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  code: number;
  windSpeed: number;
  windGusts: number;
  windDirection: number;
  uvIndex: number;
  /** Always hPa; the UI converts. */
  pressure: number;
  cloudCover: number;
  /** Raw Open-Meteo visibility: feet in imperial, metres in metric. */
  visibility: number;
  dewPoint: number;
};

export type Hour = {
  time: string;
  temperature: number;
  feelsLike: number;
  precipChance: number;
  /** Amount in the hour, in the request's precipitation unit. */
  precipitation: number;
  code: number;
  isDay: boolean;
  windSpeed: number;
  pressure: number;
};

export type Day = {
  date: string;
  code: number;
  high: number;
  low: number;
  sunrise: string;
  sunset: string;
  precipChance: number;
  precipSum: number;
  uvMax: number;
  windMax: number;
};

/** A 15-minute step of the short-range precipitation forecast. */
export type Slot = { time: string; precipitation: number };

export type PressureTrend = 'rising' | 'falling' | 'steady';

export type Forecast = {
  timezone: string;
  current: Current;
  /** Starts at the current hour. */
  hours: Hour[];
  /** Starts today. */
  days: Day[];
  yesterday: Day | null;
  /** The hour 24 hours before the current one. */
  sameHourYesterday: Hour | null;
  pressureTrend: PressureTrend | null;
  /** Next two hours in 15-minute steps, starting with the current one. */
  nowcast: Slot[];
};

export const CURRENT_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'is_day',
  'precipitation',
  'weather_code',
  'wind_speed_10m',
  'wind_gusts_10m',
  'wind_direction_10m',
  'uv_index',
  'pressure_msl',
  'cloud_cover',
  'visibility',
  'dew_point_2m',
] as const;
export const HOURLY_FIELDS = [
  'temperature_2m',
  'apparent_temperature',
  'precipitation_probability',
  'precipitation',
  'weather_code',
  'is_day',
  'wind_speed_10m',
  'pressure_msl',
] as const;
export const DAILY_FIELDS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'precipitation_probability_max',
  'precipitation_sum',
  'uv_index_max',
  'wind_speed_10m_max',
] as const;
export const MINUTELY_FIELDS = ['precipitation'] as const;

type Series = Record<string, (number | string | null)[] | undefined>;
type Raw = {
  timezone?: string;
  current?: Record<string, number | string | null>;
  hourly?: Series;
  daily?: Series;
  minutely_15?: Series;
};

const num = (v: unknown): number => (typeof v === 'number' ? v : 0);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Pressure change over three hours that counts as a trend, in hPa. */
const TREND_HPA = 1;

/**
 * Turns an Open-Meteo /v1/forecast response into the dashboard's model.
 * Expects `past_days=1` so yesterday and the pressure trend are available.
 */
export function parseForecast(json: unknown, hourCount = 48): Forecast {
  const raw = json as Raw;
  const cur = raw.current;
  if (!cur || !raw.hourly || !raw.daily) throw new Error('Forecast response is missing sections');
  const current: Current = {
    time: str(cur.time),
    temperature: num(cur.temperature_2m),
    feelsLike: num(cur.apparent_temperature),
    humidity: num(cur.relative_humidity_2m),
    isDay: cur.is_day === 1,
    precipitation: num(cur.precipitation),
    code: num(cur.weather_code),
    windSpeed: num(cur.wind_speed_10m),
    windGusts: num(cur.wind_gusts_10m),
    windDirection: num(cur.wind_direction_10m),
    uvIndex: num(cur.uv_index),
    pressure: num(cur.pressure_msl),
    cloudCover: num(cur.cloud_cover),
    visibility: num(cur.visibility),
    dewPoint: num(cur.dew_point_2m),
  };

  const h = raw.hourly;
  const times = (h.time ?? []).map(str);
  const hourAt = (i: number): Hour | null => {
    const time = times[i];
    if (time === undefined || i < 0) return null;
    return {
      time,
      temperature: num(h.temperature_2m?.[i]),
      feelsLike: num(h.apparent_temperature?.[i]),
      precipChance: num(h.precipitation_probability?.[i]),
      precipitation: num(h.precipitation?.[i]),
      code: num(h.weather_code?.[i]),
      isDay: h.is_day?.[i] === 1,
      windSpeed: num(h.wind_speed_10m?.[i]),
      pressure: num(h.pressure_msl?.[i]),
    };
  };
  const start = Math.max(0, times.indexOf(hourKey(current.time)));
  const hours: Hour[] = [];
  for (let i = start; i < Math.min(times.length, start + hourCount); i++) {
    const x = hourAt(i);
    if (x) hours.push(x);
  }
  const before = hourAt(start - 3);
  const now = hourAt(start);
  let pressureTrend: PressureTrend | null = null;
  if (before && now) {
    const change = now.pressure - before.pressure;
    pressureTrend = change >= TREND_HPA ? 'rising' : change <= -TREND_HPA ? 'falling' : 'steady';
  }

  const d = raw.daily;
  const allDays: Day[] = (d.time ?? []).map((date, i) => ({
    date: str(date),
    code: num(d.weather_code?.[i]),
    high: num(d.temperature_2m_max?.[i]),
    low: num(d.temperature_2m_min?.[i]),
    sunrise: str(d.sunrise?.[i]),
    sunset: str(d.sunset?.[i]),
    precipChance: num(d.precipitation_probability_max?.[i]),
    precipSum: num(d.precipitation_sum?.[i]),
    uvMax: num(d.uv_index_max?.[i]),
    windMax: num(d.wind_speed_10m_max?.[i]),
  }));
  const todayIndex = Math.max(
    0,
    allDays.findIndex((x) => x.date === current.time.slice(0, 10)),
  );

  const m = raw.minutely_15;
  const slotTimes = (m?.time ?? []).map(str);
  const slotKey = slotTimes.filter((t) => t <= current.time).pop();
  const slotStart = slotKey ? slotTimes.indexOf(slotKey) : 0;
  const nowcast: Slot[] = slotTimes
    .slice(slotStart, slotStart + 8)
    .map((time, j) => ({ time, precipitation: num(m?.precipitation?.[slotStart + j]) }));

  return {
    timezone: str(raw.timezone),
    current,
    hours,
    days: allDays.slice(todayIndex),
    yesterday: allDays[todayIndex - 1] ?? null,
    sameHourYesterday: hourAt(start - 24),
    pressureTrend,
    nowcast,
  };
}
