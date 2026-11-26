/** A spot the forecast is for. */
export type Place = {
  name: string;
  /** Region and country, shown under the name. */
  detail: string;
  latitude: number;
  longitude: number;
  /** ISO 3166 alpha-2, used to decide whether US-only sources apply. */
  countryCode?: string;
};

/** Used until the user picks a course of their own: the home of golf. */
export const DEFAULT_PLACE: Place = {
  name: 'St Andrews',
  detail: 'Scotland, United Kingdom',
  latitude: 56.3398,
  longitude: -2.7967,
  countryCode: 'GB',
};

/** Short label for coordinates when no name is known. */
export function coordinateLabel(latitude: number, longitude: number): string {
  const lat = `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? 'N' : 'S'}`;
  const lon = `${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? 'E' : 'W'}`;
  return `${lat}, ${lon}`;
}
