import { detect } from '@antfu/ni';
import { isCapturing } from '@cli/ui/log-sink.js';
import { getConfig } from '@cli/utils/config.js';
import { logger } from '@cli/utils/logger.js';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import * as path from 'node:path';

type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

let cachedPackageManager: PackageManager | null = null;

const SUPPORTED: readonly PackageManager[] = ['npm', 'yarn', 'pnpm', 'bun'];

function asPackageManager(value: string | null | undefined): PackageManager | null {
  // `yarn@berry`, `pnpm@6`, `bun@1.3.14` — only the family matters.
  const name = value?.split('@')[0];
  return SUPPORTED.includes(name as PackageManager) ? (name as PackageManager) : null;
}

/**
 * Which manager the *project* uses.
 *
 * Order matters. `npm_config_user_agent` describes how the CLI was invoked
 * (`npx` always says npm), not what the project uses — trusting it first gave a
 * bun project `packageManager: "npm"` in its components.json and a
 * package-lock.json next to its bun.lock. The project answers for itself: the
 * package.json `packageManager` field first, then the lockfiles.
 */
export async function detectPackageManager(cwd: string = process.cwd()): Promise<PackageManager> {
  if (cachedPackageManager) return cachedPackageManager;

  const declared = asPackageManager(await readPackageManagerField(cwd));
  if (declared) return (cachedPackageManager = declared);

  const fromLockfile = asPackageManager(await detect({ programmatic: true, cwd }));
  if (fromLockfile) return (cachedPackageManager = fromLockfile);

  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.includes('bun')) return (cachedPackageManager = 'bun');
  if (userAgent.includes('pnpm')) return (cachedPackageManager = 'pnpm');
  if (userAgent.includes('yarn')) return (cachedPackageManager = 'yarn');

  return (cachedPackageManager = 'npm');
}

const RUNNER: Record<PackageManager, string> = {
  npm: 'npx',
  yarn: 'yarn dlx',
  pnpm: 'pnpm dlx',
  bun: 'bunx',
};

/**
 * How to suggest running the CLI again.
 *
 * A different question: not which manager the project installs dependencies
 * with, but how the CLI was just invoked. Someone who ran `npx zard-cli init`
 * in a bun project does not expect to finish reading `bunx` — and the `npx`
 * they already used works. Only when that cannot be known does the project's
 * manager answer.
 */
export function suggestedRunner(packageManager: PackageManager): string {
  const userAgent = process.env.npm_config_user_agent || '';

  if (userAgent.startsWith('bun')) return RUNNER.bun;
  if (userAgent.startsWith('pnpm')) return RUNNER.pnpm;
  if (userAgent.startsWith('yarn')) return RUNNER.yarn;
  if (userAgent.startsWith('npm')) return RUNNER.npm;

  return RUNNER[packageManager];
}

/** The package.json `packageManager` field — the Corepack standard, an explicit declaration. */
async function readPackageManagerField(cwd: string): Promise<string | null> {
  try {
    const manifest = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    return typeof manifest.packageManager === 'string' ? manifest.packageManager : null;
  } catch {
    return null;
  }
}

export async function getPackageManager(cwd: string = process.cwd()): Promise<'npm' | 'yarn' | 'pnpm' | 'bun'> {
  const config = await getConfig(cwd);
  return config?.packageManager ?? 'npm';
}

export async function getInstallCommand(packageManager: string, isDev = false): Promise<string[]> {
  switch (packageManager) {
    case 'yarn':
      return isDev ? ['add', '-D'] : ['add'];
    case 'pnpm':
      return isDev ? ['add', '-D'] : ['add'];
    case 'bun':
      return isDev ? ['add', '-d'] : ['add'];
    case 'npm':
    default:
      return isDev ? ['install', '-D'] : ['install'];
  }
}

/**
 * Work the manager does out of habit that the install itself does not need.
 *
 * The vulnerability audit sends the whole tree to the registry and waits for an
 * answer; in an Angular project, with over a thousand packages, that alone
 * accounts for several seconds of a call that installs half a dozen.
 */
function speedFlags(packageManager: PackageManager): string[] {
  return packageManager === 'npm' ? ['--no-audit', '--no-fund'] : [];
}

