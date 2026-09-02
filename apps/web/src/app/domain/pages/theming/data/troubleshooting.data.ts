import type { TroubleshootingEntry } from '../models/theming.model';

export const TROUBLESHOOTING: TroubleshootingEntry[] = [
  {
    id: 'dark-mode-does-nothing',
    symptom: 'Toggling dark mode changes nothing, or only follows the OS setting.',
    cause: '`@custom-variant dark (&:is(.dark *));` is missing, so `dark:` still maps to `prefers-color-scheme`.',
    fix: 'Add the `@custom-variant` line above `:root`, and make sure something puts the `.dark` class on `<html>`.',
  },
  {
    id: 'dark-values-ignored',
    symptom: 'The .dark block exists but the light colors stay on screen.',
    cause: '`@theme` was used instead of `@theme inline`. Tailwind copied the light values into the output.',
    fix: 'Use `@theme inline`. It emits `var(--primary)` instead of the resolved color, so `.dark` can still win.',
  },
  {
    id: 'states-not-reacting',
    symptom: 'Accordions, switches and menu items ignore their open/checked/selected state.',
    cause: 'The core stylesheet is not imported, so the `data-*` custom variants do not exist.',
    fix: "Add `@import './app/shared/core/css/tailwind';` right after `@import 'tailwindcss';`.",
  },
  {
    id: 'no-animations',
    symptom: 'Dialogs and dropdowns pop in with no transition.',
    cause: '`@plugin "tailwindcss-animate";` is missing, so `animate-in` and friends do not resolve.',
    fix: 'Add the `@plugin` line and install `tailwindcss-animate`.',
  },
  {
    id: 'icons-wrong-color',
    symptom: 'text-primary on an ng-icon has no effect.',
    cause: 'The `@layer` order is missing or `ng-icon` is not first, so icon rules outrank your utilities.',
    fix: 'Keep `@layer ng-icon, theme, base, components, utilities;` as the very first line of the file.',
  },
  {
    id: 'token-defined-outside-root',
    symptom: 'A custom token works in one component but not elsewhere.',
    cause: 'The variable was declared inside a component stylesheet or a nested selector instead of `:root`.',
    fix: 'Declare raw values in `:root` / `.dark`, and scope overrides deliberately with a container class.',
  },
];
