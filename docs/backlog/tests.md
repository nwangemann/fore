# 6. Tests at every layer

Goal: three small, deliberate test layers: pure core (exists), services against recorded API responses, and one end-to-end smoke test of the web build.

- [x] **6.1 Service tests with fixtures.** Record trimmed real responses from Open-Meteo forecast, air, archive, geocoding and NWS into `src/services/__fixtures__/`. Test each service with `fetch` mocked to return them, so a change in an API's shape fails a test.
      Prove: check passes; deleting a field from a fixture fails the matching test.
- [x] **6.2 Playwright smoke test.** Add `@playwright/test` (needs a one-time browser download). Serve the web export, intercept every API call with the fixtures, and assert: hero temperature, a scorecard row, the outlook line, and the Change course search flow. Add `npm run test:e2e`.
      Prove: `npm run test:e2e` passes locally twice in a row with no network.
- [x] **6.3 CI.** Add an e2e job to `.github/workflows/check.yml` (install browsers, export, run). Keep `npm run check` as the fast job.
      Prove: both jobs pass on GitHub.
