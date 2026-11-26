import type { Place } from '@/core/place/place';
import air from './__fixtures__/openMeteoAir.json';
import archive from './__fixtures__/openMeteoArchive.json';
import forecast from './__fixtures__/openMeteoForecast.json';
import geocoding from './__fixtures__/openMeteoGeocoding.json';
import { mockFetch, requestedUrl } from './__fixtures__/mockFetch';
import { fetchAir, fetchArchive, fetchForecast, searchPlaces } from './openMeteo';

const stAndrews: Place = {
  name: 'St Andrews',
  detail: 'Scotland, United Kingdom',
  latitude: 56.3398,
  longitude: -2.7967,
  countryCode: 'GB',
};

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('fetchForecast', () => {
  it('asks for every section and reads each field the dashboard uses', async () => {
    const fetchMock = mockFetch(forecast);
    const f = await fetchForecast(stAndrews, 'metric');

    const q = requestedUrl(fetchMock).searchParams;
    expect(q.get('past_days')).toBe('1');
    expect(q.get('temperature_unit')).toBe('celsius');
    expect(q.get('current')).toContain('dew_point_2m');

    expect(f.timezone).toBe('Europe/London');
    expect(f.current).toEqual({
      time: '2026-11-26T04:15',
      temperature: 5.8,
      feelsLike: 2.5,
      humidity: 78,
      isDay: false,
      precipitation: 0.1,
      code: 51,
      windSpeed: 11.2,
      windGusts: 18,
      windDirection: 151,
      uvIndex: 0,
      pressure: 1020.7,
      cloudCover: 98,
      visibility: 38300,
      dewPoint: 2.3,
    });
    expect(f.hours[0]).toEqual({
      time: '2026-11-26T04:00',
      temperature: 5.9,
      feelsLike: 2.4,
      precipChance: 8,
      precipitation: 0,
      code: 3,
      isDay: false,
      windSpeed: 11.5,
      pressure: 1020.8,
    });
    expect(f.pressureTrend).toBe('falling');
    expect(f.days[0]).toEqual({
      date: '2026-11-26',
      code: 53,
      high: 5.9,
      low: 3.6,
      sunrise: '2026-11-26T08:11',
      sunset: '2026-11-26T15:45',
      precipChance: 10,
      precipSum: 0.6,
      uvMax: 0.15,
      windMax: 33.8,
    });
    expect(f.yesterday?.date).toBe('2026-11-25');
    expect(f.nowcast).toHaveLength(8);
    expect(f.nowcast[0]).toEqual({ time: '2026-11-26T04:15', precipitation: 0.1 });
  });
});

describe('fetchAir', () => {
  it('reads AQI, particulates and every pollen species', async () => {
    mockFetch(air);
    const a = await fetchAir(stAndrews);
    expect(a).toMatchObject({ usAqi: 29, pm25: 2.5, pm10: 8.4, ozone: 62, peak: null });
    expect(a.pollen.map((p) => p.key)).toEqual([
      'alder_pollen',
      'birch_pollen',
      'grass_pollen',
      'mugwort_pollen',
      'olive_pollen',
      'ragweed_pollen',
    ]);
  });
});

describe('fetchArchive', () => {
  it('reads daily records for the requested range', async () => {
    const fetchMock = mockFetch(archive);
    const days = await fetchArchive(stAndrews, { start: '2025-11-18', end: '2025-11-24' });
    expect(requestedUrl(fetchMock).searchParams.get('start_date')).toBe('2025-11-18');
    expect(days).toHaveLength(4);
    expect(days[0]).toEqual({
      date: '2025-11-18',
      high: 4.6,
      low: 0.2,
      precip: 10.2,
      windMax: 29.9,
    });
  });
});

describe('searchPlaces', () => {
  it('turns geocoding results into places', async () => {
    const fetchMock = mockFetch(geocoding);
    const places = await searchPlaces(' St Andrews ');
    expect(requestedUrl(fetchMock).searchParams.get('name')).toBe('St Andrews');
    expect(places[0]).toEqual({
      name: 'St Andrews',
      detail: 'Scotland, United Kingdom',
      latitude: geocoding.results[0]?.latitude,
      longitude: geocoding.results[0]?.longitude,
      countryCode: 'GB',
    });
    expect(places).toHaveLength(2);
  });
});
