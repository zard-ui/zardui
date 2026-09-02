---
name: zard
description: Manages zard/ui components and projects — adding, composing, styling, and debugging Angular UI built on TailwindCSS v4. Provides project context, component source, and the real API instead of a remembered one. Applies when working with zard/ui, zard-cli, the zard registry, or any project with a components.json that declares a zard projectType. Also triggers for "zard-cli init", "add a zard component", or "set up zard/ui in an Nx workspace".
user-invocable: false
allowed-tools: Bash(npx zard-cli *), Bash(pnpm dlx zard-cli *), Bash(bunx --bun zard-cli *)
---

# zard/ui

An Angular component library. Components are installed as source code into the user's project by the CLI — there is no runtime package to import from, and no component to `npm install`.

> **IMPORTANT:** Run every CLI command with the project's own package runner: `npx zard-cli`, `pnpm dlx zard-cli`, `yarn zard-cli`, or `bunx zard-cli` — pick the one matching `packageManager` in `components.json`. The examples below use `npx zard-cli`; substitute the right runner.

## Current Project Context

**Read `components.json` at the project root before doing anything else.** It is written by `zard-cli init` and is the whole configuration — there is no `zard-cli info` command to call.

```json
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "icons": "lucide",
  "rtl": false,
  "projectType": "angular",
  "appConfigFile": "src/app/app.config.ts",
  "packageManager": "npm",
  "tailwind": { "css": "src/styles.css", "baseColor": "neutral" },
  "baseUrl": "src/app",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```

No `components.json` means the project has not been initialised — run `init` rather than writing component files by hand.

For anything the file does not answer — what exists, what a component's API is, what it depends on — read the [registry](./registry.md) or use the [MCP server](./mcp.md). Never reconstruct a component API from memory.

## Key Fields

- **`aliases.components`** → the import prefix for every component. Use the actual value; never hardcode `@/shared/components`. The prefix can be anything (`@app/...`, `~/...`) — it is mapped in `tsconfig.json`, or `tsconfig.base.json` in an Nx workspace.
- **`baseUrl`** → the source root the aliases resolve against. Components are written under it.
- **`projectType`** → `angular`, `angular-library`, `nx`, `nx-library`, or `analog`. Decides which tsconfig holds the aliases, where Tailwind is configured, and whether an `app.config.ts` exists at all. See [cli.md](./cli.md).
- **`appConfigFile`** → where `provideZard()` is registered. **Empty in a library** — there the consuming app registers it.
- **`tailwind.css`** → the global CSS file holding the theme tokens. Always edit this file; never create a second one.
- **`tailwind.baseColor`** → the theme preset: `neutral`, `stone`, `zinc`, `gray`, or `slate`.
- **`icons`** → the icon family the components are written with (`lucide` today). Decides the `@ng-icons/*` package and the symbol names. See [rules/icons.md](./rules/icons.md).
- **`rtl`** → declares layout direction intent. It does not change what gets installed.
- **`packageManager`** → use it for every dependency install (`pnpm add date-fns`, not `npm install date-fns`) and to pick the CLI runner.
- **`registryUrl`** → optional. Present when the project installs from a registry other than `https://zardui.com/r`. See [registry.md](./registry.md).

## Principles

1. **Install before importing.** A component only exists once `zard-cli add` has written it. Check the components directory first; do not import what is not there.
2. **Compose what exists.** A settings page is Card + Field + Input + Button. A dashboard is Layout + Card + Chart + Table. Reach for custom markup only when nothing covers it.
3. **Variants before classes.** `zType="outline"`, `zSize="sm"` — not a `class` that re-styles the component into the same thing.
4. **Semantic tokens only.** `bg-primary`, `text-muted-foreground`. Never `bg-blue-500`, never a `dark:` colour override.
5. **The library's own conventions apply to the code you write.** Standalone, `OnPush`, `input()`, `z`-prefixed inputs. See [rules/angular.md](./rules/angular.md).

## Critical Rules

Always enforced. Each links to a file with Incorrect/Correct pairs.

### Angular API → [rules/angular.md](./rules/angular.md)

- **Standalone with `imports`, `ChangeDetectionStrategy.OnPush`, `ViewEncapsulation.None`.** No NgModules, no `Default` change detection.
- **Signal inputs: `input()`, `model()`, `output()`.** No `@Input()` / `@Output()` decorators in new code.
- **Selectors are `z-<name>` and/or `[z-<name>]`.** Some components are element-only, some are attributes on a native tag (`input[z-input]`, `button[z-button]`). Use the one the component declares.
- **Composite components import their `Zard<Name>Imports` array**, not the individual classes one by one.
- **Never edit generated output.** `apps/web/src/generated/**` and `public/r/*.json` are build artefacts.

