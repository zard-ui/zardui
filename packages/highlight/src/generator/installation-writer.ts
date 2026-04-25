import fs from 'fs-extra';
import path from 'path';

import { writeIfChanged } from './file-utils';
import { highlightCode } from './highlighter';
import type { CodeBlockData, CodeTabData, CodeTabItem } from '../types';

const COMPONENTS_PATH = path.resolve('libs/zard/src/lib/shared/components');
const OUTPUT_PATH = path.resolve('apps/web/src/generated/installation');
const SKIPPED_DIRS = ['styles', 'core', 'components.ts'];

const BASIC_DEPENDENCIES = [
  '@angular/cdk',
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'tailwindcss-animate',
  '@ng-icons/core',
  '@ng-icons/lucide',
];

interface RegisterConfig {
  title: string;
  code: string;
  language: string;
  highlightLines?: number[];
}

const REGISTER_CONFIGS: Record<string, RegisterConfig> = {
  toast: {
    title: 'app.component.ts',
    language: 'angular-ts',
    highlightLines: [3, 8, 11],
    code: `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardToastComponent } from '@/shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZardToastComponent],
  template: \`
    <router-outlet></router-outlet>
    <z-toaster />
  \`,
})
export class AppComponent {}`,
  },
};

interface ComponentDependency {
  name: string;
  type: 'internal' | 'external' | 'angular' | 'utils';
  npmPackage?: string;
}

export async function generateInstallationFiles(): Promise<number> {
  let count = 0;
  const componentDirs = fs.readdirSync(COMPONENTS_PATH);

  for (const componentName of componentDirs) {
    if (SKIPPED_DIRS.includes(componentName)) continue;

    const componentDir = path.join(COMPONENTS_PATH, componentName);
    if (!fs.existsSync(componentDir) || !fs.statSync(componentDir).isDirectory()) continue;

    const deps = analyzeComponentDependencies(componentDir, componentName);
    count += await generateCliFiles(componentName, deps);
    count += await generateManualFiles(componentDir, componentName, deps);
  }

  return count;
}

async function generateCliFiles(componentName: string, deps: ComponentDependency[]): Promise<number> {
  const cliDir = path.join(OUTPUT_PATH, 'cli');
  fs.ensureDirSync(cliDir);
  let count = 0;

  // CLI add command (always generated)
  const addTabs = await buildPackageManagerTabs([
    { manager: 'npm', command: `npx zard-cli@latest add ${componentName}` },
    { manager: 'pnpm', command: `pnpm dlx zard-cli@latest add ${componentName}` },
    { manager: 'yarn', command: `yarn dlx zard-cli@latest add ${componentName}` },
    { manager: 'bun', command: `bunx zard-cli@latest add ${componentName}` },
  ]);

  const addConst = toConstName(componentName, 'CLI_ADD');
  if (writeIfChanged(path.join(cliDir, `add-${componentName}.ts`), generateTabExport(addConst, addTabs))) count++;

  // CLI install deps (only if extra deps)
  const extraDeps = getExtraDependencies(deps);
  if (extraDeps.length > 0) {
    const packages = extraDeps.join(' ');
    const depsTabs = await buildPackageManagerTabs([
      { manager: 'npm', command: `npm install ${packages}` },
      { manager: 'pnpm', command: `pnpm add ${packages}` },
      { manager: 'yarn', command: `yarn add ${packages}` },
      { manager: 'bun', command: `bun add ${packages}` },
    ]);

    const depsConst = toConstName(componentName, 'CLI_INSTALL_DEPS');
    if (writeIfChanged(path.join(cliDir, `install-deps-${componentName}.ts`), generateTabExport(depsConst, depsTabs)))
      count++;
  }

  // Register step (only if component has register config)
  const registerConfig = REGISTER_CONFIGS[componentName];
  if (registerConfig) {
    const registerDir = path.join(OUTPUT_PATH, 'register');
    fs.ensureDirSync(registerDir);
    const html = await highlightCode(registerConfig.code, registerConfig.language, registerConfig.highlightLines);
    const block: CodeBlockData = {
      html,
      code: registerConfig.code,
      language: registerConfig.language,
      title: registerConfig.title,
      showLineNumbers: true,
      copyButton: true,
      expandable: false,
      highlightLines: registerConfig.highlightLines,
    };
    const registerConst = toConstName(componentName, 'REGISTER');
    if (
      writeIfChanged(
        path.join(registerDir, `register-${componentName}.ts`),
        generateCodeBlockExport(registerConst, block),
      )
    )
      count++;
  }

  return count;
}

async function generateManualFiles(
  componentDir: string,
  componentName: string,
  deps: ComponentDependency[],
): Promise<number> {
  const manualDir = path.join(OUTPUT_PATH, 'manual');
  fs.ensureDirSync(manualDir);
  let count = 0;

  // Manual install deps
  const extraDeps = getExtraDependencies(deps);
  if (extraDeps.length > 0) {
    const packages = extraDeps.join(' ');
    const depsTabs = await buildPackageManagerTabs([
      { manager: 'npm', command: `npm install ${packages}` },
      { manager: 'pnpm', command: `pnpm add ${packages}` },
      { manager: 'yarn', command: `yarn add ${packages}` },
      { manager: 'bun', command: `bun add ${packages}` },
    ]);

    const depsConst = toConstName(componentName, 'MANUAL_INSTALL_DEPS');
    if (
      writeIfChanged(path.join(manualDir, `install-deps-${componentName}.ts`), generateTabExport(depsConst, depsTabs))
    )
      count++;
  }

  // Manual component code (expandable)
  const codeBlocks = await buildComponentCodeBlocks(componentDir, componentName);
  if (codeBlocks.length > 0) {
    const codeConst = toConstName(componentName, 'MANUAL_CODE');
    if (
      writeIfChanged(path.join(manualDir, `${componentName}.ts`), generateCodeBlockArrayExport(codeConst, codeBlocks))
    )
      count++;
  }

  return count;
}

