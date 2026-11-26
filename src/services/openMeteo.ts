import { AIR_FIELDS, parseAir, type Air } from '@/core/air/air';
import type { Place } from '@/core/place/place';
import type { Units } from '@/core/units';
import {
  CURRENT_FIELDS,
  DAILY_FIELDS,
  HOURLY_FIELDS,
  parseForecast,
  type Forecast,
} from '@/core/weather/forecast';
import { getJson, query } from './http';

/** Open-Meteo: free, keyless, non-commercial use. https://open-meteo.com */
const FORECAST = 'https://api.open-meteo.com/v1/forecast';
const AIR = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';

export async function fetchForecast(place: Place, units: Units): Promise<Forecast> {
  const imperial = units === 'imperial';
  const q = query({
    latitude: place.latitude,
    longitude: place.longitude,
    current: CURRENT_FIELDS.join(','),
    hourly: HOURLY_FIELDS.join(','),
    daily: DAILY_FIELDS.join(','),
    timezone: 'auto',
    forecast_days: 9,
    temperature_unit: imperial ? 'fahrenheit' : 'celsius',
    wind_speed_unit: imperial ? 'mph' : 'kmh',
    precipitation_unit: imperial ? 'inch' : 'mm',
  });
  return parseForecast(await getJson(`${FORECAST}?${q}`));
}

export async function fetchAir(place: Place): Promise<Air> {
  const q = query({
    latitude: place.latitude,
    longitude: place.longitude,
    current: AIR_FIELDS.join(','),
    timezone: 'auto',
  });
  return parseAir(await getJson(`${AIR}?${q}`));
}

type GeoResult = {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
};

export async function searchPlaces(text: string): Promise<Place[]> {
  const name = text.trim();
  if (name.length < 2) return [];
  const json = (await getJson(`${GEOCODE}?${query({ name, count: 8, format: 'json' })}`)) as {
    results?: GeoResult[];
  };
  return (json.results ?? []).map((r) => ({
    name: r.name,
    detail: [r.admin1, r.country].filter(Boolean).join(', '),
    latitude: r.latitude,
    longitude: r.longitude,
    countryCode: r.country_code,
  }));
}
