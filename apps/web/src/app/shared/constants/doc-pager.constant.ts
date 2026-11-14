import { SIDEBAR_PATHS, type NavItem, type NavSection } from './routes.constant';

export interface DocNeighbours {
  previous: NavItem | null;
  next: NavItem | null;
}

const isPage = (item: NavItem) => item.available && !item.external;

/**
 * The reading order of the docs: the sidebar, top to bottom.
 *
 * A page the sidebar lists twice (a shortcut under "Sections" and its own entry further down) keeps the place
 * where it first appears, since a page can only have one previous and one next. External entries (`llms.txt`)
 * are skipped: they are files, not docs pages.
 */
export function buildDocSequence(sections: NavSection[] = SIDEBAR_PATHS): NavItem[] {
  const seen = new Set<string>();
  return sections
    .flatMap(section => section.data.filter(isPage))
    .filter(item => {
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
