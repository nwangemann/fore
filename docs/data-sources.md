# Data sources

All sources in use are free and keyless and were called live on 2026-11-25.

## In use

| Data                                   | Source                                               | Terms                                                             |
| -------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| Current, hourly and 9-day forecast     | Open-Meteo `/v1/forecast`                            | Free for non-commercial use, no key, CC BY 4.0 (credit in footer) |
| US AQI, PM2.5, PM10, ozone, pollen     | Open-Meteo air-quality API (CAMS models)             | As above                                                          |
| Place search                           | Open-Meteo geocoding API (GeoNames)                  | As above                                                          |
| Active watches and warnings (US only)  | US National Weather Service `api.weather.gov/alerts` | Public domain, no key; sends CORS headers                         |
| Name for "Use my location" coordinates | OpenStreetMap Nominatim `/reverse`                   | ODbL, at most 1 request a second, light use only                  |

Coverage notes from the live calls:

- US AQI is computed for any place, including outside the US.
- Pollen (alder, birch, grass, mugwort, olive, ragweed) comes back `null` outside Europe. The app hides it there and says why.
- NWS alerts are skipped when the place's country is not the US.

## Not used yet: options for later

These were not called in this session; check their current terms before building on them.

| Want                                       | Candidates                                              | Catch                                                      |
| ------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------- |
| US pollen                                  | Google Pollen API, Ambee, Tomorrow.io                   | Need an API key, so a tiny proxy to keep it off the client |
| Official US AQI from monitors              | EPA AirNow API                                          | Free key                                                   |
| Hyper-local air from sensors               | PurpleAir                                               | Key; points-based billing                                  |
| Radar map                                  | RainViewer tiles; NWS radar imagery (US)                | Map library needed                                         |
| 15-minute precipitation ("rain in 20 min") | Open-Meteo `minutely_15` on the same forecast endpoint  | None; good next step                                       |
| US text forecast and observations          | NWS `/points` → `/forecast`, `/stations/…/observations` | US only                                                    |
| Marine, flood, historical, climate         | Open-Meteo marine, flood, archive and climate APIs      | None; same terms                                           |
| Second-opinion forecast                    | Pirate Weather, OpenWeatherMap, WeatherAPI.com          | Keys and free-tier limits                                  |