### Styling → [rules/styling.md](./rules/styling.md)

- **Semantic tokens, never raw colours.** `bg-primary` not `bg-blue-600`.
- **`class` is for layout, not for restyling.** It is merged last and wins — which is exactly why it should not be used to override the component's own colours.
- **`mergeClasses()`, not string concatenation.** It is `twMerge(clsx(...))`; plain interpolation loses the conflict resolution.
- **No `space-x-*` / `space-y-*`.** Use `flex` with `gap-*`.
- **`size-*` when width and height match.** `size-4`, not `w-4 h-4`.
- **No `dark:` colour overrides.** The tokens already switch.
- **Tailwind v4 only.** There is no `tailwind.config.js`; the theme lives in CSS.
- **`scroll-fade` needs an overflow container; `shimmer` is text-only.** Both are pure-CSS utilities from the `core` item.

### Composition → [rules/composition.md](./rules/composition.md)

- **Use the full composition.** `z-card` wants `z-card-header` / `z-card-title` / `z-card-content` / `z-card-footer`, not everything dumped into content.
- **Items belong to their group.** `z-select-item` inside `z-select-group`.
- **Dialogs are opened through `ZardDialogService`**, not by putting a `z-dialog` in the template with an `open` flag.
- **Toasts go through `ZardSonnerService`** — `show`, `success`, `error`, `promise`.
- **Use the component instead of styled markup.** `z-separator` not `<hr>`, `z-skeleton` not an `animate-pulse` div, `z-badge` not a styled span, `z-empty` not a hand-built empty state.

### Forms → [rules/forms.md](./rules/forms.md)

- **All three Angular form APIs are supported**: Signal Forms, Reactive Forms, Template-driven. Follow whichever the project already uses.
- **Form layout is `z-field-group` + `z-field`**, never a `div` with `space-y-*`.
- **Validation state is `data-invalid` on the field and `aria-invalid` on the control.**
- **Errors render in `z-field-error`**, not a loose paragraph.

### Typeset → [rules/typeset.md](./rules/typeset.md)

- **Rendered markdown gets a `typeset` container, never a class per tag.** `zard-cli add typeset` installs the stylesheet.
- **Six variables govern it**, three of which are the rhythm: `--typeset-size`, `--typeset-leading`, `--typeset-flow`.
- **`not-typeset` on any component embedded in prose.** It brings its own sizing.
- **`typeset-scroll` around a wide table**, instead of a hand-rolled overflow wrapper.
- **Utilities beat it with no `!important`** — every element selector sits inside `:where()`.

### Icons → [rules/icons.md](./rules/icons.md)

- **Icons come from `@ng-icons/<family>` and are registered with `provideIcons` in `viewProviders`.** An unregistered name renders nothing, silently.
- **The family comes from `icons` in `components.json`.** Do not assume `lucide`.
- **No sizing classes on icons inside components.** The component sizes them.

## Key Patterns

```angular-ts
// Host classes: computed + mergeClasses. Never assembled in the template.
protected readonly classes = computed(() => mergeClasses(cardVariants(), this.class()));

// Variants, not classes.
<button z-button zType="outline" zSize="sm">Save</button>   // correct
<button z-button class="border bg-transparent px-2.5">Save</button>  // wrong

// Spacing: gap-*, not space-y-*.
<div class="flex flex-col gap-4">   // correct
<div class="space-y-4">             // wrong

// Field: data-invalid on the field, aria-invalid on the control.
<div z-field [attr.data-invalid]="invalid || null">
  <label z-field-label for="email">Email</label>
  <input z-input id="email" [attr.aria-invalid]="invalid || null" />
  <z-field-error>Enter a valid email.</z-field-error>
</div>

// Loading button: the zLoading input, not a hand-rolled spinner.
<button z-button [zLoading]="saving()" [zDisabled]="saving()">Save</button>
```

## Component Selection

