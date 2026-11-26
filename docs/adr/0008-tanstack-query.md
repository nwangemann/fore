# 8. TanStack Query for remote data

- Status: accepted
- Date: 2026-11-25

## Decision

Remote data goes through TanStack Query. `app/_layout.tsx` provides one `QueryClient` (one retry per query). `useDashboard` composes one query per source:

| Query    | Key                         | Fresh for | Notes                                      |
| -------- | --------------------------- | --------- | ------------------------------------------ |
| forecast | `forecast`, place, units    | 10 min    | Refetches every 10 min; its error is shown |
| air      | `air`, place                | 10 min    | Fails quietly                              |
| alerts   | `alerts`, place             | 10 min    | Failure sets `alertsFailed`                |
| normals  | `normals`, place, first day | forever   | Waits for the forecast's dates             |

Place is the latitude and longitude to three decimals. Because the place is in every key, switching place starts from empty data, never the old place's. A failed refetch keeps the last good data and sets the error.

On web TanStack Query refetches stale queries when the tab regains focus. On native, `focusManager` is wired to `AppState`.

## Why

The hook had hand-rolled staleness timers, focus refresh, race guards and per-place keys. TanStack Query does all of that, and reviewers recognise it. `useDashboard` keeps its return shape, so the screens did not change.

## Consequences

- The "from your last visit" cache paint is off until step 3.2 adds a persisted query cache (AsyncStorage) and removes `src/services/cache.ts`. The normals archive keeps its own cache until then.
