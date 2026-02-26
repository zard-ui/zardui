import * as fs from 'fs-extra';
import * as path from 'path';
import { registry, type ComponentRegistry } from '../packages/cli/src/core/registry/registry-data';

const LIB_PATH = path.resolve(__dirname, '../libs/zard/src/lib/shared');
const OUTPUT_PATH = path.resolve(__dirname, '../apps/web/public/r');

const BLOCKS_PATH = path.resolve(__dirname, '../libs/blocks/src/lib');
const BLOCKS_OUTPUT_PATH = path.resolve(OUTPUT_PATH, 'blocks');

interface RegistryFile {
  name: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: 'registry:component';
  basePath?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  docs?: { overview: string; api: string };
  demos?: RegistryFile[];
}

interface RegistryIndex {
  $schema: string;
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

function getSourcePath(componentName: string, basePath: string): string {
  const nonComponentPaths = ['core', 'services', 'utils'];
  if (nonComponentPaths.includes(basePath)) {
    return path.join(LIB_PATH, basePath);
  }
  return path.join(LIB_PATH, 'components', basePath);
}

function readComponentFile(componentName: string, basePath: string, fileName: string): string | null {
  const sourcePath = getSourcePath(componentName, basePath);
  const filePath = path.join(sourcePath, fileName);
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf8');
    }
    console.warn(`  ⚠️  File not found: ${filePath}`);
    return null;
  } catch (error) {
    console.warn(`  ⚠️  Error reading file: ${filePath}`, error);
    return null;
  }
}

function readComponentDocs(componentName: string, basePath: string): { overview: string; api: string } | null {
  const sourcePath = getSourcePath(componentName, basePath);
  const docPath = path.join(sourcePath, 'doc');

  if (!fs.existsSync(docPath)) return null;

  const overviewPath = path.join(docPath, 'overview.md');
  const apiPath = path.join(docPath, 'api.md');

  const overview = fs.existsSync(overviewPath) ? fs.readFileSync(overviewPath, 'utf8') : '';
  const api = fs.existsSync(apiPath) ? fs.readFileSync(apiPath, 'utf8') : '';

  if (!overview && !api) return null;
  return { overview, api };
}

function readComponentDemos(componentName: string, basePath: string): RegistryFile[] {
  const sourcePath = getSourcePath(componentName, basePath);
  const demoPath = path.join(sourcePath, 'demo');

  if (!fs.existsSync(demoPath)) return [];

  const demoFiles = fs.readdirSync(demoPath)
    .filter(f => f.endsWith('.ts') && f !== `${componentName}.ts`)
    .sort();

  return demoFiles
    .map(fileName => {
      const content = fs.readFileSync(path.join(demoPath, fileName), 'utf8');
      return { name: fileName, content };
    })
    .filter(f => f.content.length > 0);
}

function buildComponentJson(component: ComponentRegistry): RegistryItem | null {
  const files: RegistryFile[] = [];
  const basePath = component.basePath ?? component.name;

  for (const file of component.files) {
    const content = readComponentFile(component.name, basePath, file.name);
    if (content !== null) {
      files.push({
        name: file.name,
        content,
      });
    }
  }

  if (files.length === 0) {
    console.warn(`  ⚠️  No files found for component: ${component.name}`);
    return null;
  }

  const item: RegistryItem = {
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

  const docs = readComponentDocs(component.name, basePath);
  if (docs) {
    item.docs = docs;
  }

  const demos = readComponentDemos(component.name, basePath);
  if (demos.length > 0) {
    item.demos = demos;
  }

  return item;
}

function buildRegistryIndex(items: RegistryItem[]): RegistryIndex {
  return {
    $schema: 'https://zardui.com/schema/registry.json',
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

  const blockDirs = fs.readdirSync(BLOCKS_PATH).filter(dir =>
    fs.statSync(path.join(BLOCKS_PATH, dir)).isDirectory()
  );

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

    const blockContent = fs.readFileSync(blockTsPath, 'utf8');

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
    const componentFiles = fs.readdirSync(path.join(BLOCKS_PATH, dir))
      .filter(f => f !== 'block.ts' && (f.endsWith('.ts') || f.endsWith('.html')));

    for (const fileName of componentFiles) {
      const filePath = path.join(BLOCKS_PATH, dir, fileName);
      const content = fs.readFileSync(filePath, 'utf8');
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
