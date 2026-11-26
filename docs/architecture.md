# Architecture

```
app/            screens: index (dashboard), course (place picker modal), _layout
src/core/       pure TypeScript: parsing, weather codes, scoring, AQI bands, local time, screen-reader sentences
src/services/   network and device: Open-Meteo, NWS, expo-location
src/state/      zustand store persisted with AsyncStorage (localStorage on web)
public/         index.html, web manifest and icons
src/features/   UI per area: dashboard, forecast, air, alerts, course
src/ui/         tokens, Card, OutOfBounds, background stripes, formatters, accessibility helpers, WeatherIcon and Icon (vendored Meteocons)
```

## Data flow

1. `useSettings` holds the home place, units and recent places.
2. `useDashboard(place, units)` composes TanStack Query queries (ADR 8): forecast, air and alerts in parallel, then the archive for the seasonal normals (fetched once per place a year). Only a forecast failure is shown; air and alerts fail quietly. Data is fresh for 10 minutes and refetches on an interval and when the tab or app regains focus.
3. Open-Meteo times are place-local strings with no offset. `src/core/weather/localTime.ts` reads them as text so the viewer's time zone never shifts them.

## Features

### Dashboard

`src/features/dashboard`: the page header (logo, place pill, Re-tee refresh, when the card was signed), footer credits, and `useDashboard`.

`useDashboard` waits for saved settings to load. Every query key carries the place, so data for a previous place or unit system is never shown; a failed refresh keeps the last good forecast. The query cache is persisted to AsyncStorage (`fore.queries`), so a reload paints the last visit's data at once and the header says "From your last visit · updating…" until the refresh lands.

Errors and empty states (none renders blank):

- Render error anywhere: `app/_layout.tsx` exports Expo Router's `ErrorBoundary`, which replaces the app with an "Out of bounds" card (`src/ui/OutOfBounds.tsx`) and a "Play it again" button that calls `retry`.
- Forecast loading with nothing cached: "Teeing up the forecast…".
- Forecast failed with nothing cached: an "Out of bounds" card with the error and a Re-tee button. Offline with nothing cached (the query is paused): the same card, saying it loads once back online.
- Forecast failed or offline with a cached copy: the cached dashboard stays, and the header adds "couldn't refresh, Re-tee to retry" or "offline" after when the card was signed.
- No hours or days in a forecast: the round and the scorecard say so in their card. No air reading: the air card says so. Alerts that fail to load get a one-line note; air and the archive fail quietly.

### Forecast

`src/features/forecast` with logic in `src/core/weather` and `src/core/climate`.

- Weather icons: `codes.ts` maps each WMO code to an icon name for day and night; `src/ui/weather/WeatherIcon.tsx` draws it from the vendored Meteocons SVGs in a fixed square box (ADR 9). Used in the hero, the round and the scorecard (the scorecard always uses the day icon). UI icons (the header and course-list flag, yardage book labels, sun strip, the round's rain chance) come from `src/ui/icons/uiIcons.ts` through `Icon`. In the bag and the alert banner are words only.
- NowCard: current conditions and quip (`codes.ts`); vs yesterday and vs normal; a rain-timing outlook and a 15-minute nowcast (`outlook.ts`); in the bag; best tee time (two daylight hours that end by sunset); caddie notes; sunrise and sunset strip.
- The round: 18 hours from the current hour, with "the turn" after nine.
- Scorecard: 7 days with a Par row, drawn as one column per day so each day is read as one sentence (ADR 10). `scoreDay` scores each day against the seasonal normal from `climate/normals.ts` once it has loaded, and against a fixed ideal until then. It never goes under par below 5 °C or above 35 °C. Thunderstorms are a weather delay. "Best day to play" is the lowest score, earliest on a tie.
- Yardage book: wind, humidity, UV, cloud, visibility, and pressure (inHg in imperial) with its 3-hour trend.

Scoring and outlook thresholds are taste; tune them only in `score.ts` and `outlook.ts`.

### Air

`src/features/air/AirCard.tsx` with `src/core/air/air.ts`. US AQI uses the EPA bands, with a heads-up when the next 24 hours reach a worse band. Pollen uses one rough grains/m³ scale for all species (documented in `pollenBand`). The section only appears where the model has pollen (Europe) and collapses to one line when everything is "None".

### Alerts

`src/features/alerts/AlertBanner.tsx` with `src/core/alerts/alerts.ts`. Active NWS alerts for the place's point, most severe first, as red "FORE!" banners that expand to the description and instructions. US places only. When the NWS can't be reached, a muted line says so, so "no alerts" is never a guess.

### Course

`src/features/course/CoursePicker.tsx`, shown at `/course`. Debounced place search, "Use my location" (saved as "Current location" with its coordinates), recent places, and units. Picking a place saves it as the home course and returns to the dashboard.

## Testing

Two layers so far, both run by `npm test` (Jest, `jest-expo` preset):

- Core: unit tests next to the logic in `src/core` where mistakes are easy to miss (scoring, outlook, parsing, AQI, speech).
- Services: `src/services/*.test.ts` mock `fetch` with trimmed real responses from `src/services/__fixtures__/` (Open-Meteo forecast, air, archive and geocoding; NWS alerts), and check the request and every field the parsers read. A change in an API's shape fails a test. The fixtures' README says when and where they were recorded and how to re-record them.

`location.ts` wraps `expo-location` and has no test; it is covered by the manual checks.
