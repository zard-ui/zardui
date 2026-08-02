/** One row of the shadcn (Tailwind v3) → ZardUI (Tailwind v4) migration table. */
export interface MigrationRow {
  topic: string;
  before: string;
  after: string;
  note: string;
}

/**
 * Derived from the shadcn v3 stylesheet this documentation used to ship (HSL triplets inside
 * `@layer base`) versus what `packages/cli/src/core/themes/theme-definitions.ts` writes today.
 */
export const MIGRATION_ROWS: MigrationRow[] = [
  {
    topic: 'Color value',
    before: '--primary: 222.2 84% 4.9%;',
    after: '--primary: oklch(0.205 0 0);',
    note: 'A bare HSL triplet only worked because Tailwind wrapped it in `hsl()`. OKLCH values are complete CSS colors.',
  },
  {
    topic: 'Token wiring',
    before: "primary: 'hsl(var(--primary))' in tailwind.config.js",
    after: '--color-primary: var(--primary); inside @theme inline',
    note: 'Tailwind v4 has no JS config. The mapping lives in CSS, and `inline` is what keeps `.dark` able to override it.',
  },
  {
    topic: 'Opacity modifiers',
    before: "primary: 'hsl(var(--primary) / <alpha-value>)'",
    after: 'bg-primary/90',
    note: 'The `<alpha-value>` placeholder is gone — v4 applies opacity modifiers to any color automatically.',
  },
  {
    topic: 'Dark mode',
    before: "darkMode: 'class' in tailwind.config.js",
    after: '@custom-variant dark (&:is(.dark *));',
    note: 'Same class-based strategy, declared in CSS.',
  },
  {
    topic: 'Where variables live',
    before: '@layer base { :root { … } }',
    after: ':root { … } at the top level',
    note: 'Keeping tokens out of `@layer base` means an app stylesheet can override them without a layer battle.',
  },
  {
    topic: 'New tokens',
    before: '—',
    after: '--chart-1…5, --sidebar-*, --radius-sm/md/lg/xl',
    note: 'Added for parity with shadcn blocks. The radius scale is derived from `--radius`.',
  },
];

/**
 * Why the format changed at all. Each claim is about OKLCH itself, not about this repo.
 * Plain prose — these strings are interpolated as text, not run through the inline-code pipe.
 */
export const OKLCH_REASONS: string[] = [
  'Lightness is perceptual: the same lightness value looks equally light at any hue, so a palette stays balanced when you shift the hue.',
  'Interpolation stays clean — color-mix() and opacity modifiers do not drift toward grey the way HSL does.',
  'It reaches colors outside sRGB on displays that support them, without changing the syntax.',
  'It is a plain CSS color, so it works in :root with no build-time wrapper.',
];
