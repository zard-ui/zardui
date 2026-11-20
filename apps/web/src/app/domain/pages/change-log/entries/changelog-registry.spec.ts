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

  it('carries a launch clip only on the v1 release and the create launch', () => {
    const withRelease = CHANGELOG_ENTRIES.filter(entry => entry.release).map(entry => entry.meta.id);
    expect(withRelease).toEqual(['11-2026-create', '09-2026']);
  });

  it('lists the newest entry first, even when it is newer than the release', () => {
    expect(CHANGELOG_ENTRIES[0].meta.slug).toBe('2026-11-create');
  });

  it('gives every entry a unique page slug that starts with its year and month', () => {
    const slugs = CHANGELOG_ENTRIES.map(entry => entry.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const { meta } of CHANGELOG_ENTRIES) {
      const month = String(meta.date.getMonth() + 1).padStart(2, '0');
      expect(meta.slug.startsWith(`${meta.date.getFullYear()}-${month}-`)).toBe(true);
      expect(meta.slug).toMatch(/^\d{4}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(meta.title.trim()).not.toBe('');
    }
  });
});
