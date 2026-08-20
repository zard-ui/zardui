---
title: Theming
description: Design tokens in OKLCH, mapped to Tailwind utilities. One stylesheet controls every component.
---

# Theming

Design tokens in OKLCH, mapped to Tailwind utilities. One stylesheet controls every component.

A ZardUI theme is a set of CSS variables in `src/styles.css` . Each one is mapped to a Tailwind color through `@theme inline` , so `--primary` becomes `bg-primary` . Redefining the variable under `.dark` — or under any container class — retints every component underneath it, with no rebuild and no per-component configuration.

There are three ways to get a theme:

- **Run the CLI.**`zard-cli init` writes the whole file and asks which base color you want — see [Installation](/docs/installation) .
- **Copy the CSS.** The complete stylesheet is in How it works , explained line by line.
- **Build your own.** The [theme generator](/themes) gives you every token with a live preview and exports finished CSS.

## How it works

This is the whole file, exactly as `zard-cli init` writes it for the Neutral base color. Paste it into `src/styles.css` and every component is themed.

src/styles.css

```
@layer ng-icon, theme, base, components, utilities;
@import 'tailwindcss';
@import './app/shared/core/css/tailwind';
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.205 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield; /* Added for general compatibility */
  }
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  border-radius: 5px;
  background: var(--muted);
}
```

### Line by line

Nine parts, in the order they appear above. Each one earns its place — the last line of every entry says what breaks without it.

1. `@layer ng-icon, theme, base, components, utilities;`Cascade layer order Declaring the layers up front fixes their priority. `ng-icon` comes first, so it has the lowest weight — `@ng-icons/core` ships its rules inside `@layer ng-icon`.Without it Icon styles win over your utilities: `text-primary` on an `<ng-icon>` stops changing its color.
2. `@import 'tailwindcss';`TailwindCSS itself Pulls in preflight, the default theme and the utility engine. Everything below extends it.Without it No utility class resolves at all.
3. `@import './app/shared/core/css/tailwind';`ZardUI's core stylesheet Defines the `data-*` custom variants (`data-open`, `data-checked`, `data-selected`, `data-disabled`, `data-active`, `data-horizontal`, `data-vertical`), the accordion and caret keyframes, and the `no-scrollbar` utility. The path follows the `core` alias in `components.json`.Without it The 64 `data-*:` classes the library relies on silently compile to nothing — open/closed states, checked switches and selected menu items stop reacting. `animate-caret-blink` and `no-scrollbar` also disappear.
4. `@plugin "tailwindcss-animate";`Enter/exit animations Provides `animate-in`, `animate-out`, `fade-*`, `zoom-*` and `slide-in-from-*`.Without it Dialogs, sheets, popovers and dropdowns appear and vanish with no transition — over 50 classes across the library stop resolving.
5. `@custom-variant dark (&:is(.dark *));`Class-based dark mode Binds the `dark:` variant to a `.dark` ancestor instead of `prefers-color-scheme`. That is what lets `ZardDarkMode` flip the theme by toggling one class on `<html>`.Without it`dark:` follows the OS setting only. The theme toggle stops working and the `.dark` block below never applies.
6. `:root { --background: oklch(1 0 0); … }`Light values The raw color of every token, in OKLCH. Plain CSS variables — no Tailwind involved yet.Without it Every token resolves to nothing and components render unstyled.
7. `.dark { --background: oklch(0.145 0 0); … }`Dark overrides Redefines the same variables under `.dark`. Only the values change — no component knows which mode is active.Without it Dark mode keeps the light palette.
8. `@theme inline { --color-primary: var(--primary); … }`Tokens → Tailwind utilities Turns each token into a color utility: `--color-primary` is what makes `bg-primary` exist. `inline` is the important word — it makes Tailwind emit `var(--primary)` in the output instead of copying the value, so the `.dark` override still applies at runtime.Without it Without the block, `bg-primary` does not exist. Without `inline`, the light value gets baked into the CSS and dark mode has no effect.
9. `@layer base { * { @apply border-border outline-ring/50; } … }`Global defaults Gives every element the themed border color and focus ring, and paints `body` with `bg-background text-foreground`.Without it Borders fall back to `currentColor`, focus rings lose their theme color, and the page background stays white in dark mode.

#### Why OKLCH and not HSL or HEX?

Lightness is perceptual: the same lightness value looks equally light at any hue, so a palette stays balanced when you shift the hue. Interpolation stays clean — color-mix() and opacity modifiers do not drift toward grey the way HSL does.

## Convention

Tokens come in pairs: a surface and the text that sits on it. The `background` suffix is dropped, so `--primary` is the surface and `--primary-foreground` is the text on top of it.

