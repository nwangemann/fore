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
  inkSoft: '#5E6E62',
  pencil: '#8A8F87',
  under: '#C0392B',
  over: '#1F4E79',
} as const;

/** Hero card colour per sky. */
export const moodColor: Record<Condition['mood'], string> = {
  clear: '#2F7D4F',
  cloud: '#4D6A5B',
  fog: '#6F8077',
  rain: '#2B5873',
  snow: '#5F7F94',
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

export const WIDE = 900;
