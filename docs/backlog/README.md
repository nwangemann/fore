# Backlog

**Next step: 9.1 Person-only checks** ([manual.md](manual.md)). Needs a person; no agent steps remain on the roadmap.

## State

Snapshot: 2026-11-26. Every agent step on the roadmap is done; `main` passes `check` and `e2e` on GitHub.

Verified by the agent, in the web preview against live APIs and in CI:

- **Dashboard:** every section at desktop and 375 px widths, place search and saved place, NWS alert banners, European pollen.
- **Data (3.1–3.2):** Re-tee refetches; switching place never shows the old place's data; a reload paints the last visit at once, then refreshes; the archive is fetched once per place.
- **Icons (4.1–4.2):** Meteocons SVGs with no layout shift; no emoji remain.
- **Errors (5.1):** a render error, a failed forecast and offline with no cache each show an "Out of bounds" card that recovers; a failed refresh keeps the cached dashboard.
- **Accessibility (5.2):** keyboard-only walk with a visible focus ring; one spoken sentence per hour and per scorecard day; every text pair at WCAG AA (ADR 10).
- **Tests (6.1–6.3):** service tests fail when a parsed field disappears; the Playwright smoke test passes offline against fixtures; both run in CI.
- **Theme (7.1–7.2):** the course follows the sky; `?course=` forces a variant; every card meets AA in every variant (ADR 11).
- **Docs (8.1–8.2):** README and AI workflow render on GitHub with images and the diagram; relative links resolve.

Not verified:

- Needs a person ([manual checks](manual.md)): "Use my location" with the prompt allowed, a real phone, VoiceOver, a cold read of the README.
- Unit-tested only: the nowcast line and the AQI peak warning in real weather.
- Untested: the iOS and Android builds, native location and AsyncStorage on native.

## Roadmap

Each section is a file of session-sized steps. Do one step per session, in order.

| #   | Section                                          | Steps |
| --- | ------------------------------------------------ | ----- |
| 1   | [Trim scope and docs](trim.md)                   | 3/3   |
| 2   | [Publish on GitHub](publish.md)                  | 1/1   |
| 3   | [TanStack Query data layer](tanstack-query.md)   | 2/2   |
| 4   | [SVG weather icons](icons.md)                    | 2/2   |
| 5   | [Resilience and accessibility](quality.md)       | 2/2   |
| 6   | [Tests at every layer](tests.md)                 | 3/3   |
| 7   | [Course follows the weather](weather-theme.md)   | 2/2   |
| 8   | [README and AI workflow](readme-and-workflow.md) | 2/2   |
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
