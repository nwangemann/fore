import type { Place } from '@/core/place/place';
import alerts from './__fixtures__/nwsAlerts.json';
import { mockFetch, requestedUrl } from './__fixtures__/mockFetch';
import { fetchAlerts } from './nws';

const nationalMall: Place = {
  name: 'Washington',
  detail: 'District of Columbia, United States',
  latitude: 38.8895,
  longitude: -77.0353,
  countryCode: 'US',
};

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('fetchAlerts', () => {
  it('reads active alerts for the point', async () => {
    const fetchMock = mockFetch(alerts);
    const list = await fetchAlerts(nationalMall);

    expect(requestedUrl(fetchMock).searchParams.get('point')).toBe('38.8895,-77.0353');
    expect(list.map((a) => [a.event, a.severity])).toEqual([
      ['Coastal Flood Warning', 'Severe'],
      ['Wind Advisory', 'Moderate'],
    ]);
    const first = list[0];
    expect(first?.id).toMatch(/^https:\/\/api\.weather\.gov\/alerts\//);
    expect(first?.headline).toMatch(/Coastal Flood Warning issued/);
    expect(first?.ends).toBe('2026-11-27T03:00:00-05:00');
    expect(first?.description).not.toBe('');
    expect(first?.instruction).not.toBe('');
  });

  it('skips places outside the US without a request', async () => {
    const fetchMock = mockFetch(alerts);
    expect(await fetchAlerts({ ...nationalMall, countryCode: 'GB' })).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
