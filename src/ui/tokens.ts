import type { Condition } from '@/core/weather/codes';

export const color = {
  fairway: '#1E5B3A',
  fairwayDeep: '#143F28',
  stripe: '#226640',
  paper: '#FBF6E9',
  paperEdge: '#E6DCC3',
  sand: '#E8D5A3',
  flag: '#D62839',
  ink: '#152018',
  inkSoft: '#515F54',
  pencil: '#6D716B',
  under: '#C0392B',
  over: '#1F4E79',
} as const;

/**
 * Hero card colour per sky. Each is dark enough for sand text at WCAG AA (4.5:1);
 * ADR 10 lists every pair; recheck contrast after changing one.
 */
export const moodColor: Record<Condition['mood'], string> = {
  clear: '#276842',
  cloud: '#476254',
  fog: '#525F58',
  rain: '#2B5873',
  snow: '#475F6F',
  storm: '#3D2F4D',
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 14, lg: 22 } as const;

export const font = {
  display: 'Shrikhand_400Regular',
  body: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  bold: 'SpaceGrotesk_700Bold',
} as const;

/** Bands for AQI (0–5) and pollen (0–4), green to purple. */
export const bandColor = [
  '#3C9D5D',
  '#C9A227',
  '#E07B24',
  '#D62839',
  '#8E3B8F',
  '#6B1F2A',
] as const;

/** Text on each band colour: ink on the light yellow and orange, paper on the rest (WCAG AA). */
export const bandText = [
  color.paper,
  color.ink,
  color.ink,
  color.paper,
  color.paper,
  color.paper,
] as const;

/** The web keyboard focus ring: paper inside, ink outside, visible on any background. */
export const focusRing = { inner: color.paper, outer: color.ink, width: 3 } as const;

export const WIDE = 900;
