# fore!

@AGENTS.md

- Any change to `src/core`, features, dependencies or standards must update the matching doc in the same change.
- Significant decisions get an ADR in `docs/adr`.
- `src/core` stays free of React and Expo imports.
- Run `npm run check` before declaring work done.
- Keep testing minimal: this is a personal dashboard. `npm run check` plus a look in the web preview is usually enough. Add tests only where mistakes are likely and hard to see.

## Session routine

1. Read `dev/backlog/README.md`, then only the file for the task at hand. Its "State" section is the project state. `dev/` holds process notes (backlog, reviews); it is git-ignored, and committed files never link to it.
2. Load the `fore-dev` skill before running anything.
3. Do one step (one checkbox). Touch only the files that step lists.
4. Run `npm run check`, commit, tick the step, update "Next step" in the backlog index, and stop. Start the next step in a new session.

New ideas go in the backlog, not in the current task. Project docs (architecture, ADRs, README) are committed; backlogs, reviews and other process notes go in `dev/`.