async function buildPackageManagerTabs(commands: Array<{ manager: string; command: string }>): Promise<CodeTabData> {
  const tabs: CodeTabItem[] = [];

  for (const { manager, command } of commands) {
    const html = await highlightCode(command, 'bash');
    tabs.push({
      label: manager,
      html,
      code: command,
      language: 'bash',
    });
  }

  return { tabs };
}

async function buildComponentCodeBlocks(componentDir: string, componentName: string): Promise<CodeBlockData[]> {
  const blocks: CodeBlockData[] = [];

  const primaryFiles = [
    `${componentName}.component.ts`,
    `${componentName}.directive.ts`,
    `${componentName}.ts`,
    `${componentName}.variants.ts`,
  ];

  for (const fileName of primaryFiles) {
    const filePath = path.join(componentDir, fileName);
    if (!fs.existsSync(filePath)) continue;

    const code = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
    const language = fileName.endsWith('.html') ? 'angular-html' : 'angular-ts';
    const html = await highlightCode(code, language);

    blocks.push({
      html,
      code,
      language,
      title: fileName,
      showLineNumbers: true,
      copyButton: true,
      expandable: true,
      expandableTitle: 'Expand',
    });
  }

  // Additional files (services, templates, etc.)
  const additionalFiles = fs.readdirSync(componentDir).filter(file => {
    return (
      (file.endsWith('.ts') || file.endsWith('.html')) &&
      !file.includes('.spec.') &&
      !file.startsWith('demo') &&
      !primaryFiles.includes(file)
    );
  });

  for (const fileName of additionalFiles) {
    const filePath = path.join(componentDir, fileName);
    if (!fs.statSync(filePath).isFile()) continue;

    const code = fs.readFileSync(filePath, 'utf-8').replace(/\r\n/g, '\n');
    const language = fileName.endsWith('.html') ? 'angular-html' : 'angular-ts';
    const html = await highlightCode(code, language);

    blocks.push({
      html,
      code,
      language,
      title: fileName,
      showLineNumbers: true,
      copyButton: true,
      expandable: true,
      expandableTitle: 'Expand',
    });
  }

  return blocks;
}

function analyzeComponentDependencies(componentDir: string, componentName: string): ComponentDependency[] {
  const deps: ComponentDependency[] = [];

  const filesToCheck = [
    path.join(componentDir, `${componentName}.component.ts`),
    path.join(componentDir, `${componentName}.variants.ts`),
  ];

  let content = '';
  for (const file of filesToCheck) {
    if (fs.existsSync(file)) {
      content += fs.readFileSync(file, 'utf-8');
    }
  }

  const checks: Array<{ pattern: string; name: string; npmPackage: string; type: ComponentDependency['type'] }> = [
    {
      pattern: 'class-variance-authority',
      name: 'class-variance-authority',
      npmPackage: 'class-variance-authority',
      type: 'external',
    },
    { pattern: 'tailwind-merge', name: 'tailwind-merge', npmPackage: 'tailwind-merge', type: 'external' },
    { pattern: 'clsx', name: 'clsx', npmPackage: 'clsx', type: 'external' },
    { pattern: '@angular/cdk/overlay', name: '@angular/cdk/overlay', npmPackage: '@angular/cdk', type: 'angular' },
    { pattern: '@angular/cdk/portal', name: '@angular/cdk/portal', npmPackage: '@angular/cdk', type: 'angular' },
    { pattern: 'ngx-sonner', name: 'ngx-sonner', npmPackage: 'ngx-sonner', type: 'external' },
    {
      pattern: 'embla-carousel-angular',
      name: 'embla-carousel-angular',
      npmPackage: 'embla-carousel-angular',
      type: 'external',
    },
  ];

  for (const check of checks) {
    if (content.includes(check.pattern)) {
      deps.push({ name: check.name, type: check.type, npmPackage: check.npmPackage });
    }
  }

  return deps;
}

function getExtraDependencies(deps: ComponentDependency[]): string[] {
  return [
    ...new Set(
      deps
        .filter(
          (d): d is ComponentDependency & { npmPackage: string } =>
            !!d.npmPackage && !BASIC_DEPENDENCIES.includes(d.npmPackage),
        )
        .map(d => d.npmPackage),
    ),
  ];
}

function toConstName(componentName: string, suffix: string): string {
  return `${componentName.toUpperCase().replace(/-/g, '_')}_${suffix}`;
}

function generateTabExport(constName: string, data: CodeTabData): string {
  return `import type { CodeTabData } from '@highlight/types';

export const ${constName}: CodeTabData = ${JSON.stringify(data, null, 2)};
`;
}

function generateCodeBlockExport(constName: string, data: CodeBlockData): string {
  return `import type { CodeBlockData } from '@highlight/types';

export const ${constName}: CodeBlockData = ${JSON.stringify(data, null, 2)};
`;
}

function generateCodeBlockArrayExport(constName: string, data: CodeBlockData[]): string {
  return `import type { CodeBlockData } from '@highlight/types';

export const ${constName}: CodeBlockData[] = ${JSON.stringify(data, null, 2)};
`;
}
