import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BLOCKS_DIR = path.resolve(__dirname, '../libs/blocks/src/lib');

function toCamelCase(name: string): string {
  return name
    .split('-')
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}

function toClassName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function escapeBackticks(content: string): string {
  return content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function syncBlock(blockDir: string, blockName: string): void {
  const blockTsPath = path.join(blockDir, 'block.ts');
  if (!fs.existsSync(blockTsPath)) return;

  const blockContent = fs.readFileSync(blockTsPath, 'utf-8');

  // Read component files (.ts and .html, excluding block.ts)
  const componentFiles = fs
    .readdirSync(blockDir)
    .filter(f => f !== 'block.ts' && (f.endsWith('.ts') || f.endsWith('.html')))
    .sort();

  const filesEntries = componentFiles.map(fileName => {
    const filePath = path.join(blockDir, fileName);
    const content = fs.readFileSync(filePath, 'utf-8');
    const language = fileName.endsWith('.ts') ? 'typescript' : 'html';

    return `    {
      name: '${fileName}',
      path: 'src/components/${blockName}/${fileName}',
      content: \`${escapeBackticks(content)}\`,
      language: '${language}',
    }`;
  });

  const filesArray = `[\n${filesEntries.join(',\n')},\n  ]`;

  // Find `files:` and use bracket counting to locate the closing `]`
  // Skips brackets inside backtick strings to handle embedded content
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
  const updatedContent = `${before}files: ${filesArray}${after}`;

  if (updatedContent !== blockContent) {
    fs.writeFileSync(blockTsPath, updatedContent, 'utf-8');
    console.log(`  ✅ ${blockName}: synced ${componentFiles.length} files`);
  } else {
    console.log(`  ⏭️  ${blockName}: no changes`);
  }
}

function main(): void {
  console.log('🔄 Syncing block files...\n');

  if (!fs.existsSync(BLOCKS_DIR)) {
    console.error('❌ Blocks directory not found:', BLOCKS_DIR);
    process.exit(1);
  }

  const blockDirs = fs.readdirSync(BLOCKS_DIR).filter(dir => fs.statSync(path.join(BLOCKS_DIR, dir)).isDirectory());

  if (blockDirs.length === 0) {
    console.log('  No blocks found.');
    return;
  }

  for (const dir of blockDirs) {
    syncBlock(path.join(BLOCKS_DIR, dir), dir);
  }

  console.log(`\n✅ Done! Synced ${blockDirs.length} block(s).`);
}

main();
