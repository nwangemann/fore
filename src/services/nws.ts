import { parseAlerts, type Alert } from '@/core/alerts/alerts';
import type { Place } from '@/core/place/place';
import { getJson } from './http';

/** US National Weather Service. Public domain, keyless; covers the US and its territories. */
export async function fetchAlerts(place: Place): Promise<Alert[]> {
  if (place.countryCode && place.countryCode.toUpperCase() !== 'US') return [];
  const point = `${place.latitude.toFixed(4)},${place.longitude.toFixed(4)}`;
  const json = await getJson(`https://api.weather.gov/alerts/active?point=${point}`, {
    headers: { Accept: 'application/geo+json' },
  });
  return parseAlerts(json);
}
