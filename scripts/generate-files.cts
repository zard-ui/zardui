import * as fs from 'fs-extra';
import * as path from 'path';
import { exec } from 'child_process';

let watching = false;
const componentsPath = path.resolve(__dirname, '../libs/zard/src/lib/components');
const publicPath = path.resolve(__dirname, '../apps/web/public/components');

console.log('Watching files change...');
fs.watch(
  componentsPath,
  {
    persistent: true,
    recursive: true,
  },
  (eventType: any, fileName: string) => {
    if (eventType != 'change') return;

    const skips = ['demo', 'doc'];
    if (!skips.some(x => fileName?.includes(x))) return;

    if (watching) return;
    watching = true;

    console.log('\n📝  ' + fileName + ' was changed.');
    console.log('🧱  Generating files...');

    generateFiles();
    
    // Also generate installation guides when component files change
    if (fileName?.includes('.component.ts') || fileName?.includes('.variants.ts')) {
      console.log('🔧  Generating installation guides...');
      exec('npx tsx scripts/generate-installation-guides.cts', (error) => {
        if (error) {
          console.error('❌ Error generating installation guides:', error);
        } else {
          console.log('✅ Installation guides updated');
        }
      });
    }

    setTimeout(() => {
      watching = false;
    }, 3000);
  },
);

function convertTsToMd(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Wrap the TypeScript content in markdown code block
  return `\`\`\`angular-ts showLineNumbers
${content}
\`\`\``;
}

function isConfigurationFile(fileName: string, componentName: string): boolean {
  const baseName = path.basename(fileName, '.ts');
  // Configuration files typically have the same name as the component
  return baseName === componentName;
}

function generateFiles() {
  const componentsDir = fs.readdirSync(componentsPath);
  componentsDir.forEach((componentName: string) => {
    const componentDirPath = path.join(componentsPath, componentName);

    const skips = ['styles', 'core'];
    if (skips.indexOf(componentName) !== -1) return;

    if (fs.statSync(componentDirPath).isDirectory()) {
      copyFolder(componentDirPath, componentName, 'doc');
      processDemoFolder(componentDirPath, componentName);
    }
  });

  console.log('✅  Files generated with success!');
}

function copyFolder(componentDirPath: string, componentName: string, folderName: string) {
  const frontendResourcePath = path.resolve(__dirname, '../apps/web/public');

  const demoDirPath = path.join(componentDirPath, folderName);
  if (!fs.existsSync(demoDirPath)) return;

  const demoAssetsDirPath = path.join(frontendResourcePath, `components/${componentName}/${folderName}`);
  fs.copySync(demoDirPath, demoAssetsDirPath, { overwrite: true });
}

function processDemoFolder(componentDirPath: string, componentName: string) {
  const demoPath = path.join(componentDirPath, 'demo');
  
  if (!fs.existsSync(demoPath)) return;
  
  const demoFiles = fs.readdirSync(demoPath);
  const publicDemoPath = path.join(publicPath, componentName, 'demo');
  
  // Ensure public demo directory exists
  fs.ensureDirSync(publicDemoPath);
  
  demoFiles.forEach((file: string) => {
    if (path.extname(file) === '.ts') {
      // Skip configuration files
      if (isConfigurationFile(file, componentName)) {
        return;
      }
      
      const tsFilePath = path.join(demoPath, file);
      const mdFileName = path.basename(file, '.ts') + '.md';
      const mdFilePath = path.join(publicDemoPath, mdFileName);
      
      // Convert .ts to .md
      const markdownContent = convertTsToMd(tsFilePath);
      fs.writeFileSync(mdFilePath, markdownContent);
    } else if (path.extname(file) === '.md') {
      // Copy existing .md files as is
      const sourceFile = path.join(demoPath, file);
      const targetFile = path.join(publicDemoPath, file);
      fs.copyFileSync(sourceFile, targetFile);
    }
  });
}
