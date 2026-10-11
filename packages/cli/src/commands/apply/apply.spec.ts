/**
 * `zard-cli apply --preset <code> [--only theme|font]` on a project that was already initialized.
 *
 * Runs against a scratch project on disk. The promise being tested is a negative one — that the parts
 * you did not ask for are not touched — so the assertions compare files before and after.
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
// No network: the registry never answers, so the bundled catalogs apply.
jest.mock('@cli/utils/http-client.js', () => ({
  fetchJson: jest.fn(async () => {
    throw new Error('offline');
  }),
}));
jest.mock('@cli/ui/index.js', () => ({
  printReport: jest.fn(),
  isInteractive: jest.fn(() => false),
}));

import { parseOnly, runApply } from '@cli/commands/apply/index.js';
import { buildConfig, type InitAnswers } from '@cli/commands/init/config-prompter.js';
import { resolvePreset } from '@cli/commands/init/preset.js';
import { buildInitSteps } from '@cli/commands/init/steps.js';
import { FONT_IMPORTS_START, THEME_END, THEME_START } from '@cli/core/design/css.js';
import { printReport } from '@cli/ui/index.js';
import { resetDesignData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';
import type { ProjectInfo } from '@cli/utils/get-project-info.js';
import { resetIconCatalog } from '@cli/utils/icon-catalog.js';
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

const answers: InitAnswers = {
  kind: 'angular',
  projectRoot: '',
  appConfig: 'src/app/app.config.ts',
  theme: 'neutral',
  globalCss: 'src/styles.css',
  componentsAlias: '@/shared/components',
  utilsAlias: '@/shared/utils',
  rtl: true,
};

const USER_RULES =
  '\n/* mine */\n.hero {\n  background: linear-gradient(red, blue);\n}\n\n:root {\n  --brand: hotpink;\n}\n';

/** A project initialized with preset A (the default) that has since grown rules of its own. */
async function project(options: { crlf?: boolean; legacy?: boolean } = {}): Promise<string> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'zard-apply-'));
  await mkdir(path.join(cwd, 'src'), { recursive: true });

  const preset = options.legacy ? undefined : resolvePreset('Z0');
  const config = buildConfig(answers, 'npm', preset);
  const css = buildInitSteps(cwd, config, projectInfo, false).find(step => step.label === config.tailwind.css);
  await css?.run();

  const file = path.join(cwd, 'src/styles.css');
  let content = (await readFile(file, 'utf8')) + USER_RULES;
  if (options.crlf) content = content.replace(/\n/g, '\r\n');
  await writeFile(file, content, 'utf8');

  await writeFile(
    path.join(cwd, 'components.json'),
    JSON.stringify({ ...config, registryUrl: 'https://registry.example.com/r', custom: 'kept' }, null, 2),
    'utf8',
  );

  return cwd;
}

const read = (cwd: string, file: string): Promise<string> => readFile(path.join(cwd, file), 'utf8');
const json = async (cwd: string): Promise<Record<string, any>> => JSON.parse(await read(cwd, 'components.json'));

/** The text between two markers, markers included. */
function region(css: string, start: string, end: string): string {
  const from = css.indexOf(start);
  return css.slice(from, css.indexOf(end, from) + end.length);
}

const PRESET_B = 'Z6KtfCaQt';
const PRESET_C = 'ZK4OZp6bW';

beforeEach(() => {
  resetIconCatalog();
  resetDesignData();
  (installPackagesWithRetry as jest.Mock).mockClear();
  (printReport as jest.Mock).mockClear();
});

describe('parseOnly', () => {
  it('reads theme, font and both', () => {
    expect(parseOnly(undefined)).toBeUndefined();
    expect(parseOnly('theme')).toEqual(['theme']);
    expect(parseOnly('font')).toEqual(['font']);
    expect(parseOnly('fonts')).toEqual(['font']);
    expect(parseOnly('theme,font')).toEqual(['theme', 'font']);
    expect(parseOnly(' Theme , FONT , theme ')).toEqual(['theme', 'font']);
  });

  it.each(['colors', 'theme,icons', '', ','])('rejects %j naming the problem', value => {
    expect(() => parseOnly(value)).toThrow(CliError);
    expect(() => parseOnly(value)).toThrow(/--only/);
  });
});

