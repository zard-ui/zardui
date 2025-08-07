import * as fs from 'fs-extra';
import * as path from 'path';

const componentsPath = path.resolve(__dirname, '../libs/zard/src/lib/components');
const publicPath = path.resolve(__dirname, '../apps/web/public/components');

console.log('🔄 Converting demo .ts files to .md files...');

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

function processComponent(componentName: string) {
  const componentPath = path.join(componentsPath, componentName);
  const demoPath = path.join(componentPath, 'demo');
  
  if (!fs.existsSync(demoPath)) return;
  
  const demoFiles = fs.readdirSync(demoPath);
  const publicDemoPath = path.join(publicPath, componentName, 'demo');
  
  // Ensure public demo directory exists
  fs.ensureDirSync(publicDemoPath);
  
  demoFiles.forEach(file => {
    if (path.extname(file) === '.ts') {
      // Skip configuration files
      if (isConfigurationFile(file, componentName)) {
        console.log(`  ⏭️  ${componentName}/${file} (skipped - configuration file)`);
        return;
      }
      
      const tsFilePath = path.join(demoPath, file);
      const mdFileName = path.basename(file, '.ts') + '.md';
      const mdFilePath = path.join(publicDemoPath, mdFileName);
      
      // Convert .ts to .md
      const markdownContent = convertTsToMd(tsFilePath);
      fs.writeFileSync(mdFilePath, markdownContent);
      
      console.log(`  ✅ ${componentName}/${file} → ${mdFileName}`);
    } else if (path.extname(file) === '.md') {
      // Copy existing .md files as is
      const sourceFile = path.join(demoPath, file);
      const targetFile = path.join(publicDemoPath, file);
      fs.copyFileSync(sourceFile, targetFile);
      
      console.log(`  📄 ${componentName}/${file} (copied)`);
    }
  });
}

function convertAllDemos() {
  const components = fs.readdirSync(componentsPath);
  
  components.forEach(componentName => {
    const componentDir = path.join(componentsPath, componentName);
    const skips = ['styles', 'core', 'components.ts'];
    
    if (skips.includes(componentName) || !fs.statSync(componentDir).isDirectory()) {
      return;
    }
    
    console.log(`🔧 Processing ${componentName}...`);
    processComponent(componentName);
  });
  
  console.log('\n✅ All demos converted successfully!');
}

// Run the conversion
convertAllDemos();