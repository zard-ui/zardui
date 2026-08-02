import { type Tree, formatFiles, generateFiles, logger } from '@nx/devkit';
import * as path from 'path';

import type { BlockGeneratorSchema, BlockRegistryCategory } from './schema';

const BLOCKS_DIR = 'libs/blocks/src/lib';
const INDEX_PATH = 'libs/blocks/src/index.ts';
const REGISTRY_PATH = 'apps/web/src/app/domain/config/blocks-registry.ts';
const PUBLIC_IMAGES_DIR = 'apps/web/public/blocks';

/** Must mirror `BlockCategory` in apps/web/src/app/domain/services/blocks.service.ts. */
const REGISTRY_CATEGORIES: BlockRegistryCategory[] = ['featured', 'sidebar', 'login', 'signup', 'otp', 'calendar'];

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

function escapeSingleQuotes(value: string): string {
  return value.replace(/'/g, "\\'");
}

export default async function blockGenerator(tree: Tree, schema: BlockGeneratorSchema) {
  const kebabName = schema.name.toLowerCase();

  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(kebabName)) {
    throw new Error(`Invalid block name "${schema.name}". Use kebab-case, e.g. "sidebar-01".`);
  }

  if (tree.exists(`${BLOCKS_DIR}/${kebabName}`)) {
    throw new Error(`Block "${kebabName}" already exists at ${BLOCKS_DIR}/${kebabName}.`);
  }

  const category = (schema.category ?? 'featured') as BlockRegistryCategory;
  if (!REGISTRY_CATEGORIES.includes(category)) {
    throw new Error(
      `Unknown registry category "${category}". BLOCKS_REGISTRY only accepts: ${REGISTRY_CATEGORIES.join(', ')}. ` +
        `Add the new key to BlockCategory in apps/web/src/app/domain/services/blocks.service.ts first.`,
    );
  }

  const className = toClassName(kebabName);
  const camelName = toCamelCase(kebabName);
  const title = schema.title ?? toTitle(kebabName);
  // `Block.category` is a display label ('Authentication'), not the registry key.
  const label = schema.label ?? title;

  const templateVars = {
    name: kebabName,
    className,
    camelName,
    title,
    titleEscaped: escapeSingleQuotes(title),
    description: escapeSingleQuotes(schema.description),
    label: escapeSingleQuotes(label),
    template: '',
  };

  // 1. Generate block files from templates. `files: []` is left empty on purpose:
  //    scripts/sync-blocks.ts is the single source of truth for that array.
  generateFiles(tree, path.join(__dirname, 'files'), BLOCKS_DIR, templateVars);

  // 2. Add exports to libs/blocks/src/index.ts
  addExportsToIndex(tree, kebabName);

  // 3. Add entry to BLOCKS_REGISTRY
  addRegistryEntry(tree, camelName, category);

  await formatFiles(tree);

  logger.info(
    [
      '',
      `✅ Block "${kebabName}" scaffolded under ${BLOCKS_DIR}/${kebabName}.`,
      '',
      'Required manual steps:',
      `  1. Build the block in ${BLOCKS_DIR}/${kebabName}/${kebabName}.component.{ts,html}.`,
      '  2. Run `npm run sync:blocks` to populate `files[]` in block.ts with the component sources.',
      '     (`files[]` is generated — never edit it by hand.)',
      '  3. Add the preview screenshots the block card renders:',
      `       ${PUBLIC_IMAGES_DIR}/${kebabName}/light.png`,
      `       ${PUBLIC_IMAGES_DIR}/${kebabName}/dark.png`,
      '     Without them the card on /blocks renders a broken image.',
      '  4. Run `npm run build:registry` so the CLI can install the block.',
      '',
    ].join('\n'),
  );
}

function addExportsToIndex(tree: Tree, name: string): void {
  const content = tree.read(INDEX_PATH, 'utf-8');
  if (!content) {
    throw new Error(`Could not read ${INDEX_PATH}.`);
  }

  const componentExport = `export * from './lib/${name}/${name}.component';`;
  const blockExport = `export * from './lib/${name}/block';`;

  if (content.includes(componentExport)) return;

  tree.write(INDEX_PATH, `${content.trimEnd()}\n${componentExport}\n${blockExport}\n`);
}

/**
 * Registers the block in BLOCKS_REGISTRY. Blocks are listed in `featured` (the
 * landing bucket of /blocks) *and* in their own category, mirroring how the only
 * existing block (authentication-01) is registered — `/blocks` renders one
 * category at a time and defaults to `featured`, so a block missing from it
 * would never show on the landing page.
 */
function addRegistryEntry(tree: Tree, camelName: string, category: BlockRegistryCategory): void {
  const content = tree.read(REGISTRY_PATH, 'utf-8');
  if (!content) {
    throw new Error(`Could not read ${REGISTRY_PATH}.`);
  }

  const blockVarName = `${camelName}Block`;
  if (new RegExp(`\\b${blockVarName}\\b`).test(content)) return;

  let updated = addRegistryImport(content, blockVarName);

  for (const key of category === 'featured' ? ['featured'] : ['featured', category]) {
    updated = addToCategoryArray(updated, key, blockVarName);
  }

  tree.write(REGISTRY_PATH, updated);
}

function addRegistryImport(content: string, blockVarName: string): string {
  const importPattern = /import\s*\{([^}]*)\}\s*from\s*'@blocks';/;
  const match = content.match(importPattern);

  if (!match) {
    throw new Error(`Could not find the \`from '@blocks'\` import in ${REGISTRY_PATH}.`);
  }

  const members = match[1]
    .split(',')
    .map(member => member.trim())
    .filter(Boolean);

  members.push(blockVarName);
  members.sort((a, b) => a.localeCompare(b));

  return content.replace(importPattern, `import { ${members.join(', ')} } from '@blocks';`);
}

function addToCategoryArray(content: string, category: string, blockVarName: string): string {
  const pattern = new RegExp(`(${category}:\\s*\\[)([^\\]]*)\\]`);
  const match = content.match(pattern);

  if (!match) {
    throw new Error(
      `Category "${category}" is missing from BLOCKS_REGISTRY in ${REGISTRY_PATH}. ` +
        `Add it there (and to BlockCategory) before generating a block for it.`,
    );
  }

  const current = match[2].trim().replace(/,$/, '');
  const entries = current ? `${current}, ${blockVarName}` : blockVarName;

  return content.replace(pattern, `$1${entries}]`);
}
