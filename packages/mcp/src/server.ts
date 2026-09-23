import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { registerGetBlock } from './tools/get-block.js';
import { registerGetComponentDocs } from './tools/get-component-docs.js';
import { registerGetComponentExamples } from './tools/get-component-examples.js';
import { registerGetComponent } from './tools/get-component.js';
import { registerGetDependencies } from './tools/get-dependencies.js';
import { registerInstallComponent } from './tools/install-component.js';
import { registerListBlocks } from './tools/list-blocks.js';
import { registerListComponents } from './tools/list-components.js';
import { registerSearchComponents } from './tools/search-components.js';

/**
 * Sent to the client at initialize and usually placed in the model's system
 * prompt. It carries what no single tool description can: the order the tools
 * are meant to be used in, and the library facts a model most often gets wrong
 * when it writes Zard UI code from memory of shadcn/React.
 */
export const INSTRUCTIONS = `Zard UI is a shadcn/ui-style component library for Angular (standalone components, signals, Tailwind CSS v4). Components are copied into the project by zard-cli, not imported from an npm package.

Workflow:
1. Find the component: search-components (by purpose or synonym, e.g. "modal", "toast") or list-components.
2. Learn its API before writing templates: get-component-docs (or get-component-examples for code only). Do not guess selectors, inputs or imports from shadcn/React — Zard UI uses Angular selectors and inputs such as \`z-button\` / \`zType\`.
3. Add it: install-component with cwd set to the Angular project root. It installs registry dependencies too. The project needs \`npx zard-cli init\` first.
4. For whole page sections, list-blocks then get-block.

Component names are lowercase with dashes (date-picker, input-otp). Unknown names come back with suggestions.`;

export function createServer(version: string): McpServer {
  const server = new McpServer(
    { name: 'zard-mcp', title: 'Zard UI', version, websiteUrl: 'https://zardui.com/docs/mcp' },
    { instructions: INSTRUCTIONS },
  );

  registerSearchComponents(server);
  registerListComponents(server);
  registerGetComponentDocs(server);
  registerGetComponentExamples(server);
  registerGetComponent(server);
  registerGetDependencies(server);
  registerInstallComponent(server);
  registerListBlocks(server);
  registerGetBlock(server);

  return server;
}