```
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

### Every pair, rendered

These are real utilities on real elements — the contrast you see is the contrast you get.

--primary

--primary-foreground

Aa

light 17.16:1

Aa

dark 14.22:1

--secondary

--secondary-foreground

Aa

light 16.42:1

Aa

dark 14.48:1

--muted

--muted-foreground

Aa

light 4.34:1 *

Aa

dark 5.83:1

--accent

--accent-foreground

Aa

light 16.42:1

Aa

dark 14.48:1

--destructive

--destructive-foreground

Aa

light 4.71:1

Aa

dark 6.24:1

--card

--card-foreground

Aa

light 19.79:1

Aa

dark 17.16:1

--popover

--popover-foreground

Aa

light 19.79:1

Aa

dark 17.16:1

--sidebar

--sidebar-foreground

Aa

light 18.96:1

Aa

dark 17.16:1

Contrast ratios are computed from the Neutral preset. * marks a pair below the 4.5:1 WCAG AA threshold for body text — use it for large or secondary text, not for body copy.

### Tokens or raw utility classes?

Prefer tokens. They react to `.dark` and to scoped overrides on their own:

```
<div class="bg-background text-foreground">
  <!-- Your ZardUI components here -->
</div>
```

Raw Tailwind colors work too, but you own every dark-mode variant by hand and lose scoped theming entirely:

```
<div class="bg-zinc-950 dark:bg-white text-zinc-50 dark:text-zinc-950">
  <!-- Your ZardUI components here -->
