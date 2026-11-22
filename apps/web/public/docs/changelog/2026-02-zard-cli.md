---
title: February 2026 - zard-cli, Tree and SSR Dark Mode
description: The busiest month of the year outside August — 77 commits, most of them release automation. Underneath that: the CLI is renamed to `zard-cli` and hardened for monorepos, dark mode becomes safe under SSR, Button is restyled to match the latest shadcn/ui, Switch moves to a breaking model-input API, and Tree lands (it was removed again in August, see that entry).
---

# February 2026 - zard-cli, Tree and SSR Dark Mode

The busiest month of the year outside August — 77 commits, most of them release automation. Underneath that: the CLI is renamed to `zard-cli` and hardened for monorepos, dark mode becomes safe under SSR, Button is restyled to match the latest shadcn/ui, Switch moves to a breaking model-input API, and Tree lands (it was removed again in August, see that entry).

## CLI package renamed to zard-cli

The package moves from `@ngzard/ui` to `zard-cli`, and the binary from `ngzard` to `zard-cli`. The old package now prints a deprecation warning instead of doing anything. `components.json` and components you already installed are unaffected.

```
npx zard-cli@latest init
```

## Tree component

A new `z-tree` shipped this month — expand/collapse, single and checkbox selection with propagation and indeterminate state, CDK virtual scroll, keyboard navigation, and a custom node template. It was removed again in August 2026, so there is no install command or demo for it here; mentioned for the record.

## Switch moves to a model input

`z-switch` is now a component driven by `[(zChecked)]` and `zDisabled` instead of an attribute directive. The `(checkChange)` output and the bare `[z-switch]` selector are gone. Migrate `(checkChange)` to `(zCheckedChange)` or `[(zChecked)]`, `<button z-switch>` to `<z-switch>`, and a bare `disabled` attribute to `[zDisabled]`.

```
<z-switch [(zChecked)]="enabled" [zDisabled]="locked">Label</z-switch>
```

## Button matches the latest shadcn/ui

New `zSize` values (`xs`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`), every existing size 4px shorter, a `rounded-lg` base radius, and a tinted rather than solid `destructive` variant. Not an API break, but layouts shift — reinstall `button` (and `date-picker`, which picked up the same size scale) to pick up the new styles.

## Dark mode service works under SSR

`ZardDarkMode` no longer touches `matchMedia` in its constructor, so it no longer throws on the server and no longer flashes the wrong theme on first paint. It initialises after first render and keeps tracking OS changes while in `system` mode.

```
npx zard-cli@latest add dark-mode
```

## CLI add is monorepo- and Angular-aware

`zard-cli add` now walks up to find the right `package.json`, pins `embla-carousel-angular` to your Angular major, retries with `--legacy-peer-deps` when needed, warns on Angular pre-releases, and rewrites `@/shared/*` imports using the aliases in `components.json`.
