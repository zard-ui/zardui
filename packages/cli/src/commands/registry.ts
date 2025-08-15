import { Command } from 'commander';
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import { Project, SyntaxKind } from 'ts-morph';
import { logger, spinner } from '../utils/logger.js';
import { ComponentRegistry } from '../utils/registry.js';

export const registry = new Command()
  .name('registry')
  .description('generate or update the component registry')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('--dry-run', 'show what would be updated without making changes', false)
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

    // Look for the component library
    const libPath = path.join(cwd, 'libs/zard/src/lib/components');

    if (!existsSync(libPath)) {
      logger.error('ZardUI component library not found. This command should be run from the project root.');
      process.exit(1);
    }

    const registryPath = path.join(cwd, 'packages/cli/src/utils/registry.ts');

    if (!existsSync(registryPath)) {
      logger.error('Registry file not found. Expected at packages/cli/src/utils/registry.ts');
      process.exit(1);
    }

    const generateSpinner = spinner('Analyzing components...').start();

    try {
      // Scan component directories
      const componentDirs = await fs.readdir(libPath, { withFileTypes: true });
      const components = componentDirs
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'core')
        .map(dirent => dirent.name)
        .sort();

      generateSpinner.text = 'Analyzing existing registry...';

      // Read existing registry
      const registryContent = await fs.readFile(registryPath, 'utf8');
      const existingComponents = extractExistingComponents(registryContent);

      generateSpinner.text = 'Generating component entries...';

      // Generate new entries for missing components
      const newEntries: ComponentRegistry[] = [];

      for (const componentName of components) {
        if (!existingComponents.includes(componentName)) {
          const componentPath = path.join(libPath, componentName);
          const entry = await generateComponentEntry(componentPath, componentName);
          if (entry) {
            newEntries.push(entry);
          }
        }
      }

      generateSpinner.succeed(`Found ${newEntries.length} new components to add to registry`);

      if (newEntries.length === 0) {
        logger.info('Registry is up to date. All components are already registered.');
        return;
      }

      if (options.dryRun) {
        logger.info('Dry run - components that would be added:');
        newEntries.forEach(entry => {
          logger.info(`  - ${entry.name}`);
          if (entry.dependencies && entry.dependencies.length > 0) {
            logger.info(`    Dependencies: ${entry.dependencies.join(', ')}`);
          }
          if (entry.files && entry.files.length > 0) {
            logger.info(`    Files: ${entry.files.map(f => f.name).join(', ')}`);
          }
        });
        return;
      }

      // Update registry file
      const updateSpinner = spinner('Updating registry...').start();

      const updatedRegistry = await updateRegistryFile(registryContent, newEntries);
      await fs.writeFile(registryPath, updatedRegistry, 'utf8');

      updateSpinner.succeed('Registry updated successfully!');

      logger.break();
      logger.success(`Added ${newEntries.length} new component(s) to registry:`);
      newEntries.forEach(entry => logger.info(`  - ${entry.name}`));
    } catch (error) {
      generateSpinner.fail('Failed to generate registry');
      logger.error(error);
      process.exit(1);
    }
  });

function extractExistingComponents(registryContent: string): string[] {
  const nameMatches = registryContent.match(/name: '[^']+'/g) || [];
  return nameMatches
    .map(match => match.replace(/name: '([^']+)'/, '$1'))
    .filter(name => !name.includes('.')) // Filter out file names, keep only component names
    .filter((name, index, arr) => arr.indexOf(name) === index); // Remove duplicates
}

async function generateComponentEntry(componentPath: string, componentName: string): Promise<ComponentRegistry | null> {
  try {
    const files = await fs.readdir(componentPath);

    // Filter out demo and doc directories, and spec files
    const componentFiles = files.filter(
      file => !file.startsWith('demo') && !file.startsWith('doc') && !file.includes('.spec.') && (file.endsWith('.ts') || file.endsWith('.html')),
    );

    if (componentFiles.length === 0) {
      return null;
    }

    // Analyze main component file to determine dependencies
    const mainComponentFile = componentFiles.find(file => file === `${componentName}.component.ts` || file === `${componentName}.directive.ts` || file === `${componentName}.ts`);

    let dependencies: string[] = ['class-variance-authority']; // Default dependency

    if (mainComponentFile) {
      const filePath = path.join(componentPath, mainComponentFile);
      const content = await fs.readFile(filePath, 'utf8');
      dependencies = [...dependencies, ...analyzeDependencies(content)];
    }

    // Remove duplicates and sort
    dependencies = [...new Set(dependencies)].sort();

    return {
      name: componentName,
      dependencies,
      files: componentFiles.map(name => ({
        name,
        content: '', // Content will be fetched from GitHub
      })),
    };
  } catch (error) {
    logger.warn(`Failed to analyze component ${componentName}: ${error}`);
    return null;
  }
}

function analyzeDependencies(content: string): string[] {
  const dependencies: string[] = [];

  // Check for common Angular dependencies
  if (content.includes('@angular/forms') || content.includes('FormsModule') || content.includes('ReactiveFormsModule')) {
    dependencies.push('@angular/forms');
  }

  if (content.includes('@angular/cdk') || content.includes('@angular/cdk/')) {
    dependencies.push('@angular/cdk');
  }

  if (content.includes('@angular/router') || content.includes('RouterModule')) {
    dependencies.push('@angular/router');
  }

  // Check for other common dependencies based on imports
  if (content.includes("from '@angular/animations'")) {
    dependencies.push('@angular/animations');
  }

  return dependencies;
}

async function updateRegistryFile(registryContent: string, newEntries: ComponentRegistry[]): Promise<string> {
  if (newEntries.length === 0) {
    return registryContent;
  }

  // Find the closing bracket of the registry array
  const registryEndIndex = registryContent.lastIndexOf('];');

  if (registryEndIndex === -1) {
    throw new Error('Could not find registry array end');
  }

  // Generate new entries as string
  const newEntriesString = newEntries
    .map(entry => {
      const dependenciesStr = entry.dependencies && entry.dependencies.length > 0 ? `\n    dependencies: [${entry.dependencies.map(dep => `'${dep}'`).join(', ')}],` : '';

      const filesStr = entry.files.map(file => `      {\n        name: '${file.name}',\n        content: '',\n      }`).join(',\n');

      return `  {\n    name: '${entry.name}',${dependenciesStr}\n    files: [\n${filesStr},\n    ],\n  }`;
    })
    .join(',\n');

  // Insert new entries before the closing bracket
  const beforeClosing = registryContent.substring(0, registryEndIndex);
  const afterClosing = registryContent.substring(registryEndIndex);

  // Add comma after last existing entry if needed
  const needsComma = beforeClosing.trim().endsWith('},');
  const separator = needsComma ? ',\n' : '\n';

  return beforeClosing + separator + newEntriesString + '\n' + afterClosing;
}
