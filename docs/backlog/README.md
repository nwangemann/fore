# Backlog

**Next step: 1.2 Consolidate docs** ([trim.md](trim.md)).

## Roadmap

Each section is a file of session-sized steps. Do one step per session, in order.

| #   | Section                                          | Steps |
| --- | ------------------------------------------------ | ----- |
| 1   | [Trim scope and docs](trim.md)                   | 1/3   |
| 2   | [Publish on GitHub](publish.md)                  | 0/1   |
| 3   | [TanStack Query data layer](tanstack-query.md)   | 0/2   |
| 4   | [SVG weather icons](icons.md)                    | 0/2   |
| 5   | [Resilience and accessibility](quality.md)       | 0/2   |
| 6   | [Tests at every layer](tests.md)                 | 0/3   |
| 7   | [Course follows the weather](weather-theme.md)   | 0/2   |
| 8   | [README and AI workflow](readme-and-workflow.md) | 0/2   |
| 9   | [Manual checks](manual.md) (last)                | 0/1   |

## Ideas (not planned)

From the earlier queue; pick one up only after the roadmap.

- Set the real home course: pick it once in the app, or change `DEFAULT_PLACE` in `src/core/place/place.ts`.
- US pollen: needs a keyed API (see data sources) and a tiny proxy to hold the key.
- Precipitation radar: RainViewer tiles, or NWS radar images for the US.
- Daily detail sheet: tap a scorecard day for its hourly breakdown.
- Moon phase and golden hour: computable offline; no new source.
- Quip variety and Mulligan: several quips per condition, rotated daily; a re-roll button (explorations 14–15).
- Offline service worker: cache the app shell so the home-screen app opens with no signal.

## Rules

- One step (one checkbox) per session. When it is done: tick it, update the count above and "Next step".
- Manual checks stay last and never hold up other work.
- New ideas go under "Ideas", not into the current step.
