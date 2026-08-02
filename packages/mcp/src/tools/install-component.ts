import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { execFile } from 'node:child_process';
import { z } from 'zod';

// Component names accepted by the CLI (letters, digits, dashes). Reject anything
// else before invoking the CLI so no shell-significant characters can reach it.
const COMPONENT_NAME_RE = /^[a-z0-9][a-z0-9-]*$/i;

function execFileAsync(file: string, args: string[], cwd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    execFile(file, args, { cwd, timeout: 60_000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command failed: ${error.message}\n${stderr}`));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

export function registerInstallComponent(server: McpServer): void {
  server.tool(
    'install-component',
    'Install a Zard UI component into the current project using the CLI',
    {
      name: z.string().describe('Component name to install (e.g., "button", "card", "dialog")'),
      cwd: z.string().optional().describe('Working directory (defaults to current directory)'),
    },
    async ({ name, cwd }) => {
      const workDir = cwd || process.cwd();

      if (!COMPONENT_NAME_RE.test(name)) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Invalid component name "${name}". Component names may only contain letters, digits and dashes.`,
            },
          ],
          isError: true,
        };
      }

      try {
        // Pass the name as a discrete argv element (no shell): execFile runs the
        // program directly via execve(2), so shell metacharacters in `name` are
        // treated as a literal argument and cannot start a new command.
        const { stdout, stderr } = await execFileAsync('npx', ['zard-cli', 'add', name, '--yes'], workDir);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Successfully installed component "${name}".\n\n${stdout}${stderr ? `\n${stderr}` : ''}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Failed to install component "${name}": ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}
