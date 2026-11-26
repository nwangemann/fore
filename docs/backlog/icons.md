# 4. SVG weather icons

Goal: replace emoji, which render differently on every OS, with one consistent SVG icon set.

- [x] **4.1 Weather icons.** Pick an open-licence weather set (Meteocons by Bas Milius is MIT; confirm the licence before use) and vendor only the icons needed for the WMO codes, day and night. Add `react-native-svg`. A `WeatherIcon` component maps a code and `isDay` to an icon; `codes.ts` keeps the mapping, not the emoji. Use it in the hero, the round and the scorecard. Record the licence in `docs/dependencies.md` or a `THIRD_PARTY_NOTICES.md`.
      Prove: check passes; icons render at desktop and 375 px widths with no layout shift.
- [ ] **4.2 Remaining emoji.** Replace or remove the decorative emoji in the yardage book labels, in the bag, the sun strip, the header flag and alert copy, using a few UI icons in the same style. Keep the golf personality in words, not pictographs.
      Prove: `grep -rnP "[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}]" src app` finds nothing intended for display.
