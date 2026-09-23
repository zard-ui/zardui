import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { execFile } from 'node:child_process';
import { statSync } from 'node:fs';
import * as path from 'node:path';
import { z } from 'zod';

import { resolveCliInvocation } from '../utils/cli-runner.js';
import { assertRegistryId, InvalidIdentifierError } from '../utils/identifiers.js';
import { errorMessage, fail, text } from '../utils/result.js';

function execFileAsync(file: string, args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    // `execFile`, never `exec`: the former calls the program directly, with the
    // arguments as a vector, so a `;` in the component name is a character of
    // that argument and not the start of another command. `shell` stays off
    // (the default) — turning it on would undo all of this at once.
    execFile(file, args, { cwd, timeout: 60_000, shell: false }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command failed: ${error.message}\n${stderr}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

/**
 * The directory the command will run in.
 *
 * It has to exist and be a directory: without the check, the error that comes
 * back is `spawn`'s, which does not say which of the two problems occurred. And
 * the directory matters more than it looks — the zard-cli that runs comes from
 * it, so pointing it anywhere is choosing which binary executes.
 */
function assertWorkingDirectory(cwd: string): string {
  const resolved = path.resolve(cwd);

  let stats;
  try {
    stats = statSync(resolved);
  } catch {
    throw new Error(`Working directory does not exist: ${resolved}`);
  }

  if (!stats.isDirectory()) throw new Error(`Working directory is not a directory: ${resolved}`);

  return resolved;
}

export function registerInstallComponent(server: McpServer): void {
  server.registerTool(
    'install-component',
    {
      title: 'Install component',
      description:
        'Install a Zard UI component and its registry dependencies into an Angular project with zard-cli, and add its npm packages. ' +
        'The project must already be set up with `npx zard-cli init` (a components.json at its root). ' +
        'Existing files are kept unless overwrite is true.',
      inputSchema: {
        name: z.string().describe('Component name to install (e.g. "button", "date-picker")'),
        cwd: z
          .string()
          .optional()
          .describe(
            'Absolute path of the Angular project root. Pass it: the server process may not start in the project.',
          ),
        overwrite: z.boolean().optional().describe('Replace files that already exist (default false)'),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
    },
    async ({ name, cwd, overwrite }) => {
      let workDir: string;
      try {
        assertRegistryId(name, 'component');
        workDir = assertWorkingDirectory(cwd || process.cwd());
      } catch (error) {
        if (error instanceof InvalidIdentifierError) return fail(error.message);
        return fail(errorMessage(error));
      }

      const cli = resolveCliInvocation(workDir);
      const args = [...cli.prefix, 'add', name, '--yes', ...(overwrite ? ['--overwrite'] : [])];

      try {
        const { stdout, stderr } = await execFileAsync(cli.file, args, workDir);
        return text(`Installed "${name}" in ${workDir}.\n\n${stdout}${stderr ? `\n${stderr}` : ''}`);
      } catch (error) {
        const hint =
          cli.source === 'npx'
            ? '\n\nCould not find zard-cli in this project or npm alongside Node. Install it with `npm i -D zard-cli`.'
            : '';
        return fail(`Failed to install component "${name}": ${errorMessage(error)}${hint}`);
      }
    },
  );
}
