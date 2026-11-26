# 3. TanStack Query data layer

Goal: replace the hand-written caching, staleness, focus refresh and race handling in `useDashboard` with TanStack Query and its persister. Less code, a pattern reviewers recognise. Approved by the user on 2026-11-25.

- [ ] **3.1 Queries.** `npx expo install @tanstack/react-query`. Add a `QueryClient` provider in `app/_layout.tsx`. One query each for forecast, air, alerts and normals, keyed by place (and units where it matters), with `staleTime` 10 min and normals at `Infinity`. Wire `focusManager` to `AppState` for native. Rewrite `useDashboard` as a thin composition of the queries (target: under 60 lines) and keep its return shape so the screens barely change. ADR 8 records the switch.
      Files: `package.json`, `docs/dependencies.md`, `app/_layout.tsx`, `src/features/dashboard/useDashboard.ts`, `docs/adr/0008-tanstack-query.md`.
      Prove: check passes; in the preview, data loads, Re-tee refetches, switching place never shows the old place's data.
- [ ] **3.2 Persisted cache.** Add `@tanstack/react-query-persist-client` and `@tanstack/query-async-storage-persister`, persisting to AsyncStorage. Delete `src/services/cache.ts` and the manual cache code. Derive "From your last visit · updating…" from `isFetching` and `dataUpdatedAt`. Bump the persister `buster` when the data shape changes.
      Files: as 3.1, plus `src/services/openMeteo.ts` (normals cache), `src/features/dashboard/Header.tsx`, `docs/architecture.md`.
      Prove: a reload paints the cached forecast at once, then refreshes; the archive is fetched once per place (check network requests).
