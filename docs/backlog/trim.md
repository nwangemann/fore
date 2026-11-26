# 1. Trim scope and docs

Goal: everything left in the repo earns its place, and nothing personal is committed.

- [x] **1.1 Cut Follow me and reverse geocoding.** Remove the Follow me setting and its effect, `placeAt`/Nominatim, and `distanceKm`. "Use my location" stays: it names the spot by coordinates, or keeps "Current location". Remove recents only if it simplifies the picker without losing the demo flow.
      Files: `src/state/settings.ts`, `src/services/location.ts`, `src/core/place/place.ts`, `app/index.tsx`, `src/features/course/CoursePicker.tsx`, `src/features/dashboard/Footer.tsx` (OSM credit), `docs/adr/0005-location.md`, `docs/data-sources.md`.
      Prove: check passes; in the preview, search and "Use my location" (deny the prompt) still behave.
- [x] **1.2 Consolidate docs.** Fold `docs/systems/*.md` into `docs/architecture.md` and drop the systems rule from `scripts/docs-check.mjs`. Fold `docs/handoff.md` into a short "State" section of this backlog's index. Move `docs/review-2026-11-25.md` to `docs/reviews/`. Mark ADR 7 (home-screen install) superseded: keep the manifest and icon, drop install claims. Update `docs/README.md`, `CLAUDE.md` and the `fore-dev` skill to match.
      Prove: check passes; no dead links (`grep -rn "systems/\|handoff" docs CLAUDE.md .claude`).
- [x] **1.3 Remove personal and machine details.** Rename ADR 1 to a plain "Tooling" decision with no Stellar reference. Replace `~/.local/node` paths in the skill with "Node 22.13+ on PATH". Make `.claude/launch.json` portable (`npm run web -- --port 8082`). Stop calling it an iOS app in README and AGENTS (web-first Expo). Add `description`, `repository` and `homepage` to `package.json`. Check the bundle id and scheme are fine to publish.
      Prove: `grep -rni "stellar\|/Users/\|\.local/node\|nate" --exclude-dir=node_modules --exclude-dir=.git .` returns only the intended commit author config, which is not in the tree.
