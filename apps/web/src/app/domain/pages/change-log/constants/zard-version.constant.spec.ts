import { ZARD_VERSION } from './zard-version.constant';

describe('ZARD_VERSION', () => {
  it('reads a semver-shaped string from libs/zard/package.json', () => {
    expect(typeof ZARD_VERSION).toBe('string');
    expect(ZARD_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });
});
