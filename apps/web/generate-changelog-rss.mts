/**
 * Writes `public/rss.xml`, the changelog feed, from CHANGELOG_ENTRIES: one item per entry, linking to its page.
 * The feed is committed, and `apps/web/src/app/domain/pages/change-log/entries/changelog-rss.spec.ts` fails when
 * an entry changes without it.
 *
 *   npx tsx --tsconfig apps/web/tsconfig.generate.json apps/web/generate-changelog-rss.mts
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const { CHANGELOG_ENTRIES } = await import('./src/app/domain/pages/change-log/entries/changelog-registry');
const { buildChangelogRss } = await import('./src/app/domain/pages/change-log/entries/changelog-rss');

const RSS_FILE = resolve('apps/web/public/rss.xml');
writeFileSync(RSS_FILE, buildChangelogRss(CHANGELOG_ENTRIES));
console.log(`✅ Wrote ${CHANGELOG_ENTRIES.length} changelog entries to ${RSS_FILE}`);
