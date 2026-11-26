/** WMO weather interpretation codes, as Open-Meteo reports them, with fore! commentary. */

/** Names of the weather icons the UI draws (`WeatherIcon` in `src/ui/weather`). */
export type WeatherIconName =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'overcast'
  | 'fog-day'
  | 'fog-night'
  | 'partly-cloudy-day-drizzle'
  | 'partly-cloudy-night-drizzle'
  | 'drizzle'
  | 'sleet'
  | 'partly-cloudy-day-rain'
  | 'partly-cloudy-night-rain'
  | 'rain'
  | 'partly-cloudy-day-snow'
  | 'partly-cloudy-night-snow'
  | 'snow'
  | 'thunderstorms-day'
  | 'thunderstorms-night'
  | 'thunderstorms-rain'
  | 'not-available';

export type Condition = {
  label: string;
  /** One cheeky line of golf talk for the hero card. */
  quip: string;
  icon: { day: WeatherIconName; night: WeatherIconName };
  /** Broad group, used to theme the hero card. */
  mood: 'clear' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';
};

const c = (
  label: string,
  quip: string,
  day: WeatherIconName,
  night: WeatherIconName,
  mood: Condition['mood'],
): Condition => ({ label, quip, icon: { day, night }, mood });

const table: Record<number, Condition> = {
  0: c(
    'Clear',
    'Not a cloud on the course. Grip it and rip it.',
    'clear-day',
    'clear-night',
    'clear',
  ),
  1: c(
    'Mostly clear',
    'Fairways open, skies mostly empty.',
    'partly-cloudy-day',
    'partly-cloudy-night',
    'clear',
  ),
  2: c(
    'Partly cloudy',
    'A few clouds playing through.',
    'partly-cloudy-day',
    'partly-cloudy-night',
    'cloud',
  ),
  3: c('Overcast', 'Grey all the way to the 18th green.', 'overcast', 'overcast', 'cloud'),
  45: c('Fog', 'Can’t see the flag. Aim for the general vicinity.', 'fog-day', 'fog-night', 'fog'),
  48: c('Freezing fog', 'Frosty fog. The greens are glass.', 'fog-day', 'fog-night', 'fog'),
  51: c(
    'Light drizzle',
    'A light misting. Towel on the bag.',
    'partly-cloudy-day-drizzle',
    'partly-cloudy-night-drizzle',
    'rain',
  ),
  53: c(
    'Drizzle',
    'Steady drizzle. Grips getting slippy.',
    'partly-cloudy-day-drizzle',
    'partly-cloudy-night-drizzle',
    'rain',
  ),
  55: c('Heavy drizzle', 'Drizzle with ambition.', 'drizzle', 'drizzle', 'rain'),
  56: c('Freezing drizzle', 'Icy drizzle. Mind your footing.', 'sleet', 'sleet', 'rain'),
  57: c('Heavy freezing drizzle', 'The course is an ice rink.', 'sleet', 'sleet', 'rain'),
  61: c(
    'Light rain',
    'Bring the brolly. Play on.',
    'partly-cloudy-day-rain',
    'partly-cloudy-night-rain',
    'rain',
  ),
  63: c('Rain', 'The whole course is a water hazard.', 'rain', 'rain', 'rain'),
  65: c('Heavy rain', 'Casual water everywhere. Take relief inside.', 'rain', 'rain', 'rain'),
  66: c('Freezing rain', 'Freezing rain. Nobody is putting today.', 'sleet', 'sleet', 'rain'),
  67: c('Heavy freezing rain', 'Course closed. Ice everywhere.', 'sleet', 'sleet', 'rain'),
  71: c(
    'Light snow',
    'Light snow. Bring the orange ball.',
    'partly-cloudy-day-snow',
    'partly-cloudy-night-snow',
    'snow',
  ),
  73: c('Snow', 'Snow on the greens. Winter rules apply.', 'snow', 'snow', 'snow'),
  75: c('Heavy snow', 'Every bunker is now a snow drift.', 'snow', 'snow', 'snow'),
  77: c('Snow grains', 'Snow grains, like sand blasted from a bunker.', 'snow', 'snow', 'snow'),
  80: c(
    'Light showers',
    'Passing showers. Wait under a tree. (Not if it thunders.)',
    'partly-cloudy-day-rain',
    'partly-cloudy-night-rain',
    'rain',
  ),
  81: c(
    'Showers',
    'Showers coming and going. Pack the waterproofs.',
    'partly-cloudy-day-rain',
    'partly-cloudy-night-rain',
    'rain',
  ),
  82: c('Violent showers', 'Torrential bursts. The 9th is a lake.', 'rain', 'rain', 'rain'),
  85: c(
    'Snow showers',
    'Snow squalls. Hot toddy at the turn.',
    'partly-cloudy-day-snow',
    'partly-cloudy-night-snow',
    'snow',
  ),
  86: c('Heavy snow showers', 'Blizzard bursts. Clubhouse fire is lit.', 'snow', 'snow', 'snow'),
  95: c(
    'Thunderstorm',
    'FORE! Lightning. Off the course, now.',
    'thunderstorms-day',
    'thunderstorms-night',
    'storm',
  ),
  96: c(
    'Thunderstorm, hail',
    'Lightning and hail. Abandon the round.',
    'thunderstorms-rain',
    'thunderstorms-rain',
    'storm',
  ),
  99: c(
    'Severe thunderstorm, hail',
    'Big hail. Even the carts are hiding.',
    'thunderstorms-rain',
    'thunderstorms-rain',
    'storm',
  ),
};

const unknown = c(
  'Unknown',
  'The forecaster lost their ball.',
  'not-available',
  'not-available',
  'cloud',
);

export function condition(code: number): Condition {
  return table[code] ?? unknown;
}

/** The icon for a code, by day or night. */
export function iconFor(code: number, isDay: boolean): WeatherIconName {
  const k = condition(code).icon;
  return isDay ? k.day : k.night;
}
