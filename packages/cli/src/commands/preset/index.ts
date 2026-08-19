/**
 * `zard-cli preset` — inspecionar um design system sem aplicá-lo.
 *
 * Quatro subcomandos que respondem quatro perguntas: o que este código contém,
 * qual é o código do que eu já tenho, qual é o link disso, e me leve até lá.
 * Nenhum deles escreve nada.
 */

import { getConfig, presetOf } from '@cli/utils/config.js';
import { CliError } from '@cli/utils/errors.js';
import { logger } from '@cli/utils/logger.js';
import { openUrl } from '@cli/utils/open-url.js';
import { loadPresetCatalog, presetCatalog } from '@cli/utils/preset-catalog.js';
import { resolvePresetInput } from '@cli/utils/preset-input.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { encodePreset, entryById, normalizePreset, type Preset } from '@zardui/preset';
import { Command } from 'commander';
import * as path from 'node:path';

const BUILDER_URL = 'https://zardui.com/create';

export const preset = new Command().name('preset').description('inspect preset codes and the one this project uses');

preset
  .command('decode')
  .description('print what a preset code contains')
  .argument('<code>', 'the preset code')
  .option('--json', 'print JSON only, with no formatting around it.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (code: string, options: { json: boolean; cwd: string }) => {
    const cwd = path.resolve(options.cwd);
    await loadCatalog(cwd);

    const decoded = await resolvePresetInput(code, { cwd, catalog: presetCatalog() });

    if (options.json) {
      // Sem logger: `--json` existe para ser canalizado para outro programa, e
      // qualquer decoração aqui quebraria quem estiver do outro lado do pipe.
      process.stdout.write(`${JSON.stringify(decoded, null, 2)}\n`);
      return;
    }

    printPreset(decoded);
  });

preset
  .command('resolve')
  .description('print the preset code for the project you are in')
  .option('--json', 'print JSON only, with no formatting around it.', false)
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (options: { json: boolean; cwd: string }) => {
    const cwd = path.resolve(options.cwd);
    const current = await currentPreset(cwd);
    const code = encodePreset(current, presetCatalog());

    if (options.json) {
      process.stdout.write(`${JSON.stringify({ ...current, code }, null, 2)}\n`);
      return;
    }

    printPreset(current, code);

    if (!code) {
      logger.break();
      logger.warn('This project has hand-edited colours, which a short code cannot carry.');
    }
  });

preset
  .command('url')
  .description('print the zardui.com/create link for a preset code')
  .argument('[code]', 'the preset code. defaults to the one this project uses.')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (code: string | undefined, options: { cwd: string }) => {
    process.stdout.write(`${await builderUrl(code, path.resolve(options.cwd))}\n`);
  });

preset
  .command('open')
  .description('open a preset in the builder')
  .argument('[code]', 'the preset code. defaults to the one this project uses.')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .action(async (code: string | undefined, options: { cwd: string }) => {
    const url = await builderUrl(code, path.resolve(options.cwd));

    // Sem meio de abrir — container, SSH, WSL sem navegador — a URL impressa é
    // exatamente o que a pessoa precisava.
    if (!(await openUrl(url))) {
      logger.info('Could not open a browser here. The link is:');
      process.stdout.write(`${url}\n`);
      return;
    }

    logger.info(`Opened ${url}`);
  });

async function loadCatalog(cwd: string): Promise<void> {
  const config = await getConfig(cwd).catch(() => null);
  await loadPresetCatalog(getRegistryUrl(config ?? undefined));
}

/**
 * O preset do projeto atual.
 *
 * Um `components.json` anterior ao campo `preset` não é um projeto sem design
 * system: `presetOf` deriva dele o que ele já dizia — o tom neutro em
 * `tailwind.baseColor` —, e é isso que faz `resolve` responder para quem nunca
 * rodou `apply`.
 */
async function currentPreset(cwd: string): Promise<Preset> {
  await loadCatalog(cwd);

  const config = await getConfig(cwd);
  if (!config) {
    throw new CliError('No components.json here. Run `zard-cli init` first.', 'NOT_INITIALIZED');
  }

  return normalizePreset({ ...presetOf(config), icons: config.icons, rtl: config.rtl });
}

async function builderUrl(code: string | undefined, cwd: string): Promise<string> {
  if (code) {
    await loadCatalog(cwd);
    // Passa pelo decodificador só para recusar um código quebrado antes de
    // montar um link que abriria a página no default sem explicar por quê.
    await resolvePresetInput(code, { cwd, catalog: presetCatalog() });

    return `${BUILDER_URL}?preset=${encodeURIComponent(code)}`;
  }

  const current = await currentPreset(cwd);
  const resolved = encodePreset(current, presetCatalog());

  return resolved ? `${BUILDER_URL}?preset=${resolved}` : BUILDER_URL;
}

function printPreset(value: Preset, code?: string | null): void {
  const catalog = presetCatalog();
  const label = (entries: Parameters<typeof entryById>[0], id: string) => entryById(entries, id)?.label ?? id;

  const rows: Array<[string, string]> = [
    ...(code ? ([['code', code]] as Array<[string, string]>) : []),
    ['base color', label(catalog.baseColors, value.baseColor)],
    ['theme', label(catalog.themes, value.theme)],
    ['chart', label(catalog.charts, value.chart)],
    ['radius', label(catalog.radii, value.radius)],
    ['icons', label(catalog.icons, value.icons)],
    ['dark mode', value.darkMode],
    ['rtl', value.rtl ? 'on' : 'off'],
  ];

  const width = Math.max(...rows.map(([key]) => key.length));

  logger.break();
  for (const [key, entry] of rows) logger.info(`  ${key.padEnd(width)}  ${entry}`);
  logger.break();
}
