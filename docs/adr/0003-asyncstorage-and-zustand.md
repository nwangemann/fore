# 3. Settings in zustand persisted to AsyncStorage

- Status: accepted
- Date: 2026-11-25

## Decision

The home place, units and recent places live in one zustand store persisted with AsyncStorage. On web AsyncStorage is localStorage, so nothing needs a server. MMKV was not used because it needs a development build on native.
