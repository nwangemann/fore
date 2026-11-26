import { unitLabels, type Units } from '@/core/units';

export const deg = (t: number) => `${Math.round(t)}°`;
export const speed = (s: number, units: Units) => `${Math.round(s)} ${unitLabels[units].speed}`;
export const pct = (p: number) => `${Math.round(p)}%`;
