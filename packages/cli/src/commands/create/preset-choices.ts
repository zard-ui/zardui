/**
 * The presets `create` offers when none was passed: the default design, the curated looks Shuffle
 * draws from on the `/create` page, and a way out to build a custom one.
 */

import {
  DEFAULT_PRESET_CODE,
  SHUFFLE_PRESETS,
  encodePreset,
  fontById,
  type DesignConfig,
} from '@cli/core/design/index.js';
import { ICON_LIBRARIES, STYLES } from '@cli/core/design/options.js';

export const CUSTOM_PRESET = 'custom';
export const CREATE_URL = 'https://zardui.com/create';

export interface PresetChoice {
  /** A preset code, or `custom`. */
  readonly value: string;
  readonly label: string;
  readonly hint?: string;
}

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/** `Nova · Neutral`, the part of the design a person recognises at a glance. */
function labelOf(design: DesignConfig): string {
  const style = STYLES.find(option => option.value === design.style)?.label ?? capitalize(design.style);
  const color = design.theme === design.baseColor ? design.baseColor : `${design.baseColor} + ${design.theme}`;
  return `${style} · ${capitalize(color)}`;
}

/** `Inter · Lucide · medium radius`, the rest of what the code carries. */
function hintOf(design: DesignConfig): string {
  const font = fontById(design.font)?.label ?? design.font;
  const icons = ICON_LIBRARIES.find(option => option.value === design.iconLibrary)?.label ?? design.iconLibrary;
  return `${font} · ${icons} · ${design.radius} radius`;
}

/** Default first, then the curated list in its own order, then Custom. */
export function presetChoices(): PresetChoice[] {
  const seen = new Set<string>([DEFAULT_PRESET_CODE]);
  const curated: PresetChoice[] = [];

  for (const design of SHUFFLE_PRESETS) {
    const code = encodePreset(design);
    if (seen.has(code)) continue;
    seen.add(code);
    curated.push({ value: code, label: labelOf(design), hint: `${hintOf(design)}  ${code}` });
  }

  return [
    { value: DEFAULT_PRESET_CODE, label: 'Default', hint: `Nova · Neutral · Inter · Lucide  ${DEFAULT_PRESET_CODE}` },
    ...curated,
    { value: CUSTOM_PRESET, label: 'Custom…', hint: `design one at ${CREATE_URL} and paste the code` },
  ];
}
