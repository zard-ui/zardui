/**
 * Icons — what the components draw, and how that changes with the family.
 *
 * Everything here works off a catalog: the pair (declared families, translation
 * table). The local catalog is the bundled copy; the one that counts at runtime
 * comes from `<registry>/icons.json`. That indirection is what makes "support
 * material" a matter of publishing one more column in the registry, with no CLI
 * release and no hunting for `lucide` through the code.
 *
 *   `extractIcons`    reads which icons a source uses (the registry publishes this)
 *   `retargetIcons`   rewrites a source from one family to another (install uses it)
 *   `iconPackagesFor` says which packages the project needs (init uses it)
 */

import {
  ICON_CORE_PACKAGE,
  ICON_FAMILIES,
  SOURCE_ICON_FAMILY,
  type IconFamily,
  type IconFamilyInfo,
} from './families.js';
import { ICON_MAP } from './icon-map.js';

export {
  ICON_CORE_PACKAGE,
  ICON_FAMILIES,
  SOURCE_ICON_FAMILY,
  type IconFamily,
  type IconFamilyInfo,
} from './families.js';
export { ICON_MAP } from './icon-map.js';

/** An icon by what it means: `check`, `chevron-down`. */
export type IconToken = string;

/**
 * The declared families and the table that translates between them.
 *
 * `icons` is keyed by token and then by family — the same shape as
 * `icon-map.ts`, which is the local copy of this same data.
 */
export interface IconCatalog {
  readonly families: Readonly<Record<string, IconFamilyInfo>>;
  readonly icons: Readonly<Record<string, Readonly<Record<string, string>>>>;
}

/** The catalog bundled with the CLI — used when the registry does not answer. */
export const LOCAL_ICON_CATALOG: IconCatalog = { families: ICON_FAMILIES, icons: ICON_MAP };

/** A list of icons in both forms: as the code writes them, and as the table names them. */
export interface IconList {
  /** The symbols as they appear in the code (`lucideCheck`). */
  readonly symbols: string[];
  /** The same icons under the table's neutral key (`check`). */
  readonly tokens: IconToken[];
}

/**
 * A component's icons, in the shape the registry publishes them.
 *
 * The two lists are separate because they serve different things: `symbols` and
 * `tokens` are what `add` writes into the project — the ng-icons dependency
 * comes from them — while `demos` are the icons that only appear in the
 * documentation examples. A component can draw no icon at all and still have
 * demos full of them, and switching family has to reach both.
 */
export interface ComponentIcons extends IconList {
  /** The family the published files are written in. */
  readonly family: IconFamily;
  readonly demos: IconList;
}

/**
 * Reverse symbol → token index, built per catalog and memoized.
 *
 * The remote catalog is a single object, fetched once per run, so a weak key is
 * enough and the index is not rebuilt for every installed file.
 */
const reverseIndexes = new WeakMap<IconCatalog, Map<string, Map<string, IconToken>>>();

function reverseIndex(catalog: IconCatalog, family: IconFamily): Map<string, IconToken> {
  let byFamily = reverseIndexes.get(catalog);

  if (!byFamily) {
    byFamily = new Map();

    for (const [token, symbols] of Object.entries(catalog.icons)) {
      for (const [name, symbol] of Object.entries(symbols)) {
        const index = byFamily.get(name) ?? new Map<string, IconToken>();
        index.set(symbol, token);
        byFamily.set(name, index);
      }
    }

    reverseIndexes.set(catalog, byFamily);
  }

  return byFamily.get(family) ?? new Map();
}

export function iconFamilies(catalog: IconCatalog = LOCAL_ICON_CATALOG): string[] {
  return Object.keys(catalog.families).sort();
}

export function isIconFamily(value: string, catalog: IconCatalog = LOCAL_ICON_CATALOG): boolean {
  return Object.prototype.hasOwnProperty.call(catalog.families, value);
}

export function iconFamily(family: IconFamily, catalog: IconCatalog = LOCAL_ICON_CATALOG): IconFamilyInfo | undefined {
  return catalog.families[family];
}

/** The npm packages a project configured with this family needs. */
export function iconPackagesFor(family: IconFamily, catalog: IconCatalog = LOCAL_ICON_CATALOG): string[] {
  const info = iconFamily(family, catalog);
  return info ? [ICON_CORE_PACKAGE, info.package] : [ICON_CORE_PACKAGE];
}

export function tokenFor(
  symbol: string,
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): IconToken | undefined {
  return reverseIndex(catalog, family).get(symbol);
}

export function symbolFor(
  token: IconToken,
  family: IconFamily,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): string | undefined {
  return catalog.icons[token]?.[family];
}

/** Tokens that have no symbol declared in this family yet. */
export function missingTokensFor(family: IconFamily, catalog: IconCatalog = LOCAL_ICON_CATALOG): IconToken[] {
  return Object.keys(catalog.icons).filter(token => symbolFor(token, family, catalog) === undefined);
}

