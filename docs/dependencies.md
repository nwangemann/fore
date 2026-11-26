# Dependencies

`npm run docs:check` fails if this table and package.json differ.

## dependencies

| Package                                     | Purpose                                              | Licence | ADR  |
| ------------------------------------------- | ---------------------------------------------------- | ------- | ---- |
| `@expo-google-fonts/shrikhand`              | Display font for headings and numbers                | OFL     | 0004 |
| `@expo-google-fonts/space-grotesk`          | Body font                                            | OFL     | 0004 |
| `@expo/metro-runtime`                       | Web bundling runtime                                 | MIT     | 0002 |
| `@react-native-async-storage/async-storage` | Saved settings and query cache (localStorage on web) | MIT     | 0003 |
| `@tanstack/react-query`                     | Remote data: caching and refetching                  | MIT     | 0008 |
| `@tanstack/query-async-storage-persister`   | Saves the query cache to AsyncStorage                | MIT     | 0008 |
| `@tanstack/react-query-persist-client`      | Restores the query cache on start                    | MIT     | 0008 |
| `expo`                                      | App framework                                        | MIT     | 0002 |
| `expo-constants`                            | Expo Router requirement                              | MIT     | 0002 |
| `expo-font`                                 | Loads the fonts                                      | MIT     | 0004 |
| `expo-linking`                              | Expo Router requirement                              | MIT     | 0002 |
| `expo-location`                             | "Use my location" on web and native                  | MIT     | 0005 |
| `expo-router`                               | Navigation                                           | MIT     | 0002 |
| `expo-status-bar`                           | Light status bar on native                           | MIT     | 0002 |
| `react`                                     | UI                                                   | MIT     | 0002 |
| `react-dom`                                 | Web renderer                                         | MIT     | 0002 |
| `react-native`                              | UI                                                   | MIT     | 0002 |
| `react-native-safe-area-context`            | Notch insets                                         | MIT     | 0002 |
| `react-native-screens`                      | Expo Router requirement                              | MIT     | 0002 |
| `react-native-svg`                          | Draws the Meteocons weather and UI icons             | MIT     | 0009 |
| `react-native-web`                          | Web target                                           | MIT     | 0002 |
| `zustand`                                   | Settings store                                       | MIT     | 0003 |

Vendored assets (not npm packages) are listed with their licences in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

## devDependencies

| Package                           | Purpose               | Licence | ADR  |
| --------------------------------- | --------------------- | ------- | ---- |
| `@commitlint/cli`                 | Commit message check  | MIT     | 0001 |
| `@commitlint/config-conventional` | Conventional Commits  | MIT     | 0001 |
| `@types/jest`                     | Test types            | MIT     | 0001 |
| `@types/react`                    | React types           | MIT     | 0001 |
| `eslint`                          | Lint (pinned to 9)    | MIT     | 0001 |
| `eslint-config-expo`              | Expo lint rules       | MIT     | 0001 |
| `eslint-config-prettier`          | Lint/format agreement | MIT     | 0001 |
| `husky`                           | Git hooks             | MIT     | 0001 |
| `jest`                            | Tests                 | MIT     | 0001 |
| `jest-expo`                       | Jest preset           | MIT     | 0001 |
| `prettier`                        | Formatting            | MIT     | 0001 |
| `typescript`                      | Types                 | Apache  | 0001 |
