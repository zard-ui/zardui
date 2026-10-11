/**
 * The curated presets: what Shuffle draws from, and what Reset returns to.
 *
 * The shuffle list follows the idea of shadcn's `lib/shuffle-presets.ts` — a few dozen
 * combinations a person picked by eye, so a random jump never lands on an ugly one. They are
 * written as designs rather than codes, so they survive a change of the code table, and each one
 * goes through `normalizeDesign` (a curated look is never a constraint violation).
 */

import { encodePreset } from './codec.js';
import { DEFAULT_DESIGN, DESIGN_FIELDS, normalizeDesign, type DesignConfig, type DesignField } from './config.js';
import { type StyleId } from './options.js';

type Curated = Pick<DesignConfig, DesignField>;

const curated = (design: Curated): DesignConfig => normalizeDesign(design);

/** The hand-picked designs before the constraints are applied. */
const CURATED: readonly Curated[] = [
  {
    style: 'maia',
    baseColor: 'olive',
    theme: 'olive',
    chartColor: 'olive',
    font: 'geist',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'default',
    menuColor: 'inverted',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'maia',
    baseColor: 'mist',
    theme: 'blue',
    chartColor: 'mist',
    font: 'dm-sans',
    fontHeading: 'outfit',
    iconLibrary: 'lucide',
    radius: 'large',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'stone',
    theme: 'blue',
    chartColor: 'stone',
    font: 'inter',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'default',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'stone',
    theme: 'blue',
    chartColor: 'blue',
    font: 'raleway',
    fontHeading: 'inherit',
    iconLibrary: 'remixicon',
    radius: 'large',
    menuColor: 'default',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'nova',
    baseColor: 'zinc',
    theme: 'green',
    chartColor: 'zinc',
    font: 'geist-mono',
    fontHeading: 'instrument-sans',
    iconLibrary: 'remixicon',
    radius: 'medium',
    menuColor: 'inverted',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'mist',
    theme: 'cyan',
    chartColor: 'lime',
    font: 'noto-sans',
    fontHeading: 'eb-garamond',
    iconLibrary: 'remixicon',
    radius: 'small',
    menuColor: 'inverted',
    menuAppearance: 'solid',
    menuAccent: 'bold',
  },
  {
    style: 'sera',
    baseColor: 'stone',
    theme: 'emerald',
    chartColor: 'cyan',
    font: 'oxanium',
    fontHeading: 'geist',
    iconLibrary: 'phosphor',
    radius: 'default',
    menuColor: 'default',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'maia',
    baseColor: 'taupe',
    theme: 'taupe',
    chartColor: 'amber',
    font: 'outfit',
    fontHeading: 'raleway',
    iconLibrary: 'hugeicons',
    radius: 'medium',
    menuColor: 'default',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'stone',
    theme: 'red',
    chartColor: 'stone',
    font: 'inter',
    fontHeading: 'inherit',
    iconLibrary: 'tabler',
    radius: 'large',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'mist',
    theme: 'rose',
    chartColor: 'rose',
    font: 'public-sans',
    fontHeading: 'inherit',
    iconLibrary: 'phosphor',
    radius: 'default',
    menuColor: 'default',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'nova',
    baseColor: 'mist',
    theme: 'mist',
    chartColor: 'violet',
    font: 'roboto-slab',
    fontHeading: 'public-sans',
    iconLibrary: 'phosphor',
    radius: 'default',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'bold',
  },
  {
    style: 'nova',
    baseColor: 'neutral',
    theme: 'blue',
    chartColor: 'neutral',
    font: 'ibm-plex-sans',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'none',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'lyra',
    baseColor: 'neutral',
    theme: 'red',
    chartColor: 'neutral',
    font: 'jetbrains-mono',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'none',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'lyra',
    baseColor: 'stone',
    theme: 'orange',
    chartColor: 'orange',
    font: 'outfit',
    fontHeading: 'oxanium',
    iconLibrary: 'hugeicons',
    radius: 'none',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'olive',
    theme: 'olive',
    chartColor: 'olive',
    font: 'geist',
    fontHeading: 'inherit',
    iconLibrary: 'hugeicons',
    radius: 'default',
    menuColor: 'inverted',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'sera',
    baseColor: 'mist',
    theme: 'olive',
    chartColor: 'taupe',
    font: 'noto-serif',
    fontHeading: 'public-sans',
    iconLibrary: 'remixicon',
    radius: 'none',
    menuColor: 'inverted',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'maia',
    baseColor: 'mist',
    theme: 'emerald',
    chartColor: 'mist',
    font: 'inter',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'medium',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'mira',
    baseColor: 'olive',
    theme: 'lime',
    chartColor: 'emerald',
    font: 'ibm-plex-sans',
    fontHeading: 'space-grotesk',
    iconLibrary: 'phosphor',
    radius: 'default',
    menuColor: 'inverted',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'nova',
    baseColor: 'stone',
    theme: 'amber',
    chartColor: 'stone',
    font: 'inter',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'none',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'maia',
    baseColor: 'mauve',
    theme: 'emerald',
    chartColor: 'red',
    font: 'ibm-plex-sans',
    fontHeading: 'merriweather',
    iconLibrary: 'hugeicons',
    radius: 'default',
    menuColor: 'inverted',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'nova',
    baseColor: 'taupe',
    theme: 'amber',
    chartColor: 'taupe',
    font: 'dm-sans',
    fontHeading: 'noto-serif',
    iconLibrary: 'lucide',
    radius: 'large',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'maia',
    baseColor: 'mist',
    theme: 'blue',
    chartColor: 'mist',
    font: 'inter',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'medium',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'vega',
    baseColor: 'neutral',
    theme: 'green',
    chartColor: 'neutral',
    font: 'ibm-plex-sans',
    fontHeading: 'source-sans-3',
    iconLibrary: 'phosphor',
    radius: 'large',
    menuColor: 'inverted',
    menuAppearance: 'translucent',
    menuAccent: 'subtle',
  },
  {
    style: 'lyra',
    baseColor: 'taupe',
    theme: 'taupe',
    chartColor: 'orange',
    font: 'jetbrains-mono',
    fontHeading: 'merriweather',
    iconLibrary: 'remixicon',
    radius: 'none',
    menuColor: 'inverted',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
  {
    style: 'luma',
    baseColor: 'stone',
    theme: 'amber',
    chartColor: 'stone',
    font: 'inter',
    fontHeading: 'inherit',
    iconLibrary: 'lucide',
    radius: 'large',
    menuColor: 'default',
    menuAppearance: 'solid',
    menuAccent: 'subtle',
  },
];

/** 25 curated designs, in the order Shuffle walks them. */
export const SHUFFLE_PRESETS: readonly DesignConfig[] = CURATED.map(curated);

const reset = (style: StyleId, overrides: Partial<DesignConfig>): DesignConfig =>
  curated({ ...DEFAULT_DESIGN, style, ...overrides });

/** The design "Reset" returns to, per style: the look that style was drawn for. */
export const STYLE_RESET_PRESETS: Readonly<Record<StyleId, DesignConfig>> = {
  vega: reset('vega', {}),
  nova: reset('nova', {}),
  maia: reset('maia', { iconLibrary: 'hugeicons', font: 'figtree' }),
  lyra: reset('lyra', { iconLibrary: 'phosphor', font: 'jetbrains-mono' }),
  mira: reset('mira', { iconLibrary: 'hugeicons' }),
  luma: reset('luma', {}),
  sera: reset('sera', {
    baseColor: 'taupe',
    theme: 'taupe',
    chartColor: 'taupe',
    font: 'noto-sans',
    fontHeading: 'playfair-display',
  }),
  rhea: reset('rhea', {}),
};

/** The curated design for a style — nova's is the default design. */
export function resetDesign(style: StyleId): DesignConfig {
  return { ...STYLE_RESET_PRESETS[style] };
}

export type DesignLocks = Partial<Record<DesignField, boolean>>;

/**
 * A curated design other than the current one, with the locked fields held where they are.
 *
 * Locks are applied before comparing, so a candidate that only differs in locked fields counts as
 * the current design and is skipped. When nothing differs (everything locked), the current design is
 * returned unchanged rather than looping.
 *
 * `random` returns a number in [0, 1); it is a parameter so tests (and the page's seeded undo) stay
 * deterministic.
 */
export function shuffleDesign(
  current: DesignConfig,
  locks: DesignLocks = {},
  random: () => number = Math.random,
): DesignConfig {
  const currentCode = encodePreset(current);

  const candidates = SHUFFLE_PRESETS.map(preset => {
    const held: Partial<DesignConfig> = {};
    for (const field of DESIGN_FIELDS) if (locks[field]) (held as Record<string, unknown>)[field] = current[field];
    return normalizeDesign({ ...preset, ...held });
  }).filter(candidate => encodePreset(candidate) !== currentCode);

  if (candidates.length === 0) return current;

  return candidates[Math.min(candidates.length - 1, Math.floor(random() * candidates.length))] ?? current;
}
