/**
 * A component's documentation, read from its published page.
 *
 * The registry used to carry `docs` and `demos` inside each component's JSON.
 * Both are gone, for two reasons. The first is that `docs` was dead: it looked
 * for `overview.md`/`api.md`, which the library replaced with `api.ts`, and of
 * 46 documented components exactly one still had the old files — for the rest,
 * this server answered "no documentation". The second is that the page markdown
 * is simply better: installation, usage, examples with their code and the API
 * reference in one coherent document, which is how a model reads well, instead
 * of fragments of source in a JSON envelope.
 *
 * The base URL is configurable because a third-party registry has no such
 * pages; the official site is the default.
 */

import { fetchWithTimeout, HttpError } from '../utils/http.js';
import { assertRegistryId } from '../utils/identifiers.js';

const DOCS_TTL = 5 * 60 * 1000;

class DocsService {
  private cache = new Map<string, { text: string; timestamp: number }>();
  private llms: { text: string; timestamp: number } | null = null;

  private get baseUrl(): string {
    return (process.env['ZARD_DOCS_URL'] || 'https://zardui.com').replace(/\/+$/, '');
  }

  urlFor(name: string): string {
    // The name becomes a path, so it goes through the same validation as the
    // registry: without it, `../../something` would leave /docs/components and
    // bring back a different page.
    return `${this.baseUrl}/docs/components/${assertRegistryId(name, 'component')}`;
  }

  /**
   * The site's llms.txt, the index that both the catalog and the guides are
   * read from.
   *
   * Best effort: a third-party registry has no llms.txt, and search still works
   * on names alone, so a failure here yields an empty index, never an error.
   */
  private async getLlms(): Promise<string> {
    if (this.llms && Date.now() - this.llms.timestamp < DOCS_TTL) return this.llms.text;
    let text = '';
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/llms.txt`);
      if (response.ok) text = await response.text();
    } catch {
      // Offline or no llms.txt: names alone.
    }
    this.llms = { text, timestamp: Date.now() };
    return text;
  }

  /** Titles, descriptions and categories by component name. */
  async getCatalog(): Promise<Map<string, CatalogEntry>> {
    return parseCatalog(await this.getLlms());
  }

  /** The guide pages — installation, theming, forms… — by slug. */
  async getGuides(): Promise<Map<string, GuideEntry>> {
    return parseGuides(await this.getLlms());
  }

  /** The page markdown, or null when the page does not exist. */
  async getComponentMarkdown(name: string): Promise<string | null> {
    return this.fetchMarkdown(`${this.urlFor(name)}.md`);
  }

  /**
   * A guide page as markdown, or null when there is no such guide.
   *
   * Only slugs listed in llms.txt are fetched: the slug may contain a slash
   * (`forms/signal-forms`), so the allowlist, not a pattern, is what keeps it
   * from turning into an arbitrary path on the docs site.
   */
  async getGuideMarkdown(slug: string): Promise<string | null> {
    const guides = await this.getGuides();
    if (!guides.has(slug)) return null;
    return this.fetchMarkdown(`${this.baseUrl}/docs/${slug}.md`);
  }

  private async fetchMarkdown(url: string): Promise<string | null> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < DOCS_TTL) return cached.text;

    const response = await fetchWithTimeout(url);
    if (response.status === 404) return null;
    if (!response.ok) throw new HttpError(response);

    const text = await response.text();

    // The site is a single-page app: a path that does not exist answers 200
    // with the site's own shell, not 404. Without this check, asking for the
    // docs of a component that is not there handed fifty kB of markup to the
    // model — worse than no answer, since it burns context and explains
    // nothing.
    if (!isMarkdown(response, text)) return null;

    this.cache.set(url, { text, timestamp: Date.now() });
    return text;
  }
}

/**
 * Whether the response really is the page in markdown.
 *
 * The content-type decides when it is there — the site serves `text/markdown`
 * for the `.md` files and `text/html` for the app shell. When it is missing,
 * the start of the body breaks the tie: the generated page opens with front
 * matter or a heading, never with a tag.
 */
function isMarkdown(response: Response, body: string): boolean {
  const type = response.headers.get('content-type') ?? '';

  if (type.includes('text/markdown') || type.includes('text/plain')) return true;
  if (type.includes('text/html')) return false;

  return !/^\s*<(!doctype|html)/i.test(body);
}

/**
 * Cuts a level-two section out of the markdown, with its subsections.
 *
 * Runs to the next `## ` or to the end. It exists so that asking for examples
 * returns examples, rather than the whole document.
 */
export function sectionOf(markdown: string, heading: string): string | null {
  const lines = markdown.split('\n');
  const start = lines.findIndex(line => line.trim().toLowerCase() === `## ${heading.toLowerCase()}`);

  if (start === -1) return null;

  const rest = lines.slice(start + 1);
  const end = rest.findIndex(line => line.startsWith('## '));

  return [lines[start], ...(end === -1 ? rest : rest.slice(0, end))].join('\n').trim();
}

export interface CatalogEntry {
  title: string;
  description: string;
  category: string;
}

/**
 * The component entries of `llms.txt`: title, one-line description and category
 * for each slug.
 *
 * The registry carries names and files, nothing a model can search by meaning.
 * Someone asking for "a modal" or "toast notifications" needs to reach `dialog`
 * and `sonner`, and only the descriptions make that possible.
 */
export function parseCatalog(llms: string): Map<string, CatalogEntry> {
  const catalog = new Map<string, CatalogEntry>();
  let inComponents = false;
  let category = '';
  for (const line of llms.split('\n')) {
    if (line.startsWith('## ')) {
      inComponents = line.trim() === '## Components';
      continue;
    }
    if (!inComponents) continue;
    if (line.startsWith('### ')) {
      category = line.slice(4).trim();
      continue;
    }
    const match = /^- \[([^\]]+)\]\([^)]*\/docs\/components\/([a-z0-9-]+)\):\s*(.*)$/i.exec(line.trim());
    if (match) catalog.set(match[2], { title: match[1], description: match[3].trim(), category });
  }
  return catalog;
}

export interface GuideEntry {
  title: string;
  description: string;
}

/**
 * Sections of llms.txt that are about building the library, not using it. A
 * model writing an app has no use for the contribution guide or the credits,
 * and listing them only dilutes the choice.
 */
const NOT_GUIDES = /^(components|contribute)(\/|$)|^(changelog|about|figma)$/;

/** The `/docs/<slug>` entries of llms.txt that are guides for using the library. */
export function parseGuides(llms: string): Map<string, GuideEntry> {
  const guides = new Map<string, GuideEntry>();
  for (const line of llms.split('\n')) {
    const match = /^- \[([^\]]+)\]\([^)]*?\/docs\/([a-z0-9-]+(?:\/[a-z0-9-]+)*)\):\s*(.*)$/i.exec(line.trim());
    if (match && !NOT_GUIDES.test(match[2])) guides.set(match[2], { title: match[1], description: match[3].trim() });
  }
  return guides;
}

export const docsService = new DocsService();
