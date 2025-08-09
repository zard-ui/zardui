#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { setupHandlers } from './handler.js';
import { parseArgs } from './utils/args.js';
import { logger } from './utils/logger.js';

/**
 * ZardUI MCP Server
 *
 * Provides AI assistants with comprehensive access to ZardUI Angular components.
 * Features include component source code retrieval, installation via CLI,
 * demo access, and component metadata.
 */

const SERVER_NAME = '@zardui/mcp-server';
const SERVER_VERSION = '1.0.0';

async function main() {
  try {
    const args = await parseArgs();

    if (args.help) {
      console.log(`
ZardUI MCP Server v${SERVER_VERSION}

Usage: npx ${SERVER_NAME} [options]

Options:
  --help                Show this help message
  --version            Show version information
  --log-level <level>  Set logging level (error, warn, info, debug)
  --project-path <path> Path to ZardUI project (default: auto-detect)

Examples:
  npx ${SERVER_NAME}
  npx ${SERVER_NAME} --log-level debug
  npx ${SERVER_NAME} --project-path /path/to/zardui
      `);
      process.exit(0);
    }

    if (args.version) {
      console.log(`${SERVER_NAME} v${SERVER_VERSION}`);
      process.exit(0);
    }

    // Configure logger
    logger.level = args.logLevel || 'info';
    logger.info(`Starting ${SERVER_NAME} v${SERVER_VERSION}`);

    // Create MCP server instance
    const server = new McpServer({
      name: SERVER_NAME,
      version: SERVER_VERSION,
    });

    // Setup all handlers
    await setupHandlers(server, args);

    // Connect to transport
    const transport = new StdioServerTransport();
    await server.connect(transport);

    logger.info('ZardUI MCP Server is running and ready for connections');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Failed to start ZardUI MCP Server:', error);
    process.exit(1);
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', error => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
