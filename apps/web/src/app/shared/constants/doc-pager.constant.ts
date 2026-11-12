import { SECTIONS, SIDEBAR_PATHS, type NavItem, type NavSection } from './routes.constant';

export interface DocNeighbours {
  previous: NavItem | null;
  next: NavItem | null;
}

const isPage = (item: NavItem) => item.available && !item.external;

/**
 * The reading order of the docs, as the sidebar lists it.
 *
 * "Sections" only repeats shortcuts to pages listed further down, so it does not set the order:
 * the pages that live only there (Introduction, the components list, ...) open the sequence, and
 * every other page sits where its own section lists it. A page listed twice keeps its first place,
 * and external entries (`llms.txt`) are skipped, since they are files, not docs pages.
 */
export function buildDocSequence(sections: NavSection[] = SIDEBAR_PATHS, shortcuts: NavSection = SECTIONS): NavItem[] {
  const content = sections.filter(section => section !== shortcuts).flatMap(section => section.data.filter(isPage));
  const listed = new Set(content.map(item => item.path));
  const shortcutOnly = shortcuts.data.filter(item => isPage(item) && !listed.has(item.path));

  const seen = new Set<string>();
  return [...shortcutOnly, ...content].filter(item => {
    if (seen.has(item.path)) return false;
    seen.add(item.path);
    return true;
  });
}

/** Strips the query, the fragment and a trailing slash, so `/docs/x/?a#b` matches `/docs/x`. */
export function normalizeDocPath(url: string): string {
  const path = url.split(/[?#]/)[0];
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

export function findDocNeighbours(url: string, sequence: NavItem[] = DOC_SEQUENCE): DocNeighbours {
  const index = sequence.findIndex(item => item.path === normalizeDocPath(url));
  if (index === -1) return { previous: null, next: null };

  return {
    previous: sequence[index - 1] ?? null,
    next: sequence[index + 1] ?? null,
  };
}

export const DOC_SEQUENCE = buildDocSequence();
