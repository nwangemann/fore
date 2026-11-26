import { defineConfig, devices } from '@playwright/test';

const PORT = 4183;

/** One end-to-end smoke test of the static web export. Run with `npm run test:e2e`. */
export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: 0,
  // CI also writes an HTML report, uploaded by the e2e job when it fails.
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    timezoneId: 'Europe/London',
    locale: 'en-GB',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx expo export -p web && npx expo serve --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Never reuse: another app on this port would be tested instead.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
