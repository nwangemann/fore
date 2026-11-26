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
  pressure: number;
  cloudCover: number;
  /** Raw Open-Meteo visibility: feet in imperial, metres in metric. */
  visibility: number;
  dewPoint: number;
};

export type Hour = {
  time: string;
  temperature: number;
  precipChance: number;
  code: number;
  isDay: boolean;
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

export type Forecast = {
  timezone: string;
  current: Current;
  /** Starts at the current hour. */
  hours: Hour[];
  days: Day[];
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
  'precipitation_probability',
  'weather_code',
  'is_day',
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

type Series = Record<string, (number | string | null)[] | undefined>;
type Raw = {
  timezone?: string;
  current?: Record<string, number | string | null>;
  hourly?: Series;
  daily?: Series;
};

const num = (v: unknown): number => (typeof v === 'number' ? v : 0);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

/** Turns an Open-Meteo /v1/forecast response into the dashboard's model. */
export function parseForecast(json: unknown, hourCount = 24): Forecast {
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
  const start = Math.max(0, times.indexOf(hourKey(current.time)));
  const hours: Hour[] = times.slice(start, start + hourCount).map((time, j) => {
    const i = start + j;
    return {
      time,
      temperature: num(h.temperature_2m?.[i]),
      precipChance: num(h.precipitation_probability?.[i]),
      code: num(h.weather_code?.[i]),
      isDay: h.is_day?.[i] === 1,
    };
  });

  const d = raw.daily;
  const days: Day[] = (d.time ?? []).map((date, i) => ({
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

  return { timezone: str(raw.timezone), current, hours, days };
}
