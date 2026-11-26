/** WMO weather interpretation codes, as Open-Meteo reports them, with fore! commentary. */
export type Condition = {
  label: string;
  /** One cheeky line of golf talk for the hero card. */
  quip: string;
  icon: { day: string; night: string };
  /** Broad group, used to theme the hero card. */
  mood: 'clear' | 'cloud' | 'fog' | 'rain' | 'snow' | 'storm';
};

const c = (
  label: string,
  quip: string,
  day: string,
  night: string,
  mood: Condition['mood'],
): Condition => ({ label, quip, icon: { day, night }, mood });

const table: Record<number, Condition> = {
  0: c('Clear', 'Not a cloud on the course. Grip it and rip it.', '☀️', '🌙', 'clear'),
  1: c('Mostly clear', 'Fairways open, skies mostly empty.', '🌤️', '🌙', 'clear'),
  2: c('Partly cloudy', 'A few clouds playing through.', '⛅', '☁️', 'cloud'),
  3: c('Overcast', 'Grey all the way to the 18th green.', '☁️', '☁️', 'cloud'),
  45: c('Fog', 'Can’t see the flag. Aim for the general vicinity.', '🌫️', '🌫️', 'fog'),
  48: c('Freezing fog', 'Frosty fog. The greens are glass.', '🌫️', '🌫️', 'fog'),
  51: c('Light drizzle', 'A light misting. Towel on the bag.', '🌦️', '🌧️', 'rain'),
  53: c('Drizzle', 'Steady drizzle. Grips getting slippy.', '🌦️', '🌧️', 'rain'),
  55: c('Heavy drizzle', 'Drizzle with ambition.', '🌧️', '🌧️', 'rain'),
  56: c('Freezing drizzle', 'Icy drizzle. Mind your footing.', '🌧️', '🌧️', 'rain'),
  57: c('Heavy freezing drizzle', 'The course is an ice rink.', '🌧️', '🌧️', 'rain'),
  61: c('Light rain', 'Bring the brolly. Play on.', '🌦️', '🌧️', 'rain'),
  63: c('Rain', 'The whole course is a water hazard.', '🌧️', '🌧️', 'rain'),
  65: c('Heavy rain', 'Casual water everywhere. Take relief inside.', '🌧️', '🌧️', 'rain'),
  66: c('Freezing rain', 'Freezing rain. Nobody is putting today.', '🌧️', '🌧️', 'rain'),
  67: c('Heavy freezing rain', 'Course closed. Ice everywhere.', '🌧️', '🌧️', 'rain'),
  71: c('Light snow', 'Light snow. Bring the orange ball.', '🌨️', '🌨️', 'snow'),
  73: c('Snow', 'Snow on the greens. Winter rules apply.', '🌨️', '🌨️', 'snow'),
  75: c('Heavy snow', 'Every bunker is now a snow drift.', '❄️', '❄️', 'snow'),
  77: c('Snow grains', 'Snow grains, like sand blasted from a bunker.', '🌨️', '🌨️', 'snow'),
  80: c(
    'Light showers',
    'Passing showers. Wait under a tree. (Not if it thunders.)',
    '🌦️',
    '🌧️',
    'rain',
  ),
  81: c('Showers', 'Showers coming and going. Pack the waterproofs.', '🌦️', '🌧️', 'rain'),
  82: c('Violent showers', 'Torrential bursts. The 9th is a lake.', '🌧️', '🌧️', 'rain'),
  85: c('Snow showers', 'Snow squalls. Hot toddy at the turn.', '🌨️', '🌨️', 'snow'),
  86: c('Heavy snow showers', 'Blizzard bursts. Clubhouse fire is lit.', '❄️', '❄️', 'snow'),
  95: c('Thunderstorm', 'FORE! Lightning. Off the course, now.', '⛈️', '⛈️', 'storm'),
  96: c('Thunderstorm, hail', 'Lightning and hail. Abandon the round.', '⛈️', '⛈️', 'storm'),
  99: c('Severe thunderstorm, hail', 'Big hail. Even the carts are hiding.', '⛈️', '⛈️', 'storm'),
};

const unknown = c('Unknown', 'The forecaster lost their ball.', '❔', '❔', 'cloud');

export function condition(code: number): Condition {
  return table[code] ?? unknown;
}

export function iconFor(code: number, isDay: boolean): string {
  const k = condition(code).icon;
  return isDay ? k.day : k.night;
}
