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

import { assertRegistryId } from '../utils/identifiers.js';

const DOCS_TTL = 5 * 60 * 1000;
const FETCH_TIMEOUT = 10_000;

class DocsService {
  private cache = new Map<string, { text: string; timestamp: number }>();

  private get baseUrl(): string {
    return (process.env['ZARD_DOCS_URL'] || 'https://zardui.com').replace(/\/+$/, '');
  }

  urlFor(name: string): string {
    // The name becomes a path, so it goes through the same validation as the
    // registry: without it, `../../something` would leave /docs/components and
    // bring back a different page.
    return `${this.baseUrl}/docs/components/${assertRegistryId(name, 'component')}`;
  }

  /** The page markdown, or null when the page does not exist. */
  async getComponentMarkdown(name: string): Promise<string | null> {
    const url = `${this.urlFor(name)}.md`;

    const cached = this.cache.get(name);
    if (cached && Date.now() - cached.timestamp < DOCS_TTL) return cached.text;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'zard-mcp' },
      });

      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const text = await response.text();

      // The site is a single-page app: a path that does not exist answers 200
      // with the site's own shell, not 404. Without this check, asking for the
      // docs of a component that is not there handed fifty kB of markup to the
      // model — worse than no answer, since it burns context and explains
      // nothing.
      if (!isMarkdown(response, text)) return null;

      this.cache.set(name, { text, timestamp: Date.now() });
      return text;
    } finally {
      clearTimeout(timeout);
    }
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

export const docsService = new DocsService();
