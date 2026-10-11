/**
 * `init --preset`: what a resolved preset writes into a project.
 *
 * The steps are built exactly as `init` builds them and run against a scratch directory, so the
 * assertions are about files on disk — components.json, the stylesheet, the installed packages —
 * rather than about the functions that produce them.
 */

jest.mock('@antfu/ni', () => ({ detect: jest.fn() }));
jest.mock('@cli/utils/logger.js', () => ({
  logger: { warn: jest.fn(), error: jest.fn(), info: jest.fn(), debug: jest.fn() },
  spinner: jest.fn(() => ({ start: jest.fn().mockReturnThis(), succeed: jest.fn(), fail: jest.fn() })),
}));
jest.mock('@cli/utils/package-manager.js', () => ({
  filterInstalledPackages: jest.fn(async (packages: string[]) => packages),
  installPackagesWithRetry: jest.fn(async () => undefined),
}));

import { buildConfig, type AppliedPreset, type InitAnswers } from '@cli/commands/init/config-prompter.js';
import { designOfConfig, fontPackagesFor, resolvePreset } from '@cli/commands/init/preset.js';
import { buildInitSteps } from '@cli/commands/init/steps.js';
import { FONT_IMPORTS_START, FONT_THEME_START, THEME_START } from '@cli/core/design/css.js';
import { CliError } from '@cli/utils/errors.js';
import type { ProjectInfo } from '@cli/utils/get-project-info.js';
import { installPackagesWithRetry } from '@cli/utils/package-manager.js';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';

const projectInfo: ProjectInfo = {
  framework: 'angular',
  root: '/proj',
  workspace: 'angular',
  hasTypeScript: true,
  hasTailwind: false,
  hasNx: false,
  hasAnalog: false,
  tsconfigFile: 'tsconfig.json',
  angularVersion: '22.0.0',
  angularVersionRaw: '^22.0.0',
  projects: [],
};

const app: InitAnswers = {
  kind: 'angular',
  projectRoot: '',
  appConfig: 'src/app/app.config.ts',
  theme: 'neutral',
  globalCss: 'src/styles.css',
  componentsAlias: '@/shared/components',
  utilsAlias: '@/shared/utils',
  rtl: false,
};

const library: InitAnswers = {
  ...app,
  kind: 'angular-library',
  projectRoot: 'projects/ui',
  appConfig: '',
  globalCss: 'projects/ui/src/styles.css',
};

const PRESET_B = resolvePreset('Z6KtfCaQt');
const PRESET_C = resolvePreset('--preset ZK4OZp6bW');

async function scratch(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), 'zard-preset-'));
}

describe('resolvePreset', () => {
  it('decodes a bare code, a flag and a pasted command to the same design', () => {
    expect(resolvePreset('Z6KtfCaQt')).toEqual(PRESET_B);
    expect(resolvePreset('--preset Z6KtfCaQt')).toEqual(PRESET_B);
    expect(resolvePreset('npx zard-cli init --preset=Z6KtfCaQt')).toEqual(PRESET_B);
    expect(PRESET_B.code).toBe('Z6KtfCaQt');
  });

  it.each(['b2D0wqNxT', 'zzz', '', 'Z!', 'ZV'])('rejects %j with a CliError that names it', code => {
    const attempt = (): AppliedPreset => resolvePreset(code);

    expect(attempt).toThrow(CliError);
    expect(attempt).toThrow(/Invalid --preset/);
    if (code) expect(attempt).toThrow(code);
  });

  it('carries the INVALID_PRESET code, which the CLI reports', () => {
    try {
      resolvePreset('b2D0wqNxT');
      throw new Error('expected a throw');
    } catch (error) {
      expect(error).toBeInstanceOf(CliError);
      expect((error as CliError).code).toBe('INVALID_PRESET');
    }
  });
});

describe('components.json', () => {
  it('records style, icons, base color, menu settings and the preset', () => {
    const config = buildConfig(app, 'npm', PRESET_B);

    expect(config).toMatchObject({
      style: 'lyra',
      icons: 'phosphor',
      rtl: false,
      menuColor: 'inverted',
      menuAppearance: 'translucent',
      menuAccent: 'subtle',
      preset: 'Z6KtfCaQt',
      tailwind: { css: 'src/styles.css', baseColor: 'mauve' },
    });
  });

  it('lets the preset decide the base color over the answer the wizard holds', () => {
    expect(buildConfig({ ...app, theme: 'zinc' }, 'npm', PRESET_C).tailwind.baseColor).toBe('taupe');
  });

  it('leaves rtl to the flag, not to the preset', () => {
    expect(buildConfig({ ...app, rtl: true }, 'npm', PRESET_B).rtl).toBe(true);
    expect(buildConfig(app, 'npm', PRESET_B).rtl).toBe(false);
  });

  it('is exactly the old file without a preset: css, lucide, no menu keys', () => {
    const config = buildConfig(app, 'npm');

    expect(config.style).toBe('css');
    expect(config.icons).toBe('lucide');
    expect(config).not.toHaveProperty('preset');
    expect(config).not.toHaveProperty('menuColor');
    expect(config).not.toHaveProperty('menuAppearance');
    expect(config).not.toHaveProperty('menuAccent');
  });

  it('can be read back to the design it came from', () => {
    expect(designOfConfig(buildConfig(app, 'npm', PRESET_C))).toEqual(PRESET_C.design);
    expect(designOfConfig(buildConfig(app, 'npm'))).toBeUndefined();
  });

  it('does not choke on a code from a newer CLI: the project just has no readable design', () => {
    expect(designOfConfig({ preset: 'Zzzzzzzzzz' })).toBeUndefined();
    expect(fontPackagesFor({ preset: 'Zzzzzzzzzz' })).toEqual([]);
  });
});

