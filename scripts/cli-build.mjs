/**
 * Builds zard-cli — same behaviour on Linux, macOS, Git Bash, PowerShell and cmd.
 *
 * Replaces the chain of shell commands the Nx target used to run (`rm -rf`,
 * `sed -i`, `chmod`, `cp`), which only worked on POSIX.
 *
 * Two Windows traps shape the design here:
 *   - `npx`/`npm` are `.cmd`, and since the CVE-2024-27980 fix Node refuses to
 *     run them without a shell. So the binaries are resolved inside node_modules
 *     and executed with Node itself.
 *   - `npm link` has no JS equivalent, so it is the one call that goes through a
 *     shell — with no dynamic arguments, and therefore no injection risk.
 *
 * Usage:
 *   node scripts/cli-build.mjs --registry <url> --package <file> [--link]
 */

import { execFileSync, execSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CLI = join(ROOT, 'packages', 'cli');
const DIST = join(CLI, 'dist');
const TSCONFIG = 'packages/cli/tsconfig.build.json';

const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = { link: false };
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    if (flag === '--link') args.link = true;
    else if (flag === '--registry') args.registry = argv[++index];
    else if (flag === '--package') args.package = argv[++index];
  }

  if (!args.registry) throw new Error('Missing --registry <url>');
  if (!args.package) throw new Error('Missing --package <file>');

  args.registry = validateRegistry(args.registry);
  return args;
}

/**
 * The registry URL goes into the published artifact, so it is validated first.
 *
 * Two things a typo in the build command would produce in silence: a value that
 * is not a URL at all, which would only fail on the installing user's machine;
 * and a quote in the middle, which would break the generated `.js` file, since
 * the placeholder lives inside a string literal.
 */
function validateRegistry(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`--registry must be a URL, got: ${value}`);
  }

  if (url.protocol !== 'https:' && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
    throw new Error(`--registry must use https (or localhost for development), got: ${value}`);
  }

  // No trailing slash: the code builds `${base}/registry.json`.
  return url.href.replace(/\/+$/, '');
}

/** Path of the entrypoint declared in `bin` — avoids depending on the .cmd shims. */
function resolveBin(packageName, binName = packageName) {
  const manifestPath = require.resolve(`${packageName}/package.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[binName];

  if (!bin) throw new Error(`Package "${packageName}" does not declare a "${binName}" bin.`);
  return join(dirname(manifestPath), bin);
}

/**
 * Runs a build tool with Node itself.
 *
 * If the package is not in node_modules yet, it falls back to `npx` through a
 * shell — the case of someone who cloned the repo and has not run `npm install`.
 */
function runTool(packageName, binName, toolArgs) {
  let scriptPath;
  try {
    scriptPath = resolveBin(packageName, binName);
  } catch {
    execSync([binName, ...toolArgs].join(' '), { cwd: ROOT, stdio: 'inherit' });
    return;
  }

  execFileSync(process.execPath, [scriptPath, ...toolArgs], { cwd: ROOT, stdio: 'inherit' });
}

function copyIfExists(from, to) {
  if (existsSync(from)) copyFileSync(from, to);
}

const args = parseArgs(process.argv.slice(2));

// 1. clean dist — never drag files from a previous build along.
rmSync(DIST, { recursive: true, force: true });

// 2. compile, then rewrite the `@cli/*` aliases to relative paths.
runTool('typescript', 'tsc', ['-p', TSCONFIG]);
runTool('tsc-alias', 'tsc-alias', ['-p', TSCONFIG]);

// 3. inject the registry URL in place of the placeholder.
const registryConfig = join(DIST, 'config', 'registry-config.js');
writeFileSync(registryConfig, readFileSync(registryConfig, 'utf8').replaceAll('__REGISTRY_URL__', args.registry));

// 4. shebang + execute bit: without them the binary does not run directly.
const entry = join(DIST, 'index.js');
writeFileSync(entry, `#!/usr/bin/env node\n${readFileSync(entry, 'utf8')}`);
chmodSync(entry, 0o755);

// 5. the metadata the published package has to carry.
copyFileSync(join(CLI, args.package), join(DIST, 'package.json'));
copyIfExists(join(CLI, 'README.md'), join(DIST, 'README.md'));
copyIfExists(join(CLI, '.npmignore'), join(DIST, '.npmignore'));

// 6. in dev mode, register the binary globally (`zardev`).
if (args.link) execSync('npm link', { cwd: DIST, stdio: 'inherit' });

console.log(`\n✔ zard-cli built — registry: ${args.registry}`);
