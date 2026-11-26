# Architecture

```
app/            screens: index (dashboard), course (place picker modal), _layout
src/core/       pure TypeScript: parsing, weather codes, scoring, AQI bands, local time
src/services/   network and device: Open-Meteo, NWS, expo-location
src/state/      zustand store persisted with AsyncStorage (localStorage on web)
public/         index.html, web manifest and icons
src/features/   UI per area: dashboard, forecast, air, alerts, course
src/ui/         tokens, Card, background stripes, formatters
```

## Data flow

1. `useSettings` holds the home place, units and recent places.
2. `useDashboard(place, units)` paints the cached copy from the last visit, then fetches forecast, air and alerts in parallel, then the seasonal normals (cached per place, refetched once a year). Only a forecast failure is shown; air and alerts fail quietly. It refreshes when data is over 10 minutes old (checked each minute and when the app returns to the foreground).
3. Open-Meteo times are place-local strings with no offset. `src/core/weather/localTime.ts` reads them as text so the viewer's time zone never shifts them.

## Features

### Dashboard

`src/features/dashboard`: the page header (logo, place pill, Re-tee refresh, when the card was signed), footer credits, and `useDashboard`.

`useDashboard` waits for saved settings to load and paints the last good result for that place and units from the cache ("From your last visit · updating…"). Data for a previous place or unit system is never shown; a failed refresh keeps the last good forecast.

### Forecast

`src/features/forecast` with logic in `src/core/weather` and `src/core/climate`.

- NowCard: current conditions and quip (`codes.ts`); vs yesterday and vs normal; a rain-timing outlook and a 15-minute nowcast (`outlook.ts`); in the bag; best tee time (two daylight hours that end by sunset); caddie notes; sunrise and sunset strip.
- The round: 18 hours from the current hour, with "the turn" after nine.
- Scorecard: 7 days with a Par row. `scoreDay` scores each day against the seasonal normal from `climate/normals.ts` once it has loaded, and against a fixed ideal until then. It never goes under par below 5 °C or above 35 °C. Thunderstorms are a weather delay. "Best day to play" is the lowest score, earliest on a tie.
- Yardage book: wind, humidity, UV, cloud, visibility, and pressure (inHg in imperial) with its 3-hour trend.

Scoring and outlook thresholds are taste; tune them only in `score.ts` and `outlook.ts`.

### Air

`src/features/air/AirCard.tsx` with `src/core/air/air.ts`. US AQI uses the EPA bands, with a heads-up when the next 24 hours reach a worse band. Pollen uses one rough grains/m³ scale for all species (documented in `pollenBand`). The section only appears where the model has pollen (Europe) and collapses to one line when everything is "None".

### Alerts

`src/features/alerts/AlertBanner.tsx` with `src/core/alerts/alerts.ts`. Active NWS alerts for the place's point, most severe first, as red "FORE!" banners that expand to the description and instructions. US places only. When the NWS can't be reached, a muted line says so, so "no alerts" is never a guess.

### Course

`src/features/course/CoursePicker.tsx`, shown at `/course`. Debounced place search, "Use my location" (saved as "Current location" with its coordinates), recent places, and units. Picking a place saves it as the home course and returns to the dashboard.
