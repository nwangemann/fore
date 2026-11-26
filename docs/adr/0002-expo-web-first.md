# 2. Expo Router app, web first

- Status: accepted
- Date: 2026-11-25

## Context

The goal was a web app as the easy path, with a phone app as an option for location and other device features.

## Decision

Build one Expo Router app. Web is the main target: it needs no build, opens anywhere and the browser already gives location. The same code can build for iOS with `npx expo run:ios` when native location, widgets or notifications are worth it. A web view wrapper was rejected: it adds a native shell without the native APIs being any easier to reach.