describe('the stylesheet', () => {
  async function runStylesheetStep(answers: InitAnswers, preset: AppliedPreset, options = {}): Promise<string> {
    const cwd = await scratch();
    const config = buildConfig(answers, 'npm', preset);
    const step = buildInitSteps(cwd, config, projectInfo, false, options).find(
      candidate => candidate.label === config.tailwind.css,
    );

    await mkdir(path.join(cwd, 'src'), { recursive: true });
    await step?.run();

    return readFile(path.join(cwd, config.tailwind.css), 'utf8');
  }

  it('is written from the design: theme, radius, fonts', async () => {
    const css = await runStylesheetStep(app, PRESET_C);

    expect(css).toContain(THEME_START);
    expect(css).toContain(FONT_IMPORTS_START);
    expect(css).toContain(FONT_THEME_START);
    expect(css).toContain("@import '@fontsource-variable/inter';");
    expect(css).toContain("@import '@fontsource-variable/playfair-display';");
    expect(css).toContain("--font-heading: 'Playfair Display Variable', serif;");
    expect(css).toContain('--radius: 0rem;');
    expect(css).toContain("@import './app/shared/core/css/zard';");
  });

  it('has the pointer rule only with --pointer', async () => {
    expect(await runStylesheetStep(app, PRESET_B)).not.toContain('cursor: pointer');
    expect(await runStylesheetStep(app, PRESET_B, { pointer: true })).toContain('cursor: pointer');
  });

  it('is also written in a library, with the @source line that ships its classes', async () => {
    const cwd = await scratch();
    const config = buildConfig(library, 'npm', PRESET_B);
    const step = buildInitSteps(cwd, config, projectInfo, false).find(
      candidate => candidate.label === config.tailwind.css,
    );

    await step?.run();
    const css = await readFile(path.join(cwd, config.tailwind.css), 'utf8');

    expect(css).toContain(THEME_START);
    expect(css).toContain("@source './';");
    expect(css).toContain("@import '@fontsource-variable/jetbrains-mono';");
  });

  it('without a preset is the plain theme of the base color, with no markers', async () => {
    const cwd = await scratch();
    const config = buildConfig({ ...app, theme: 'stone' }, 'npm');
    const step = buildInitSteps(cwd, config, projectInfo, false).find(
      candidate => candidate.label === config.tailwind.css,
    );

    await mkdir(path.join(cwd, 'src'), { recursive: true });
    await step?.run();
    const css = await readFile(path.join(cwd, 'src/styles.css'), 'utf8');

    expect(css).toContain('--foreground: oklch(0.147 0.004 49.25);');
    expect(css).not.toContain('zard:');
  });

  it.each(['mauve', 'olive', 'mist', 'taupe'])('writes the %s base color without a preset too', async color => {
    const cwd = await scratch();
    const config = buildConfig({ ...app, theme: color }, 'npm');
    const step = buildInitSteps(cwd, config, projectInfo, false).find(
      candidate => candidate.label === config.tailwind.css,
    );

    await mkdir(path.join(cwd, 'src'), { recursive: true });
    await step?.run();

    expect(await readFile(path.join(cwd, 'src/styles.css'), 'utf8')).toContain('@theme inline');
  });
});

describe('the dependencies', () => {
  const installed = (): string[] =>
    (installPackagesWithRetry as jest.Mock).mock.calls.flatMap(call => call[0] as string[]);

  beforeEach(() => (installPackagesWithRetry as jest.Mock).mockClear());

  async function runDependencies(answers: InitAnswers, preset?: AppliedPreset): Promise<string[]> {
    const cwd = await scratch();
    await writeFile(path.join(cwd, 'package.json'), JSON.stringify({ name: 'x' }), 'utf8');
    const config = buildConfig(answers, 'npm', preset);
    const step = buildInitSteps(cwd, config, projectInfo, false).find(candidate => candidate.label === 'dependencies');

    await step?.run();
    return installed();
  }

  it('install the fonts and the icon family of the preset', async () => {
    const packages = await runDependencies(app, PRESET_B);

    expect(packages).toEqual(
      expect.arrayContaining(['@ng-icons/core', '@ng-icons/phosphor-icons', '@fontsource-variable/jetbrains-mono']),
    );
    expect(packages).not.toContain('@ng-icons/lucide');
  });

  it('install both fonts when the heading is a different one', async () => {
    const packages = await runDependencies(app, PRESET_C);

    expect(packages).toEqual(
      expect.arrayContaining([
        '@ng-icons/huge-icons',
        '@fontsource-variable/inter',
        '@fontsource-variable/playfair-display',
      ]),
    );
  });

  it('install no font without a preset', async () => {
    const packages = await runDependencies(app);

    expect(packages).toContain('@ng-icons/lucide');
    expect(packages.some(name => name.includes('fontsource'))).toBe(false);
  });
});
