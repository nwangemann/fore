# 9. SVG weather icons (Meteocons)

- Status: accepted
- Date: 2026-11-25

## Decision

Weather conditions are drawn with Meteocons by Bas Milius (MIT), "fill" style, static exports from the official repository at tag `v2.0.0`. Only the 21 icons that `src/core/weather/codes.ts` maps to are vendored, as SVG strings in `src/ui/weather/meteocons.ts`, and drawn with `react-native-svg`'s `SvgXml`.

- `codes.ts` keeps the mapping: each WMO code has a day and a night icon name (`WeatherIconName`). `src/core` stays free of React.
- `WeatherIcon` takes a code, `isDay` and a size, and draws into a fixed square box, so nothing moves while the icon draws.
- Gradient ids are prefixed with the icon name when vendoring, because every Meteocons file uses ids like `a` and `b` and several icons share one web page. Inherited gradients get their stops copied in, since `react-native-svg` gradients have no `href`.
- Source, changes and licence text are in `THIRD_PARTY_NOTICES.md`.

## Why

Emoji draw differently on every OS and browser. Meteocons is one consistent, colourful set with day and night variants, and MIT. The repository's `main` no longer commits built SVGs, so the last tagged release with static exports is used. Strings in a TypeScript module need no Metro SVG transformer.

## Consequences

- Adding a code or icon means copying its SVG from the same tag, applying the same id prefix, and adding the name to `WeatherIconName`; the type check fails if the two disagree.
- The "fill" icons are pale (white clouds), so they read best on the darker hero card; on the cream cards they rely on their outlines.
