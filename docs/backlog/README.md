# Backlog

**Next step: pick from the queue.**

## Queue

| #   | Task                       | Notes                                                                                      |
| --- | -------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | Set the real home course   | Pick it once in the app, or change `DEFAULT_PLACE` in `src/core/place/place.ts`.           |
| 2   | Host it                    | `npx expo export -p web` gives a static site; any static host works.                       |
| 3   | US pollen                  | Needs a keyed API (see data sources) and a tiny proxy to hold the key.                     |
| 4   | Precipitation radar        | RainViewer tiles, or NWS radar images for the US.                                          |
| 5   | Daily detail sheet         | Tap a scorecard day for its hourly breakdown.                                              |
| 6   | Moon phase and golden hour | Computable offline; no new source.                                                         |
| 7   | Home-screen install        | Web manifest and icons so it opens like an app on the phone.                               |
| 8   | Manual checks (last)       | Location prompt and Follow me in a real browser; iOS build on a phone if native is wanted. |

## Rules

- Manual checks stay last and never hold up other work.
- When a task is done, add a line to the changelog and remove its row.
