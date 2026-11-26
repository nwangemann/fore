# Air

`src/features/air/AirCard.tsx` with `src/core/air/air.ts`. US AQI uses the EPA bands, with a heads-up when the next 24 hours reach a worse band. Pollen uses one rough grains/m³ scale for all species (documented in `pollenBand`). The section only appears where the model has pollen (Europe) and collapses to one line when everything is "None".
