/** Air quality and pollen, from Open-Meteo's air-quality API. */
export type Pollen = { key: PollenKey; name: string; value: number };
export type Air = {
  usAqi: number | null;
  pm25: number | null;
  pm10: number | null;
  ozone: number | null;
  /** Only species the model covers here. Empty outside Europe. */
  pollen: Pollen[];
};

export const POLLEN_SPECIES = {
  alder_pollen: 'Alder',
  birch_pollen: 'Birch',
  grass_pollen: 'Grass',
  mugwort_pollen: 'Mugwort',
  olive_pollen: 'Olive',
  ragweed_pollen: 'Ragweed',
} as const;
export type PollenKey = keyof typeof POLLEN_SPECIES;

export const AIR_FIELDS = ['us_aqi', 'pm2_5', 'pm10', 'ozone', ...Object.keys(POLLEN_SPECIES)];

const maybe = (v: unknown): number | null => (typeof v === 'number' ? v : null);

export function parseAir(json: unknown): Air {
  const cur = (json as { current?: Record<string, unknown> }).current;
  if (!cur) throw new Error('Air quality response is missing current values');
  const pollen: Pollen[] = [];
  for (const [key, name] of Object.entries(POLLEN_SPECIES) as [PollenKey, string][]) {
    const value = maybe(cur[key]);
    if (value !== null) pollen.push({ key, name, value });
  }
  return {
    usAqi: maybe(cur.us_aqi),
    pm25: maybe(cur.pm2_5),
    pm10: maybe(cur.pm10),
    ozone: maybe(cur.ozone),
    pollen,
  };
}

export type Band = { label: string; quip: string; level: 0 | 1 | 2 | 3 | 4 | 5 };

/** US EPA AQI categories. */
export function aqiBand(aqi: number): Band {
  if (aqi <= 50) return { level: 0, label: 'Good', quip: 'Fresh as the first tee.' };
  if (aqi <= 100)
    return { level: 1, label: 'Moderate', quip: 'Playable. Sensitive lungs, take it easy.' };
  if (aqi <= 150)
    return {
      level: 2,
      label: 'Unhealthy for sensitive groups',
      quip: 'Sensitive swingers, take a cart.',
    };
  if (aqi <= 200) return { level: 3, label: 'Unhealthy', quip: 'Cut the round short.' };
  if (aqi <= 300) return { level: 4, label: 'Very unhealthy', quip: 'Clubhouse only.' };
  return { level: 5, label: 'Hazardous', quip: 'Course closed. Stay indoors.' };
}

/**
 * Rough pollen bands in grains/m³. Real thresholds differ by species and agency;
 * these are a single compromise scale for a glanceable label.
 */
export function pollenBand(value: number): Band {
  if (value < 1) return { level: 0, label: 'None', quip: 'The rough is quiet.' };
  if (value < 20) return { level: 1, label: 'Low', quip: 'A light rough.' };
  if (value < 50) return { level: 2, label: 'Moderate', quip: 'The rough is getting thick.' };
  if (value < 200) return { level: 3, label: 'High', quip: 'Deep rough. Antihistamines.' };
  return { level: 4, label: 'Very high', quip: 'Knee-deep rough. Stay on the fairway.' };
}
