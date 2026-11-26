# Alerts

`src/features/alerts/AlertBanner.tsx` with `src/core/alerts/alerts.ts`. Active NWS alerts for the place's point, most severe first, as red "FORE!" banners that expand to the description and instructions. US places only.

When the NWS can't be reached, a muted line says so, so "no alerts" is never a guess.
