import { Platform } from 'react-native';
import { parseCourseVariant, type CourseVariant } from '@/core/weather/variant';

/**
 * Web only: `?course=day|night|frost|storm` forces a course variant, for screenshots.
 * Read once at startup and never saved, so it lasts for this page load only and leaves
 * settings alone. The rule that picks the variant stays in `courseVariant` (ADR 11).
 */
export const previewVariant: CourseVariant | null =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? parseCourseVariant(new URLSearchParams(window.location.search).get('course'))
    : null;
