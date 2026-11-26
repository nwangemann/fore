# 12. Live demo on GitHub Pages

- Status: accepted
- Date: 2026-11-26

## Context

A portfolio reviewer should be able to try fore! without cloning it. The web export is a static site, and all data sources are keyless and send CORS headers, so no server is needed.

## Decision

The `deploy` job in `.github/workflows/check.yml` publishes the web export to GitHub Pages at https://nwangemann.github.io/fore/. It runs only for pushes to `main`, after `check` and `e2e` pass.

- A project site lives under `/fore/`. `app.config.ts` sets Expo's `experiments.baseUrl` from `FORE_BASE_URL`, which only the deploy job sets. Development, the preview and the e2e test still serve from the root.
- `public/index.html` and the web manifest use relative paths, so they work at the root and under `/fore/`.
- The job copies `index.html` to `404.html`, so a deep link such as `/fore/course` loads the app instead of GitHub's 404 page.

## Consequences

- Every green push to `main` updates the live demo. A red build never deploys.
- Saved settings and the query cache live in the visitor's own browser storage, as in development.
- Pages is free for public repositories.
