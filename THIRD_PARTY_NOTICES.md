# Third-party notices

npm packages and their licences are listed in [docs/dependencies.md](docs/dependencies.md). This file covers code and assets copied into the repository.

## Meteocons

- What: 21 static weather icons ("fill" style), vendored as SVG strings in `src/ui/weather/meteocons.ts`, and 9 UI icons (barometer, cloudy, horizon, humidity, raindrop, sunrise, sunset, uv-index, windsock) in `src/ui/icons/uiIcons.ts`. The `flag` icon in that file is fore!'s own drawing in the Meteocons style, not part of Meteocons.
- Source: https://github.com/basmilius/meteocons (formerly `basmilius/weather-icons`), tag `v2.0.0`, files `design/fill/export/wi_<name>.svg`.
- Changes: gradient ids prefixed with the icon name, gradients that inherited stops through `xlink:href` given their stops directly, whitespace collapsed. The drawings are unchanged.
- Licence: MIT

```
MIT License

Copyright (c) 2020-2021 Bas Milius

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
