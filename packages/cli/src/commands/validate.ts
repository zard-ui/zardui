import { Command } from 'commander';
import { existsSync, promises as fs } from 'fs';
import path from 'path';
import { logger, spinner } from '../utils/logger.js';
import { ComponentRegistry, getAllComponentNames, getRegistryComponent } from '../utils/registry.js';

interface ValidationResult {
  isValid: boolean;
  missingComponents: string[];
  extraComponents: string[];
  invalidFiles: ComponentFileIssue[];
  dependencyIssues: ComponentDependencyIssue[];
  totalIssues: number;
}

interface ComponentFileIssue {
  component: string;
  missing: string[];
  extra: string[];
  incorrect: string[];
}

interface ComponentDependencyIssue {
  component: string;
  missing: string[];
  unnecessary: string[];
  incorrect: string[];
}

interface ActualComponentStructure {
  name: string;
  files: string[];
  dependencies: string[];
  hasVariants: boolean;
  hasModule: boolean;
  hasService: boolean;
  isDirective: boolean;
}

export const validate = new Command()
  .name('validate')
  .description('validate registry against actual component library')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('--fix', 'automatically fix issues found during validation', false)
  .option('--detailed', 'show detailed information about each component', false)
  .action(async options => {
    const cwd = path.resolve(options.cwd);

    if (!existsSync(cwd)) {
      logger.error(`The path ${cwd} does not exist. Please try again.`);
      process.exit(1);
    }

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

    const validationSpinner = spinner('Validating registry against component library...').start();

    try {
      // Scan actual components
      const actualComponents = await scanActualComponents(libPath);

      // Get registry components
      const registryComponents = getAllComponentNames();

      // Perform validation
      const validation = await performValidation(actualComponents, registryComponents);

      validationSpinner.succeed(`Validation completed. Found ${validation.totalIssues} issue(s)`);

      // Display results
      displayValidationResults(validation, options.detailed);

      if (validation.totalIssues > 0 && options.fix) {
        const fixSpinner = spinner('Fixing registry issues...').start();
        await fixRegistryIssues(validation, actualComponents, registryPath);
        fixSpinner.succeed('Registry issues fixed!');
      }

      if (validation.totalIssues > 0 && !options.fix) {
        logger.break();
        logger.info('Run with --fix to automatically correct these issues.');
      }

      process.exit(validation.isValid ? 0 : 1);
    } catch (error) {
      validationSpinner.fail('Validation failed');
      logger.error(error);
      process.exit(1);
    }
  });

async function scanActualComponents(libPath: string): Promise<ActualComponentStructure[]> {
  const componentDirs = await fs.readdir(libPath, { withFileTypes: true });
  const actualComponents: ActualComponentStructure[] = [];

  for (const dirent of componentDirs) {
    if (!dirent.isDirectory() || dirent.name === 'core') continue;

    const componentPath = path.join(libPath, dirent.name);
    const files = await fs.readdir(componentPath);

    // Filter out demo, doc, spec files
    const componentFiles = files.filter(
      file => !file.startsWith('demo') && !file.startsWith('doc') && !file.includes('.spec.') && (file.endsWith('.ts') || file.endsWith('.html')),
    );

    if (componentFiles.length === 0) continue;

    // Analyze component structure
    const structure = await analyzeComponentStructure(componentPath, dirent.name, componentFiles);
    actualComponents.push(structure);
  }

  return actualComponents.sort((a, b) => a.name.localeCompare(b.name));
}

async function analyzeComponentStructure(componentPath: string, componentName: string, files: string[]): Promise<ActualComponentStructure> {
  // No dependencies needed in registry since all are peerDependencies
  const dependencies: string[] = [];
  let hasVariants = false;
  let hasModule = false;
  let hasService = false;
  let isDirective = false;

  // Analyze each file
  for (const file of files) {
    if (file.includes('.variants.')) {
      hasVariants = true;
    }
    if (file.includes('.module.')) {
      hasModule = true;
    }
    if (file.includes('.service.')) {
      hasService = true;
    }
    if (file.includes('.directive.')) {
      isDirective = true;
    }
  }

  return {
    name: componentName,
    files,
    dependencies,
    hasVariants,
    hasModule,
    hasService,
    isDirective,
  };
}

function analyzeDependencies(content: string): string[] {
  // Since all Angular dependencies are now peerDependencies,
  // we don't need to track them in the registry anymore
  // Only track truly external dependencies that aren't part of the standard Angular setup
  const dependencies: string[] = [];

  // Currently, no additional dependencies are needed beyond peerDependencies
  // class-variance-authority, @angular/forms, @angular/cdk, etc. are all peerDependencies

  return dependencies;
}

