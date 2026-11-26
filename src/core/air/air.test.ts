import { aqiBand, parseAir } from './air';

describe('parseAir', () => {
  it('keeps only pollen species with values', () => {
    const a = parseAir({ current: { us_aqi: 30, grass_pollen: 12, birch_pollen: null } });
    expect(a.usAqi).toBe(30);
    expect(a.pollen).toEqual([{ key: 'grass_pollen', name: 'Grass', value: 12 }]);
  });

  it('bands AQI at the EPA edges', () => {
    expect(aqiBand(50).label).toBe('Good');
    expect(aqiBand(51).label).toBe('Moderate');
    expect(aqiBand(301).label).toBe('Hazardous');
  });
});
