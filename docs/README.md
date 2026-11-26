# fore! docs

Live demo: https://nwangemann.github.io/fore/

## Quick start

1. Node 22.13+, 24.3+ or 26+ on PATH.
2. `npm install`
3. `npm run web` opens the dashboard at http://localhost:8081. `npm run ios` builds for the iOS simulator (untested).
4. `npm run check` runs before every commit (pre-commit hook) and in CI.
5. `npm run test:e2e` runs the end-to-end smoke test. First run: `npx playwright install --only-shell chromium`.

## Index

- [Architecture](architecture.md): folders, data flow, features, testing and CI
- [Decisions](adr/): twelve short ADRs
- [Standards](standards.md), including accessibility
- [Data sources](data-sources.md) and [dependencies](dependencies.md)
- [How fore! was built with an AI agent](ai-workflow.md)
- [Backlog](backlog/README.md): roadmap, verified state and ideas
- [Reviews](reviews/): dated reviews of the app and the process
