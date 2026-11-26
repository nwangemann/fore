# 5. Home place with optional device location

- Status: accepted
- Date: 2026-11-25

## Decision

The dashboard always shows one saved place. The user can search (Open-Meteo geocoding) or tap "Use my location" (expo-location, which uses the browser's geolocation on web). A device fix is saved as "Current location" with its coordinates as the detail; there is no reverse geocoding, so no third source or usage policy to respect. An earlier Follow me option, which re-read the location on every open and named it with OpenStreetMap Nominatim, was cut on 2026-11-25 to keep the scope small. The default place before setup is St Andrews, the home of golf.
