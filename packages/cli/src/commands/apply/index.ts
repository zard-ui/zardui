import { CssPatchError, patchThemeCss, tokensFrom } from '@cli/commands/apply/css-patch.js';
import { coreImportPath } from '@cli/commands/init/tailwind-setup.js';
import { retargetIcons, iconPackagesFor } from '@cli/core/icons/index.js';
import { isInteractive, printReport } from '@cli/ui/index.js';
import { getConfig, resolveConfigPaths, type Config } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { assertIconFamily, loadIconCatalog, iconCatalog } from '@cli/utils/icon-catalog.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry } from '@cli/utils/package-manager.js';
import { loadPresetCatalog, presetCatalog } from '@cli/utils/preset-catalog.js';
import { resolvePresetInput } from '@cli/utils/preset-input.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { encodePreset, entryById, renderThemeBlocks, renderThemeCss, resolvePreset, type Preset } from '@zardui/preset';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

type ApplyPart = 'theme' | 'icons' | 'config';

const ALL_PARTS: readonly ApplyPart[] = ['theme', 'icons', 'config'];

interface ApplyOptions {
  only?: string[];
  yes: boolean;
  cwd: string;
  force: boolean;
}

export const apply = new Command()
  .name('apply')
  .description('swap the design system of a project that is already set up')
  .argument('<preset>', 'a preset code, a path to a zard.preset.json, or a URL')
  .option(
    '--only <part>',
    `apply only part of the preset: ${ALL_PARTS.join(', ')}. Repeatable.`,
    (value: string, previous: string[] = []) => [...previous, value],
  )
  .option('-y, --yes', 'do not ask for confirmation.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .option('--force', 'rewrite the whole global CSS when the surgical patch does not fit.', false)
  .action(async (input: string, options: ApplyOptions) => {
    const cwd = path.resolve(options.cwd);
    const parts = resolveParts(options.only);

    const config = await getConfig(cwd);
    if (!config) {
      throw new CliError(
        'No components.json here. Run `zard-cli init` first, or `zard-cli create` for a new project.',
        'NOT_INITIALIZED',
      );
    }

    await loadPresetCatalog(getRegistryUrl(config));
    await loadIconCatalog(getRegistryUrl(config));

    // O preset é resolvido antes de qualquer escrita: um código quebrado tem que
    // parar o comando com o projeto do jeito que estava.
    const preset = await resolvePresetInput(input, { cwd, catalog: presetCatalog() });
    assertIconFamily(preset.icons);

    const changes: string[] = [];
    const notes: string[] = [];

    if (parts.includes('theme')) {
      changes.push(...(await applyTheme(cwd, config, preset, options.force, notes)));
    }

    if (parts.includes('icons')) {
      changes.push(...(await applyIcons(cwd, config, preset, notes)));
    }

    if (parts.includes('config')) {
      changes.push(...(await applyConfig(cwd, config, preset)));
    }

    reportSuccess(preset, changes, notes);
  });

function resolveParts(only: string[] | undefined): ApplyPart[] {
  if (!only || only.length === 0) return [...ALL_PARTS];

  for (const part of only) {
    if (!ALL_PARTS.includes(part as ApplyPart)) {
      throw new CliError(`Unknown part "${part}". Expected one of: ${ALL_PARTS.join(', ')}.`, 'UNKNOWN_APPLY_PART');
    }
  }

  return only as ApplyPart[];
}

/**
 * Os tokens de cor e o raio, trocados dentro do CSS que já existe.
 *
 * O caminho normal é o patch cirúrgico. `--force` reescreve o arquivo inteiro, e
 * está aqui porque um CSS que não tem `:root` e `.dark` reconhecíveis não deixa
 * alternativa — mas é opt-in, e o aviso diz o que se perde.
 */
async function applyTheme(
  cwd: string,
  config: Config,
  preset: Preset,
  force: boolean,
  notes: string[],
): Promise<string[]> {
  const stylesPath = path.resolve(cwd, config.tailwind.css);

  if (!existsSync(stylesPath)) {
    throw new CliError(`No stylesheet at ${config.tailwind.css}, which components.json points to.`, 'CSS_NOT_FOUND');
  }

  const resolved = resolvePreset(preset, presetCatalog());
  const themeSpinner = spinner('Applying theme tokens...').start();

  if (force) {
    await writeFile(stylesPath, renderThemeCss(resolved, { corePath: coreImportPath(cwd, config) }), 'utf8');
    themeSpinner.succeed(`${config.tailwind.css} — rewritten`);
    notes.push('--force rewrote the whole stylesheet. Anything you had added to it is gone; check your diff.');

    return [`${config.tailwind.css} (rewritten)`];
  }

  const blocks = renderThemeBlocks(resolved);
  const [lightBlock = '', darkBlock = ''] = blocks.split('\n\n.dark {');

  try {
    const result = patchThemeCss(await readFile(stylesPath, 'utf8'), {
      light: tokensFrom(lightBlock),
      dark: tokensFrom(darkBlock),
    });

    await writeFile(stylesPath, result.css, 'utf8');
    themeSpinner.succeed(`${config.tailwind.css} — ${result.changed.join(' and ')}`);

    return result.changed.map(block => `${config.tailwind.css} ${block}`);
  } catch (error) {
    themeSpinner.fail(`${config.tailwind.css} — left alone`);

    if (error instanceof CssPatchError) {
      throw new CliError(
        `${error.message}\n` +
          `  ${config.tailwind.css} does not look like a stylesheet zard/ui wrote, so nothing was changed.\n` +
          '  Run again with --force to replace the file entirely — you will lose anything else in it.',
        'CSS_PATCH_FAILED',
      );
    }

    throw error;
  }
}

/**
 * A família de ícones dos componentes já instalados.
 *
 * Trocar o catálogo sem reescrever os componentes deixaria imports apontando
 * para um pacote que não está mais nas dependências — a troca é nos dois lugares
 * ou em nenhum.
 */
async function applyIcons(cwd: string, config: Config, preset: Preset, notes: string[]): Promise<string[]> {
  if (preset.icons === config.icons) return [];

  const resolved = await resolveConfigPaths(cwd, config);
  const componentsDir = resolved.resolvedPaths.components;

  if (!existsSync(componentsDir)) return [];

  const iconSpinner = spinner(`Rewriting components for ${preset.icons}...`).start();
  const rewritten: string[] = [];
  const missing = new Set<string>();

  for (const file of await sourceFilesIn(componentsDir)) {
    const source = await readFile(file, 'utf8');
    const result = retargetIcons(source, config.icons, preset.icons, iconCatalog());

    if (result.content === source) continue;

    await writeFile(file, result.content, 'utf8');
    rewritten.push(path.relative(cwd, file));
    for (const symbol of result.missing) missing.add(symbol);
  }

  const packages = await filterInstalledPackages(iconPackagesFor(preset.icons, iconCatalog()), cwd);
  if (packages.length > 0) {
    await installPackagesWithRetry(packages, cwd, config.packageManager);
  }

  iconSpinner.succeed(`${rewritten.length} file(s) rewritten for ${preset.icons}`);

  if (missing.size > 0) {
    notes.push(
      `${missing.size} icon(s) have no equivalent in ${preset.icons} and were left as they were: ` +
        `${[...missing].sort().join(', ')}.`,
    );
  }

  return rewritten.length > 0 ? [`${rewritten.length} component file(s) — icons`] : [];
}

/** Os arquivos `.ts` de uma árvore. */
async function sourceFilesIn(directory: string): Promise<string[]> {
  const found: string[] = [];

  for (const entry of await readdir(directory)) {
    const full = path.join(directory, entry);
    const info = await stat(full);

    if (info.isDirectory()) found.push(...(await sourceFilesIn(full)));
    else if (entry.endsWith('.ts')) found.push(full);
  }

  return found;
}

async function applyConfig(cwd: string, config: Config, preset: Preset): Promise<string[]> {
  const code = presetCode(preset);

  const updated: Config = {
    ...config,
    preset: {
      ...(code ? { code } : {}),
      baseColor: preset.baseColor,
      theme: preset.theme,
      chart: preset.chart,
      radius: preset.radius,
      darkMode: preset.darkMode,
    },
    icons: preset.icons,
    rtl: preset.rtl,
    tailwind: { ...config.tailwind, baseColor: preset.baseColor },
  };

  await writeFile(path.resolve(cwd, 'components.json'), `${JSON.stringify(updated, null, 2)}\n`, 'utf8');

  return ['components.json — preset, icons and rtl'];
}

function presetCode(preset: Preset): string | undefined {
  try {
    return encodePreset(preset, presetCatalog()) ?? undefined;
  } catch {
    return undefined;
  }
}

function reportSuccess(preset: Preset, changes: string[], notes: string[]): void {
  const catalog = presetCatalog();
  const baseColor = entryById(catalog.baseColors, preset.baseColor)?.label ?? preset.baseColor;
  const theme = entryById(catalog.themes, preset.theme)?.label ?? preset.theme;

  if (changes.length === 0) {
    logger.info('Nothing to change — the project already matches this preset.');
    if (!isInteractive()) return;
  }

  printReport({
    status: 'success',
    headline: `Applied ${preset.theme === 'neutral' ? baseColor : `${baseColor} · ${theme}`}.`,
    items: changes,
    notes: [...notes, '', 'Restart the dev server if it is running — the tokens changed.'],
  });
}
