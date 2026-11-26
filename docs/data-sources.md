# Data sources

All sources in use are free and keyless and were called live on 2026-11-25.

## In use

| Data                                                   | Source                                                       | Terms                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| Yesterday, today, 7 days, hourly and 15-minute nowcast | Open-Meteo `/v1/forecast` (`past_days=1`, `minutely_15`)     | Free for non-commercial use, no key, CC BY 4.0 (credit in footer) |
| Seasonal normals (par)                                 | Open-Meteo archive API, last 10 full years, cached per place | As above; about 120 KB once a year per place                      |
| US AQI now and next 24 h, PM2.5, PM10, ozone, pollen   | Open-Meteo air-quality API (CAMS models)                     | As above                                                          |
| Place search                                           | Open-Meteo geocoding API (GeoNames)                          | As above                                                          |
| Active watches and warnings (US only)                  | US National Weather Service `api.weather.gov/alerts`         | Public domain, no key; sends CORS headers                         |

Coverage notes from the live calls:

- US AQI is computed for any place, including outside the US.
- Pollen (alder, birch, grass, mugwort, olive, ragweed) comes back `null` outside Europe. The app leaves the section out there.
- NWS alerts are skipped when the place's country is not the US.

## Not used yet: options for later

These were not called in this session; check their current terms before building on them.

| Want                               | Candidates                                              | Catch                                                      |
| ---------------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| US pollen                          | Google Pollen API, Ambee, Tomorrow.io                   | Need an API key, so a tiny proxy to keep it off the client |
| Official US AQI from monitors      | EPA AirNow API                                          | Free key                                                   |
| Hyper-local air from sensors       | PurpleAir                                               | Key; points-based billing                                  |
| Radar map                          | RainViewer tiles; NWS radar imagery (US)                | Map library needed                                         |
| US text forecast and observations  | NWS `/points` → `/forecast`, `/stations/…/observations` | US only                                                    |
| Marine, flood, historical, climate | Open-Meteo marine, flood, archive and climate APIs      | None; same terms                                           |
| Second-opinion forecast            | Pirate Weather, OpenWeatherMap, WeatherAPI.com          | Keys and free-tier limits                                  |
