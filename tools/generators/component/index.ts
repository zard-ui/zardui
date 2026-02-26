import { type Tree, formatFiles, generateFiles } from '@nx/devkit';
import * as path from 'path';

import type { ComponentGeneratorSchema } from './schema';

const COMPONENTS_DIR = 'libs/zard/src/lib/shared/components';
const PUBLIC_COMPONENTS_DIR = 'apps/web/public/components';
const INDEX_PATH = 'libs/zard/src/index.ts';
const REGISTRY_PATH = 'apps/web/src/app/shared/constants/components.constant.ts';
const ROUTES_PATH = 'apps/web/src/app/shared/constants/routes.constant.ts';

function toClassName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function toConstantName(name: string): string {
  return name.replace(/-/g, '_').toUpperCase();
}

function toCamelCase(name: string): string {
  const pascal = toClassName(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function toDisplayName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default async function componentGenerator(tree: Tree, schema: ComponentGeneratorSchema) {
  const kebabName = schema.name.toLowerCase();
  const className = toClassName(kebabName);
  const constantName = toConstantName(kebabName);
  const exportAs = 'z' + className;
  const selector = `z-${kebabName}`;
  const displayName = toDisplayName(kebabName);

  const variantName = toCamelCase(kebabName);

  const desc = schema.description;
  const descriptionLower = desc.charAt(0).toLowerCase() + desc.slice(1);

  const templateVars = {
    name: kebabName,
    variantName,
    className,
    constantName,
    selector,
    exportAs,
    description: desc,
    descriptionLower,
    template: '',
  };

  // 1. Generate component files from templates
  generateFiles(tree, path.join(__dirname, 'files'), COMPONENTS_DIR, templateVars);

  // 2. Generate public markdown files (demo code tab + docs)
  generateFiles(tree, path.join(__dirname, 'public-files'), PUBLIC_COMPONENTS_DIR, templateVars);

  // 3. Add export to libs/zard/src/index.ts
  addExportToIndex(tree, kebabName);

  // 4. Add entry to COMPONENTS_REGISTRY
  addRegistryEntry(tree, kebabName, constantName, desc);

  // 5. Add entry to COMPONENTS_PATH routes
  addRouteEntry(tree, kebabName, displayName);

  await formatFiles(tree);
}

function addExportToIndex(tree: Tree, name: string): void {
  const content = tree.read(INDEX_PATH, 'utf-8');
  if (!content) return;

  const newExport = `export * from './lib/shared/components/${name}';`;

  if (content.includes(newExport)) return;

  // Find all component exports and insert alphabetically
  const lines = content.split('\n');
  const componentExports = lines.filter(line => line.includes("'./lib/shared/components/"));
  const otherLines = lines.filter(line => !line.includes("'./lib/shared/components/"));

  componentExports.push(newExport);
  componentExports.sort((a, b) => a.localeCompare(b));

  // Reconstruct: non-component lines first, then sorted component exports
  const nonEmptyOther = otherLines.filter(line => line.trim() !== '');
  const result = [...nonEmptyOther, ...componentExports, ''].join('\n');

  tree.write(INDEX_PATH, result);
}

function addRegistryEntry(tree: Tree, name: string, constantName: string, description: string): void {
  const content = tree.read(REGISTRY_PATH, 'utf-8');
  if (!content) return;

  // Check if entry already exists
  if (content.includes(`componentName: '${name}'`)) return;

  const entry = `  {
    componentName: '${name}',
    description: '${description.replace(/'/g, "\\'")}',
    loadData: () => import('@zard/components/${name}/demo/${name}').then(m => m.${constantName}),
  },`;

  // Insert before the closing bracket of the array
  const closingIndex = content.lastIndexOf('];');
  if (closingIndex === -1) return;

  const before = content.slice(0, closingIndex);
  const after = content.slice(closingIndex);

  tree.write(REGISTRY_PATH, before + entry + '\n' + after);
}

function addRouteEntry(tree: Tree, name: string, displayName: string): void {
  const content = tree.read(ROUTES_PATH, 'utf-8');
  if (!content) return;

  // Check if entry already exists
  if (content.includes(`path: '/docs/components/${name}'`)) return;

  const entry = `    { name: '${displayName}', path: '/docs/components/${name}', available: true },`;

  // Find the .sort() line in COMPONENTS_PATH and insert before the closing bracket
  // The array ends with `].sort((a, b) => a.name.localeCompare(b.name)),`
  const sortPattern = /\]\.sort\(\(a, b\) => a\.name\.localeCompare\(b\.name\)\)/;
  const match = content.match(sortPattern);

  if (!match || match.index === undefined) return;

  // Find the position just before the `]` that precedes `.sort(`
  const insertPos = match.index;
  const before = content.slice(0, insertPos);
  const after = content.slice(insertPos);

  tree.write(ROUTES_PATH, before + entry + '\n  ' + after);
}
