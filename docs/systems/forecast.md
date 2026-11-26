# Forecast

`src/features/forecast` with logic in `src/core/weather`.

- NowCard: current conditions, a quip per WMO code (`codes.ts`), today's score badge, and caddie notes (`caddieNotes` in `score.ts`).
- FrontNine: 18 hours from the current hour, with "the turn" after nine.
- Scorecard: 7 days. `scoreDay` scores warmth, rain chance, wind and snow against par; thunderstorms are a weather delay. Under par is circled, over par boxed.
- YardageBook: wind, humidity, UV, cloud, visibility, pressure, rain today, sunrise to sunset.

Scoring thresholds are taste; tune them only in `scoreDay`.
