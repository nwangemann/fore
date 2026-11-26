/** Measurement system for every value shown. Open-Meteo converts on its side. */
export type Units = 'imperial' | 'metric';

export const unitLabels = {
  imperial: { temp: '°F', speed: 'mph', precip: 'in', distance: 'mi' },
  metric: { temp: '°C', speed: 'km/h', precip: 'mm', distance: 'km' },
} as const;

/** Open-Meteo reports visibility in feet (imperial) or metres (metric). */
export function visibilityToDistance(raw: number, units: Units): number {
  return units === 'imperial' ? raw / 5280 : raw / 1000;
}

const compass = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

/** Degrees the wind blows from, as an eight-point compass word. */
export function compassPoint(degrees: number): string {
  const i = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return compass[i] ?? 'N';
}
