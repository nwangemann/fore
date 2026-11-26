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
