# 7. Home-screen install as a web app

- Status: accepted
- Date: 2026-11-25

## Decision

Ship a web manifest, icons and Apple touch icon through `public/`, with `public/index.html` overriding Expo's web template to link them. This makes fore! installable from the phone browser with no App Store build. Installing needs HTTPS hosting (backlog task 2). An offline service worker is left for later.
