# Forecast

`src/features/forecast` with logic in `src/core/weather` and `src/core/climate`.

- NowCard: current conditions and quip (`codes.ts`); vs yesterday and vs normal; a rain-timing outlook and a 15-minute nowcast (`outlook.ts`); in the bag; best tee time (two daylight hours that end by sunset); caddie notes; sunrise and sunset strip.
- The round: 18 hours from the current hour, with "the turn" after nine.
- Scorecard: 7 days with a Par row. `scoreDay` scores each day against the seasonal normal from `climate/normals.ts` once it has loaded, and against a fixed ideal until then. It never goes under par below 5 °C or above 35 °C. Thunderstorms are a weather delay. "Best day to play" is the lowest score, earliest on a tie.
- Yardage book: wind, humidity, UV, cloud, visibility, and pressure (inHg in imperial) with its 3-hour trend.

Scoring and outlook thresholds are taste; tune them only in `score.ts` and `outlook.ts`.
