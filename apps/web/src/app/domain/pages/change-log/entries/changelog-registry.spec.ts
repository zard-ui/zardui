import { CHANGELOG_ENTRIES } from './changelog-registry';

describe('CHANGELOG_ENTRIES', () => {
  it('is sorted newest first', () => {
    for (let i = 1; i < CHANGELOG_ENTRIES.length; i++) {
      const previous = CHANGELOG_ENTRIES[i - 1].meta.date.getTime();
      const current = CHANGELOG_ENTRIES[i].meta.date.getTime();
      expect(previous).toBeGreaterThan(current);
    }
  });

  it('includes the backfilled 2026 months in the right chronological position', () => {
    const ids = CHANGELOG_ENTRIES.map(entry => entry.meta.id);
    expect(ids).toEqual(
      expect.arrayContaining(['01-2026', '02-2026', '04-2026', '03-2026', '05-2026', '07-2026', '08-2026']),
    );

    const indexOf = (id: string) => ids.indexOf(id);
    // Chronological order (newest first): Aug > Jul > May > Apr > Mar > Feb > Jan.
    expect(indexOf('08-2026')).toBeLessThan(indexOf('07-2026'));
    expect(indexOf('07-2026')).toBeLessThan(indexOf('05-2026'));
    expect(indexOf('05-2026')).toBeLessThan(indexOf('04-2026'));
    expect(indexOf('04-2026')).toBeLessThan(indexOf('03-2026'));
    expect(indexOf('03-2026')).toBeLessThan(indexOf('02-2026'));
    expect(indexOf('02-2026')).toBeLessThan(indexOf('01-2026'));
  });

  it('has no entry for June 2026 — the repository has zero commits that month', () => {
    const ids = CHANGELOG_ENTRIES.map(entry => entry.meta.id);
    expect(ids).not.toContain('06-2026');
  });

  it('has no duplicate ids', () => {
    const ids = CHANGELOG_ENTRIES.map(entry => entry.meta.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('carries the release banner data on exactly one entry, the newest', () => {
    const withRelease = CHANGELOG_ENTRIES.filter(entry => entry.release);
    expect(withRelease).toHaveLength(1);
    expect(withRelease[0].meta.id).toBe('09-2026');
    expect(CHANGELOG_ENTRIES[0].meta.id).toBe('09-2026');
  });

  it('every highlight icon is one of the eight values the closed union allows', () => {
    const allowed = new Set(['zap', 'terminal', 'moon', 'package', 'rocket', 'shield', 'code', 'settings']);
    for (const entry of CHANGELOG_ENTRIES) {
      for (const highlight of entry.highlights ?? []) {
        expect(allowed.has(highlight.icon)).toBe(true);
      }
    }
  });
});
