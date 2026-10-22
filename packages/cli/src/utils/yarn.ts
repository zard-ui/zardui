import { spawnSync, type SpawnSyncOptionsWithStringEncoding } from 'node:child_process';

/** `1.22.19` → 1, `4.5.0` → 4, `yarn/4.5.0 npm/?` → 4. `null` when there is no version in it. */
export function yarnMajorOf(version: string | null | undefined): number | null {
  const match = /(\d+)\.\d+/.exec(version ?? '');
  return match ? Number.parseInt(match[1], 10) : null;
}

/** Yarn Classic (1.x) has no `dlx`; Berry (2+) does. */
export function isYarnClassic(version: string | null | undefined): boolean {
  const major = yarnMajorOf(version);
  return major !== null && major < 2;
}

/**
 * The Yarn major that answers inside `cwd` — Berry is chosen per project (`packageManager`, `yarnPath`), so
 * the directory matters. Synchronous on purpose: it feeds the closing report, which is not async. `null`
 * when yarn is not there or says nothing readable.
 */
export function probeYarnMajor(cwd: string): number | null {
  try {
    const options: SpawnSyncOptionsWithStringEncoding = {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 15_000,
    };
    // `yarn` is a .cmd shim on Windows, found only through a shell. The command goes as one fixed string:
    // arguments next to `shell: true` are concatenated unescaped, which Node deprecates.
    const result =
      process.platform === 'win32'
        ? spawnSync('yarn --version', { ...options, shell: true })
        : spawnSync('yarn', ['--version'], options);
    return result.status === 0 ? yarnMajorOf(result.stdout) : null;
  } catch {
    return null;
  }
}