describe('apply --only theme', () => {
  it('changes the theme tokens and nothing else in the stylesheet', async () => {
    const cwd = await project();
    const before = await read(cwd, 'src/styles.css');

    await runApply({ cwd, preset: PRESET_B, only: 'theme' });

    const after = await read(cwd, 'src/styles.css');
    expect(region(after, THEME_START, THEME_END)).not.toBe(region(before, THEME_START, THEME_END));
    expect(region(after, THEME_START, THEME_END)).toContain('--radius: 0rem;');
    // Byte for byte: everything outside the theme block is the same file.
    expect(after.replace(region(after, THEME_START, THEME_END), '')).toBe(
      before.replace(region(before, THEME_START, THEME_END), ''),
    );
  });

  it('keeps the rules the user wrote below the theme', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_B, only: 'theme' });

    expect(await read(cwd, 'src/styles.css')).toContain(USER_RULES);
  });

  it('leaves fonts and components alone: no package is installed', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_B, only: 'theme' });

    expect(installPackagesWithRetry).not.toHaveBeenCalled();
    expect(await read(cwd, 'src/styles.css')).toContain("@import '@fontsource-variable/inter';");
    expect(await read(cwd, 'src/styles.css')).not.toContain('jetbrains');
  });

  it('records the base color and menu look, and not style, icons or preset', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_B, only: 'theme' });

    expect(await json(cwd)).toMatchObject({
      style: 'nova',
      icons: 'lucide',
      preset: 'Z0',
      menuColor: 'inverted',
      menuAppearance: 'translucent',
      tailwind: { baseColor: 'mauve' },
    });
  });

  it('keeps the pointer rule the file already has, unless told otherwise', async () => {
    const cwd = await project();
    await runApply({ cwd, preset: PRESET_B, only: 'theme', pointer: true });
    expect(await read(cwd, 'src/styles.css')).toContain('cursor: pointer');

    await runApply({ cwd, preset: PRESET_C, only: 'theme' });
    expect(await read(cwd, 'src/styles.css')).toContain('cursor: pointer');

    await runApply({ cwd, preset: PRESET_C, only: 'theme', pointer: false });
    expect(await read(cwd, 'src/styles.css')).not.toContain('cursor: pointer');
  });

  it('is idempotent', async () => {
    const cwd = await project();
    await runApply({ cwd, preset: PRESET_B, only: 'theme' });
    const once = await read(cwd, 'src/styles.css');

    await runApply({ cwd, preset: PRESET_B, only: 'theme' });

    expect(await read(cwd, 'src/styles.css')).toBe(once);
  });
});

describe('apply --only font', () => {
  it('changes the font regions and nothing else', async () => {
    const cwd = await project();
    const before = await read(cwd, 'src/styles.css');

    await runApply({ cwd, preset: PRESET_C, only: 'font' });

    const after = await read(cwd, 'src/styles.css');
    expect(after).toContain("@import '@fontsource-variable/playfair-display';");
    expect(after).toContain("--font-heading: 'Playfair Display Variable', serif;");
    expect(region(after, THEME_START, THEME_END)).toBe(region(before, THEME_START, THEME_END));
    expect(after.endsWith(USER_RULES)).toBe(true);
  });

  it('installs the font packages and not the icon family', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_C, only: 'font' });

    const installed = (installPackagesWithRetry as jest.Mock).mock.calls.flatMap(call => call[0] as string[]);
    expect(installed.sort()).toEqual(['@fontsource-variable/inter', '@fontsource-variable/playfair-display']);
  });

  it('does not touch components.json beyond rewriting it as it was', async () => {
    const cwd = await project();
    const before = await json(cwd);

    await runApply({ cwd, preset: PRESET_C, only: 'font' });

    expect(await json(cwd)).toEqual(before);
  });

  it('drops the heading rule when the new preset has no heading font', async () => {
    const cwd = await project();
    await runApply({ cwd, preset: PRESET_C, only: 'font' });

    await runApply({ cwd, preset: 'Z0', only: 'font' });

    const css = await read(cwd, 'src/styles.css');
    expect(css).not.toContain('playfair');
    expect(css).not.toContain('font-family: var(--font-heading)');
  });
});

