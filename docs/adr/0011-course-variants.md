# 11. The course follows the weather

- Status: accepted
- Date: 2026-11-25

## Decision

The mowing stripes and the hero card take one of four course variants: `day`, `night` (`is_day = 0`), `frost` (snow) and `storm` (thunderstorms).

- `courseVariant(code, isDay)` in `src/core/weather/variant.ts` is the only place that picks it. Weather beats the clock: snow is `frost` and thunderstorms are `storm`, day or night; everything else is `day` or `night` by `isDay`. Freezing drizzle, freezing rain and freezing fog keep their rain and fog moods, so they follow the clock.
- The palettes live with the other tokens in `src/ui/tokens.ts`: `stripeColor` for the stripes and `heroColor(variant, mood)` for the hero. In the day the hero keeps its per-sky colour (`moodColor`); night, frost and storm each have one hero colour.
- The root layout's stripes read the variant through `useCourseVariant`, which shares the dashboard's forecast query, so it adds no request. They stay `day` until a forecast loads, on the course picker underneath, and on the error screen.
- On web, a hidden `?course=day|night|frost|storm` query parameter forces a variant, for screenshots (`docs/images/course-*.png`). `previewVariant` in `src/ui/previewVariant.ts` reads it once when the app starts, through `parseCourseVariant` in `src/core`, and the stripes and hero use it in place of `courseVariant`. It is never written to settings or storage, so it lasts for that page load only. It forces the palette, not the weather: icons, text and scores still show the real sky. Unknown values are ignored.
- Nothing animates, so there is no reduced-motion case. A future transition between variants must respect it.

## Contrast

Measured with the same relative-luminance script as ADR 10 (WCAG 2.x), paper and sand text, lowest per surface. Hero panels are the hero colour darkened by `glass` and `shade`, so they only rise.

| Variant | Stripes (fairway / stripe)        | Paper on stripes | Sand on stripes | Hero      | Paper on hero | Sand on hero |
| ------- | --------------------------------- | ---------------- | --------------- | --------- | ------------- | ------------ |
| day     | `#1E5B3A` / `#226640` (unchanged) | 6.40             | 4.76            | by sky    | ADR 10        | 4.60         |
| night   | `#132A33` / `#17323C`             | 12.49            | 9.29            | `#24365A` | 11.12         | 8.27         |
| frost   | `#375957` / `#3D6260`             | 6.25             | 4.65            | `#3F5A70` | 6.69          | 4.98         |
| storm   | `#1F2B2C` / `#263436`             | 11.96            | 8.90            | `#3D2F4D` | 11.37         | 8.46         |

Every pair meets 4.5:1, so body text passes as well as large text. Every other card was checked against every variant as well. The paper cards (yardage book, round, scorecard, outlook, Clubhouse air, search, Out of bounds), the alert card and their insets do not change colour, so their pairs are the same in every variant; the lowest are pencil on paper 4.61, flag on paper 4.61, paper on flag (alerts) 4.61, inkSoft on sand (the round's "Now") 4.65 and pencil on white (search placeholder) 4.97. Text that sits on the stripes (header tagline, "Card signed", the alerts-failed line, the loading line, the footer) is paper or sand, covered by the table above. Nothing fell below AA, so no colour changed.

## Consequences

- A new variant, or a change to one, needs its stripes and hero checked against these thresholds.
- Frost is the closest to the limit (sand on the light stripe at 4.65).
