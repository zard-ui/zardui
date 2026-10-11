import { type AppliedPreset } from '@cli/commands/init/config-prompter.js';
import { writeFonts, writeTheme, type StyleWrite } from '@cli/commands/init/design-css.js';
import { resolvePreset } from '@cli/commands/init/preset.js';
import { type DesignConfig } from '@cli/core/design/config.js';
import { fontPackagesOf } from '@cli/core/design/css.js';
import { iconPackagesFor } from '@cli/core/icons/index.js';
import { printReport } from '@cli/ui/index.js';
import { getConfig } from '@cli/utils/config.js';
import { designData, loadDesignData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';
import { assertIconFamily, iconCatalog, loadIconCatalog } from '@cli/utils/icon-catalog.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry } from '@cli/utils/package-manager.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { Command } from 'commander';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import * as path from 'node:path';

/** The parts of a preset `--only` can pick. `fonts` is accepted as `font`. */
export const APPLY_PARTS = ['theme', 'font'] as const;
export type ApplyPart = (typeof APPLY_PARTS)[number];

export interface ApplyOptions {
  cwd?: string;
  /** A preset code, `--preset <code>` or a whole pasted command. */
  preset: string;
  /** `theme`, `font`, or both comma-separated. Without it the whole preset is applied. */
  only?: string;
  /** `true` adds the pointer-cursor rule, `false` removes it, `undefined` keeps what the file has. */
  pointer?: boolean;
  /** Accepted for symmetry with `init`; `apply` never prompts, so it changes nothing. */
  yes?: boolean;
}

export const apply = new Command()
  .name('apply')
  .description('apply a design preset to a project that is already initialized')
  .option('-c, --cwd <cwd>', 'the working directory. defaults to the current directory.', process.cwd())
  .requiredOption('--preset <code>', 'the preset to apply. build one at https://zardui.com/create.')
  .option('--only <parts>', `apply only part of the preset: ${APPLY_PARTS.join(' or ')}. defaults to all of it.`)
  .option('--pointer', 'add the pointer cursor rule for buttons to the theme.')
  .option('--no-pointer', 'remove the pointer cursor rule from the theme.')
  .option('-y, --yes', 'accepted for scripts; apply never prompts.', false)
  .action(options => runApply(options));

/** Reads `--only`, turning an unknown part into an error that names it. */
export function parseOnly(value: string | undefined): ApplyPart[] | undefined {
  if (value === undefined) return undefined;

  const parts = value
    .split(',')
    .map(part => part.trim().toLowerCase())
    .filter(Boolean)
    .map(part => (part === 'fonts' ? 'font' : part));

  const unknown = parts.filter(part => !(APPLY_PARTS as readonly string[]).includes(part));
  if (parts.length === 0 || unknown.length > 0) {
    throw new CliError(
      `Invalid --only "${value}"${unknown.length ? `: unknown part ${unknown.map(part => `"${part}"`).join(', ')}` : ''}. ` +
        `Use ${APPLY_PARTS.join(', ')} (comma-separated for both).`,
      'INVALID_ONLY',
    );
  }

  return [...new Set(parts)] as ApplyPart[];
}

export async function runApply(options: ApplyOptions): Promise<void> {
  // Everything that can be wrong with the request is checked before the first write.
  const preset = resolvePreset(options.preset);
  const only = parseOnly(options.only);
  const parts: readonly ApplyPart[] = only ?? APPLY_PARTS;
  const isFull = only === undefined;

  const cwd = path.resolve(options.cwd ?? process.cwd());
  if (!existsSync(cwd)) throw new CliError(`The path ${cwd} does not exist. Please try again.`, 'INVALID_CWD');

  const config = await getConfig(cwd);
  if (!config) {
    throw new CliError('Configuration not found. Please run `zard-cli init` first.', 'CONFIG_NOT_FOUND');
  }

  await loadIconCatalog(getRegistryUrl());
  await loadDesignData(getRegistryUrl());
  if (isFull) assertIconFamily(preset.design.iconLibrary);

  const cssFile = path.resolve(cwd, config.tailwind.css);
  if (!existsSync(cssFile)) {
    throw new CliError(
      `The stylesheet ${config.tailwind.css} does not exist. Run \`zard-cli init\` first, or fix "tailwind.css" in components.json.`,
      'CSS_NOT_FOUND',
    );
  }

  logger.info(`Applying preset ${preset.code}${only ? ` (${only.join(' + ')} only)` : ''}...`);

  const done: string[] = [];
  const { design } = preset;

  if (parts.includes('theme')) {
    const result = await writeTheme(cwd, config.tailwind.css, design, { pointer: options.pointer });
    done.push(describe(config.tailwind.css, 'theme tokens, radius and base layer', result));
  }

  if (parts.includes('font')) {
    const result = await writeFonts(cwd, config.tailwind.css, design);
    done.push(describe(config.tailwind.css, 'font imports and --font-sans / --font-heading', result));
  }

  if ((await updateComponentsJson(cwd, preset, parts, isFull)) === 'updated') done.push('components.json');

  const packages = packagesFor(design, parts, isFull);
  if (packages.length > 0) {
    const missing = await filterInstalledPackages(packages, cwd);
    if (missing.length > 0) {
      const installing = spinner(`Installing ${missing.join(', ')}...`).start();
      await installPackagesWithRetry(missing, cwd, config.packageManager, false);
      installing.succeed(`Installed ${missing.join(', ')}`);
      done.push(`dependencies (${missing.join(', ')})`);
    }
  }

  printReport({
    status: 'success',
    headline: `Preset ${preset.code} applied${only ? ` (${only.join(' + ')})` : ''}.`,
    items: done,
    notes: isFull
      ? [
          'Components already in your project keep their current style and icons.',
          'Re-add them to follow the preset: zard-cli add <component> --overwrite',
        ]
      : [],
  });
}

function describe(file: string, what: string, result: StyleWrite): string {
  return `${file} — ${what}${result === 'unchanged' ? ' (already up to date)' : ''}`;
}

/** The npm packages the applied parts need: the fonts, and — for a full preset — the icon family. */
function packagesFor(design: DesignConfig, parts: readonly ApplyPart[], isFull: boolean): string[] {
  const packages: string[] = [];

  if (parts.includes('font')) packages.push(...fontPackagesOf(design, designData()));
  if (isFull) packages.push(...iconPackagesFor(design.iconLibrary, iconCatalog()));

  return [...new Set(packages)];
}

/**
 * Updates `components.json` and nothing else in it.
 *
 * The file is patched, not regenerated: aliases, `registryUrl`, `rtl` and every other key the user
 * may have edited stay as they are. A theme-only apply records the base color and menu look it
 * wrote; `style`, `icons` and `preset` change only with a full preset, since they describe the
 * components and the whole design, which a partial apply did not touch.
 */
async function updateComponentsJson(
  cwd: string,
  preset: AppliedPreset,
  parts: readonly ApplyPart[],
  isFull: boolean,
): Promise<StyleWrite> {
  const file = path.resolve(cwd, 'components.json');
  const original = await readFile(file, 'utf8');
  const json = JSON.parse(original) as Record<string, unknown>;
  const { design } = preset;

  if (parts.includes('theme')) {
    json['tailwind'] = { ...(json['tailwind'] as Record<string, unknown> | undefined), baseColor: design.baseColor };
    json['menuColor'] = design.menuColor;
    json['menuAppearance'] = design.menuAppearance;
    json['menuAccent'] = design.menuAccent;
  }

  if (isFull) {
    json['style'] = design.style;
    json['icons'] = design.iconLibrary;
    json['preset'] = preset.code;
  }

  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const trailing = /\r?\n$/.test(original) ? eol : '';
  const updated = JSON.stringify(json, null, 2).replace(/\n/g, eol) + trailing;

  if (updated === original) return 'unchanged';

  await writeFile(file, updated, 'utf8');
  return 'updated';
}