describe('apply (the whole preset)', () => {
  it('writes theme, fonts and components.json, and installs fonts and icons', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_C });

    const css = await read(cwd, 'src/styles.css');
    expect(css).toContain('--radius: 0rem;');
    expect(css).toContain("@import '@fontsource-variable/playfair-display';");
    expect(await json(cwd)).toMatchObject({
      style: 'sera',
      icons: 'hugeicons',
      preset: PRESET_C,
      menuAccent: 'bold',
      tailwind: { baseColor: 'taupe' },
    });
    const installed = (installPackagesWithRetry as jest.Mock).mock.calls.flatMap(call => call[0] as string[]);
    expect(installed).toEqual(
      expect.arrayContaining(['@ng-icons/core', '@ng-icons/huge-icons', '@fontsource-variable/playfair-display']),
    );
  });

  it('keeps every other key of components.json, rtl and registryUrl included', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_C });

    expect(await json(cwd)).toMatchObject({
      rtl: true,
      registryUrl: 'https://registry.example.com/r',
      custom: 'kept',
      aliases: { components: '@/shared/components' },
    });
  });

  it('tells the user how to bring the components along', async () => {
    const cwd = await project();

    await runApply({ cwd, preset: PRESET_C });

    expect(JSON.stringify((printReport as jest.Mock).mock.calls[0])).toContain('--overwrite');
  });

  it('upgrades a stylesheet written by an init that had no preset, keeping the user rules', async () => {
    const cwd = await project({ legacy: true });

    await runApply({ cwd, preset: PRESET_B });

    const css = await read(cwd, 'src/styles.css');
    expect(css).toContain(THEME_START);
    expect(css).toContain(FONT_IMPORTS_START);
    expect(css.match(/@theme inline/g)?.length).toBe(2); // the color mapping and the font variables
    expect(css).toContain('.hero {\n  background: linear-gradient(red, blue);\n}');
    expect(css).toContain(':root {\n  --brand: hotpink;\n}');
  });

  it('keeps a CRLF file CRLF, so the diff shows only what changed', async () => {
    const cwd = await project({ crlf: true });

    await runApply({ cwd, preset: PRESET_B, only: 'theme' });

    const css = await read(cwd, 'src/styles.css');
    expect(css).toContain('\r\n');
    expect(css.replace(/\r\n/g, '')).not.toContain('\n');
  });
});

describe('what goes wrong', () => {
  it.each([
    ['a shadcn code', 'b2D0wqNxT'],
    ['nonsense', 'zzz'],
    ['an empty code', ''],
  ])('refuses %s before touching any file', async (_label, preset) => {
    const cwd = await project();
    const css = await read(cwd, 'src/styles.css');
    const config = await read(cwd, 'components.json');

    await expect(runApply({ cwd, preset })).rejects.toThrow(/Invalid --preset/);

    expect(await read(cwd, 'src/styles.css')).toBe(css);
    expect(await read(cwd, 'components.json')).toBe(config);
    expect(installPackagesWithRetry).not.toHaveBeenCalled();
  });

  it('names the bad code in the message', async () => {
    const cwd = await project();

    await expect(runApply({ cwd, preset: 'b2D0wqNxT' })).rejects.toThrow('b2D0wqNxT');
  });

  it('refuses a bad --only before touching any file', async () => {
    const cwd = await project();
    const css = await read(cwd, 'src/styles.css');

    await expect(runApply({ cwd, preset: PRESET_B, only: 'icons' })).rejects.toThrow(/--only/);

    expect(await read(cwd, 'src/styles.css')).toBe(css);
  });

  it('asks for init first when there is no components.json', async () => {
    const cwd = await mkdtemp(path.join(tmpdir(), 'zard-apply-empty-'));

    await expect(runApply({ cwd, preset: PRESET_B })).rejects.toThrow(/zard-cli init/);
  });

  it('says which stylesheet is missing, and writes nothing', async () => {
    const cwd = await project();
    const config = await read(cwd, 'components.json');
    await writeFile(
      path.join(cwd, 'components.json'),
      JSON.stringify({ ...JSON.parse(config), tailwind: { css: 'src/nope.css', baseColor: 'neutral' } }),
      'utf8',
    );

    await expect(runApply({ cwd, preset: PRESET_B })).rejects.toThrow(/src\/nope\.css/);
    expect(installPackagesWithRetry).not.toHaveBeenCalled();
  });

  it('refuses a directory that does not exist', async () => {
    await expect(runApply({ cwd: path.join(tmpdir(), 'zard-does-not-exist'), preset: PRESET_B })).rejects.toThrow(
      /does not exist/,
    );
  });
});
