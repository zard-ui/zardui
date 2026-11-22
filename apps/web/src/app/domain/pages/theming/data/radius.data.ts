import type { RadiusStep } from '../models/theming.model';

/** Presets offered by the interactive radius preview. `0.625rem` is the CLI default. */
export const RADIUS_PRESETS = ['0rem', '0.3rem', '0.5rem', '0.625rem', '0.75rem', '1rem'] as const;

export const DEFAULT_RADIUS = '0.625rem';

/**
 * The seven steps `@theme inline` derives from `--radius`, verbatim from
 * `packages/cli/src/core/design/css.ts` (shadcn's multiplicative scale: 0 stays 0).
 */
export const RADIUS_STEPS: RadiusStep[] = [
  { utility: 'rounded-sm', formula: '--radius-sm: calc(var(--radius) * 0.6)', multiplier: 0.6 },
  { utility: 'rounded-md', formula: '--radius-md: calc(var(--radius) * 0.8)', multiplier: 0.8 },
  { utility: 'rounded-lg', formula: '--radius-lg: var(--radius)', multiplier: 1 },
  { utility: 'rounded-xl', formula: '--radius-xl: calc(var(--radius) * 1.4)', multiplier: 1.4 },
  { utility: 'rounded-2xl', formula: '--radius-2xl: calc(var(--radius) * 1.8)', multiplier: 1.8 },
  { utility: 'rounded-3xl', formula: '--radius-3xl: calc(var(--radius) * 2.2)', multiplier: 2.2 },
  { utility: 'rounded-4xl', formula: '--radius-4xl: calc(var(--radius) * 2.6)', multiplier: 2.6 },
];
