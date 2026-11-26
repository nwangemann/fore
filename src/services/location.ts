import * as Location from 'expo-location';
import { coordinateLabel, type Place } from '@/core/place/place';

export class LocationDenied extends Error {
  constructor() {
    super('Location permission was not granted');
  }
}

/** Asks for permission if needed and reads a coarse fix, named by its coordinates. */
export async function currentPlace(): Promise<Place> {
  const { granted } = await Location.requestForegroundPermissionsAsync();
  if (!granted) throw new LocationDenied();
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = pos.coords;
  return {
    name: 'Current location',
    detail: coordinateLabel(latitude, longitude),
    latitude,
    longitude,
  };
}
