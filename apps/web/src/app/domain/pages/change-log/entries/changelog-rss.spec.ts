import { readFileSync } from 'node:fs';
import * as path from 'node:path';

import { CHANGELOG_ENTRIES } from './changelog-registry';
import { buildChangelogRss } from './changelog-rss';

describe('buildChangelogRss', () => {
  const feed = buildChangelogRss(CHANGELOG_ENTRIES);

  it('has one item per entry, linking to its page', () => {
    expect(feed.match(/<item>/g)).toHaveLength(CHANGELOG_ENTRIES.length);
    expect(feed).toContain('<link>https://zardui.com/docs/changelog/2026-11-create</link>');
    expect(feed).toContain('<title><![CDATA[November 2026 - Create]]></title>');
  });

  it('dates each item on its calendar day, in UTC', () => {
    expect(feed).toContain('<pubDate>Mon, 23 Nov 2026 00:00:00 GMT</pubDate>');
  });

  it('keeps a CDATA terminator inside the text from closing the section', () => {
    const [entry] = CHANGELOG_ENTRIES;
    const xml = buildChangelogRss([{ ...entry, overview: 'a ]]> b' }]);
    expect(xml).toContain('<description><![CDATA[a ]]]]><![CDATA[> b]]></description>');
  });

  // The feed is committed: an entry added or edited without running `npm run generate:rss` would go out stale.
  it('matches the committed public/rss.xml', () => {
    const committed = readFileSync(path.join(__dirname, '../../../../../../public/rss.xml'), 'utf8');
    expect(committed.replace(/\r\n/g, '\n')).toBe(feed);
  });
});
