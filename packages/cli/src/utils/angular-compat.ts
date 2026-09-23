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
export function pinForAngular(packageName: string, angularMajor: number | null): string {
  if (angularMajor === null) return packageName;

  if (TRACKS_ANGULAR_MAJOR.has(packageName)) return `${packageName}@^${angularMajor}`;

  const range = LAST_COMPATIBLE[packageName]?.[angularMajor];
  return range ? `${packageName}@${range}` : packageName;
}

/** `pinForAngular` over a batch, keeping the order the caller passed. */
export function pinAllForAngular(packageNames: Iterable<string>, angularVersion: string | null): string[] {
  const major = angularMajorOf(angularVersion);
  return Array.from(packageNames, name => pinForAngular(name, major));
}
