import { type Tree, formatFiles, generateFiles } from '@nx/devkit';
import * as path from 'path';

import type { BlockGeneratorSchema } from './schema';

const BLOCKS_DIR = 'libs/blocks/src/lib';
const INDEX_PATH = 'libs/blocks/src/index.ts';
const REGISTRY_PATH = 'apps/web/src/app/domain/config/blocks-registry.ts';

function toClassName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toCamelCase(name: string): string {
  const pascal = toClassName(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toTitle(name: string): string {
  // "sidebar-01" → "Sidebar", "authentication-02" → "Authentication"
  const base = name.replace(/-\d+$/, '');
  return base
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function blockGenerator(tree: Tree, schema: BlockGeneratorSchema) {
  const kebabName = schema.name.toLowerCase();
  const className = toClassName(kebabName);
  const camelName = toCamelCase(kebabName);
  const title = toTitle(kebabName);
  const category = schema.category || 'featured';

  const templateVars = {
    name: kebabName,
    className,
    camelName,
    title,
    description: schema.description,
    category,
    template: '',
  };

  // 1. Generate block files from templates
  generateFiles(tree, path.join(__dirname, 'files'), BLOCKS_DIR, templateVars);

  // 2. Populate files[] in block.ts with generated component content
  populateBlockFiles(tree, kebabName);

  // 3. Add exports to libs/blocks/src/index.ts
  addExportsToIndex(tree, kebabName, className);

  // 4. Add entry to BLOCKS_REGISTRY
  addRegistryEntry(tree, kebabName, camelName, category);

  await formatFiles(tree);
}

function escapeBackticks(content: string): string {
  return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function populateBlockFiles(tree: Tree, name: string): void {
  const blockDir = `${BLOCKS_DIR}/${name}`;
  const blockTsPath = `${blockDir}/block.ts`;
  const blockContent = tree.read(blockTsPath, 'utf-8');
  if (!blockContent) return;

  const componentFiles = [`${name}.component.ts`, `${name}.component.html`];
  const filesEntries = componentFiles
    .map(fileName => {
      const content = tree.read(`${blockDir}/${fileName}`, 'utf-8');
      if (!content) return null;
      const language = fileName.endsWith('.ts') ? 'typescript' : 'html';
      return `    {
      name: '${fileName}',
      path: 'src/components/${name}/${fileName}',
      content: \`${escapeBackticks(content)}\`,
      language: '${language}',
    }`;
    })
    .filter(Boolean);

  const filesArray = `[\n${filesEntries.join(',\n')},\n  ]`;

  // Use bracket counting (backtick-aware) to find the closing `]` of files array
  const filesIdx = blockContent.indexOf('files:');
  if (filesIdx === -1) return;

  const openBracketIdx = blockContent.indexOf('[', filesIdx);
  if (openBracketIdx === -1) return;

  let depth = 0;
  let inBacktick = false;
  let closeBracketIdx = -1;
  for (let i = openBracketIdx; i < blockContent.length; i++) {
    const ch = blockContent[i];
    const prev = blockContent[i - 1];
    if (ch === '`' && prev !== '\\') {
      inBacktick = !inBacktick;
      continue;
    }
    if (inBacktick) continue;
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (depth === 0) {
      closeBracketIdx = i;
      break;
    }
  }
  if (closeBracketIdx === -1) return;

  const before = blockContent.slice(0, filesIdx);
  const after = blockContent.slice(closeBracketIdx + 1);
  tree.write(blockTsPath, `${before}files: ${filesArray}${after}`);
}

function addExportsToIndex(tree: Tree, name: string, className: string): void {
  const content = tree.read(INDEX_PATH, 'utf-8');
  if (!content) return;

  const componentExport = `export * from './lib/${name}/${name}.component';`;
  const blockExport = `export * from './lib/${name}/block';`;

  if (content.includes(componentExport)) return;

  const newContent = content.trimEnd() + '\n' + componentExport + '\n' + blockExport + '\n';
  tree.write(INDEX_PATH, newContent);
}

function addRegistryEntry(tree: Tree, name: string, camelName: string, category: string): void {
  const content = tree.read(REGISTRY_PATH, 'utf-8');
  if (!content) return;

  const blockVarName = `${camelName}Block`;

  // Check if entry already exists
  if (content.includes(blockVarName)) return;

  // 1. Add import
  const importLine = `import { ${blockVarName} } from '@blocks';`;
  const lastImportIdx = content.lastIndexOf('import ');
  const lastImportEnd = content.indexOf('\n', lastImportIdx);
  const before = content.slice(0, lastImportEnd + 1);
  const after = content.slice(lastImportEnd + 1);
  let updated = before + importLine + '\n' + after;

  // 2. Add to featured array (default category)
  const featuredPattern = /featured:\s*\[([^\]]*)\]/;
  const featuredMatch = updated.match(featuredPattern);
  if (featuredMatch) {
    const currentEntries = featuredMatch[1].trim();
    const newEntries = currentEntries ? `${currentEntries}, ${blockVarName}` : blockVarName;
    updated = updated.replace(featuredPattern, `featured: [${newEntries}]`);
  }

  // 3. Also add to the specific category if different from featured
  if (category.toLowerCase() !== 'featured') {
    const catKey = category.toLowerCase();
    const catPattern = new RegExp(`(${catKey}:\\s*\\[)([^\\]]*)\\]`);
    const catMatch = updated.match(catPattern);
    if (catMatch) {
      const currentEntries = catMatch[2].trim();
      const newEntries = currentEntries ? `${currentEntries}, ${blockVarName}` : blockVarName;
      updated = updated.replace(catPattern, `$1${newEntries}]`);
    }
  }

  tree.write(REGISTRY_PATH, updated);
}
