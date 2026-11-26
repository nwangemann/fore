# Changelog

## Unreleased

- Tests: service tests against recorded API responses, and a Playwright smoke test of the web build (`npm run test:e2e`).
- Accessibility: one spoken sentence per hour and per scorecard day, roles and names on every control, heading levels, a visible keyboard focus ring on web, and theme colours raised to WCAG AA contrast.
- Par is now the seasonal normal (10-year archive), with a Par row and "best day to play" in place of the week total.
- Hero card: rain timing outlook, 15-minute nowcast, vs yesterday and vs normal, in the bag, best tee time, sun strip.
- Last forecast cached for an instant open; settings load before the first fetch; Follow me only switches after a real move.
- Pressure in inHg for imperial with a 3-hour trend; AQI peak warning; pollen hidden outside Europe; alert check failures shown.
- Home-screen install: web manifest, icons and an app icon.
- First dashboard: now, hourly, 7-day scorecard, details, air quality and pollen, NWS alerts, place search, device location, saved settings.
