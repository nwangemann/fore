# 10. Accessibility: one sentence per cell, AA tokens, a web focus ring

- Status: accepted
- Date: 2026-11-25

## Decision

- **Grids read as sentences.** Each hour of the round and each scorecard day is one `role="img"` element whose `aria-label` says it all ("Saturday, high 52, low 44, rain 17 percent, one under par"). The sentences are built in `src/core/weather/speech.ts`, which is pure and tested. The scorecard is drawn as one column per day, with fixed row heights so the label column lines up, so that a day can be one element. Icons inside a labelled cell are `decorative` and hidden.
- **Icons.** `WeatherIcon` on its own is an image named after the sky; `Icon` (UI icons) is always hidden because text beside it says the same thing. The hero icon is decorative: the sky label is right next to it.
- **Roles.** Buttons are `role="button"` (Re-tee, Out of bounds, Use my location, search results, alerts with `aria-expanded`), Change course and the footer sources are links, units are toggle buttons with a pressed state, and headings carry levels on web (`fore!` is `h1`, card titles `h2`, hero panels `h3`). `src/ui/a11y.ts` holds the two web-only props React Native's types lack (`aria-level`, `aria-pressed`).
- **Focus.** On web, `installFocusRing` adds one `:focus-visible` rule: a paper ring inside an ink ring, which shows on green, paper and sand. Mouse clicks get no ring. Nothing that holds a focusable child may use `overflow: hidden`, which would clip the ring.
- **Contrast.** Every text and background pair in `tokens.ts` meets WCAG AA: 4.5:1 for body text, 3:1 for large text (the AQI dial).

## Why

react-native-web has no table semantics, and a grid of loose numbers reads as noise on a screen reader. One sentence per cell is what a person would say. react-native-web only activates `button` roles with Space, so the units are buttons, not radios.

## Contrast changes

Measured with a small script (relative luminance, WCAG 2.x). Lowest ratio per pair after the change:

| Pair                                         | Before | After |
| -------------------------------------------- | ------ | ----- |
| `pencil` on paper (kickers, legend)          | 3.06   | 4.61  |
| `pencil` on white (search placeholder)       | 3.30   | 4.97  |
| `inkSoft` on sand (the "Now" hour)           | 3.73   | 4.65  |
| sand on hero skies (clear, cloud, fog, snow) | 2.88   | 4.60  |
| sand on hero panels ("glass")                | 2.25   | 5.44  |
| paper on hero panels                         | 3.02   | 7.32  |
| AQI number on Moderate / USG bands (large)   | 2.24   | 5.61  |

- `pencil` `#8A8F87` → `#6D716B`, `inkSoft` `#5E6E62` → `#515F54`.
- Hero skies darkened: clear `#276842`, cloud `#476254`, fog `#525F58`, snow `#475F6F` (rain and storm already passed).
- Hero panels are a dark tint (`rgba(0,0,0,0.12)`) instead of a light one.
- The AQI number is ink on the yellow and orange bands (`bandText`).
- The alert banner's "Show the details" line lost its 80% opacity.

Pairs that already passed: paper on fairway 7.45, sand on fairway 5.54, ink on paper 15.55, fairway on paper 7.45, flag on paper 4.61, paper on flag 4.61, under on paper 5.04, over on paper 8.03.

## Consequences

- A new colour pair, or a change to a token, needs its contrast checked against these thresholds.
- The fog and cloud skies are now close in tone; the icon and label tell them apart.
- A real screen-reader pass (VoiceOver) is a manual check in `docs/backlog/manual.md`.
