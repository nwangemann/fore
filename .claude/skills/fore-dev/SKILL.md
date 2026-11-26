---
name: fore-dev
description: Set up the shell, run, check and preview the fore! Expo web dashboard. Use before running any npm or npx command in this repo, and when the preview misbehaves.
---

# Working on fore!

## Environment

Node lives in `~/.local/node`, not on the shell path. Run this first in every new terminal:

```bash
export PATH="$HOME/.local/node/bin:/opt/homebrew/bin:$PATH"
export LANG=en_US.UTF-8
```

## Commands

- `npm run web`: dashboard at http://localhost:8081.
- `npm run check`: types, lint, formatting, tests and docs. Required before finishing.
- `npx prettier --write <files>`: fixes formatting failures.
- `npx expo export -p web`: static build in `dist/`.

## Preview pane

`.claude/launch.json` defines `fore-web` on port 8082 (stellar may hold 8081).

## Gotchas

- The React Compiler lint rules reject `setState` called synchronously in an effect body. Set state in promise callbacks or event handlers (see `useDashboard`).
- The navigator theme background is transparent so the mowing stripes in `_layout.tsx` show through. Keep it that way.
- Settings persist in localStorage under `fore.settings`. Remove that key to reset to the default place.
- Open-Meteo pollen is null outside Europe; that is expected, not a bug.
