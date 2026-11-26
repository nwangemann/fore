# Backlog

**Next step: 5.2 Accessibility pass** ([quality.md](quality.md)).

## State

Snapshot: 2026-11-25. The dashboard works in the web preview against live APIs.

- Verified: `npm run check`; at desktop and 375 px widths for Portland, OR, every dashboard section, search and saved place, NWS alert banners and European pollen. Since 3.1 and 3.2 (TanStack Query), data loads, Re-tee refetches, switching place never shows the old place's data, a reload paints the last visit's forecast at once ("From your last visit · updating…") and the archive is fetched once per place. Since 4.1, weather conditions draw as Meteocons SVG icons in the hero, the round and the scorecard, at both widths with no layout shift. Since 4.2, no emoji remain: Meteocons UI icons label the yardage book, the sun strip and the round's rain chance, a drawn flagstick marks the header and course rows, and the bag is words only. Since 5.1, a forced render error shows the route-level "Out of bounds" card and "Play it again" recovers; a failed forecast with no cache, and offline with no cache, show an "Out of bounds" card whose Re-tee recovers; a failed refresh keeps the cached dashboard with "couldn't refresh" in the header.
- Not verified: "Use my location" with the prompt allowed (needs a person); the nowcast line and AQI peak warning in real weather (unit-tested only); the iOS build, native location and AsyncStorage on native.

## Roadmap

Each section is a file of session-sized steps. Do one step per session, in order.

| #   | Section                                          | Steps |
| --- | ------------------------------------------------ | ----- |
| 1   | [Trim scope and docs](trim.md)                   | 3/3   |
| 2   | [Publish on GitHub](publish.md)                  | 1/1   |
| 3   | [TanStack Query data layer](tanstack-query.md)   | 2/2   |
| 4   | [SVG weather icons](icons.md)                    | 2/2   |
| 5   | [Resilience and accessibility](quality.md)       | 1/2   |
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
- Local Node on PATH: this Mac keeps Node in a folder outside the shell path, so the portable `fore-web` launch config fails until that folder is added to the shell profile (outside the repo).

## Rules

- One step (one checkbox) per session. When it is done: tick it, update the count above and "Next step".
- Manual checks stay last and never hold up other work.
- New ideas go under "Ideas", not into the current step.