/**
 * `import { lucideCheck, lucideX } from '@ng-icons/lucide'` — on one line or
 * several, with a leading `type` or aliased. What matters is the package (which
 * gives the family) and the names imported from it.
 */
const ICON_IMPORT = /import\s*(?:type\s+)?\{([^}]*)\}\s*from\s*['"]@ng-icons\/([a-z0-9-]+)['"]/g;

function familyByPackageSuffix(suffix: string, catalog: IconCatalog): IconFamily | undefined {
  return Object.keys(catalog.families).find(name => catalog.families[name]?.package === `@ng-icons/${suffix}`);
}

/**
 * The icon symbols a source imports.
 *
 * Only the import counts. A stray `name="lucideCheck"` in a template draws
 * nothing without the matching `provideIcons`, so the import is at once the
 * complete list and the list without false positives — `@ng-icons/core`
 * (NgIcon, provideIcons, IconName) is left out because it is not a family.
 */
export function extractIcons(
  source: string,
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): string[] {
  const found = new Set<string>();

  for (const match of source.matchAll(ICON_IMPORT)) {
    if (familyByPackageSuffix(match[2] ?? '', catalog) !== family) continue;

    for (const specifier of (match[1] ?? '').split(',')) {
      // `type Foo`, `Foo as Bar` — the package's symbol is always the first name.
      const name = specifier
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        ?.trim();
      if (name) found.add(name);
    }
  }

  return [...found].sort();
}

/** The icons of a set of files, in both forms. */
export function listIcons(
  sources: readonly string[],
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): IconList {
  const symbols = new Set<string>();

  for (const source of sources) {
    for (const symbol of extractIcons(source, family, catalog)) symbols.add(symbol);
  }

  const sorted = [...symbols].sort();

  return {
    symbols: sorted,
    tokens: sorted
      .map(symbol => tokenFor(symbol, family, catalog))
      .filter((token): token is IconToken => token !== undefined),
  };
}

/**
 * A component's icon mapping, ready for the registry.
 *
 * It comes back filled in even when there is no icon at all: the field always
 * being present is what tells "this component draws no icons" apart from "this
 * registry was published before the mapping existed", so a reader never has to
 * guess which of the two it is.
 */
export function collectIcons(
  files: readonly string[],
  demos: readonly string[] = [],
  family: IconFamily = SOURCE_ICON_FAMILY,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): ComponentIcons {
  return {
    family,
    ...listIcons(files, family, catalog),
    demos: listIcons(demos, family, catalog),
  };
}

export interface RetargetResult {
  readonly content: string;
  /** Symbols the target family does not declare — left untouched. */
  readonly missing: string[];
}

/**
 * Rewrites a source from one icon family to another.
 *
 * Two swaps: the package the symbols come from, and each symbol itself. A symbol
 * is replaced wherever it appears — the import, the `provideIcons({ lucideCheck })`
 * and the template's `name="lucideCheck"` are the same word, and the object
 * shorthand stays valid after the swap.
 *
 * A symbol with no equivalent in the target family is not invented: it stays as
 * it is and comes back in `missing`, so the caller can warn instead of writing
 * an import that does not resolve.
 */
export function retargetIcons(
  source: string,
  from: IconFamily,
  to: IconFamily,
  catalog: IconCatalog = LOCAL_ICON_CATALOG,
): RetargetResult {
  const origin = iconFamily(from, catalog);
  const target = iconFamily(to, catalog);

  if (from === to || !origin || !target) return { content: source, missing: [] };

  const missing: string[] = [];
  const replacements = new Map<string, string>();

  for (const symbol of extractIcons(source, from, catalog)) {
    const token = tokenFor(symbol, from, catalog);
    const replacement = token !== undefined ? symbolFor(token, to, catalog) : undefined;

    if (replacement === undefined) missing.push(symbol);
    else replacements.set(symbol, replacement);
  }

  if (replacements.size === 0) return { content: source, missing };

  return { content: rewriteIcons(source, origin.package, target.package, replacements), missing };
}

/**
 * The mechanical half of the swap, separated from whatever decides what to swap.
 *
 * It is exported because this is where rewriting bugs live — whole-word
 * replacement and the order of the alternation — and because testing it does
 * not require more than one declared family.
 */
export function rewriteIcons(
  source: string,
  fromPackage: string,
  toPackage: string,
  replacements: ReadonlyMap<string, string>,
): string {
  if (replacements.size === 0) return source;

  // The alternation is tried in written order, so the long names come first:
  // with `lucideClock` in front, `lucideClock2` would be matched from its prefix
  // and only the trailing `\b` would save it — cheaper not to rely on that.
  const pattern = new RegExp(`\\b(${[...replacements.keys()].sort((a, b) => b.length - a.length).join('|')})\\b`, 'g');

  return source
    .replace(
      new RegExp(`(['"])${escapeRegExp(fromPackage)}\\1`, 'g'),
      (_match, quote: string) => `${quote}${toPackage}${quote}`,
    )
    .replace(pattern, symbol => replacements.get(symbol) ?? symbol);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
