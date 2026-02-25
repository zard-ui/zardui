import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { registerGetBlock } from './tools/get-block.js';
import { registerGetComponentDocs } from './tools/get-component-docs.js';
import { registerGetComponentExamples } from './tools/get-component-examples.js';
import { registerGetComponent } from './tools/get-component.js';
import { registerGetDependencies } from './tools/get-dependencies.js';
import { registerInstallComponent } from './tools/install-component.js';
import { registerListBlocks } from './tools/list-blocks.js';
import { registerListComponents } from './tools/list-components.js';
import { registerSearchComponents } from './tools/search-components.js';

const server = new McpServer({ name: 'zard-mcp', version: '1.0.0' });

registerListComponents(server);
registerSearchComponents(server);
registerGetComponent(server);
registerGetComponentDocs(server);
registerGetComponentExamples(server);
registerGetDependencies(server);
registerInstallComponent(server);
registerListBlocks(server);
registerGetBlock(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Zard MCP server started');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
