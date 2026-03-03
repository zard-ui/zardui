import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { exec } from 'node:child_process';
import { z } from 'zod';

function execAsync(command: string, cwd: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd, timeout: 60_000 }, (error, stdout, stderr) => {
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
      const command = `npx zard-cli add ${name} --yes`;

      try {
        const { stdout, stderr } = await execAsync(command, workDir);
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
