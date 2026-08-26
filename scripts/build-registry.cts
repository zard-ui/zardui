import * as fs from 'fs-extra';
import * as path from 'path';
import { ICON_FAMILIES, ICON_MAP, collectIcons, type ComponentIcons } from '../packages/cli/src/core/icons/index';
import { registry, type ComponentRegistry } from '../packages/cli/src/core/registry/registry-data';

/**
 * The shape of the published files. It goes up when a change breaks a reader — a
 * field removed, a meaning altered — and it is what lets an old CLI say "update"
 * instead of silently reading it wrong. See `utils/schema-version.ts`.
 */
const SCHEMA_VERSION = 1;

const LIB_PATH = path.resolve(__dirname, '../libs/zard/src/lib/shared');
const OUTPUT_PATH = path.resolve(__dirname, '../apps/web/public/r');

const BLOCKS_PATH = path.resolve(__dirname, '../libs/blocks/src/lib');
const BLOCKS_OUTPUT_PATH = path.resolve(OUTPUT_PATH, 'blocks');

interface RegistryFile {
  name: string;
  content: string;
}

interface RegistryItem {
  $schema: string;
  name: string;
  type: 'registry:component';
  basePath?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  icons?: ComponentIcons;
  files: RegistryFile[];
}

interface RegistryIndex {
  $schema: string;
  schemaVersion: number;
  name: string;
  homepage: string;
  version: string;
  items: Array<{
    name: string;
    type: string;
    basePath?: string;
    dependencies?: string[];
    devDependencies?: string[];
    registryDependencies?: string[];
    icons?: ComponentIcons;
    files: string[];
  }>;
}

