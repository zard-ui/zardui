/**
 * Tool definitions for ZardUI MCP Server
 */

export const tools = [
  {
    name: 'get_component',
    description: 'Retrieve source code for a specific ZardUI component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name (e.g., button, card, dialog)',
        },
        file: {
          type: 'string',
          description: 'Specific file to retrieve (component.ts, variants.ts, etc.)',
          enum: ['component.ts', 'variants.ts', 'module.ts', 'all'],
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_component_demo',
    description: 'Retrieve demo code for a ZardUI component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name',
        },
        demo: {
          type: 'string',
          description: 'Specific demo name (default shows all available demos)',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'list_components',
    description: 'List all available ZardUI components',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by component category',
          enum: ['form', 'layout', 'navigation', 'feedback', 'data-display', 'overlay'],
        },
      },
    },
  },
  {
    name: 'get_component_metadata',
    description: 'Get metadata for a specific component including dependencies and variants',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_component_docs',
    description: 'Retrieve documentation for a ZardUI component',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Component name',
        },
        type: {
          type: 'string',
          description: 'Documentation type',
          enum: ['overview', 'api', 'both'],
          default: 'both',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'install_component',
    description: 'Install a ZardUI component using the CLI',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Component names to install',
        },
        path: {
          type: 'string',
          description: 'Target installation path',
        },
        overwrite: {
          type: 'boolean',
          description: 'Overwrite existing files',
          default: false,
        },
      },
      required: ['components'],
    },
  },
  {
    name: 'init_zardui',
    description: 'Initialize ZardUI in an Angular project',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Project path (defaults to current directory)',
        },
        style: {
          type: 'string',
          description: 'Style format',
          enum: ['css', 'scss'],
          default: 'css',
        },
      },
    },
  },
  {
    name: 'search_components',
    description: 'Search for components by name or functionality',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        type: {
          type: 'string',
          description: 'Search scope',
          enum: ['name', 'description', 'demo', 'all'],
          default: 'all',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_installation_guide',
    description: 'Get installation instructions for components',
    inputSchema: {
      type: 'object',
      properties: {
        components: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Component names to get installation guide for',
        },
        format: {
          type: 'string',
          description: 'Output format',
          enum: ['markdown', 'text', 'json'],
          default: 'markdown',
        },
      },
      required: ['components'],
    },
  },
] as const;

export type ToolName = (typeof tools)[number]['name'];
