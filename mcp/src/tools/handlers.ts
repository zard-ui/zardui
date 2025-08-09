/**
 * Tool handlers for ZardUI MCP Server
 */

import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger.js';
import { getProjectInfo, listComponents, componentExists, type ProjectInfo } from '../utils/project.js';

const execAsync = promisify(exec);

export interface ToolContext {
  projectInfo: ProjectInfo;
}

/**
 * Get component source code
 */
export async function getComponent(params: any, context: ToolContext) {
  const { name, file = 'all' } = params;

  if (!(await componentExists(context.projectInfo, name))) {
    throw new Error(`Component '${name}' not found`);
  }

  const componentPath = path.join(context.projectInfo.componentsPath, name);
  const files = await fs.readdir(componentPath);

  const result: any = {
    component: name,
    files: {},
  };

  if (file === 'all') {
    // Return all TypeScript files
    for (const fileName of files) {
      if (fileName.endsWith('.ts') && !fileName.endsWith('.spec.ts')) {
        const filePath = path.join(componentPath, fileName);
        const content = await fs.readFile(filePath, 'utf-8');
        result.files[fileName] = content;
      }
    }
  } else {
    // Return specific file
    const fileName = file.endsWith('.ts') ? file : `${name}.${file}`;
    const targetFile = files.find(f => f === fileName || f === `${name}.${file}`);

    if (!targetFile) {
      throw new Error(`File '${file}' not found for component '${name}'`);
    }

    const filePath = path.join(componentPath, targetFile);
    const content = await fs.readFile(filePath, 'utf-8');
    result.files[targetFile] = content;
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

/**
 * Get component demo code
 */
export async function getComponentDemo(params: any, context: ToolContext) {
  const { name, demo } = params;

  if (!(await componentExists(context.projectInfo, name))) {
    throw new Error(`Component '${name}' not found`);
  }

  const demoPath = path.join(context.projectInfo.componentsPath, name, 'demo');

  try {
    const files = await fs.readdir(demoPath);
    const demoFiles = files.filter(f => f.endsWith('.ts'));

    if (demo) {
      const demoFile = `${demo}.ts`;
      if (!demoFiles.includes(demoFile)) {
        throw new Error(`Demo '${demo}' not found for component '${name}'`);
      }

      const content = await fs.readFile(path.join(demoPath, demoFile), 'utf-8');
      return {
        content: [
          {
            type: 'text' as const,
            text: content,
          },
        ],
      };
    } else {
      // Return all demos
      const demos: any = {};
      for (const demoFile of demoFiles) {
        const content = await fs.readFile(path.join(demoPath, demoFile), 'utf-8');
        demos[demoFile.replace('.ts', '')] = content;
      }

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({ component: name, demos }, null, 2),
          },
        ],
      };
    }
  } catch (error) {
    throw new Error(`No demos found for component '${name}'`);
  }
}

/**
 * List all components
 */
export async function listAllComponents(params: any, context: ToolContext) {
  const { category } = params;

  const components = await listComponents(context.projectInfo);

  // TODO: Implement category filtering when component metadata includes categories
  const filteredComponents = category
    ? components.filter(comp => {
        // This would need component metadata to properly categorize
        return true; // For now, return all
      })
    : components;

  return {
    content: [
      {
        type: 'text' as const,
        text: `Available ZardUI components (${filteredComponents.length}):\n\n${filteredComponents.map(c => `- ${c}`).join('\n')}`,
      },
    ],
  };
}

/**
 * Get component metadata
 */
export async function getComponentMetadata(params: any, context: ToolContext) {
  const { name } = params;

  if (!(await componentExists(context.projectInfo, name))) {
    throw new Error(`Component '${name}' not found`);
  }

  const componentPath = path.join(context.projectInfo.componentsPath, name);
  const files = await fs.readdir(componentPath);

  const metadata: any = {
    name,
    path: componentPath,
    files: files.filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts')),
    hasDemo: files.includes('demo'),
    hasDocs: files.includes('doc'),
    hasVariants: files.some(f => f.includes('variants')),
    hasModule: files.some(f => f.includes('module')),
    dependencies: [],
    variants: null,
  };

  // Try to extract variants information
  const variantFile = files.find(f => f.endsWith('.variants.ts'));
  if (variantFile) {
    try {
      const content = await fs.readFile(path.join(componentPath, variantFile), 'utf-8');
      const variantMatch = content.match(/variant:\s*\{([^}]+)\}/);
      const sizeMatch = content.match(/size:\s*\{([^}]+)\}/);

      metadata.variants = {
        hasVariants: !!variantMatch,
        hasSizes: !!sizeMatch,
        variantOptions: variantMatch ? variantMatch[1].match(/\w+:/g)?.map(v => v.replace(':', '')) : [],
        sizeOptions: sizeMatch ? sizeMatch[1].match(/\w+:/g)?.map(s => s.replace(':', '')) : [],
      };
    } catch (error) {
      logger.debug(`Error parsing variants for ${name}:`, error);
    }
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(metadata, null, 2),
      },
    ],
  };
}

