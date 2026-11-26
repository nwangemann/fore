import { condition } from './codes';

/** How the course looks: the mowing stripes and hero card follow the current sky. */
export type CourseVariant = 'day' | 'night' | 'frost' | 'storm';

/**
 * The one place that picks the variant. Weather beats time of day: a storm or snow
 * shows its own palette day or night; otherwise `isDay` picks day or night.
 */
export function courseVariant(code: number, isDay: boolean): CourseVariant {
  const { mood } = condition(code);
  if (mood === 'storm') return 'storm';
  if (mood === 'snow') return 'frost';
  return isDay ? 'day' : 'night';
}

const VARIANTS: readonly CourseVariant[] = ['day', 'night', 'frost', 'storm'];

/** A variant name from outside (the `?course=` preview parameter), or null if it is not one. */
export function parseCourseVariant(value: string | null | undefined): CourseVariant | null {
  const v = value?.trim().toLowerCase();
  return VARIANTS.find((x) => x === v) ?? null;
}
