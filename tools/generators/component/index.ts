import { type Tree, formatFiles, generateFiles, logger } from '@nx/devkit';
import * as path from 'path';

import type { ComponentGeneratorSchema } from './schema';

const COMPONENTS_DIR = 'libs/zard/src/lib/shared/components';
const INDEX_PATH = 'libs/zard/src/index.ts';
const REGISTRY_PATH = 'apps/web/src/app/shared/constants/components.constant.ts';
const ROUTES_PATH = 'apps/web/src/app/shared/constants/routes.constant.ts';
const USAGE_DATA_PATH = 'packages/highlight/src/generator/usage-data.ts';

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

function escapeSingleQuotes(value: string): string {
  return value.replace(/'/g, "\\'");
}

export default async function componentGenerator(tree: Tree, schema: ComponentGeneratorSchema) {
  const kebabName = schema.name.toLowerCase();

  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(kebabName)) {
    throw new Error(`Invalid component name "${schema.name}". Use kebab-case, e.g. "date-picker".`);
  }

  if (tree.exists(`${COMPONENTS_DIR}/${kebabName}`)) {
    throw new Error(`Component "${kebabName}" already exists at ${COMPONENTS_DIR}/${kebabName}.`);
  }

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
    descriptionEscaped: escapeSingleQuotes(desc),
    descriptionLower,
    template: '',
  };

  // 1. Generate component files from templates
  generateFiles(tree, path.join(__dirname, 'files'), COMPONENTS_DIR, templateVars);

  // 2. Add export to libs/zard/src/index.ts
  addExportToIndex(tree, kebabName);

  // 3. Add entry to COMPONENTS_REGISTRY
  addRegistryEntry(tree, kebabName, constantName, desc);

  // 4. Add entry to COMPONENTS_PATH routes
  addRouteEntry(tree, kebabName, displayName);

  // 5. Add entry to USAGE_DATA so `@generated/usage/<name>` is produced
  addUsageDataEntry(tree, kebabName, className, selector, displayName);

  await formatFiles(tree);

  logger.info(
    [
      '',
      `✅ Component "${kebabName}" scaffolded.`,
      '',
      'Next steps:',
      `  1. Implement ${COMPONENTS_DIR}/${kebabName}/${kebabName}.component.ts and its variants.`,
      `  2. Document the public API in ${COMPONENTS_DIR}/${kebabName}/doc/api.ts.`,
      '  3. Run `npm run generate:highlight` to emit the highlighted code under apps/web/src/generated/',
      `     (demo, installation and usage blocks imported by demo/${kebabName}.ts).`,
      '  4. Commit the generated files — apps/web/src/generated/ is versioned.',
      '',
    ].join('\n'),
  );
}

/**
 * Inserts the new barrel export alphabetically among the existing
 * `./lib/shared/components/*` lines, leaving every other line untouched.
 */
function addExportToIndex(tree: Tree, name: string): void {
  const content = tree.read(INDEX_PATH, 'utf-8');
  if (!content) {
    throw new Error(`Could not read ${INDEX_PATH}.`);
  }

  const newExport = `export * from './lib/shared/components/${name}';`;
  if (content.includes(newExport)) return;

  const lines = content.split('\n');
  const isComponentExport = (line: string) => line.includes("'./lib/shared/components/");

  let insertAt = -1;
  for (let i = 0; i < lines.length; i++) {
    if (!isComponentExport(lines[i])) continue;
    if (lines[i].localeCompare(newExport) > 0) {
      insertAt = i;
      break;
    }
    insertAt = i + 1;
  }

  if (insertAt === -1) {
    throw new Error(`Could not find any component export in ${INDEX_PATH} to anchor the new export.`);
  }

  lines.splice(insertAt, 0, newExport);
  tree.write(INDEX_PATH, lines.join('\n'));
}

/** Appends the component entry to COMPONENTS_REGISTRY, anchored on its own declaration. */
function addRegistryEntry(tree: Tree, name: string, constantName: string, description: string): void {
  const content = tree.read(REGISTRY_PATH, 'utf-8');
  if (!content) {
    throw new Error(`Could not read ${REGISTRY_PATH}.`);
  }

  if (content.includes(`componentName: '${name}'`)) return;

  const entry = `  {
    componentName: '${name}',
    description: '${escapeSingleQuotes(description)}',
    loadData: () => import('@zard/components/${name}/demo/${name}').then(m => m.${constantName}),
  },`;

  const closingIndex = findLiteralClose(content, findDeclarationOpen(content, 'COMPONENTS_REGISTRY', '['), '[', ']');
  if (closingIndex === -1) {
    throw new Error(`Could not locate the end of COMPONENTS_REGISTRY in ${REGISTRY_PATH}.`);
  }

  tree.write(REGISTRY_PATH, content.slice(0, closingIndex) + entry + '\n' + content.slice(closingIndex));
}