function getCliVersion(): string {
  try {
    const packageJsonPath = path.resolve(__dirname, '../packages/cli/package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version;
  } catch {
    return '0.0.0';
  }
}

/*
 * Where a non-component item's source lives in this repository.
 *
 * The key is the `basePath` the registry publishes — the install destination —
 * and the value is the source directory. The first three agree; typeset does
 * not: it ships next to the installing project's global CSS, but it is born
 * beside the core's tailwind.css, which is where it is edited and tested.
 */
const NON_COMPONENT_PATHS: Record<string, string> = {
  core: 'core',
  services: 'services',
  utils: 'utils',
  styles: 'core/css',
};

function getSourcePath(componentName: string, basePath: string): string {
  const nonComponentPath = NON_COMPONENT_PATHS[basePath];
  if (nonComponentPath) {
    return path.join(LIB_PATH, nonComponentPath);
  }
  return path.join(LIB_PATH, 'components', basePath);
}

/**
 * Reads a file from the repository with normalized line endings.
 *
 * The content goes verbatim into the registry JSON and is written that way into
 * the installing project. Read raw on Windows, every file would carry embedded
 * `\r\n` — the registry would change wholesale depending on who ran the build,
 * and every installed component would arrive with CRLF on the user's machine.
 */
function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

/**
 * A listed file that is not on disk is a broken publish, not a warning.
 *
 * `alert-dialog` shipped five of its six declared files for months because this
 * only logged: the item went out missing a file and the build still exited 0.
 */
function readComponentFile(componentName: string, basePath: string, fileName: string): string {
  const sourcePath = getSourcePath(componentName, basePath);
  const filePath = path.join(sourcePath, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Registry item "${componentName}" lists a file that does not exist: ${filePath}\n` +
        'Fix the file list in packages/cli/src/core/registry/registry-data.ts.',
    );
  }

  return readText(filePath);
}

/*
 * The registry's `docs` field was removed, and it is no loss: it looked for
 * `doc/overview.md` and `doc/api.md`, which the library abandoned in favour of
 * `doc/api.ts`. Of the published items, exactly one still had the old files —
 * every other documented component went out with no documentation at all, and
 * the MCP answered "no docs" for practically everything. What answers now is the
 * page's `.md`, which is complete and exists for all of them.
 */

function readComponentDemos(componentName: string, basePath: string): RegistryFile[] {
  const sourcePath = getSourcePath(componentName, basePath);
  const demoPath = path.join(sourcePath, 'demo');

  if (!fs.existsSync(demoPath)) return [];

  const demoFiles = fs
    .readdirSync(demoPath)
    .filter(f => f.endsWith('.ts') && f !== `${componentName}.ts`)
    .sort();

  return demoFiles
    .map(fileName => {
      const content = readText(path.join(demoPath, fileName));
      return { name: fileName, content };
    })
    .filter(f => f.content.length > 0);
}

function buildComponentJson(component: ComponentRegistry): RegistryItem | null {
  const files: RegistryFile[] = [];
  const basePath = component.basePath ?? component.name;

  for (const file of component.files) {
    files.push({
      name: file.name,
      content: readComponentFile(component.name, basePath, file.name),
    });
  }

  if (files.length === 0) {
    throw new Error(`Registry item "${component.name}" declares no files.`);
  }

  const item: RegistryItem = {
    // The item has a shape of its own — files with content, and the demo icons
    // the index does not carry — so it points at a schema of its own.
    $schema: 'https://zardui.com/schema/registry-item.json',
    name: component.name,
    type: 'registry:component',
    files,
  };

  if (component.basePath) {
    item.basePath = component.basePath;
  }

  if (component.dependencies?.length) {
    item.dependencies = component.dependencies;
  }

  if (component.devDependencies?.length) {
    item.devDependencies = component.devDependencies;
  }

  if (component.registryDependencies?.length) {
    item.registryDependencies = component.registryDependencies;
  }

  // The demos are read but not published: the MCP was what consumed them, and it
  // now reads the page's `.md` — one document with installation, usage, examples
  // and API at once, rather than loose code fragments. Here they serve only the
  // icon mapping, because half the components that use an icon only use it in
  // the examples.
  const demos = readComponentDemos(component.name, basePath);

  // Read from the code itself, never declared by hand: a list written in
  // registry-data would go stale in silence at the first icon swapped, and the
  // field exists precisely to say what the component actually draws.
  item.icons = collectIcons(
    files.map(file => file.content),
    demos.map(demo => demo.content),
  );

  return item;
}

/**
 * `icons.json` — the supported families and the table that translates between them.
 *
 * Publishing this is what makes a new family work for someone who already has the
 * CLI installed: it reads from here instead of the bundled copy, so adding a
 * column is a site deploy, not a package release.
 */
function buildIconCatalog(): { $schema: string; schemaVersion: number; families: unknown; icons: unknown } {
  return {
    $schema: 'https://zardui.com/schema/icons.json',
    schemaVersion: SCHEMA_VERSION,
    families: ICON_FAMILIES,
    icons: ICON_MAP,
  };
}

function buildRegistryIndex(items: RegistryItem[]): RegistryIndex {
  return {
    $schema: 'https://zardui.com/schema/registry.json',
    schemaVersion: SCHEMA_VERSION,
    name: '@zard',
    homepage: 'https://zardui.com',
    version: getCliVersion(),
    items: items.map(item => ({
      name: item.name,
      type: item.type,
      ...(item.basePath && { basePath: item.basePath }),
      ...(item.dependencies?.length && { dependencies: item.dependencies }),
      ...(item.devDependencies?.length && { devDependencies: item.devDependencies }),
      ...(item.registryDependencies?.length && { registryDependencies: item.registryDependencies }),
      // The index carries only what `add` installs: the demo icons influence no
      // dependency, and the index is downloaded on every command.
      ...(item.icons && {
        icons: { family: item.icons.family, symbols: item.icons.symbols, tokens: item.icons.tokens },
      }),
      files: item.files.map(f => f.name),
    })),
  };
}

async function main() {
  console.log('🔧 Building component registry...\n');

  fs.ensureDirSync(OUTPUT_PATH);

  const existingFiles = fs.readdirSync(OUTPUT_PATH).filter(f => f.endsWith('.json'));
  for (const file of existingFiles) {
    fs.removeSync(path.join(OUTPUT_PATH, file));
  }

  const items: RegistryItem[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const component of registry) {
    console.log(`📦 Processing: ${component.name}`);

    const item = buildComponentJson(component);

    if (item) {
      items.push(item);

      const outputFile = path.join(OUTPUT_PATH, `${component.name}.json`);
      fs.writeJsonSync(outputFile, item, { spaces: 2 });
      console.log(`   ✅ Generated: ${component.name}.json (${item.files.length} files)`);
      successCount++;
    } else {
      failCount++;
    }
  }

  const registryIndex = buildRegistryIndex(items);
  const indexFile = path.join(OUTPUT_PATH, 'registry.json');
  fs.writeJsonSync(indexFile, registryIndex, { spaces: 2 });

  const iconsFile = path.join(OUTPUT_PATH, 'icons.json');
  fs.writeJsonSync(iconsFile, buildIconCatalog(), { spaces: 2 });
  console.log(
    `   🎨 Icon catalog: ${Object.keys(ICON_FAMILIES).length} family(ies), ${Object.keys(ICON_MAP).length} icons`,
  );

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Registry built successfully!`);
  console.log(`   📁 Output: ${OUTPUT_PATH}`);
  console.log(`   📦 Components: ${successCount} success, ${failCount} failed`);
  console.log(`   📄 Total files: registry.json + ${successCount} component files`);
  console.log(`   🏷️  Version: ${getCliVersion()}`);
  console.log('='.repeat(50));

  // Build blocks registry
  buildBlocksRegistry();

  let totalSize = 0;
  const allJsonFiles = fs.readdirSync(OUTPUT_PATH).filter(f => f.endsWith('.json'));
  for (const file of allJsonFiles) {
    const stat = fs.statSync(path.join(OUTPUT_PATH, file));
    totalSize += stat.size;
  }
  if (fs.existsSync(BLOCKS_OUTPUT_PATH)) {
    const blockFiles = fs.readdirSync(BLOCKS_OUTPUT_PATH).filter(f => f.endsWith('.json'));
    for (const file of blockFiles) {
      const stat = fs.statSync(path.join(BLOCKS_OUTPUT_PATH, file));
      totalSize += stat.size;
    }
  }
  console.log(`   💾 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
}

function buildBlocksRegistry() {
  if (!fs.existsSync(BLOCKS_PATH)) {
    console.log('\n⏭️  No blocks directory found, skipping blocks registry.');
    return;
  }

  console.log('\n🧱 Building blocks registry...\n');
  fs.ensureDirSync(BLOCKS_OUTPUT_PATH);

  const blockDirs = fs.readdirSync(BLOCKS_PATH).filter(dir => fs.statSync(path.join(BLOCKS_PATH, dir)).isDirectory());

  interface BlockMeta {
    id: string;
    title: string;
    description: string;
    category: string;
  }

  interface BlockFile {
    name: string;
    path: string;
    content: string;
    language: string;
  }

  const blocksMeta: BlockMeta[] = [];

  for (const dir of blockDirs) {
    const blockTsPath = path.join(BLOCKS_PATH, dir, 'block.ts');
    if (!fs.existsSync(blockTsPath)) continue;

    const blockContent = readText(blockTsPath);

    const idMatch = blockContent.match(/id:\s*'([^']+)'/);
    const titleMatch = blockContent.match(/title:\s*'([^']+)'/);
    const descMatch = blockContent.match(/description:\s*'([^']+)'/);
    const catMatch = blockContent.match(/category:\s*'([^']+)'/);

    if (!idMatch) continue;

    const id = idMatch[1];
    const title = titleMatch?.[1] ?? id;
    const description = descMatch?.[1] ?? '';
    const category = catMatch?.[1] ?? 'Other';

    blocksMeta.push({ id, title, description, category });

    // Extract files from block.ts content
    const files: BlockFile[] = [];
    const componentFiles = fs
      .readdirSync(path.join(BLOCKS_PATH, dir))
      .filter(f => f !== 'block.ts' && (f.endsWith('.ts') || f.endsWith('.html')));

    for (const fileName of componentFiles) {
      const filePath = path.join(BLOCKS_PATH, dir, fileName);
      const content = readText(filePath);
      const language = fileName.endsWith('.ts') ? 'typescript' : 'html';
      files.push({
        name: fileName,
        path: `src/components/${dir}/${fileName}`,
        content,
        language,
      });
    }

    const blockData = { id, title, description, category, files };
    const blockOutputFile = path.join(BLOCKS_OUTPUT_PATH, `${id}.json`);
    fs.writeJsonSync(blockOutputFile, blockData, { spaces: 2 });
    console.log(`   🧱 Generated: blocks/${id}.json (${files.length} files)`);
  }

  const blocksRegistryFile = path.join(OUTPUT_PATH, 'blocks-registry.json');
  fs.writeJsonSync(blocksRegistryFile, { blocks: blocksMeta }, { spaces: 2 });
  console.log(`\n   ✅ Blocks registry: ${blocksMeta.length} blocks`);
}

main().catch(console.error);
