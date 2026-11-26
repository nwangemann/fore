# Handoff

Snapshot: 2026-11-25.

## State

The dashboard works in the web preview against live APIs, with the review's first batch built (see [review](review-2026-11-25.md)).

## What has been verified

- `npm run check` passes.
- In the web preview at desktop and 375 px phone widths, for Portland, OR: the hero outlook, vs yesterday and vs normal, in the bag, best tee time inside daylight, Par row from cached normals, best day to play, pressure in inHg with a trend, pollen hidden outside Europe. Earlier: search, saved place, NWS alert banners, European pollen.
- A reload paints the cached copy ("From your last visit · updating…") and then refreshes. Settings, dashboard and normals caches appear in localStorage.
- The manifest, icons and Apple touch icon are served and linked.

## Not verified

- "Use my location" and Follow me (needs a browser location prompt answered by a person).
- Adding to the home screen on a phone (needs HTTPS hosting).
- The nowcast line and AQI peak warning showing up in real weather: covered by unit tests and the code path, but neither condition happened during the check.
- iOS build, native location and AsyncStorage hydration on native.
