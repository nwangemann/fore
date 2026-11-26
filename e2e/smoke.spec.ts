import { expect, test, type Page } from '@playwright/test';
import air from '../src/services/__fixtures__/openMeteoAir.json';
import archive from '../src/services/__fixtures__/openMeteoArchive.json';
import forecast from '../src/services/__fixtures__/openMeteoForecast.json';
import geocoding from '../src/services/__fixtures__/openMeteoGeocoding.json';
import alerts from '../src/services/__fixtures__/nwsAlerts.json';

/** Each API host the services call, answered with its recorded fixture. */
const FIXTURES: Record<string, unknown> = {
  'api.open-meteo.com': forecast,
  'air-quality-api.open-meteo.com': air,
  'archive-api.open-meteo.com': archive,
  'geocoding-api.open-meteo.com': geocoding,
  'api.weather.gov': alerts,
};

/** When the fixtures were recorded (see their README), so "now" matches the data. */
const RECORDED_AT = new Date('2026-11-26T04:15:00Z');

/**
 * Answers every API call from the fixtures and blocks anything else that leaves the local
 * server. Returns the API URLs requested and any request that was blocked.
 */
async function offline(page: Page, origin: string) {
  const api: URL[] = [];
  const blocked: string[] = [];
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    const body = FIXTURES[url.host];
    if (body === undefined) {
      blocked.push(url.href);
      return route.abort('blockedbyclient');
    }
    api.push(url);
    return route.fulfill({
      json: body,
      headers: { 'access-control-allow-origin': '*' },
    });
  });
  return { api, blocked };
}

test('dashboard loads from fixtures and Change course finds a place', async ({ page, baseURL }) => {
  const net = await offline(page, new URL(baseURL!).origin);
  await page.clock.setFixedTime(RECORDED_AT);
  // Metric, to match the units the fixtures were recorded in.
  await page.addInitScript(() => {
    if (!localStorage.getItem('fore.settings'))
      localStorage.setItem(
        'fore.settings',
        JSON.stringify({ state: { units: 'metric' }, version: 1 }),
      );
  });

  await page.goto('/');

  // Hero: current temperature 5.8 °C, drizzle.
  await expect(page.getByText('6°C', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Light drizzle' })).toBeVisible();

  // Outlook: the nowcast from the 15-minute steps, then the line from the hourly forecast.
  await expect(page.getByText('Rain easing in about 60 min.', { exact: true })).toBeVisible();
  await expect(page.getByText('Dry for the next 18 hours.', { exact: true })).toBeVisible();

  // Scorecard: today's column reads as one sentence.
  await expect(
    page.getByRole('img', { name: 'Today, high 6, low 4, rain 10 percent, two over par' }),
  ).toBeVisible();

  // Change course: search, pick the Australian St Andrews, back on the dashboard.
  await page.getByRole('link', { name: /^Change course/ }).click();
  await page.getByLabel('Search for a place').fill('St Andrews');
  await page.getByRole('button', { name: 'St Andrews, New South Wales, Australia' }).click();
  await expect(
    page.getByRole('link', { name: 'Change course, now playing St Andrews' }),
  ).toBeVisible();
  await expect(page.getByText('New South Wales, Australia')).toBeVisible();

  const search = net.api.find((u) => u.host === 'geocoding-api.open-meteo.com');
  expect(search?.searchParams.get('name')).toBe('St Andrews');
  expect(net.api.filter((u) => u.host === 'api.open-meteo.com').length).toBeGreaterThanOrEqual(2);
  expect(net.blocked).toEqual([]);
});
