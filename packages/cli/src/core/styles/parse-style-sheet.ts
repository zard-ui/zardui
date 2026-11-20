/**
 * Reads a style sheet back into the data the installer needs.
 *
 * A style is authored as CSS — `libs/zard/.../core/css/styles/style-<id>.css` —
 * because that is what the docs site imports to switch looks at runtime. The
 * same files are the source of the install-time data, so the two cannot drift:
 * every rule is one marker and one `@apply`,
 *
 *   .cn-button-size-sm { @apply h-7 gap-1 px-2.5; }
 *
 * and this turns that into `{ 'cn-button-size-sm': 'h-7 gap-1 px-2.5' }`.
 * A rule with nothing in it (`.cn-x { }`) is a marker the style deliberately has
 * no classes for — present in the table, as an empty string. A marker with
 * several rules (plain classes in the first pass, classes with a variant in the
 * second) is the rules joined.
 *
 * The selector may carry more than the marker (`.cn-x:not(:where(...) *)`, which
 * is how the default look stays exclusive); only the leading `.cn-*` class is read.
 */

/** Marker name → the utility classes it stands for, space separated. */
export type StyleMarkers = Readonly<Record<string, string>>;

const RULE = /(?:^|[}\s,])\.(cn-[a-z0-9]+(?:-[a-z0-9]+)*)(?![\w-])[^{};]*\{([^{}]*)\}/g;
const APPLY = /@apply\s+([^;]*?)\s*(?:;|$)/;

export function parseStyleSheet(css: string): StyleMarkers {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const markers: Record<string, string> = {};

  for (const match of withoutComments.matchAll(RULE)) {
    const [, marker, body] = match;
    const classes = (APPLY.exec(body)?.[1] ?? '').split(/\s+/).filter(Boolean);

    // A marker may have several rules — the sheets write classes with a variant in a
    // second pass, so Tailwind's "variants outrank plain classes" order survives the
    // trip through separate rules. Together they are the marker's classes.
    markers[marker] = [...(markers[marker] ? markers[marker].split(' ') : []), ...classes].join(' ');
  }

  return markers;
}
