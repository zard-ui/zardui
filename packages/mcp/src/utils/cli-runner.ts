/**
 * How to invoke zard-cli without going through a shell.
 *
 * `execFile('npx', …)` looks like it settles this, and it does on POSIX. Not on
 * Windows: `npx` there is `npx.cmd`, and since the CVE-2024-27980 fix Node
 * refuses to run a `.cmd` without `shell: true` — the call dies with ENOENT.
 * The tempting way out is to turn the shell on, which is exactly what would
 * reopen the injection this command has already suffered once.
 *
 * The real way out is to never need a shell: everything here runs through Node
 * itself (`process.execPath`) over a `.js` file, the same approach the CLI's
 * own build takes, for the same reason.
 *
 * The order is a security decision too: the copy installed in the project comes
 * before `npx`, which would download and execute a package from the network.
 */

import { existsSync } from 'node:fs';
import * as path from 'node:path';

export interface CliInvocation {
  /** The program. Never a `.cmd`, never a shell string. */
  readonly file: string;
  /** The arguments that come before the command's own. */
  readonly prefix: string[];
  /** Where it came from, so the error message can say what was tried. */
  readonly source: 'local' | 'npx-cli' | 'npx';
}

/** The entrypoint of the npm that ships with this Node, if it can be located. */
function bundledNpx(): string | null {
  const nodeDir = path.dirname(process.execPath);

  const candidates = [
    // Windows: npm sits next to the executable.
    path.join(nodeDir, 'node_modules', 'npm', 'bin', 'npx-cli.js'),
    // POSIX: <prefix>/bin/node and <prefix>/lib/node_modules.
    path.join(nodeDir, '..', 'lib', 'node_modules', 'npm', 'bin', 'npx-cli.js'),
  ];

  return candidates.find(candidate => existsSync(candidate)) ?? null;
}

/**
 * What to execute in order to run zard-cli from `cwd`.
 *
 * The project's own copy wins: besides needing no network, it is the version
 * that project settled on. `npx` only steps in when that copy is absent.
 */
export function resolveCliInvocation(cwd: string): CliInvocation {
  const local = path.join(cwd, 'node_modules', 'zard-cli', 'index.js');
  if (existsSync(local)) {
    return { file: process.execPath, prefix: [local], source: 'local' };
  }

  const npxCli = bundledNpx();
  if (npxCli) {
    return { file: process.execPath, prefix: [npxCli, '--yes', 'zard-cli'], source: 'npx-cli' };
  }

  // Last resort: the `npx` on PATH. Works on POSIX; on Windows it fails with
  // ENOENT, and the command's error message says what to install.
  return { file: 'npx', prefix: ['zard-cli'], source: 'npx' };
}