async function performValidation(actualComponents: ActualComponentStructure[], registryComponents: string[]): Promise<ValidationResult> {
  const actualComponentNames = actualComponents.map(c => c.name);

  const missingComponents = actualComponentNames.filter(name => !registryComponents.includes(name));
  const extraComponents = registryComponents.filter(name => !actualComponentNames.includes(name));

  const invalidFiles: ComponentFileIssue[] = [];
  const dependencyIssues: ComponentDependencyIssue[] = [];

  // Validate existing components
  for (const actualComponent of actualComponents) {
    if (!registryComponents.includes(actualComponent.name)) continue;

    const registryComponent = getRegistryComponent(actualComponent.name);
    if (!registryComponent) continue;

    // Validate files
    const fileIssue = validateComponentFiles(actualComponent, registryComponent);
    if (fileIssue.missing.length > 0 || fileIssue.extra.length > 0 || fileIssue.incorrect.length > 0) {
      invalidFiles.push(fileIssue);
    }

    // Validate dependencies
    const depIssue = validateComponentDependencies(actualComponent, registryComponent);
    if (depIssue.missing.length > 0 || depIssue.unnecessary.length > 0 || depIssue.incorrect.length > 0) {
      dependencyIssues.push(depIssue);
    }
  }

  const totalIssues = missingComponents.length + extraComponents.length + invalidFiles.length + dependencyIssues.length;

  return {
    isValid: totalIssues === 0,
    missingComponents,
    extraComponents,
    invalidFiles,
    dependencyIssues,
    totalIssues,
  };
}

function validateComponentFiles(actualComponent: ActualComponentStructure, registryComponent: ComponentRegistry): ComponentFileIssue {
  const actualFiles = actualComponent.files;
  const registryFiles = registryComponent.files.map(f => f.name);

  const missing = registryFiles.filter(file => !actualFiles.includes(file));
  const extra = actualFiles.filter(file => !registryFiles.includes(file));

  // Check for incorrectly named files
  const incorrect: string[] = [];

  // Special validation for select component (select-option vs select-item)
  if (actualComponent.name === 'select') {
    const hasSelectItem = actualFiles.some(f => f.includes('select-item'));
    const registryHasSelectOption = registryFiles.some(f => f.includes('select-option'));

    if (hasSelectItem && registryHasSelectOption) {
      incorrect.push('select-option/select-option.component.ts should be select-item.component.ts');
    }
  }

  return {
    component: actualComponent.name,
    missing,
    extra,
    incorrect,
  };
}

function validateComponentDependencies(actualComponent: ActualComponentStructure, registryComponent: ComponentRegistry): ComponentDependencyIssue {
  const actualDeps = actualComponent.dependencies;
  const registryDeps = registryComponent.dependencies || [];

  // Allow specific external dependencies that are not Angular core
  const allowedExternalDeps = ['ngx-sonner'];

  const missing = actualDeps.filter(dep => !registryDeps.includes(dep));
  const unnecessary = registryDeps.filter(dep => !actualDeps.includes(dep) && !allowedExternalDeps.includes(dep));

  return {
    component: actualComponent.name,
    missing,
    unnecessary,
    incorrect: [],
  };
}

function displayValidationResults(validation: ValidationResult, detailed: boolean) {
  logger.break();

  if (validation.isValid) {
    logger.success('✅ Registry is valid! All components match the library structure.');
    return;
  }

  logger.warn(`❌ Registry validation failed. Found ${validation.totalIssues} issue(s):`);
  logger.break();

  if (validation.missingComponents.length > 0) {
    logger.error(`🔍 Missing components in registry (${validation.missingComponents.length}):`);
    validation.missingComponents.forEach(comp => logger.info(`  - ${comp}`));
    logger.break();
  }

  if (validation.extraComponents.length > 0) {
    logger.warn(`➕ Extra components in registry (${validation.extraComponents.length}):`);
    validation.extraComponents.forEach(comp => logger.info(`  - ${comp}`));
    logger.break();
  }

  if (validation.invalidFiles.length > 0) {
    logger.error(`📁 File structure issues (${validation.invalidFiles.length} components):`);
    validation.invalidFiles.forEach(issue => {
      logger.info(`  📦 ${issue.component}:`);
      if (issue.missing.length > 0) {
        logger.info(`    Missing: ${issue.missing.join(', ')}`);
      }
      if (issue.extra.length > 0) {
        logger.info(`    Extra: ${issue.extra.join(', ')}`);
      }
      if (issue.incorrect.length > 0) {
        logger.info(`    Incorrect: ${issue.incorrect.join(', ')}`);
      }
    });
    logger.break();
  }

  if (validation.dependencyIssues.length > 0) {
    logger.error(`🔗 Dependency issues (${validation.dependencyIssues.length} components):`);
    validation.dependencyIssues.forEach(issue => {
      logger.info(`  📦 ${issue.component}:`);
      if (issue.missing.length > 0) {
        logger.info(`    Missing deps: ${issue.missing.join(', ')}`);
      }
      if (issue.unnecessary.length > 0) {
        logger.info(`    Unnecessary deps: ${issue.unnecessary.join(', ')}`);
      }
    });
    logger.break();
  }
}

