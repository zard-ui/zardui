import * as fs from 'fs-extra';
import * as path from 'path';
import { ICON_FAMILIES, ICON_MAP, collectIcons, type ComponentIcons } from '../packages/cli/src/core/icons/index';
import { registry, type ComponentRegistry } from '../packages/cli/src/core/registry/registry-data';

/**
 * A forma dos arquivos publicados. Sobe quando a mudança quebra quem lê — campo
 * removido, significado alterado —, e é o que permite a uma CLI antiga dizer
 * "atualize" em vez de ler errado em silêncio. Ver `utils/schema-version.ts`.
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

function getSourcePath(componentName: string, basePath: string): string {
  const nonComponentPaths = ['core', 'services', 'utils'];
  if (nonComponentPaths.includes(basePath)) {
    return path.join(LIB_PATH, basePath);
  }
  return path.join(LIB_PATH, 'components', basePath);
}

/**
 * Lê um arquivo do repositório com quebras de linha normalizadas.
 *
 * O conteúdo vai literal para dentro do JSON do registry e é gravado assim no
 * projeto de quem instala. Lido cru no Windows, cada arquivo entraria com
 * `\r\n` embutido — o registry mudaria por inteiro conforme quem rodou o build
 * e todo componente instalado chegaria com CRLF na máquina do usuário.
 */
function readText(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function readComponentFile(componentName: string, basePath: string, fileName: string): string | null {
  const sourcePath = getSourcePath(componentName, basePath);
  const filePath = path.join(sourcePath, fileName);
  try {
    if (fs.existsSync(filePath)) {
      return readText(filePath);
    }
    console.warn(`  ⚠️  File not found: ${filePath}`);
    return null;
  } catch (error) {
    console.warn(`  ⚠️  Error reading file: ${filePath}`, error);
    return null;
  }
}

/*
 * O campo `docs` do registry foi removido, e não é perda: ele procurava
 * `doc/overview.md` e `doc/api.md`, que a biblioteca abandonou em favor de
 * `doc/api.ts`. Dos 49 itens publicados, exatamente um ainda tinha os arquivos
 * antigos — os outros 45 componentes documentados saíam sem documentação
 * nenhuma, e o MCP respondia "sem docs" para praticamente tudo. Quem responde
 * agora é o `.md` da página, que é completo e existe para os 46.
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

  // Os demos são lidos, mas não publicados: quem os consumia era o MCP, que
  // agora lê o `.md` da página — um documento com instalação, uso, exemplos e
  // API de uma vez, em vez de fragmentos de código soltos. Aqui eles servem
  // só para o mapeamento de ícones, porque metade dos componentes que usam
  // ícone só o usa nos exemplos.
  const demos = readComponentDemos(component.name, basePath);

  // Lidos do próprio código, nunca declarados à mão: uma lista escrita no
  // registry-data envelheceria em silêncio no primeiro ícone trocado, e o campo
  // existe justamente para dizer o que o componente desenha de verdade.
  item.icons = collectIcons(
    files.map(file => file.content),
    demos.map(demo => demo.content),
  );

  return item;
}

/**
 * `icons.json` — as famílias suportadas e a tabela que traduz entre elas.
 *
 * Publicar isto é o que faz uma família nova valer para quem já tem a CLI
 * instalada: ela lê daqui em vez da cópia embutida, então acrescentar uma coluna
 * é um deploy do site, e não um release do pacote.
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
      // O índice carrega só o que o `add` instala: os ícones dos demos não
      // influenciam dependência nenhuma e o índice é baixado a cada comando.
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
