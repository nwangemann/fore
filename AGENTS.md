fore! is a personal weather dashboard built with Expo and Expo Router. Web is the main target (ADR 2); the same Expo code can also build for iOS and Android, but those builds are untested.

## Expo APIs

Expo changes every SDK release, so do not code from memory. Before using an Expo or React Native API:

1. Read the installed package's types in `node_modules`.
2. If they do not settle it, fetch only that API's page under `https://docs.expo.dev/versions/v<major>.0.0/`, with the major version of `expo` in `package.json`.
3. Use `https://docs.expo.dev/llms.txt` only to find a page you cannot locate.

## Rules

- Use npm and npx. Add packages with `npx expo install <package>`, never plain `npm install <package>`.
- Navigation is Expo Router. Every file in `app/` is a screen or a `_layout.tsx`; other code goes in `src/`.
- Network calls live in `src/services`; parsing and rules live in `src/core`.
- `ios/` and `android/` are generated. Never edit them; use `app.json` and config plugins.
- Every data source must be free and keyless, or the key must stay off the client. Record each source in `docs/data-sources.md`.