</div>
```

## Token reference

All 32 tokens, with their Neutral values in both modes. The *Used by* column comes from a scan of the library source, so a token marked *not used yet* really is unused today.

Showing 32 of 32 tokens · light values for Neutral

### Base

Canvas, text and the four action colors.

| Token | Value | Used by |
| --- | --- | --- |
| `--background`App canvas. `@layer base` applies it to `body`.`bg-background``text-background``ring-background` | `oklch(1 0 0)` | 12 components avatar, button, calendar, card, field, input-group, kbd, layout, sheet, switch, tabs, tooltip |
| `--foreground`Default text color, applied to `body` next to `--background`.`text-foreground``bg-foreground``ring-foreground``fill-foreground` | `oklch(0.145 0 0)` | 18 components alert, alert-dialog, badge, breadcrumb, button, card, command, dialog, empty, input, input-group, input-otp, sheet, spinner, switch, tabs, toggle, tooltip |
| `--primary`Main action color — filled buttons, checked switches, progress fill.`bg-primary``text-primary``border-primary``ring-primary``fill-primary` | `oklch(0.205 0 0)` | 18 components alert-dialog, avatar, badge, button, calendar, carousel, checkbox, empty, field, input-group, input-otp, item, progress, radio-group, sheet, slider, switch, tabs |
| `--primary-foreground`Text and icons drawn on top of `--primary`.`text-primary-foreground``bg-primary-foreground` | `oklch(0.985 0 0)` | 9 components avatar, badge, button, calendar, checkbox, input-group, radio-group, sheet, switch |
| `--secondary`Low-emphasis action color for secondary buttons and badges.`bg-secondary` | `oklch(0.97 0 0)` | 3 components badge, button, input-group |
| `--secondary-foreground`Text drawn on top of `--secondary`.`text-secondary-foreground` | `oklch(0.205 0 0)` | 3 components badge, button, input-group |
| `--muted`Quiet surface — skeletons, separators, keyboard chips, table headers.`bg-muted` | `oklch(0.97 0 0)` | 20 components alert-dialog, avatar, button, button-group, calendar, card, command, dialog, empty, input-group, item, kbd, progress, skeleton, slider, spinner, table, tabs, toggle, toggle-group |
| `--muted-foreground`Secondary text — descriptions, placeholders, helper copy. The most used token in the library.`text-muted-foreground` | `oklch(0.556 0 0)` | 32 components accordion, alert, alert-dialog, avatar, breadcrumb, button-group, calendar, card, combobox, command, date-picker, dialog, dropdown, empty, field, form, input, input-group, input-otp, item, kbd, layout, menu, popover, select, separator, sheet, slider, table, tabs, textarea, toggle-group |
| `--accent`Hover and active surface for list items — menus, selects, trees, calendars.`bg-accent` | `oklch(0.97 0 0)` | 6 components badge, calendar, dropdown, layout, menu, select |
| `--accent-foreground`Text drawn on top of `--accent`.`text-accent-foreground` | `oklch(0.205 0 0)` | 6 components badge, calendar, command, dropdown, menu, select |
| `--destructive`Error and danger states — delete buttons, invalid fields, error rings.`bg-destructive``text-destructive``border-destructive``ring-destructive` | `oklch(0.577 0.245 27.325)` | 18 components alert, alert-dialog, badge, button, checkbox, command, dropdown, field, input, input-group, input-otp, menu, radio-group, select, sheet, switch, textarea, toggle |
| `--destructive-foreground`Text drawn on top of `--destructive`. The CLI maps it in `@theme inline` but does not define it — ZardUI docs do.`text-destructive-foreground` | `oklch(0.985 0 0)` | 1 component command |

### Surfaces

Layers that sit above the canvas.

| Token | Value | Used by |
| --- | --- | --- |
| `--card`Raised surface for cards and alerts.`bg-card` | `oklch(1 0 0)` | 2 components alert, card |
| `--card-foreground`Text drawn on top of `--card`.`text-card-foreground` | `oklch(0.145 0 0)` | 2 components alert, card |
| `--popover`Floating surface — dialogs, dropdowns, menus, selects, command palette.`bg-popover` | `oklch(1 0 0)` | 7 components alert-dialog, command, dialog, dropdown, menu, popover, select |
| `--popover-foreground`Text drawn on top of `--popover`.`text-popover-foreground` | `oklch(0.145 0 0)` | 7 components alert-dialog, command, dialog, dropdown, menu, popover, select |

### Form

Borders, inputs and focus rings.

| Token | Value | Used by |
| --- | --- | --- |
| `--border`Default border color. `@layer base` applies `border-border` to every element.`border-border``bg-border``fill-border` | `oklch(0.922 0 0)` | 14 components avatar, badge, button, carousel, command, dropdown, field, input-group, item, layout, resizable, select, separator, table |
| `--input`Border of form controls, and their fill at 30% opacity.`border-input``bg-input` | `oklch(0.922 0 0)` | 15 components button, button-group, card, checkbox, command, input, input-group, input-otp, radio-group, select, sheet, switch, tabs, textarea, toggle |
| `--ring`Focus ring. `@layer base` sets `outline-ring/50` globally; components add `ring-ring/50`.`ring-ring``border-ring``outline-ring` | `oklch(0.708 0 0)` | 19 components accordion, badge, button, calendar, card, checkbox, input, input-group, input-otp, item, radio-group, resizable, select, sheet, slider, switch, tabs, textarea, toggle |

### Charts

Categorical palette for data visualization.

| Token | Value | Used by |
| --- | --- | --- |
| `--chart-1`Categorical series 1 for data visualization. Defined for parity with shadcn chart blocks — no ZardUI component consumes it yet. | `oklch(0.646 0.222 41.116)` | Not used yet |
| `--chart-2`Categorical series 2 for data visualization. Defined for parity with shadcn chart blocks — no ZardUI component consumes it yet. | `oklch(0.6 0.118 184.704)` | Not used yet |
| `--chart-3`Categorical series 3 for data visualization. Defined for parity with shadcn chart blocks — no ZardUI component consumes it yet. | `oklch(0.398 0.07 227.392)` | Not used yet |
| `--chart-4`Categorical series 4 for data visualization. Defined for parity with shadcn chart blocks — no ZardUI component consumes it yet. | `oklch(0.828 0.189 84.429)` | Not used yet |
| `--chart-5`Categorical series 5 for data visualization. Defined for parity with shadcn chart blocks — no ZardUI component consumes it yet. | `oklch(0.769 0.188 70.08)` | Not used yet |

### Sidebar

A self-contained scale for app shells.

| Token | Value | Used by |
| --- | --- | --- |
| `--sidebar`Sidebar surface, kept separate from `--background` so the two can contrast.`bg-sidebar` | `oklch(0.985 0 0)` | 1 component layout |
| `--sidebar-foreground`Text drawn on top of `--sidebar`.`text-sidebar-foreground` | `oklch(0.145 0 0)` | 1 component layout |
| `--sidebar-primary`Active sidebar entry. Defined by the CLI; not consumed by any component yet. | `oklch(0.205 0 0)` | Not used yet |
| `--sidebar-primary-foreground`Text on top of `--sidebar-primary`. Defined by the CLI; not consumed yet. | `oklch(0.985 0 0)` | Not used yet |
| `--sidebar-accent`Hover surface for sidebar entries.`bg-sidebar-accent` | `oklch(0.97 0 0)` | 1 component layout |
| `--sidebar-accent-foreground`Text on top of `--sidebar-accent`. Defined by the CLI; not consumed yet. | `oklch(0.205 0 0)` | Not used yet |
| `--sidebar-border`Divider between the sidebar and the content area.`border-sidebar-border` | `oklch(0.922 0 0)` | 1 component layout |
| `--sidebar-ring`Focus ring inside the sidebar.`ring-sidebar-ring` | `oklch(0.708 0 0)` | 1 component layout |

## Radius & scale

`--radius` is the single knob for corner rounding. The four utilities below are derived from it in `@theme inline` , so changing one value reshapes every component.

`--radius` :

Card

| Utility | Definition | At 0.625rem |
| --- | --- | --- |
| `rounded-sm` | `--radius-sm: calc(var(--radius) - 4px)` | 6px |
| `rounded-md` | `--radius-md: calc(var(--radius) - 2px)` | 8px |
| `rounded-lg` | `--radius-lg: var(--radius)` | 10px |
| `rounded-xl` | `--radius-xl: calc(var(--radius) + 4px)` | 14px |

## Base colors

Five neutral scales ship with the CLI. They differ only in the hue mixed into the greys — pick one, then adjust `--primary` to taste.

Live preview

Neutral · light

Badge

Secondary

Destructive

Muted copy, for the text that supports the rest.

[Build your own theme →](/themes)

src/styles.css

```
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.205 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

