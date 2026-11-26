# fore!

@AGENTS.md

- Any change to `src/core`, features, dependencies or standards must update the matching doc in the same change.
- Significant decisions get an ADR in `docs/adr`.
- `src/core` stays free of React and Expo imports.
- Run `npm run check` before declaring work done.
- Keep testing minimal: this is a personal dashboard. `npm run check` plus a look in the web preview is usually enough. Add tests only where mistakes are likely and hard to see.

## Session routine

1. Read `docs/backlog/README.md`, then only the file for the task at hand. Read `docs/handoff.md` only when you need project state.
2. Load the `fore-dev` skill before running anything.
3. Do one task, run `npm run check`, update the backlog, and stop.

New ideas go in the backlog, not in the current task.
