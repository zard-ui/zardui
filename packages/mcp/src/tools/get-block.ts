import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { failure, unknownBlock } from './shared.js';
import { registryService } from '../services/registry.service.js';
import { isNotFound } from '../utils/http.js';
import { json } from '../utils/result.js';

export function registerGetBlock(server: McpServer): void {
  server.registerTool(
    'get-block',
    {
      title: 'Get block source',
      description:
        'Get every source file of a Zard UI block (a ready-made page section such as a login form or dashboard). ' +
        'The files import Zard UI components, which must be installed with install-component.',
      inputSchema: { id: z.string().describe('Block id from list-blocks (e.g. "login-01", "dashboard-01")') },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ id }) => {
      try {
        return json(await registryService.getBlock(id));
      } catch (error) {
        return isNotFound(error) ? unknownBlock(id) : failure(error, `block "${id}"`);
      }
    },
  );
}
