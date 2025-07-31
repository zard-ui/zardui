import * as fs from 'fs-extra';
import * as path from 'path';

const componentsPath = path.resolve(__dirname, '../libs/zard/src/lib/components');
const publicPath = path.resolve(__dirname, '../apps/web/public/installation');

console.log('🔄 Generating installation guides...');

interface ComponentDependency {
  name: string;
  type: 'internal' | 'external' | 'angular' | 'utils';
  path?: string;
  npmPackage?: string;
}

// Analyze component file to extract dependencies
function analyzeComponentDependencies(componentPath: string, componentName: string): ComponentDependency[] {
  const dependencies: ComponentDependency[] = [];
  
  try {
    const componentFile = path.join(componentPath, `${componentName}.component.ts`);
    const variantsFile = path.join(componentPath, `${componentName}.variants.ts`);
    
    let content = '';
    if (fs.existsSync(componentFile)) {
      content += fs.readFileSync(componentFile, 'utf-8');
    }
    if (fs.existsSync(variantsFile)) {
      content += fs.readFileSync(variantsFile, 'utf-8');
    }

    // Check for common external dependencies
    if (content.includes('class-variance-authority') || content.includes('cva') || content.includes('VariantProps')) {
      dependencies.push({
        name: 'class-variance-authority',
        type: 'external',
        npmPackage: 'class-variance-authority'
      });
    }

    if (content.includes('tailwind-merge') || content.includes('twMerge')) {
      dependencies.push({
        name: 'tailwind-merge',
        type: 'external',
        npmPackage: 'tailwind-merge'
      });
    }

    if (content.includes('clsx')) {
      dependencies.push({
        name: 'clsx',
        type: 'external',
        npmPackage: 'clsx'
      });
    }

    if (content.includes('@angular/cdk/overlay')) {
      dependencies.push({
        name: '@angular/cdk/overlay',
        type: 'angular',
        npmPackage: '@angular/cdk'
      });
    }

    if (content.includes('@angular/cdk/portal')) {
      dependencies.push({
        name: '@angular/cdk/portal',
        type: 'angular',
        npmPackage: '@angular/cdk'
      });
    }

    if (content.includes('@angular/animations')) {
      dependencies.push({
        name: '@angular/animations',
        type: 'angular',
        npmPackage: '@angular/animations'
      });
    }

    if (content.includes('rxjs')) {
      dependencies.push({
        name: 'rxjs',
        type: 'external',
        npmPackage: 'rxjs'
      });
    }

    // Check for utils dependency
    if (content.includes('mergeClasses') || content.includes('utils')) {
      dependencies.push({
        name: 'utils',
        type: 'utils',
        path: 'lib/utils.ts'
      });
    }

    // Check for internal component dependencies
    const componentImports = content.match(/from\s+['"]\.\/([^'"]+)/g);
    if (componentImports) {
      componentImports.forEach(imp => {
        const match = imp.match(/from\s+['"]\.\/([^'"]+)/);
        if (match && match[1].includes('component')) {
          const depName = match[1].replace('.component', '').replace('-', '');
          dependencies.push({
            name: depName,
            type: 'internal',
            path: `components/${componentName}/${match[1]}.ts`
          });
        }
      });
    }

  } catch (error) {
    console.warn(`Warning: Could not analyze dependencies for ${componentName}:`, error);
  }

  return dependencies;
}

function generateCliInstallDepsMarkdown(dependencies: ComponentDependency[]): string {
  const externalDeps = dependencies.filter(dep => dep.type === 'external' || dep.type === 'angular');
  if (externalDeps.length === 0) return '';
  
  const packages = [...new Set(externalDeps.map(dep => dep.npmPackage).filter(Boolean))].join(' ');
  
  return `\`\`\`bash
npm install ${packages}
\`\`\``;
}

function generateCliAddComponentMarkdown(componentName: string): string {
  return `\`\`\`bash
npx zardui-cli add ${componentName}
\`\`\``;
}

function generateManualInstallDepsMarkdown(dependencies: ComponentDependency[]): string {
  const externalDeps = dependencies.filter(dep => dep.type === 'external' || dep.type === 'angular');
  if (externalDeps.length === 0) return '';
  
  const packages = [...new Set(externalDeps.map(dep => dep.npmPackage).filter(Boolean))].join(' ');
  
  return `\`\`\`bash
npm install ${packages}
\`\`\``;
}

function generateUtilsMarkdown(): string {
  return `\`\`\`typescript
import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === '' : value;
}
\`\`\``;
}

function generateComponentMarkdown(componentPath: string, componentName: string): string {
  try {
    let markdown = '';
    
    // Helper function to get icon for file type using actual SVG files
    function getFileIcon(fileName: string): string {
      if (fileName.endsWith('.html')) {
        return '<img src="/icons/angular.svg" class="w-4 h-4 inline mr-2" alt="Angular HTML">';
      } else if (fileName.endsWith('.ts')) {
        return '<img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">';
      }
      return '<img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2 opacity-50" alt="File">';
    }
    
    // Check for different file types in order of preference
    const possibleFiles = [
      `${componentName}.component.ts`,
      `${componentName}.directive.ts`, 
      `${componentName}.ts`,
      `${componentName}.variants.ts`
    ];
    
    possibleFiles.forEach(fileName => {
      const filePath = path.join(componentPath, fileName);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const icon = getFileIcon(fileName);
        const language = fileName.endsWith('.ts') ? 'angular-ts' : 'typescript';
        markdown += `### ${icon}${fileName}\n\n\`\`\`${language} showLineNumbers\n${content}\n\`\`\`\n\n`;
      }
    });
    
    // Add additional component files (like service files for dialog) and HTML templates
    const additionalFiles = fs.readdirSync(componentPath)
      .filter(file => {
        // Include .ts and .html files but exclude spec files, demo files, and already processed files
        return (file.endsWith('.ts') || file.endsWith('.html')) && 
               !file.includes('.spec.') && 
               !file.startsWith('demo/') &&
               !possibleFiles.includes(file);
      });
    
    additionalFiles.forEach(fileName => {
      const filePath = path.join(componentPath, fileName);
      const content = fs.readFileSync(filePath, 'utf-8');
      const language = fileName.endsWith('.html') ? 'angular-html' : 'angular-ts';
      const icon = getFileIcon(fileName);
      markdown += `### ${icon}${fileName}\n\n\`\`\`${language} showLineNumbers\n${content}\n\`\`\`\n\n`;
    });
    
    return markdown || `// No TypeScript files found for ${componentName}`;
  } catch (error) {
    return `// Error loading component code for ${componentName}`;
  }
}

function processComponent(componentName: string) {
  const componentPath = path.join(componentsPath, componentName);
  
  if (!fs.existsSync(componentPath) || !fs.statSync(componentPath).isDirectory()) {
    return;
  }

  console.log(`🔧 Processing ${componentName}...`);
  
  // Analyze dependencies
  const dependencies = analyzeComponentDependencies(componentPath, componentName);
  
  // Create directories
  const cliDir = path.join(publicPath, 'cli');
  const manualDir = path.join(publicPath, 'manual');
  fs.ensureDirSync(cliDir);
  fs.ensureDirSync(manualDir);
  
  // Generate CLI files
  const cliDepsMarkdown = generateCliInstallDepsMarkdown(dependencies);
  if (cliDepsMarkdown) {
    fs.writeFileSync(path.join(cliDir, `install-deps-${componentName}.md`), cliDepsMarkdown);
  }
  
  const cliAddMarkdown = generateCliAddComponentMarkdown(componentName);
  fs.writeFileSync(path.join(cliDir, `add-${componentName}.md`), cliAddMarkdown);
  
  // Generate Manual files
  const manualDepsMarkdown = generateManualInstallDepsMarkdown(dependencies);
  if (manualDepsMarkdown) {
    fs.writeFileSync(path.join(manualDir, `install-deps-${componentName}.md`), manualDepsMarkdown);
  }
  
  // Generate utils file (shared)
  if (dependencies.some(dep => dep.type === 'utils')) {
    const utilsMarkdown = generateUtilsMarkdown();
    fs.writeFileSync(path.join(manualDir, 'utils.md'), utilsMarkdown);
  }
  
  // Generate component code
  const componentMarkdown = generateComponentMarkdown(componentPath, componentName);
  fs.writeFileSync(path.join(manualDir, `${componentName}.md`), componentMarkdown);
  
  console.log(`  ✅ Generated installation guides for ${componentName}`);
  console.log(`     Dependencies: ${dependencies.map(d => d.name).join(', ')}`);
}

function generateAllInstallationGuides() {
  const components = fs.readdirSync(componentsPath);
  
  components.forEach(componentName => {
    const skips = ['styles', 'core', 'components.ts'];
    if (skips.includes(componentName)) return;
    
    processComponent(componentName);
  });
  
  console.log('\n✅ All installation guides generated successfully!');
}

// Run the generation
generateAllInstallationGuides();