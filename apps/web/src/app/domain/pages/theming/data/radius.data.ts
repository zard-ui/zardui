import type { RadiusStep } from '../models/theming.model';

/** Presets offered by the interactive radius preview. `0.625rem` is the CLI default. */
export const RADIUS_PRESETS = ['0rem', '0.3rem', '0.5rem', '0.625rem', '0.75rem', '1rem'] as const;

export const DEFAULT_RADIUS = '0.625rem';

/**
 * The four steps `@theme inline` derives from `--radius`, verbatim from
 * `packages/cli/src/core/themes/theme-definitions.ts:40-43`.
 */
export const RADIUS_STEPS: RadiusStep[] = [
  { utility: 'rounded-sm', formula: '--radius-sm: calc(var(--radius) - 4px)', offset: -4 },
  { utility: 'rounded-md', formula: '--radius-md: calc(var(--radius) - 2px)', offset: -2 },
  { utility: 'rounded-lg', formula: '--radius-lg: var(--radius)', offset: 0 },
  { utility: 'rounded-xl', formula: '--radius-xl: calc(var(--radius) + 4px)', offset: 4 },
];
