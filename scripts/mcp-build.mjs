/**
 * Builds zard-mcp — same behaviour on Linux, macOS, Git Bash, PowerShell and cmd.
 *
 * Replaces the chain of shell commands the Nx target used to run (`rm -rf`,
 * `echo | cat -`, `chmod`, `cp`), which only worked on POSIX. `scripts/cli-build.mjs`
 * exists for the same reason; its header explains the Windows traps in detail.
 *
 * Usage:
 *   node scripts/mcp-build.mjs --package <file> [--link]
 */

import { execFileSync, execSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MCP = join(ROOT, 'packages', 'mcp');
const DIST = join(MCP, 'dist');
const TSCONFIG = 'packages/mcp/tsconfig.json';

const require = createRequire(import.meta.url);

function parseArgs(argv) {
  const args = { link: false };
  for (let index = 0; index < argv.length; index++) {
    const flag = argv[index];
    if (flag === '--link') args.link = true;
    else if (flag === '--package') args.package = argv[++index];
  }

  if (!args.package) throw new Error('Missing --package <file>');
  return args;
}

/** Path of the entrypoint declared in `bin` — avoids depending on the .cmd shims. */
function resolveBin(packageName, binName = packageName) {
  const manifestPath = require.resolve(`${packageName}/package.json`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.[binName];

  if (!bin) throw new Error(`Package "${packageName}" does not declare a "${binName}" bin.`);
  return join(dirname(manifestPath), bin);
}

/** Runs a build tool with Node itself, falling back to npx before `npm install`. */
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

const args = parseArgs(process.argv.slice(2));

// 1. clean dist — never drag files from a previous build along.
rmSync(DIST, { recursive: true, force: true });

// 2. compile.
runTool('typescript', 'tsc', ['-p', TSCONFIG]);

// 3. shebang + execute bit: without them the binary does not run directly.
const entry = join(DIST, 'index.js');
if (!existsSync(entry)) throw new Error(`tsc produced no ${entry}`);
writeFileSync(entry, `#!/usr/bin/env node\n${readFileSync(entry, 'utf8')}`);
chmodSync(entry, 0o755);

// 4. the manifest the published package carries.
copyFileSync(join(MCP, args.package), join(DIST, 'package.json'));

// 5. in dev mode, register the binary globally.
if (args.link) execSync('npm link', { cwd: DIST, stdio: 'inherit' });

console.log('\n✔ zard-mcp built');
