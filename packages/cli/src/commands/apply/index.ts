import { fontPackagesIn, installedItems, orphanedPackages, removeCommand } from '@cli/commands/apply/leftovers.js';
import { type AppliedPreset } from '@cli/commands/init/config-prompter.js';
import { writeFonts, writeTheme, type StyleWrite } from '@cli/commands/init/design-css.js';
import { resolvePreset } from '@cli/commands/init/preset.js';
import { type DesignConfig } from '@cli/core/design/config.js';
import { fontPackagesOf } from '@cli/core/design/css.js';
import { iconPackagesFor } from '@cli/core/icons/index.js';
import { resolveStyle, type StyleSelection } from '@cli/core/styles/ids.js';
import { printReport, type ReportCommand } from '@cli/ui/index.js';
import { getConfig, type Config } from '@cli/utils/config.js';
import { designData, loadDesignData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';
import { assertIconFamily, iconCatalog, loadIconCatalog } from '@cli/utils/icon-catalog.js';
import { logger, spinner } from '@cli/utils/logger.js';
import { filterInstalledPackages, installPackagesWithRetry, suggestedRunner } from '@cli/utils/package-manager.js';
import { getRegistryUrl } from '@cli/utils/registry.js';
import { assertWorkingDirectory } from '@cli/utils/working-directory.js';
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

  // The pointer rule lives in the theme block; asking for it while leaving the theme out would be ignored.
  if (options.pointer !== undefined && !parts.includes('theme')) {
    throw new CliError(
      `--${options.pointer ? 'pointer' : 'no-pointer'} changes the theme block, and --only ${parts.join(',')} does not ` +
        'apply the theme. Add theme to --only (--only theme,font) or drop the flag.',
      'INVALID_FLAGS',
    );
  }

  const cwd = path.resolve(options.cwd ?? process.cwd());
  assertWorkingDirectory(cwd);

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

  // What the project looked like before: the leftovers are whatever this apply made obsolete.
  const before = await snapshot(config, cssFile);

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

  const leftovers = await findLeftovers({ cwd, config, cssFile, design, parts, isFull, before });

  printReport({
    status: 'success',
    headline: `Preset ${preset.code} applied${only ? ` (${only.join(' + ')})` : ''}.`,
    items: done,
    notes: leftovers.notes,
    commands: leftovers.commands,
  });
}

interface Snapshot {
  readonly style: StyleSelection;
  readonly icons: string;
  readonly menuColor: string;
  readonly menuAppearance: string;
  readonly fontPackages: readonly string[];
}

/** The settings and font packages of the project before `apply` touches it. */
async function snapshot(config: Config, cssFile: string): Promise<Snapshot> {
  return {
    style: config.style,
    icons: config.icons,
    menuColor: config.menuColor ?? 'default',
    menuAppearance: config.menuAppearance ?? 'solid',
    fontPackages: fontPackagesIn(await readFile(cssFile, 'utf8')),
  };
}

interface LeftoverInput {
  readonly cwd: string;
  readonly config: Config;
  readonly cssFile: string;
  readonly design: DesignConfig;
  readonly parts: readonly ApplyPart[];
  readonly isFull: boolean;
  readonly before: Snapshot;
}

/**
 * What the user still has to do after the run: re-add the components written in the previous look,
 * and remove the packages nothing uses anymore. Each line is there because this apply caused it.
 */
async function findLeftovers(input: LeftoverInput): Promise<{ notes: string[]; commands: ReportCommand[] }> {
  const { cwd, config, design, parts, isFull, before } = input;
  const notes: string[] = [];
  const commands: ReportCommand[] = [];
  const runner = suggestedRunner(config.packageManager);

  // Only a full preset writes the look of the components; a part never does.
  if (!isFull && parts.includes('theme')) {
    if (design.menuColor !== before.menuColor || design.menuAppearance !== before.menuAppearance) {
      notes.push(
        `The menu look (${design.menuColor}, ${design.menuAppearance}) is written into the components, not the ` +
          'stylesheet, so --only theme left it as it was. Apply the full preset to change it.',
      );
    }
  }

  if (isFull) {
    const looks: string[] = [];
    const oldStyle = resolveStyle(before.style);
    if (oldStyle !== design.style) looks.push(`style ${oldStyle} to ${design.style}`);
    if (before.icons !== design.iconLibrary) looks.push(`icons ${before.icons} to ${design.iconLibrary}`);
    if (before.menuColor !== design.menuColor) looks.push(`menu color ${before.menuColor} to ${design.menuColor}`);
    if (before.menuAppearance !== design.menuAppearance) {
      looks.push(`menu ${before.menuAppearance} to ${design.menuAppearance}`);
    }

    if (looks.length > 0) {
      const installed = await installedItems(cwd, config);

      if (installed.length > 0) {
        notes.push(
          `Installed components keep their previous look (${looks.join('; ')}). Add them again to follow the preset; ` +
            '--overwrite replaces their files, so commit any edits of your own first.',
        );
        commands.push({ command: `${runner} zard-cli add ${installed.join(' ')} --overwrite` });
      } else {
        notes.push(`Components you add from now on follow the preset (${looks.join('; ')}).`);
      }
    }
  }

  const previous = [
    ...(parts.includes('font') ? before.fontPackages : []),
    ...(isFull ? iconPackagesFor(before.icons, iconCatalog()) : []),
  ];
  const stylesheet = await readFile(input.cssFile, 'utf8');
  const orphans = await orphanedPackages(cwd, previous, packagesFor(design, parts, isFull), stylesheet);

  if (orphans.length > 0) {
    const icons = orphans.some(name => name.startsWith('@ng-icons/'));
    notes.push(
      `Packages the preset no longer uses: ${orphans.join(', ')}.` +
        (icons
          ? ' Remove them once the components are added again, since those still import the old icon package.'
          : ''),
    );
    commands.push({ command: removeCommand(config.packageManager, orphans) });
  }

  return { notes, commands };
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
 * may have edited stay as they are. A theme-only apply records the base color and the menu accent,
 * which are in the stylesheet it wrote; `style`, `icons`, the menu color and appearance, and `preset`
 * change only with a full preset, since they describe the components and the whole design, which a
 * partial apply did not touch. The file never claims a state the files do not have.
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
    // Only what the stylesheet now says. The menu color and appearance are baked into the component
    // files when they are added, so they follow the components (a full preset), never a stylesheet edit.
    json['tailwind'] = { ...(json['tailwind'] as Record<string, unknown> | undefined), baseColor: design.baseColor };
    json['menuAccent'] = design.menuAccent;
  }

  if (isFull) {
    json['menuColor'] = design.menuColor;
    json['menuAppearance'] = design.menuAppearance;
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
