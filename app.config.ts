import type { ConfigContext, ExpoConfig } from 'expo/config';

// app.json holds the config. FORE_BASE_URL sets the web base path for the GitHub Pages
// build (`/fore`); unset, the app serves from the root as in development and e2e (ADR 12).
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  experiments: { ...config.experiments, baseUrl: process.env.FORE_BASE_URL ?? '' },
});
