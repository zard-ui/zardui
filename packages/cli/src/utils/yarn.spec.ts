import { isYarnClassic, yarnMajorOf } from '@cli/utils/yarn.js';

describe('yarnMajorOf', () => {
  it.each([
    ['1.22.19', 1],
    ['4.5.0', 4],
    ['yarn/4.5.0', 4],
    ['3.6.4\n', 3],
  ])('reads the major out of %j', (version, major) => {
    expect(yarnMajorOf(version)).toBe(major);
  });

  it('is null when there is no version', () => {
    expect(yarnMajorOf('')).toBeNull();
    expect(yarnMajorOf(null)).toBeNull();
    expect(yarnMajorOf('not found')).toBeNull();
  });
});

describe('isYarnClassic', () => {
  it('is true only for a readable 1.x', () => {
    expect(isYarnClassic('1.22.19')).toBe(true);
    expect(isYarnClassic('4.5.0')).toBe(false);
    expect(isYarnClassic(null)).toBe(false);
  });
});