## Dark mode

Dark mode is the `.dark` block and nothing else. No component knows which mode is active: they all read the same token names, and the values change underneath them.

Two pieces make it work — `@custom-variant dark (&:is(.dark *))` binds the `dark:` variant to a class instead of the OS setting, and something has to put that class on `<html>` . The `ZardDarkMode` service does that, and persists the choice.

[Set up dark mode →](/docs/dark-mode)

## Customizing

Three things you are likely to want: a new color, a token overridden for one part of the app, and a theme that follows a route.

### Adding a new color

Declare the raw value, override it under `.dark` , then map it — the same three steps every built-in token goes through.

src/styles.css

```
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

```
<div class="bg-warning text-warning-foreground">Warning message</div>
```

### Overriding tokens in one scope

Because `@theme inline` emits `var(--primary)` instead of a baked-in color, any container can redefine a token for its subtree.

src/styles.css

```
.theme-brand {
  --primary: oklch(0.55 0.22 264);
  --primary-foreground: oklch(0.98 0.01 264);
  --radius: 1rem;
}
```

```
<section class="theme-brand">
  <!-- Every ZardUI component in here picks up the scoped values. -->
  <button z-button>Brand button</button>
</section>
```

### A theme per route

Put the override class on a layout component's host and everything rendered through its outlet inherits it.

src/app/marketing/marketing.layout.ts

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-marketing-layout',
  imports: [RouterOutlet],
  // The class carries the token overrides declared in src/styles.css.
  host: { class: 'theme-brand' },
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingLayout {}
```

src/app/app.routes.ts

```
import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'marketing',
    loadComponent: () => import('./marketing/marketing.layout').then(m => m.MarketingLayout),
    children: [{ path: '', loadComponent: () => import('./marketing/home.page').then(m => m.HomePage) }],
  },
];
```

### Other color formats

The raw tokens hold plain CSS colors, so RGB, HSL and HEX all work. Keep the `@theme inline` mapping as it is.

src/styles.css

```
:root {
  /* OKLCH — what ZardUI ships */
  --primary: oklch(0.205 0 0);

  /* RGB */
  --secondary: rgb(244 244 245);

  /* HSL */
  --accent: hsl(240 5% 96%);

  /* HEX */
  --muted: #f4f4f5;
}
```

Need the values? The [colors page](/colors) lists the full Tailwind palette in OKLCH, HEX, RGB and HSL.

## Troubleshooting

Every entry below is a real failure mode of the setup on this page, with the line that causes it.

Cause

@custom-variant dark (&:is(.dark *));

is missing, so

dark:

still maps to

prefers-color-scheme

Fix

Add the

@custom-variant

line above

:root

, and make sure something puts the

.dark

class on

<html>

Cause

@theme

was used instead of

@theme inline

. Tailwind copied the light values into the output.

Fix

Use

@theme inline

. It emits

var(--primary)

instead of the resolved color, so

.dark

can still win.

Cause

The core stylesheet is not imported, so the

data-*

custom variants do not exist.

Fix

Add

@import './app/shared/core/css/tailwind';

right after

@import 'tailwindcss';

Cause

@plugin "tailwindcss-animate";

is missing, so

animate-in

and friends do not resolve.

Fix

Add the

@plugin

line and install

tailwindcss-animate

Cause

The

@layer

order is missing or

ng-icon

is not first, so icon rules outrank your utilities.

Fix

Keep

@layer ng-icon, theme, base, components, utilities;

as the very first line of the file.

Cause

The variable was declared inside a component stylesheet or a nested selector instead of

:root

Fix

Declare raw values in

:root

.dark

, and scope overrides deliberately with a container class.

Cause

@theme inline

maps

--color-destructive-foreground

to

--destructive-foreground

, which the CLI never defines.

Fix

Add

--destructive-foreground

to both

:root

and

.dark

, as the CSS on this page does.