export async function installPackages(
  packages: string[],
  cwd: string,
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
  isDev = false,
  legacyPeerDeps = false,
  saveExact = false,
): Promise<void> {
  const { execa } = await import('execa');
  const installCmd = await getInstallCommand(packageManager, isDev);

  const args = [...installCmd, ...packages, ...speedFlags(packageManager)];

  if (saveExact) {
    args.push(packageManager === 'yarn' || packageManager === 'bun' ? '--exact' : '--save-exact');
  }

  if (legacyPeerDeps && packageManager === 'npm') {
    args.push('--legacy-peer-deps');
  }

  if (legacyPeerDeps && packageManager === 'pnpm') {
    args.push('--no-strict-peer-dependencies');
  }

  // With the interactive screen mounted, inheriting stdio would let the package
  // manager write over the frame. In that case the output is captured and only
  // shows up in debug mode; outside it, the behaviour stays "pass the output
  // through live".
  if (isCapturing()) {
    const command = `${packageManager} ${args.join(' ')}`;
    try {
      // stdin ignored, not piped: an open input pipe never sees EOF and the
      // package manager waits on it forever. Closing stdin also guarantees it
      // never opens a prompt, which would be invisible behind the full screen.
      const result = await execa(packageManager, args, {
        cwd,
        stdin: 'ignore',
        stdout: 'pipe',
        stderr: 'pipe',
      });
      logger.debug(`${command}\n${result.stdout}`);
    } catch (error) {
      // Without this the failure reaches the user as one generic line: the
      // package manager's real output stays in the sink and is printed with the
      // summary.
      logger.error(`${command} failed:\n${outputOf(error)}`);
      throw error;
    }
    return;
  }

  // stdin ignored here too. The install takes its packages as arguments and has
  // nothing to ask; inheriting a stdin that never closes (a pipe, CI, a
  // background job) leaves the manager waiting for an EOF that never comes —
  // output stays live because stdout and stderr are still inherited.
  await execa(packageManager, args, { cwd, stdin: 'ignore', stdout: 'inherit', stderr: 'inherit' });
}

function outputOf(error: unknown): string {
  const { stderr, stdout, message } = (error ?? {}) as { stderr?: string; stdout?: string; message?: string };
  return (stderr?.trim() || stdout?.trim() || message || String(error)).trim();
}

/** Only npm and pnpm can relax peer checking; elsewhere, retrying repeats the same failure. */
function canRelaxPeers(packageManager: PackageManager): boolean {
  return packageManager === 'npm' || packageManager === 'pnpm';
}

let peerRelaxationEngaged = false;

/**
 * Installs the batch and, if the manager rejects the tree over a peer conflict,
 * retries with the check relaxed.
 *
 * The fallback is remembered for the rest of the run: once the first batch
 * needed it, the following ones will need it for the same reason, and an
 * attempt already known to be doomed costs a full tree resolution.
 */
export async function installPackagesWithRetry(
  packages: string[],
  cwd: string,
  packageManager: PackageManager,
  isDev = false,
): Promise<void> {
  if (packages.length === 0) return;

  // `name@1.2.3` asks for that release and nothing else, but the managers save it as `^1.2.3` unless told
  // otherwise — which lets a pre-1.0 package drift on the next install. The flag is per command, not per
  // package, so the exact ones go in a batch of their own.
  const exact = packages.filter(isExactSpec);
  const ranged = packages.filter(spec => !isExactSpec(spec));

  if (exact.length && ranged.length) {
    await installBatch(ranged, cwd, packageManager, isDev, false);
    await installBatch(exact, cwd, packageManager, isDev, true);
    return;
  }

  await installBatch(packages, cwd, packageManager, isDev, exact.length > 0);
}

/** A spec that names one release (`ng-mapcn@22.0.0-beta.7`), as opposed to a range or a dist-tag. */
export function isExactSpec(spec: string): boolean {
  return /^(?:@[^/@]+\/)?[^/@]+@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(spec);
}

async function installBatch(
  packages: string[],
  cwd: string,
  packageManager: PackageManager,
  isDev: boolean,
  saveExact: boolean,
): Promise<void> {
  if (peerRelaxationEngaged) {
    await installPackages(packages, cwd, packageManager, isDev, true, saveExact);
    return;
  }

  try {
    await installPackages(packages, cwd, packageManager, isDev, false, saveExact);
  } catch (error) {
    if (!canRelaxPeers(packageManager)) throw error;

    logger.warn('Installation failed, retrying with relaxed peer dependency resolution...');
    await installPackages(packages, cwd, packageManager, isDev, true, saveExact);
    peerRelaxationEngaged = true;
  }
}

