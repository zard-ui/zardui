/**
 * Turning a preset code into what init and apply work with.
 *
 * The code is decoded here, once, before anything touches the disk: a bad code is an error that names
 * it and nothing has changed yet.
 */

import { type AppliedPreset } from '@cli/commands/init/config-prompter.js';
import { PresetError, decodePreset, encodePreset, extractPresetCode } from '@cli/core/design/codec.js';
import { type DesignConfig } from '@cli/core/design/config.js';
import { fontPackagesOf } from '@cli/core/design/css.js';
import { type Config } from '@cli/utils/config.js';
import { designData } from '@cli/utils/design-catalog.js';
import { CliError } from '@cli/utils/errors.js';

/**
 * `--preset` as the user typed it — `Z3k`, `--preset Z3k`, a whole pasted command — resolved to the
 * design and its canonical code.
 *
 * `source` says where it came from, only to word the error: `--preset` for a flag, the bare reason for
 * a code typed into a prompt.
 *
 * @throws CliError `INVALID_PRESET`, with the offending input in the message.
 */
export function resolvePreset(input: string, source: 'flag' | 'pasted' = 'flag'): AppliedPreset {
  try {
    const design = decodePreset(extractPresetCode(input));
    return { design, code: encodePreset(design) };
  } catch (error) {
    if (error instanceof PresetError) {
      // A code pasted into a prompt was never a flag: naming `--preset` there points at something
      // the user did not type.
      throw new CliError(source === 'flag' ? `Invalid --preset: ${error.message}` : error.message, 'INVALID_PRESET');
    }
    throw error;
  }
}

/**
 * The design a project was configured from, when its `components.json` records a preset that this
 * CLI can still read. A code from a newer CLI, or none at all, yields `undefined` — `add` must keep
 * working for such a project, so this never throws.
 */
export function designOfConfig(config: Pick<Config, 'preset'>): DesignConfig | undefined {
  if (!config.preset) return undefined;

  try {
    return decodePreset(config.preset);
  } catch {
    return undefined;
  }
}

/** The font packages a preset's design needs installed. */
export function fontPackagesFor(config: Pick<Config, 'preset'>): string[] {
  const design = designOfConfig(config);
  return design ? fontPackagesOf(design, designData()) : [];
}
