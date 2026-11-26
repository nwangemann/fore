# Service fixtures

Trimmed real API responses, used by the service tests (`src/services/*.test.ts`) to mock `fetch`, so a change in an API's shape fails a test.

Recorded 2026-11-26 (about 04:15 UTC) with the same endpoints and parameters the services send:

| File                      | Request                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `openMeteoForecast.json`  | `api.open-meteo.com/v1/forecast`, St Andrews, Scotland (56.3398, -2.7967), metric          |
| `openMeteoAir.json`       | `air-quality-api.open-meteo.com/v1/air-quality`, St Andrews (has the European pollen)      |
| `openMeteoArchive.json`   | `archive-api.open-meteo.com/v1/archive`, St Andrews, 2025-11-18 to 2025-11-24              |
| `openMeteoGeocoding.json` | `geocoding-api.open-meteo.com/v1/search?name=St Andrews&count=8&format=json`               |
| `nwsAlerts.json`          | `api.weather.gov/alerts/active?point=38.8895,-77.0353` (the National Mall, Washington, DC) |

Trimming: forecast hourly kept from 6 hours before the current hour to 12 after, daily from yesterday to 3 days ahead; air hourly 24 hours; archive 4 days; geocoding 2 results; NWS 2 alerts with only the properties the parser reads plus a few for context, geometry dropped. Everything else is as the API sent it.

To re-record, request the same URLs (the field lists come from `src/core`), trim the same way and update the expected values in the tests. NWS needs a User-Agent; use a generic one such as `fore-dashboard (github.com/nwangemann/fore)`.
