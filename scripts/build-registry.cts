import * as fs from 'fs-extra';
import * as path from 'path';
import { registry, type ComponentRegistry } from '../packages/cli/src/core/registry/registry-data';

const LIB_PATH = path.resolve(__dirname, '../libs/zard/src/lib');
const OUTPUT_PATH = path.resolve(__dirname, '../apps/web/public/r');

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

  return item;
}

function buildRegistryIndex(items: RegistryItem[]): RegistryIndex {
  return {
    $schema: 'https://zardui.com/schema/registry.json',
    name: '@ngzard',
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

  let totalSize = 0;
  const files = fs.readdirSync(OUTPUT_PATH).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const stat = fs.statSync(path.join(OUTPUT_PATH, file));
    totalSize += stat.size;
  }
  console.log(`   💾 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
}

main().catch(console.error);
