/**
 * create-parity / run — the whole regression check: real projects from the local CLI + local registry, then the pixel
 * comparison against the `/create` preview. `npm run check:create-parity -- [options]`
 *
 *   --projects <dir>   where the projects are made (default C:/zq/parity, else /tmp/zq-parity: keep it SHORT, Windows
 *                      over 260 characters break Nx / pnpm / esbuild; and outside OneDrive)
 *   --base <url>       a running docs server (default http://localhost:4201: `npm start`)
 *   --only a,b         a subset of the presets below, by name
 *   --keep             leave the projects in place (otherwise they are deleted when the run ends)
 *   (the rest goes to compare.mts: --themes, --items, --tolerance...)
 *
 * Needs `npm run build:cli` and `npm run build:registry` done first. The registry is served on 4223 for the run unless
 * something already listens there. The presets use Lucide icons on purpose: the /create examples import their icons
 * from `@ng-icons/lucide`, so another family would differ for a reason that has nothing to do with the styles.
 */
import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { connect } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const flag = (name: string): string | undefined => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

/** name → [preset code, extra `create` flags]. Chosen to cover the divergences found by the C3 validation. */
const PRESETS: Record<string, [string, string[]]> = {
  nova: ['Z0', []],
  vega: ['Z2qIUL', []],
  mira: ['Z5EEma2M8', []], // translucent menu, xs sizes with text-[0.625rem]
  lyra: ['Z6JzMdKaJ', ['--rtl']], // translucent + inverted menu, right to left
  sera: ['Z4q2bMOc', []], // tallest input / tabs
};

const projects = resolve(
  flag('projects') ?? (process.platform === 'win32' ? 'C:/zq/parity' : join(tmpdir(), 'zq-parity')),
);
const only = flag('only')?.split(',') ?? Object.keys(PRESETS);
const keep = args.includes('--keep');
const registryUrl = process.env['ZARD_REGISTRY_URL'] ?? 'http://localhost:4223/r';
const cli = join(root, 'packages/cli/dist/index.js');
const env = {
  ...process.env,
  ZARD_REGISTRY_URL: registryUrl,
  NG_FORCE_AUTOCOMPLETE: 'false',
  NG_CLI_ANALYTICS: 'false',
  NX_PLUGIN_NO_TIMEOUTS: 'true',
  CI: '1',
};

const listening = (port: number): Promise<boolean> =>
  new Promise(done => {
    const socket = connect(port, '127.0.0.1');
    socket.once('connect', () => (socket.destroy(), done(true)));
    socket.once('error', () => done(false));
  });

function run(command: string, argv: string[], cwd: string): void {
  const result = spawnSync(command, argv, {
    cwd,
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32' && command === 'npx',
  });
  if (result.status !== 0) throw new Error(`${command} ${argv.join(' ')} failed (${result.status})`);
}

async function main(): Promise<number> {
  if (!existsSync(cli)) throw new Error('packages/cli/dist is missing: run `npm run build:cli`');
  mkdirSync(projects, { recursive: true });

  let registry: ChildProcess | undefined;
  if (!(await listening(4223))) {
    registry = spawn(process.execPath, [join(root, 'node_modules/tsx/dist/cli.mjs'), 'scripts/serve-registry.cts'], {
      cwd: root,
      stdio: 'ignore',
    });
    while (!(await listening(4223))) await new Promise(r => setTimeout(r, 500));
  }

  try {
    for (const name of only) {
      const [preset, extra] = PRESETS[name] ?? [];
      if (!preset) throw new Error(`unknown preset name ${name}`);
      const dir = join(projects, name);
      if (!existsSync(join(dir, 'components.json'))) {
        run(
          'node',
          [
            cli,
            'create',
            name,
            '--template',
            'angular',
            '--preset',
            preset,
            '--package-manager',
            'npm',
            '--yes',
            ...extra,
          ],
          projects,
        );
        run('node', [cli, 'add', '--all', '--yes', '--overwrite'], dir);
      }
      run('npx', ['tsx', 'scripts/create-parity/prepare.mts', dir], root);
    }
    const compareArgs = [
      'tsx',
      'scripts/create-parity/compare.mts',
      '--projects',
      projects,
      '--only',
      only.join(','),
      ...args.filter(a => !['--keep'].includes(a)),
    ];
    const result = spawnSync('npx', compareArgs, {
      cwd: root,
      env,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    return result.status ?? 1;
  } finally {
    if (registry?.pid) {
      if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(registry.pid), '/T', '/F']);
      else registry.kill();
    }
    if (!keep) rmSync(projects, { recursive: true, force: true });
  }
}

main().then(
  code => process.exit(code),
  error => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  },
);