async function fixRegistryIssues(validation: ValidationResult, actualComponents: ActualComponentStructure[], registryPath: string) {
  if (validation.totalIssues === 0) return;

  // Read current registry
  let registryContent = await fs.readFile(registryPath, 'utf8');

  // Fix missing components
  if (validation.missingComponents.length > 0) {
    const missingEntries = validation.missingComponents
      .map(name => actualComponents.find(c => c.name === name))
      .filter(Boolean)
      .map(comp => createRegistryEntry(comp!));

    registryContent = await addComponentsToRegistry(registryContent, missingEntries);
  }

  // Fix file structure issues
  if (validation.invalidFiles.length > 0) {
    for (const issue of validation.invalidFiles) {
      const actualComponent = actualComponents.find(c => c.name === issue.component);
      if (actualComponent) {
        registryContent = await updateComponentFiles(registryContent, actualComponent);
      }
    }
  }

  // Fix dependency issues
  if (validation.dependencyIssues.length > 0) {
    for (const issue of validation.dependencyIssues) {
      const actualComponent = actualComponents.find(c => c.name === issue.component);
      if (actualComponent) {
        registryContent = await updateComponentDependencies(registryContent, actualComponent);
      }
    }
  }

  // Write updated registry
  await fs.writeFile(registryPath, registryContent, 'utf8');
}

function createRegistryEntry(component: ActualComponentStructure): ComponentRegistry {
  return {
    name: component.name,
    dependencies: component.dependencies,
    files: component.files.map(name => ({
      name,
      content: '',
    })),
  };
}

async function addComponentsToRegistry(registryContent: string, newEntries: ComponentRegistry[]): Promise<string> {
  if (newEntries.length === 0) return registryContent;

  const registryEndIndex = registryContent.lastIndexOf('];');
  if (registryEndIndex === -1) {
    throw new Error('Could not find registry array end');
  }

  const newEntriesString = newEntries
    .map(entry => {
      const dependenciesStr = entry.dependencies && entry.dependencies.length > 0 ? `\n    dependencies: [${entry.dependencies.map(dep => `'${dep}'`).join(', ')}],` : '';

      const filesStr = entry.files.map(file => `      {\n        name: '${file.name}',\n        content: '',\n      }`).join(',\n');

      return `  {\n    name: '${entry.name}',${dependenciesStr}\n    files: [\n${filesStr},\n    ],\n  }`;
    })
    .join(',\n');

  const beforeClosing = registryContent.substring(0, registryEndIndex);
  const afterClosing = registryContent.substring(registryEndIndex);

  const needsComma = beforeClosing.trim().endsWith('},');
  const separator = needsComma ? ',\n' : '\n';

  return beforeClosing + separator + newEntriesString + '\n' + afterClosing;
}

async function updateComponentFiles(registryContent: string, actualComponent: ActualComponentStructure): Promise<string> {
  // Find and update the component entry
  const componentPattern = new RegExp(`(\\s*{\\s*name: '${actualComponent.name}',[\\s\\S]*?files: \\[)[\\s\\S]*?(\\],.*?\\s*},?)`, 'm');

  const filesStr = actualComponent.files.map(file => `      {\n        name: '${file}',\n        content: '',\n      }`).join(',\n');

  const replacement = `$1\n${filesStr},\n    $2`;

  return registryContent.replace(componentPattern, replacement);
}

async function updateComponentDependencies(registryContent: string, actualComponent: ActualComponentStructure): Promise<string> {
  if (!actualComponent.dependencies || actualComponent.dependencies.length === 0) {
    return registryContent;
  }

  const dependenciesStr = actualComponent.dependencies.map(dep => `'${dep}'`).join(', ');

  // Pattern to match component entry and capture dependencies
  const componentPattern = new RegExp(`(\\s*{\\s*name: '${actualComponent.name}',)(?:\\s*dependencies: \\[[^\\]]*\\],)?([\\s\\S]*?\\s*},?)`, 'm');

  const replacement = `$1\n    dependencies: [${dependenciesStr}],$2`;

  return registryContent.replace(componentPattern, replacement);
}
