# 7. Home-screen install as a web app

- Status: superseded (2026-11-25)
- Date: 2026-11-25

## Decision

Ship a web manifest, icons and Apple touch icon through `public/`, with `public/index.html` overriding Expo's web template to link them.

## Superseded

Home-screen install is no longer a goal, and fore! makes no install claims. The manifest and icons stay because they give the tab its name, icon and theme color. An offline service worker remains a possible later addition.
