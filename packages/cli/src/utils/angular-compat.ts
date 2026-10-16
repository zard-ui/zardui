/**
 * Pins the dependencies whose releases are tied to an Angular major.
 *
 * Zard supports Angular 19 and above, but several of the packages it installs
 * ship one release per Angular major and peer on `>=` that major. Asking for
 * them by name resolves to `latest`, which peers on an Angular newer than the
 * project's: npm then fails the whole install with ERESOLVE, and the retry with
 * `--legacy-peer-deps` "succeeds" while leaving a version that cannot compile.
 */

/** Packages whose own major is the Angular major, so the pin is arithmetic. */
const TRACKS_ANGULAR_MAJOR = new Set(['@angular/cdk', 'embla-carousel-angular', 'ngx-echarts']);

/**
 * The newest release of a package that still accepts a given Angular major, for
 * the packages that version on their own schedule.
 *
 * Entries are only ever needed for a superseded Angular major, and those never
 * go stale: once Angular N is behind us, the last release built for it is
 * history. The current major is deliberately absent — it falls through
 * unconstrained to `latest`, which is the release made for it. So when Angular
 * N+1 ships, N gets its entry here.
 */
const LAST_COMPATIBLE: Record<string, Record<number, string>> = {
  '@ng-icons/core': { 19: '^31', 20: '^32', 21: '^34' },
  '@ng-icons/lucide': { 19: '^31', 20: '^32', 21: '^34' },
  // ng-mapcn publishes only pre-releases, and a caret range never matches one: `ng-mapcn@^21` is ETARGET.
  // So its lines are exact versions, one per Angular major it was built for (npm view ng-mapcn peerDependencies):
  //   18.0.0-beta.4  peers Angular ^18.2.14
  //   21.0.0-beta.7  peers Angular ^21.2.9
  //   22.x           peers Angular ^22 — the current line, so it is the registry's own spec and is absent here.
  // Angular 19 and 20 have no line of their own; the 18 one is the nearest (a partial-Ivy library keeps working on
  // a newer major), and the peer mismatch is what the install's relaxed retry exists for.
  'ng-mapcn': { 19: '18.0.0-beta.4', 20: '18.0.0-beta.4', 21: '21.0.0-beta.7' },
  // Before ng-mapcn 22, MapLibre came in as the library's own dependency, at ^5.16 and with no worker files to copy.
  // Declaring the same line keeps `maplibre-gl/dist/maplibre-gl.css` resolvable from the app under a strict
  // node_modules (pnpm), without a second copy of the engine.
  'maplibre-gl': { 19: '^5.16.0', 20: '^5.16.0', 21: '^5.16.0' },
};

/** The major of an Angular version string, or null when it could not be read. */
export function angularMajorOf(angularVersion: string | null | undefined): number | null {
  if (!angularVersion) return null;

  const major = Number.parseInt(angularVersion.split('.')[0] as string, 10);
  return Number.isNaN(major) ? null : major;
}

/**
 * The install specifier for one package.
 *
 * Returns the name unchanged whenever nothing is known to constrain it — an
 * unrecognized package, or an Angular major this package has no history for.
 */
export function pinForAngular(spec: string, angularMajor: number | null): string {
  if (angularMajor === null) return spec;

  // A registry item may already carry a version (`ng-mapcn@22.0.0-beta.7`): the lookups are by name.
  const { name, version } = splitSpec(spec);

  // The table wins over the item's own version: the item is written for the current Angular major,
  // and the table is what says which release an older one still accepts.
  const range = LAST_COMPATIBLE[name]?.[angularMajor];
  if (range) return `${name}@${range}`;

  // A bare name tracks the Angular major; one that already names a version was chosen by the item.
  if (TRACKS_ANGULAR_MAJOR.has(name) && !version) return `${name}@^${angularMajor}`;

  return spec;
}

/** `@scope/pkg@^1` → `{ name: '@scope/pkg', version: '^1' }`; the `@` opening a scope is not a version. */
export function splitSpec(spec: string): { name: string; version: string | null } {
  const separator = spec.lastIndexOf('@');
  if (separator <= 0) return { name: spec, version: null };

  return { name: spec.slice(0, separator), version: spec.slice(separator + 1) };
}

/** `pinForAngular` over a batch, keeping the order the caller passed. */
export function pinAllForAngular(packageNames: Iterable<string>, angularVersion: string | null): string[] {
  const major = angularMajorOf(angularVersion);
  return Array.from(packageNames, name => pinForAngular(name, major));
}