/**
 * Get component documentation
 */
export async function getComponentDocs(params: any, context: ToolContext) {
  const { name, type = 'both' } = params;

  if (!(await componentExists(context.projectInfo, name))) {
    throw new Error(`Component '${name}' not found`);
  }

  const docPath = path.join(context.projectInfo.componentsPath, name, 'doc');

  try {
    const result: any = { component: name, docs: {} };

    if (type === 'overview' || type === 'both') {
      try {
        const overviewPath = path.join(docPath, 'overview.md');
        const content = await fs.readFile(overviewPath, 'utf-8');
        result.docs.overview = content;
      } catch {
        result.docs.overview = 'No overview documentation found';
      }
    }

    if (type === 'api' || type === 'both') {
      try {
        const apiPath = path.join(docPath, 'api.md');
        const content = await fs.readFile(apiPath, 'utf-8');
        result.docs.api = content;
      } catch {
        result.docs.api = 'No API documentation found';
      }
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(`Documentation not found for component '${name}'`);
  }
}

/**
 * Install components using CLI
 */
export async function installComponent(params: any, context: ToolContext) {
  const { components, path: targetPath, overwrite = false } = params;

  if (!Array.isArray(components) || components.length === 0) {
    throw new Error('At least one component must be specified');
  }

  const cwd = targetPath || process.cwd();

  // Build the command using the published CLI
  let command = `npx @ngzard/ui add ${components.join(' ')}`;
  if (overwrite) command += ' --overwrite';
  if (targetPath) command += ` --path ${targetPath}`;
  command += ' --yes'; // Skip confirmation

  logger.info(`Executing: ${command}`);

  try {
    const { stdout, stderr } = await execAsync(command, { cwd });

    return {
      content: [
        {
          type: 'text' as const,
          text: `Successfully installed components: ${components.join(', ')}\n\n${stdout || stderr}`,
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to install components: ${error.message}`);
  }
}

/**
 * Initialize ZardUI in project
 */
export async function initZardui(params: any, context: ToolContext) {
  const { path: projectPath, style = 'css' } = params;

  const cwd = projectPath || process.cwd();

  // Build the command using the published CLI
  let command = 'npx @ngzard/ui init --yes';
  if (style) command += ` --style ${style}`;

  logger.info(`Executing: ${command}`);

  try {
    const { stdout, stderr } = await execAsync(command, { cwd });

    return {
      content: [
        {
          type: 'text' as const,
          text: `Successfully initialized ZardUI\n\n${stdout || stderr}`,
        },
      ],
    };
  } catch (error: any) {
    throw new Error(`Failed to initialize ZardUI: ${error.message}`);
  }
}

/**
 * Search components
 */
export async function searchComponents(params: any, context: ToolContext) {
  const { query, type = 'all' } = params;

  const components = await listComponents(context.projectInfo);
  const results = [];

  for (const component of components) {
    let match = false;

    if (type === 'name' || type === 'all') {
      if (component.toLowerCase().includes(query.toLowerCase())) {
        match = true;
      }
    }

    // TODO: Implement search in descriptions and demos

    if (match) {
      results.push(component);
    }
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: `Search results for "${query}" (${results.length} found):\n\n${results.map(c => `- ${c}`).join('\n')}`,
      },
    ],
  };
}

/**
 * Get installation guide
 */
export async function getInstallationGuide(params: any, context: ToolContext) {
  const { components, format = 'markdown' } = params;

  if (!Array.isArray(components) || components.length === 0) {
    throw new Error('At least one component must be specified');
  }

  // Verify components exist
  for (const component of components) {
    if (!(await componentExists(context.projectInfo, component))) {
      throw new Error(`Component '${component}' not found`);
    }
  }

  let guide = '';

  if (format === 'markdown') {
    guide = `# ZardUI Installation Guide\n\n`;
    guide += `## Components to Install\n\n`;
    guide += components.map(c => `- ${c}`).join('\n') + '\n\n';
    guide += `## Installation\n\n`;
    guide += `### Using CLI (Recommended)\n\n`;
    guide += `\`\`\`bash\n`;
    guide += `npx @ngzard/ui add ${components.join(' ')}\n`;
    guide += `\`\`\`\n\n`;
    guide += `### Manual Installation\n\n`;
    guide += `1. Install dependencies if needed\n`;
    guide += `2. Copy component files to your project\n`;
    guide += `3. Update your module imports\n`;
  } else if (format === 'json') {
    guide = JSON.stringify(
      {
        components,
        cli_command: `npx @ngzard/ui add ${components.join(' ')}`,
        steps: ['Run the CLI command', 'Components will be installed automatically', 'Import in your Angular modules as needed'],
      },
      null,
      2,
    );
  } else {
    guide = `ZardUI Installation Guide\n\n`;
    guide += `Components: ${components.join(', ')}\n\n`;
    guide += `Command: npx @ngzard/ui add ${components.join(' ')}\n\n`;
    guide += `The CLI will handle dependencies and setup automatically.`;
  }

  return {
    content: [
      {
        type: 'text' as const,
        text: guide,
      },
    ],
  };
}
