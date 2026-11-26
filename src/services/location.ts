import * as Location from 'expo-location';
import { coordinateLabel, type Place } from '@/core/place/place';
import { getJson, query } from './http';

export class LocationDenied extends Error {
  constructor() {
    super('Location permission was not granted');
  }
}

/** Asks for permission if needed and reads a coarse fix. */
export async function currentCoords(): Promise<{ latitude: number; longitude: number }> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new LocationDenied();
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}

/** Reads the device location and names it. */
export async function currentPlace(): Promise<Place> {
  return placeAt(await currentCoords());
}

/** Names coordinates, falling back to a coordinate label. */
export async function placeAt({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<Place> {
  try {
    return await nameFor(latitude, longitude);
  } catch {
    return { name: 'Here', detail: coordinateLabel(latitude, longitude), latitude, longitude };
  }
}

type Nominatim = {
  name?: string;
  address?: Record<string, string | undefined>;
};

/**
 * Reverse geocoding through OpenStreetMap Nominatim. Its policy allows light personal use
 * (at most one request a second); we call it only when the user taps "Use my location".
 */
async function nameFor(latitude: number, longitude: number): Promise<Place> {
  const q = query({ lat: latitude, lon: longitude, format: 'jsonv2', zoom: 10 });
  const json = (await getJson(`https://nominatim.openstreetmap.org/reverse?${q}`)) as Nominatim;
  const a = json.address ?? {};
  const name = a.city ?? a.town ?? a.village ?? a.hamlet ?? json.name ?? 'Here';
  return {
    name,
    detail: [a.state, a.country].filter(Boolean).join(', '),
    latitude,
    longitude,
    countryCode: a.country_code?.toUpperCase(),
  };
}