| Need            | Use                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Action          | `z-button` (`zType`: default, destructive, outline, secondary, ghost, link)                                                                                  |
| Grouped actions | `z-button-group`, `z-toggle`, `z-toggle-group`                                                                                                               |
| Text input      | `input[z-input]`, `textarea[z-textarea]`, `z-input-group`, `z-input-otp`                                                                                     |
| Choice          | `z-select`, `z-combobox`, `z-radio-group`, `z-checkbox`, `z-switch`, `z-slider`                                                                              |
| Dates           | `z-calendar`, `z-date-picker`                                                                                                                                |
| Form structure  | `z-field-group`, `z-field`, `z-field-label`, `z-field-description`, `z-field-error`                                                                          |
| Data display    | `z-table`, `z-card`, `z-item`, `z-badge`, `z-avatar`, `z-chart`                                                                                              |
| Navigation      | `z-navigation-menu`, `z-breadcrumb`, `z-tab-group`, `z-pagination`, `z-tree`                                                                                 |
| Layout          | `z-layout`, `z-separator`, `z-resizable`, `z-accordion`, `z-carousel`                                                                                        |
| Overlays        | `ZardDialogService` (modal), `z-drawer` (bottom/side sheet), `z-sheet` (side panel), `z-alert-dialog` (confirmation), `z-popover`, `z-tooltip`, `z-dropdown` |
| Command palette | `z-command`                                                                                                                                                  |
| Feedback        | `ZardSonnerService` (toast), `z-alert`, `z-progress`, `z-skeleton`, `z-spinner`                                                                              |
| Empty states    | `z-empty`                                                                                                                                                    |
| Chat / messages | `z-bubble`, `z-bubble-group`, `z-bubble-content`, `z-bubble-reactions`                                                                                       |
| Keyboard hints  | `z-kbd`                                                                                                                                                      |
| Rendered prose  | `typeset` + a preset class (a stylesheet, not a component) — see [rules/typeset.md](./rules/typeset.md)                                                       |

Names are the registry names — the same string `zard-cli add` takes.

## Workflow

1. **Read `components.json`.** No file → run `init`. Note `aliases`, `baseUrl`, `icons`, `packageManager`, `projectType`.
2. **Check what is installed.** List the components directory resolved from `aliases.components`. Do not re-add what is there, and do not import what is not.
3. **Find what exists.** The registry index at `<registryUrl>/registry.json` lists every item; the MCP server exposes the same thing as `list-components` and `search-components`.
4. **Read the real API before writing code.** `get-component-docs` (MCP) or `https://zardui.com/docs/components/<name>.md`. Every component page is published as Markdown. Guessing at inputs is the single most common failure mode.
5. **Install.** `npx zard-cli add <name>` — dependencies of the component, both npm packages and other registry items, are resolved and installed with it.
6. **Review what was written.** Read the added files. Check the imports resolve under the project's real alias, and that the icon family matches `icons`.
7. **Never hand-fetch component source from GitHub.** Use the CLI or the registry; the registry is what the project actually installs from.

## Quick Reference

```bash
# Initialise a project (full-screen wizard).
npx zard-cli init
npx zard-cli init --type nx --project web        # answer the wizard up front
npx zard-cli init --yes                          # accept the defaults; required without a TTY

# Add components.
npx zard-cli add button card dialog
npx zard-cli add                                 # pick from the list
npx zard-cli add --all
npx zard-cli add button --overwrite              # replace local changes — ask first
npx zard-cli add button --path src/app/ui        # a directory other than the configured one

# Diagnose.
npx zard-cli add button --debug
npx zard-cli --version
```

There is no `search`, `view`, `diff`, `info`, or `build` command — those are shadcn's. See [cli.md](./cli.md) for the full flag reference.

## Detailed References

- [cli.md](./cli.md) — `init` and `add`, every flag, the five project types, headless behaviour
- [registry.md](./registry.md) — the index, item and icon-catalog formats, JSON Schemas, pointing at your own registry
- [mcp.md](./mcp.md) — the nine MCP tools, how to connect, `ZARD_REGISTRY_URL` / `ZARD_DOCS_URL`
- [customization.md](./customization.md) — theme tokens, CVA variants, `mergeClasses`, extending a component
- [rules/angular.md](./rules/angular.md) — standalone, `input()`, OnPush, `ViewEncapsulation.None`, selectors
- [rules/styling.md](./rules/styling.md) — Tailwind v4, semantic tokens, `mergeClasses`, variants before raw classes, the `scroll-fade` / `shimmer` utilities
- [rules/composition.md](./rules/composition.md) — composing with what exists before inventing markup
- [rules/forms.md](./rules/forms.md) — Signal Forms, Reactive Forms, Template-driven
- [rules/icons.md](./rules/icons.md) — ng-icons, `provideIcons`, the catalog, the configurable family
- [rules/typeset.md](./rules/typeset.md) — styling rendered markdown with one container class instead of one per tag
