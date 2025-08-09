/**
 * Main handler setup for ZardUI MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as toolHandlers from './tools/handlers.js';
import { logger } from './utils/logger.js';
import { getProjectInfo, type ProjectInfo } from './utils/project.js';
import type { ParsedArgs } from './utils/args.js';

/**
 * Handle request with error catching and logging
 */
async function handleRequest<T extends any[], R>(name: string, handler: (...args: T) => Promise<R>, ...args: T): Promise<R> {
  try {
    logger.debug(`Handling request: ${name}`);
    const result = await handler(...args);
    logger.debug(`Successfully handled: ${name}`);
    return result;
  } catch (error: any) {
    logger.error(`Error in ${name}:`, error);
    throw error;
  }
}

/**
 * Setup all request handlers for the MCP server
 */
export async function setupHandlers(server: McpServer, args: ParsedArgs): Promise<void> {
  logger.info('Setting up MCP server handlers...');

  // Initialize project info
  const projectInfo = await getProjectInfo(args.projectPath);
  const context: toolHandlers.ToolContext = { projectInfo };

  logger.info(`Project root: ${projectInfo.root}`);
  logger.info(`Components path: ${projectInfo.componentsPath}`);

  // Register all tools
  server.registerTool(
    'get_component',
    {
      description: 'Retrieve source code for a specific ZardUI component',
      inputSchema: {},
    },
    async params => {
      return handleRequest('get_component', async () => {
        return toolHandlers.getComponent(params, context);
      });
    },
  );

  server.registerTool(
    'get_component_demo',
    {
      description: 'Retrieve demo code for a ZardUI component',
      inputSchema: {},
    },
    async params => {
      return handleRequest('get_component_demo', async () => {
        return toolHandlers.getComponentDemo(params, context);
      });
    },
  );

  server.registerTool(
    'list_components',
    {
      description: 'List all available ZardUI components',
      inputSchema: {},
    },
    async params => {
      return handleRequest('list_components', async () => {
        return toolHandlers.listAllComponents(params, context);
      });
    },
  );

  server.registerTool(
    'get_component_metadata',
    {
      description: 'Get metadata for a specific component including dependencies and variants',
      inputSchema: {},
    },
    async params => {
      return handleRequest('get_component_metadata', async () => {
        return toolHandlers.getComponentMetadata(params, context);
      });
    },
  );

  server.registerTool(
    'get_component_docs',
    {
      description: 'Retrieve documentation for a ZardUI component',
      inputSchema: {},
    },
    async params => {
      return handleRequest('get_component_docs', async () => {
        return toolHandlers.getComponentDocs(params, context);
      });
    },
  );

  server.registerTool(
    'install_component',
    {
      description: 'Install a ZardUI component using the CLI',
      inputSchema: {},
    },
    async params => {
      return handleRequest('install_component', async () => {
        return toolHandlers.installComponent(params, context);
      });
    },
  );

  server.registerTool(
    'init_zardui',
    {
      description: 'Initialize ZardUI in an Angular project',
      inputSchema: {},
    },
    async params => {
      return handleRequest('init_zardui', async () => {
        return toolHandlers.initZardui(params, context);
      });
    },
  );

  server.registerTool(
    'search_components',
    {
      description: 'Search for components by name or functionality',
      inputSchema: {},
    },
    async params => {
      return handleRequest('search_components', async () => {
        return toolHandlers.searchComponents(params, context);
      });
    },
  );

  server.registerTool(
    'get_installation_guide',
    {
      description: 'Get installation instructions for components',
      inputSchema: {},
    },
    async params => {
      return handleRequest('get_installation_guide', async () => {
        return toolHandlers.getInstallationGuide(params, context);
      });
    },
  );

  logger.info(`Registered 9 tools successfully`);
}