/**
 * Appends the sidebar entry to COMPONENTS_PATH. Anchored on the `COMPONENTS_PATH`
 * declaration (not on the first `.sort(...)` in the file) so other sections may
 * sort their own items without breaking the generator.
 */
function addRouteEntry(tree: Tree, name: string, displayName: string): void {
  const content = tree.read(ROUTES_PATH, 'utf-8');
  if (!content) {
    throw new Error(`Could not read ${ROUTES_PATH}.`);
  }

  if (content.includes(`path: '/docs/components/${name}'`)) return;

  const entry = `    { name: '${displayName}', path: '/docs/components/${name}', available: true },`;

  const closingIndex = findLiteralClose(content, findNavSectionDataOpen(content, 'COMPONENTS_PATH'), '[', ']');
  if (closingIndex === -1) {
    throw new Error(`Could not locate the end of COMPONENTS_PATH in ${ROUTES_PATH}.`);
  }

  tree.write(ROUTES_PATH, content.slice(0, closingIndex) + entry + '\n  ' + content.slice(closingIndex));
}

/**
 * USAGE_DATA is a hand-maintained record consumed by `usage-writer.ts`. Without an
 * entry, `@generated/usage/<name>` is never written and the demo registry import
 * breaks the build — so the generator seeds a placeholder the author can refine.
 */
function addUsageDataEntry(tree: Tree, name: string, className: string, selector: string, displayName: string): void {
  const content = tree.read(USAGE_DATA_PATH, 'utf-8');
  if (!content) {
    throw new Error(`Could not read ${USAGE_DATA_PATH}.`);
  }

  const key = /^[a-z][a-z0-9]*$/.test(name) ? name : `'${name}'`;
  if (new RegExp(`^\\s*'?${name}'?:\\s*\\{`, 'm').test(content)) return;

  const importCode = `import { Zard${className}Component } from '@/shared/components/${name}/${name}.component';`;
  const entry = `  ${key}: {
    importCode: \`${importCode}\`,
    templateCode: \`<${selector}>${displayName}</${selector}>\`,
  },`;

  const closingIndex = findLiteralClose(content, findDeclarationOpen(content, 'USAGE_DATA', '{'), '{', '}');
  if (closingIndex === -1) {
    throw new Error(`Could not locate the end of USAGE_DATA in ${USAGE_DATA_PATH}.`);
  }

  tree.write(USAGE_DATA_PATH, content.slice(0, closingIndex) + entry + '\n' + content.slice(closingIndex));
}

/**
 * Index of the literal opening a `export const <declaration>...= <open>` statement.
 * The `[^=;]*` guard skips the type annotation, so `Foo: Bar[] = [` anchors on the
 * assignment and not on the `[` of the array type.
 */
function findDeclarationOpen(content: string, declaration: string, open: string): number {
  const match = content.match(new RegExp(`\\b${declaration}\\b[^=;]*=\\s*\\${open}`));
  return match?.index === undefined ? -1 : match.index + match[0].length - 1;
}

/** Index of the `[` opening the `data: [` array of a `NavSection` declaration. */
function findNavSectionDataOpen(content: string, declaration: string): number {
  const declarationIndex = content.search(new RegExp(`\\b${declaration}\\b`));
  if (declarationIndex === -1) return -1;

  const match = content.slice(declarationIndex).match(/data:\s*\[/);
  return match?.index === undefined ? -1 : declarationIndex + match.index + match[0].length - 1;
}

/** Index of the `close` matching the literal that starts at `openIndex`. */
function findLiteralClose(content: string, openIndex: number, open: string, close: string): number {
  if (openIndex === -1) return -1;

  let depth = 0;
  let quote: string | null = null;

  for (let i = openIndex; i < content.length; i++) {
    const char = content[i];
    const prev = content[i - 1];

    if (quote) {
      if (char === quote && prev !== '\\') quote = null;
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === open) depth++;
    else if (char === close) depth--;

    if (depth === 0) return i;
  }

  return -1;
}