/**
 * Drops from the batch the packages the project already declares and resolves.
 *
 * The manager charges a lot per invocation — it revalidates the whole tree even
 * when there is nothing to do — so the win is not in making the install faster
 * but in not calling it. An `add` in an already-initialized project asks for
 * exactly the dependencies `init` put there.
 *
 * The filter is deliberately conservative: when in doubt the package stays in
 * the batch and the manager decides. Comparing only the major is enough because
 * the versions the CLI asks for are always of the form `^N`.
 */
export async function filterInstalledPackages(packages: string[], cwd: string): Promise<string[]> {
  const declared = await readDeclaredDependencies(cwd);
  if (!declared) return packages;

  return packages.filter(spec => {
    const { name, range } = parseSpec(spec);
    const declaredRange = declared[name];

    if (!declaredRange) return true;
    if (!isResolvable(name, cwd)) return true;
    if (range && majorOf(range) !== majorOf(declaredRange)) return true;
    // Same major, older release: `maplibre-gl@^6.11.2` is not met by a declared `^6.0.0`, and a pinned
    // `ng-mapcn@22.0.0-beta.7` is not met by `22.0.0-beta.5`.
    if (range && isBelow(declaredRange, range)) return true;

    return false;
  });
}

/** The numeric `major.minor.patch` a range starts at, ignoring operators and pre-release tags. */
function floorOf(range: string): [number, number, number] | null {
  const match = /(\d+)(?:\.(\d+))?(?:\.(\d+))?/.exec(range);
  return match ? [Number(match[1]), Number(match[2] ?? 0), Number(match[3] ?? 0)] : null;
}

/** Whether what the project declares starts below what is wanted — within the same major, or at all. */
function isBelow(declaredRange: string, wantedRange: string): boolean {
  const declared = floorOf(declaredRange);
  const wanted = floorOf(wantedRange);
  if (!declared || !wanted) return false;

  for (let index = 0; index < 3; index++) {
    if (declared[index] !== wanted[index]) return declared[index] < wanted[index];
  }

  // Same numbers: only a pre-release tag can still tell them apart, and only an exact pin cares.
  return isExactSpec(`x@${wantedRange}`) && declaredRange.replace(/^[\^~]/, '') !== wantedRange;
}

export interface OutdatedInstall {
  name: string;
  wanted: string;
  installed: string;
}

/**
 * The packages whose installed release has an older major than the one asked for.
 *
 * The package manager can "succeed" and still leave the old one: a peer conflict relaxed by the retry, or a
 * lockfile that wins. For most packages that is a warning in the build; for the ones an item cannot work without
 * (MapLibre 5 where ng-mapcn 22 needs 6) it is a blank screen, so the caller stops with a message instead.
 */
export async function findOutdatedInstalls(specs: readonly string[], cwd: string): Promise<OutdatedInstall[]> {
  const outdated: OutdatedInstall[] = [];

  for (const spec of specs) {
    const { name, range } = parseSpec(spec);
    const wantedMajor = range ? Number(majorOf(range)) : NaN;
    if (Number.isNaN(wantedMajor)) continue;

    const installed = await readInstalledVersion(name, cwd);
    if (installed && Number(majorOf(installed)) < wantedMajor)
      outdated.push({ name, wanted: range as string, installed });
  }

  return outdated;
}

async function readInstalledVersion(name: string, cwd: string): Promise<string | null> {
  let dir = path.resolve(cwd);

  for (;;) {
    try {
      const manifest = JSON.parse(await readFile(path.join(dir, 'node_modules', name, 'package.json'), 'utf8'));
      if (typeof manifest.version === 'string') return manifest.version;
    } catch {
      // Not here: look one level up, where a workspace hoists it.
    }

    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function parseSpec(spec: string): { name: string; range: string | null } {
  // The `@` in `@ng-icons/core` opens the scope, not the version — hence the last one.
  const separator = spec.lastIndexOf('@');
  if (separator <= 0) return { name: spec, range: null };

  return { name: spec.slice(0, separator), range: spec.slice(separator + 1) };
}

function majorOf(range: string): string | null {
  return /(\d+)/.exec(range)?.[1] ?? null;
}

async function readDeclaredDependencies(cwd: string): Promise<Record<string, string> | null> {
  try {
    const manifest = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    return { ...manifest.dependencies, ...manifest.devDependencies };
  } catch {
    return null;
  }
}

/** node_modules can sit above the project — workspaces hoist everything to the root. */
function isResolvable(name: string, cwd: string): boolean {
  let dir = path.resolve(cwd);

  for (;;) {
    if (existsSync(path.join(dir, 'node_modules', name))) return true;

    const parent = path.dirname(dir);
    if (parent === dir) return false;
    dir = parent;
  }
}
