# 5. Home place with optional device location

- Status: accepted
- Date: 2026-11-25

## Decision

The dashboard always shows one saved place. The user can search (Open-Meteo geocoding) or tap "Use my location" (expo-location, which uses the browser's geolocation on web). Follow me re-reads the location every time the app opens. Coordinates are named with OpenStreetMap Nominatim, called only on those actions to stay within its usage policy. The default place before setup is St Andrews, the home of golf.
