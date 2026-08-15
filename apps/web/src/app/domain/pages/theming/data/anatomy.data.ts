import type { AnatomyPart } from '../models/theming.model';

/**
 * Why the format is OKLCH at all. Each claim is about OKLCH itself, not about this repo.
 * Plain prose — these strings are interpolated as text, not run through the inline-code pipe.
 */
export const OKLCH_REASONS: string[] = [
  'Lightness is perceptual: the same lightness value looks equally light at any hue, so a palette stays balanced when you shift the hue.',
  'Interpolation stays clean — color-mix() and opacity modifiers do not drift toward grey the way HSL does.',
  'It reaches colors outside sRGB on displays that support them, without changing the syntax.',
  'It is a plain CSS color, so it works in :root with no build-time wrapper.',
];

/**
 * `src/styles.css`, line by line.
 *
 * Every `reason` and `breaksWhenMissing` below is checked against this repository — the layer
 * order against `@ng-icons/core` (which ships its rules inside `@layer ng-icon`), the core import
 * against `libs/zard/src/lib/shared/core/css/tailwind.css`, and the usage counts against a scan of
 * `libs/zard/src/lib/shared/components/**`.
 */
export const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'layer-order',
    snippet: '@layer ng-icon, theme, base, components, utilities;',
    title: 'Cascade layer order',
    reason:
      'Declaring the layers up front fixes their priority. `ng-icon` comes first, so it has the lowest weight — `@ng-icons/core` ships its rules inside `@layer ng-icon`.',
    breaksWhenMissing:
      'Icon styles win over your utilities: `text-primary` on an `<ng-icon>` stops changing its color.',
  },
  {
    id: 'import-tailwind',
    snippet: "@import 'tailwindcss';",
    title: 'TailwindCSS itself',
    reason: 'Pulls in preflight, the default theme and the utility engine. Everything below extends it.',
    breaksWhenMissing: 'No utility class resolves at all.',
  },
  {
    id: 'import-core',
    snippet: "@import './app/shared/core/css/tailwind';",
    title: "ZardUI's core stylesheet",
    reason:
      'Defines the `data-*` custom variants (`data-open`, `data-checked`, `data-selected`, `data-disabled`, `data-active`, `data-horizontal`, `data-vertical`), the accordion and caret keyframes, and the `no-scrollbar` utility. The path follows the `core` alias in `components.json`.',
    breaksWhenMissing:
      'The 64 `data-*:` classes the library relies on silently compile to nothing — open/closed states, checked switches and selected menu items stop reacting. `animate-caret-blink` and `no-scrollbar` also disappear.',
  },
  {
    id: 'plugin-animate',
    snippet: '@plugin "tailwindcss-animate";',
    title: 'Enter/exit animations',
    reason: 'Provides `animate-in`, `animate-out`, `fade-*`, `zoom-*` and `slide-in-from-*`.',
    breaksWhenMissing:
      'Dialogs, sheets, popovers and dropdowns appear and vanish with no transition — over 50 classes across the library stop resolving.',
  },
  {
    id: 'custom-variant-dark',
    snippet: '@custom-variant dark (&:is(.dark *));',
    title: 'Class-based dark mode',
    reason:
      'Binds the `dark:` variant to a `.dark` ancestor instead of `prefers-color-scheme`. That is what lets `ZardDarkMode` flip the theme by toggling one class on `<html>`.',
    breaksWhenMissing:
      '`dark:` follows the OS setting only. The theme toggle stops working and the `.dark` block below never applies.',
  },
  {
    id: 'root',
    snippet: ':root { --background: oklch(1 0 0); … }',
    title: 'Light values',
    reason: 'The raw color of every token, in OKLCH. Plain CSS variables — no Tailwind involved yet.',
    breaksWhenMissing: 'Every token resolves to nothing and components render unstyled.',
  },
  {
    id: 'dark',
    snippet: '.dark { --background: oklch(0.145 0 0); … }',
    title: 'Dark overrides',
    reason:
      'Redefines the same variables under `.dark`. Only the values change — no component knows which mode is active.',
    breaksWhenMissing: 'Dark mode keeps the light palette.',
  },
  {
    id: 'theme-inline',
    snippet: '@theme inline { --color-primary: var(--primary); … }',
    title: 'Tokens → Tailwind utilities',
    reason:
      'Turns each token into a color utility: `--color-primary` is what makes `bg-primary` exist. `inline` is the important word — it makes Tailwind emit `var(--primary)` in the output instead of copying the value, so the `.dark` override still applies at runtime.',
    breaksWhenMissing:
      'Without the block, `bg-primary` does not exist. Without `inline`, the light value gets baked into the CSS and dark mode has no effect.',
  },
  {
    id: 'layer-base',
    snippet: '@layer base { * { @apply border-border outline-ring/50; } … }',
    title: 'Global defaults',
    reason:
      'Gives every element the themed border color and focus ring, and paints `body` with `bg-background text-foreground`.',
    breaksWhenMissing:
      'Borders fall back to `currentColor`, focus rings lose their theme color, and the page background stays white in dark mode.',
  },
];
