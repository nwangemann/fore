import { courseVariant } from './variant';

describe('courseVariant', () => {
  it('follows the clock in plain weather', () => {
    expect(courseVariant(0, true)).toBe('day');
    expect(courseVariant(0, false)).toBe('night');
    expect(courseVariant(63, false)).toBe('night');
  });

  it('lets snow and storms win day or night', () => {
    expect(courseVariant(73, true)).toBe('frost');
    expect(courseVariant(85, false)).toBe('frost');
    expect(courseVariant(95, true)).toBe('storm');
    expect(courseVariant(99, false)).toBe('storm');
  });

  it('falls back to the clock for unknown codes', () => {
    expect(courseVariant(-1, true)).toBe('day');
  });
});
