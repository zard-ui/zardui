/**
 * `initWithPreset`, the entry `create` calls after the framework's generator has run: a whole preset
 * applied to a project, headless, with nothing to answer.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn(async () => 'npm') }));
jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
  spinner: jest.fn(() => ({ start: jest.fn().mockReturnThis(), succeed: jest.fn(), fail: jest.fn() })),
}));
jest.mock('@cli/utils/package-manager.js', () => ({
  detectPackageManager: jest.fn(async () => 'npm'),
  suggestedRunner: jest.fn(() => 'npx'),
  filterInstalledPackages: jest.fn(async (packages: string[]) => packages),
  installPackagesWithRetry: jest.fn(async () => undefined),
}));
jest.mock('@cli/utils/http-client.js', () => ({
  fetchJson: jest.fn(async () => {
    throw new Error('offline');
  }),
}));
// The core and utils files come from the registry; what is under test here is everything around them.
jest.mock('@cli/commands/add/component-installer.js', () => ({ installComponent: jest.fn(async () => undefined) }));
jest.mock('@cli/ui/index.js', () => ({
  printReport: jest.fn(),
  isInteractive: jest.fn(() => true), // a terminal is attached: headless has to win over it
  WizardCancelledError: class extends Error {},
}));
jest.mock('@cli/commands/init/wizard.js', () => ({
  runInitWizard: jest.fn(() => {
    throw new Error('the wizard must not be mounted');
  }),
}));

import { initWithPreset, runInit } from '@cli/commands/init/index.js';
import { resetDesignData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';
import { resetIconCatalog } from '@cli/utils/icon-catalog.js';
import { installPackagesWithRetry } from '@cli/utils/package-manager.js';
import { mkdir, mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

async function angularApp(): Promise<string> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'zard-init-preset-'));

  await mkdir(path.join(cwd, 'src/app'), { recursive: true });
  await writeFile(
    path.join(cwd, 'package.json'),
    JSON.stringify({ name: 'app', dependencies: { '@angular/core': '^22.0.0' } }),
    'utf8',
  );
  await writeFile(
    path.join(cwd, 'angular.json'),
    JSON.stringify({
      projects: {
        app: {
          projectType: 'application',
          root: '',
          sourceRoot: 'src',
          architect: { build: { builder: '@angular/build:application', options: { styles: ['src/styles.css'] } } },
        },
      },
    }),
    'utf8',
  );
  await writeFile(path.join(cwd, 'tsconfig.json'), '{ "compilerOptions": {} }', 'utf8');
  await writeFile(path.join(cwd, 'src/styles.css'), '@import "tailwindcss";\n', 'utf8');
  await writeFile(
    path.join(cwd, 'src/app/app.config.ts'),
    "import { ApplicationConfig } from '@angular/core';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [],\n};\n",
    'utf8',
  );
  await writeFile(path.join(cwd, 'src/index.html'), '<html lang="en"><head></head><body></body></html>', 'utf8');

  return cwd;
}

beforeEach(() => {
  resetIconCatalog();
  resetDesignData();
  (installPackagesWithRetry as jest.Mock).mockClear();
});

describe('initWithPreset', () => {
  it('applies the whole preset without mounting the wizard, even with a terminal attached', async () => {
    const cwd = await angularApp();

    await initWithPreset({ cwd, type: 'angular', preset: 'Z6KtfCaQt' });

    const config = JSON.parse(await readFile(path.join(cwd, 'components.json'), 'utf8'));
    expect(config).toMatchObject({
      style: 'lyra',
      icons: 'phosphor',
      projectType: 'angular',
      preset: 'Z6KtfCaQt',
      tailwind: { baseColor: 'mauve' },
    });

    const css = await readFile(path.join(cwd, 'src/styles.css'), 'utf8');
    expect(css).toContain('--radius: 0rem;');
    expect(css).toContain("@import '@fontsource-variable/jetbrains-mono';");

    const installed = (installPackagesWithRetry as jest.Mock).mock.calls.flatMap(call => call[0] as string[]);
    expect(installed).toEqual(
      expect.arrayContaining(['@ng-icons/phosphor-icons', '@fontsource-variable/jetbrains-mono']),
    );
  });

  it('passes --rtl and --pointer through', async () => {
    const cwd = await angularApp();

    await initWithPreset({ cwd, type: 'angular', preset: 'Z0', rtl: true, pointer: true });

    expect(JSON.parse(await readFile(path.join(cwd, 'components.json'), 'utf8')).rtl).toBe(true);
    expect(await readFile(path.join(cwd, 'src/index.html'), 'utf8')).toContain('dir="rtl"');
    expect(await readFile(path.join(cwd, 'src/styles.css'), 'utf8')).toContain('cursor: pointer');
  });

  it('refuses a bad preset before writing a single file', async () => {
    const cwd = await angularApp();
    const before = (await readdir(cwd)).sort();

    await expect(initWithPreset({ cwd, type: 'angular', preset: 'b2D0wqNxT' })).rejects.toThrow(/Invalid --preset/);

    expect((await readdir(cwd)).sort()).toEqual(before);
    expect(await readFile(path.join(cwd, 'src/styles.css'), 'utf8')).toBe('@import "tailwindcss";\n');
    expect(installPackagesWithRetry).not.toHaveBeenCalled();
  });

  it('refuses --base-color together with a preset, naming both', async () => {
    const cwd = await angularApp();

    const attempt = runInit({ cwd, yes: true, headless: true, type: 'angular', preset: 'Z0', baseColor: 'zinc' });

    await expect(attempt).rejects.toThrow(CliError);
    await expect(attempt).rejects.toThrow(/--base-color "zinc" conflicts with --preset Z0/);
  });

  it('refuses --pointer without a preset', async () => {
    const cwd = await angularApp();

    await expect(runInit({ cwd, yes: true, headless: true, type: 'angular', pointer: true })).rejects.toThrow(
      /--pointer needs --preset/,
    );
  });
});
