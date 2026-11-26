# Handoff

Snapshot: 2026-11-25.

## State

The first dashboard works in the web preview against live APIs.

## What has been verified

- `npm run check` passes.
- In the web preview (desktop and 375 px phone width): dashboard loads for the default place, search for "Portland" returns results, picking one reloads the dashboard and persists in localStorage, NWS alert banners render for a point with live alerts, pollen shows for a European place, no console errors.

## Not verified

- "Use my location" and Follow me (needs a browser location prompt answered by a person).
- iOS build and native location.
- Behaviour over many hours (auto refresh), offline, and slow networks.
