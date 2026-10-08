# Renames and removals

Every breaking rename verified against the commit that made it — `git show <sha>` on this repository,
not a recollection of the subject line. Registry item names are what `zard-cli add` takes; selectors and
class names are what your own source has to change.

## Component renames

| Old registry item | Old selector / class | New registry item | New selector / class | What to change | Source |
| --- | --- | --- | --- | --- | --- |
| `divider` | `z-divider`, `ZardDividerComponent` | `separator` | `z-separator`, `[z-separator]`, `ZardSeparatorComponent` | `zard-cli add separator`; replace every `<z-divider>` / `ZardDividerComponent` import | [282d4210](https://github.com/zard-ui/zardui/commit/282d4210) |
| `loader` | `z-loader`, `ZardLoaderComponent` | `spinner` | `z-spinner`, `ZardSpinnerComponent` | `zard-cli add spinner`; replace every `<z-loader>` / `ZardLoaderComponent` import | [282d4210](https://github.com/zard-ui/zardui/commit/282d4210) |
| `radio` | `z-radio, [z-radio]` used standalone, `ZardRadioComponent` | `radio-group` | `z-radio-group` as the parent, `z-radio`/`[z-radio]` only as a **child** of it | `zard-cli add radio-group`; wrap the existing `z-radio` elements in a `z-radio-group` — a bare `z-radio` outside one no longer participates in the same value/name group | [282d4210](https://github.com/zard-ui/zardui/commit/282d4210) |
| `progress-bar` | `z-progress-bar`, `ZardProgressBarComponent` | `progress` | `z-progress`, `ZardProgressComponent` | `zard-cli add progress`; replace every `<z-progress-bar>` / `ZardProgressBarComponent` import | [282d4210](https://github.com/zard-ui/zardui/commit/282d4210) |
| `toast` | `z-toast`, `z-toaster`, `ZardToastComponent`, an injected toast service | `sonner` | `z-sonner` (the toaster host), `ZardSonnerService` (`.show` / `.success` / `.error` / `.promise`) | `zard-cli add sonner`; replace the old toast service calls with `inject(ZardSonnerService)` and its methods — see [rules/composition.md](../zard/rules/composition.md) in the `zard` skill | [1fd63f15](https://github.com/zard-ui/zardui/commit/1fd63f15) |
| `menu` | `[z-menu]`, `ZardMenuDirective`, one generic directive for every kind of menu | split into `navigation-menu`, `dropdown`, `context-menu` | `z-navigation-menu` for site navigation; `z-dropdown` for a menu opened from a trigger; `z-context-menu` for a right-click menu (the last two pre-date this rename — `menu` was the generic one, not a new capability) | Pick the component that matches what the old `[z-menu]` was actually being used for and re-author with it; there is no mechanical 1:1 replacement | [81f36e16](https://github.com/zard-ui/zardui/commit/81f36e16) |
| `form` | `z-form-field`, `z-form-control`, `z-form-label`, `z-form-message` | `field` | `z-field-group`, `z-field`, `z-field-label`, `z-field-description`, `z-field-error` | `zard-cli add field`; see [recompositions.md](./recompositions.md) — the control is no longer wrapped, it sits directly inside `z-field` alongside the label and error, driven by whichever of Signal Forms / Reactive Forms / Template-driven the project already uses | [282d4210](https://github.com/zard-ui/zardui/commit/282d4210) (added `field`) / [1d403cbf](https://github.com/zard-ui/zardui/commit/1d403cbf) (removed `form`) |
| `segmented` | `z-segmented`, `ZardSegmentedComponent` | absorbed into `tabs` | `z-tab-group` / `z-tab` | `zard-cli add tabs`; a segmented control is a styled `z-tab-group` — there is no direct equivalent, re-author with tabs | [282d4210](https://github.com/zard-ui/zardui/commit/282d4210) |
| `tree` | `z-tree`, `ZardTreeComponent`, `ZardTreeService` | removed, no replacement component | — | Nest `z-collapsible` (`z-collapsible-trigger` / `z-collapsible-content`) — see the `collapsible-file-tree` demo in the `collapsible` component for the real pattern zard/ui itself uses | [e321ad85](https://github.com/zard-ui/zardui/commit/e321ad85) |
| `layout` | `z-layout`, `z-header`, `z-footer` (as layout regions), `z-content`, `z-sidebar` (the old layout's own sidebar) | `sidebar` | `z-sidebar-provider` + `z-sidebar` + `z-sidebar-inset`, with `z-sidebar-header` / `z-sidebar-content` / `z-sidebar-footer` inside `z-sidebar` | `zard-cli add sidebar`; the shape is different, not just the names — see [recompositions.md](./recompositions.md) | [e321ad85](https://github.com/zard-ui/zardui/commit/e321ad85) |

## Selector / class renames inside a component that kept its registry name

| Where | Old | New | Source |
| --- | --- | --- | --- |
| `button-group` | `z-button-group-divider`, `ZardButtonGroupDividerComponent`, `buttonGroupDividerVariants` | `z-button-group-separator`, `ZardButtonGroupSeparatorComponent`, `buttonGroupSeparatorVariants` | [93391360](https://github.com/zard-ui/zardui/commit/93391360) |
| `input`/`textarea` | `textarea[z-input]` (a `<textarea>` using the input component's selector) | `textarea[z-textarea]`, its own component (`zard-cli add textarea`) | [70bc9b0a](https://github.com/zard-ui/zardui/commit/70bc9b0a) |

## API / prop changes (same selector, different inputs)

| Component | Old | New | Source |
| --- | --- | --- | --- |
| `toggle-group` | `value`, `defaultValue`, `items`, `zSize` scale `'sm'\|'md'\|'lg'` | `zValue`, `zDefaultValue`, `zItems`, plus new `zOrientation` and `zSpacing`; `zSize` now shares `toggle`'s scale (`xs`/`sm`/`default`/`lg`/`icon`) | [66df83b3](https://github.com/zard-ui/zardui/commit/66df83b3) |
| `toggle` | `zValue = input<boolean \| undefined>()` plus a separate `zDefault` input; `zAriaLabel` optional; `zSize` default `'md'` | `zValue = model(false)` (two-way, no separate default); `zAriaLabel = input.required<string>()`; `zSize` default `'default'` | [e6ad84d1](https://github.com/zard-ui/zardui/commit/e6ad84d1) |
| `dialog` / `alert-dialog` | Service internals built around plain fields; reading `Z_MODAL_DATA` via a raw `inject(Z_MODAL_DATA) as T` | Internals moved to signals; `injectDialogData<T>()` (dialog) reads `Z_MODAL_DATA` type-safely — the raw `inject` still works, but is no longer how the library's own code does it | [67d1ef90](https://github.com/zard-ui/zardui/commit/67d1ef90), [ac020bda](https://github.com/zard-ui/zardui/commit/ac020bda) |

## Additive, non-breaking (listed so you don't mistake them for something to migrate)

| Component | Added | Source |
| --- | --- | --- |
| `avatar` | `z-avatar-group-count` — the "+N" chip at the end of an avatar group | [b8d649f1](https://github.com/zard-ui/zardui/commit/b8d649f1) |

Existing code keeps working; there is nothing to change unless you want the new piece.

## Registry-level split

`core` used to ship `scroll-fade` and `shimmer` as part of every install. They are now their own item —
see [recompositions.md](./recompositions.md) for the full detail and the exact CSS `@import` change this
requires in the project's global stylesheet.
