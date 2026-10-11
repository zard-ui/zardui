/**
 * Turns a component written with style markers into the chosen style's classes.
 *
 * The library's sources do not hard-code a look. Wherever the look matters they
 * carry a marker — `cn-button`, `cn-button-size-sm` — and a style is the table
 * that says what each marker stands for. The docs site resolves the markers in
 * CSS (so the visitor can switch live); the CLI resolves them here, once, while
 * writing the file. A project installed with `lyra` therefore ships plain
 * Tailwind classes and no runtime style switch.
 *
 *   const source = "cn-badge inline-flex cn-badge-variant-outline";
 *   transformStyle(source, 'lyra');
 *   // → "h-5 gap-1 rounded-none ... inline-flex border-border text-foreground"
 *
 * Only string literals are touched, so a marker in a comment or an identifier is
 * left alone, and the replacement is escaped for the quote it lands in — the
 * classes carry arbitrary values with quotes of their own (`[class*='size-']`).
 */

import { DEFAULT_STYLE, resolveStyle, type StyleId, type StyleSelection } from './ids.js';
import { LOCAL_STYLE_CATALOG } from './local-catalog.js';
import { menuMarkers, type MenuOptions } from './menu.js';
import type { StyleMarkers } from './parse-style-sheet.js';

/** Every style's markers. A catalog may hold only some of the styles. */
export type StyleCatalog = Readonly<Partial<Record<StyleId, StyleMarkers>>>;

export interface StyleTransformResult {
  content: string;
  /** Markers that no style defines — probably a typo in the source, left untouched. */
  unknown: string[];
}

const MARKER = /(?<![\w-])cn-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g;

// A private-use character: it cannot occur in a class list, and is not a control character.
const EMPTY = '';
const SWEEP = / ? ?/g;

type Quote = "'" | '"' | '`';

/**
 * Calls `visit` with the body of every string literal and keeps what it returns.
 *
 * A small lexer rather than a regex because the sources are TypeScript with
 * comments full of apostrophes ("don't") and templates that nest expressions.
 */
function mapStringLiterals(source: string, visit: (body: string, quote: Quote) => string): string {
  let out = '';
  let i = 0;
  // Brace depth of each open `${ … }`, so the `}` that closes it resumes the template.
  const templates: number[] = [];
  let depth = 0;
  // Whether the literal just read had a marker resolved in it.
  let changed = false;

  const readString = (quote: Quote): void => {
    let body = '';

    while (i < source.length) {
      const char = source[i];

      if (char === '\\') {
        body += char + (source[i + 1] ?? '');
        i += 2;
        continue;
      }
      if (char === quote) break;
      if (quote === '`' && char === '$' && source[i + 1] === '{') {
        const visited = visit(body, quote);
        changed ||= visited !== body;
        out += visited + '${';
        i += 2;
        templates.push(depth);
        depth += 1;
        return;
      }
      if (quote !== '`' && char === '\n') break;

      body += char;
      i += 1;
    }

    const visited = visit(body, quote);
    changed ||= visited !== body;
    out += visited;
    if (source[i] === quote) {
      out += quote;
      i += 1;
    }
  };

  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];

    if (char === '/' && next === '/') {
      const end = source.indexOf('\n', i);
      const stop = end === -1 ? source.length : end;
      out += source.slice(i, stop);
      i = stop;
    } else if (char === '/' && next === '*') {
      const end = source.indexOf('*/', i + 2);
      const stop = end === -1 ? source.length : end + 2;
      out += source.slice(i, stop);
      i = stop;
    } else if (char === "'" || char === '"' || char === '`') {
      const start = out.length;
      changed = false;
      out += char;
      i += 1;
      readString(char);

      // A class with a quote of its own (`[class*='size-']`) in a single-quoted literal
      // reads better double-quoted than escaped — what a formatter would do anyway.
      const literal = out.slice(start);
      if (
        changed &&
        char === "'" &&
        literal.length > 1 &&
        literal.endsWith("'") &&
        literal.includes("\\'") &&
        !literal.includes('"')
      ) {
        out = out.slice(0, start) + `"${literal.slice(1, -1).replace(/\\'/g, "'")}"`;
      }
    } else if (char === '{') {
      depth += 1;
      out += char;
      i += 1;
    } else if (char === '}') {
      depth -= 1;
      out += char;
      i += 1;
      if (templates.length > 0 && templates[templates.length - 1] === depth) {
        templates.pop();
        readString('`');
      }
    } else {
      out += char;
      i += 1;
    }
  }

  return out;
}

/** Escapes classes for the literal they are written into. */
function escapeFor(classes: string, quote: Quote): string {
  let escaped = classes.replace(/\\/g, '\\\\');

  if (quote === '`') return escaped.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  escaped = escaped.replace(new RegExp(quote, 'g'), `\\${quote}`);
  return escaped;
}

/**
 * Resolves the markers of `content` in `style`, reporting the ones nobody knows.
 *
 * A marker the style does not define stands for no classes — the style simply has
 * nothing to say about that part, as in a stylesheet. A marker defined by no
 * style at all is not a marker; it is left in place and reported.
 */
export function transformStyleReport(
  content: string,
  style: StyleSelection,
  catalog: StyleCatalog = LOCAL_STYLE_CATALOG,
  menu: MenuOptions = {},
): StyleTransformResult {
  const id = resolveStyle(style);
  // The menu look is not part of any style: it is resolved from `menuColor` / `menuAppearance`.
  const chosen: StyleMarkers = { ...(catalog[id] ?? {}), ...menuMarkers(menu) };
  const known = new Set<string>(Object.keys(menuMarkers()));
  for (const markers of Object.values(catalog)) for (const marker of Object.keys(markers ?? {})) known.add(marker);
  const unknown = new Set<string>();

  const transformed = mapStringLiterals(content, (body, quote) => {
    if (!body.includes('cn-')) return body;

    return body
      .replace(MARKER, (marker: string) => {
        if (!known.has(marker)) {
          unknown.add(marker);
          return marker;
        }

        // A marker with nothing to say leaves a sentinel, swept below together
        // with the space that separated it from its neighbours.
        return escapeFor(chosen[marker] ?? '', quote) || EMPTY;
      })
      .replace(SWEEP, (gap: string) => (gap.length === 3 ? ' ' : ''));
  });

  return { content: transformed, unknown: [...unknown].sort() };
}

/**
 * The component source in `style`'s classes.
 *
 * `css` is the legacy name of the default look and resolves to {@link DEFAULT_STYLE}.
 */
export function transformStyle(
  content: string,
  style: StyleSelection = DEFAULT_STYLE,
  catalog: StyleCatalog = LOCAL_STYLE_CATALOG,
  menu: MenuOptions = {},
): string {
  return transformStyleReport(content, style, catalog, menu).content;
}

/** The markers a source uses, in order of appearance. */
export function extractMarkers(content: string): string[] {
  const found = new Set<string>();

  mapStringLiterals(content, body => {
    for (const marker of body.match(MARKER) ?? []) found.add(marker);
    return body;
  });

  return [...found];
}
