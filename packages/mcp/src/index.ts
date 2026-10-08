import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { readFileSync } from 'node:fs';

import { createServer } from './server.js';

/**
 * The version clients see, read from the package that is running. The build
 * copies package.json next to index.js; from source it sits one level up.
 */
function packageVersion(): string {
  for (const candidate of ['./package.json', '../package.json']) {
    try {
      return JSON.parse(readFileSync(new URL(candidate, import.meta.url), 'utf8')).version;
    } catch {
      // Try the next location.
    }
  }
  return '0.0.0';
}

async function main() {
  const server = createServer(packageVersion());
  await server.connect(new StdioServerTransport());
  console.error('Zard MCP server started');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
