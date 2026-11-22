import { type ChangelogEntry } from './changelog-entry.interface';

export const SITE_URL = 'https://zardui.com';
export const RSS_PATH = '/rss.xml';

/** `]]>` would end the CDATA section early; split it across two sections. */
function cdata(text: string): string {
  return `<![CDATA[${text.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;
}

/**
 * The entry's publication day at midnight UTC. The entry dates are built from local calendar parts
 * (`new Date(2026, 10, 23)`), so the parts are read back the same way: the feed must not move an entry to the
 * previous day because the build machine sits west of Greenwich.
 */
function pubDate(date: Date): string {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toUTCString();
}

/**
 * The changelog as an RSS 2.0 feed, one item per entry pointing at the entry's own page — the same shape as
 * shadcn/ui's `/rss.xml`. Written to `apps/web/public/rss.xml` by `apps/web/generate-changelog-rss.mts`.
 */
export function buildChangelogRss(entries: readonly ChangelogEntry[]): string {
  const items = entries.map(entry => {
    const url = `${SITE_URL}/docs/changelog/${entry.meta.slug}`;
    return [
      '    <item>',
      `      <title>${cdata(`${entry.meta.month} - ${entry.meta.title}`)}</title>`,
      `      <link>${url}</link>`,
      `      <guid>${url}</guid>`,
      `      <description>${cdata(entry.overview.replace(/`/g, ''))}</description>`,
      `      <pubDate>${pubDate(entry.meta.date)}</pubDate>`,
      '    </item>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>zard/ui Changelog</title>',
    `    <link>${SITE_URL}/docs/changelog</link>`,
    '    <description>Latest updates and announcements from zard/ui: beautifully-designed, accessible Angular components inspired by shadcn/ui.</description>',
    '    <language>en-us</language>',
    `    <atom:link href="${SITE_URL}${RSS_PATH}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
}
