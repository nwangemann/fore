# 8. TanStack Query for remote data

- Status: accepted
- Date: 2026-11-25

## Decision

Remote data goes through TanStack Query. `app/_layout.tsx` provides one `QueryClient` (one retry per query). `useDashboard` composes one query per source:

| Query    | Key                          | Fresh for | Notes                                        |
| -------- | ---------------------------- | --------- | -------------------------------------------- |
| forecast | `forecast`, place, units     | 10 min    | Refetches every 10 min; its error is shown   |
| air      | `air`, place                 | 10 min    | Fails quietly                                |
| alerts   | `alerts`, place              | 10 min    | Failure sets `alertsFailed`                  |
| archive  | `archive`, place, start year | forever   | Waits for the forecast's dates; kept 30 days |

Place is the latitude and longitude to three decimals. Because the place is in every key, switching place starts from empty data, never the old place's. A failed refetch keeps the last good data and sets the error.

On web TanStack Query refetches stale queries when the tab regains focus. On native, `focusManager` is wired to `AppState`.

The query cache is persisted (step 3.2) with `PersistQueryClientProvider` and an AsyncStorage persister under `fore.queries` (localStorage on web). It is kept 30 days (`maxAge`); queries stay in memory for a day (`gcTime`), the archive for 30 days. The `buster` in `app/_layout.tsx` must be bumped whenever a cached data shape changes. On start the last visit's data paints at once; stale queries then refetch. `fromCache` is true while the forecast is refetching and its `dataUpdatedAt` is older than this page load, which the header shows as "From your last visit · updating…". The normals are computed from the cached archive records, so the archive is fetched once per place and year.

## Why

The hook had hand-rolled staleness timers, focus refresh, race guards and per-place keys. TanStack Query does all of that, and reviewers recognise it. `useDashboard` keeps its return shape, so the screens did not change.

## Consequences

- `src/services/cache.ts` and the archive's own cache are gone; old `fore.cache.*` keys are deleted on start.
- The persisted cache is about 270 KB per place with its archive, so localStorage holds a handful of places.
