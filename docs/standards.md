# Standards

- Strict TypeScript with `noUncheckedIndexedAccess`.
- Components PascalCase, modules camelCase, one system doc per feature folder.
- Colours, spacing and fonts come from `src/ui/tokens.ts`. Touch targets are at least 44 points.
- Core logic has unit tests next to it where mistakes are easy to miss. Services are tested against recorded fixtures, and one Playwright smoke test runs the web build against the same fixtures (see Testing in `architecture.md`).
- Conventional Commits. `npm run check` must pass, locally and in CI; CI also runs `npm run test:e2e` (see Testing in `architecture.md`).
- Accessibility (ADR 10): text meets WCAG AA contrast (4.5:1, or 3:1 for large text) against its background; check new colour pairs. Every control has a role and a name; icons next to text are hidden; grids give each cell one spoken sentence from `src/core/weather/speech.ts`. On web, keep the focus ring visible: no `overflow: hidden` around focusable children.
- Golf jokes are welcome in copy; labels must still say plainly what a value is.
