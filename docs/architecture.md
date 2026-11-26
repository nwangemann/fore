# Architecture

```
app/            screens: index (dashboard), course (place picker modal), _layout
src/core/       pure TypeScript: parsing, weather codes, scoring, AQI bands, local time
src/services/   network and device: Open-Meteo, NWS, expo-location
src/state/      zustand store persisted with AsyncStorage (localStorage on web)
public/         index.html, web manifest and icons for home-screen install
src/features/   UI per area: dashboard, forecast, air, alerts, course
src/ui/         tokens, Card, background stripes, formatters
```

## Data flow

1. `useSettings` holds the home place, units and recent places.
2. `useDashboard(place, units)` paints the cached copy from the last visit, then fetches forecast, air and alerts in parallel, then the seasonal normals (cached per place, refetched once a year). Only a forecast failure is shown; air and alerts fail quietly. It refreshes when data is over 10 minutes old (checked each minute and when the app returns to the foreground).
3. Open-Meteo times are place-local strings with no offset. `src/core/weather/localTime.ts` reads them as text so the viewer's time zone never shifts them.
