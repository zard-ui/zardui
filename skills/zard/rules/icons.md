# Icons

Icons come from [ng-icons](https://ng-icons.github.io). A name that was never registered renders nothing and reports nothing — which is why registration is the rule that matters most here.

## Contents

- Register every icon with `provideIcons`
- The family comes from `components.json`
- Icons in a component are inputs, not content
- No sizing classes inside components
- Icon-only buttons need a label
- The catalogue

---

## Register every icon with `provideIcons`

Two halves, both required: `NgIcon` in `imports` so the template can use the element, and the symbol in `viewProviders` so the name resolves.

**Incorrect:**

```angular-ts
@Component({
  imports: [NgIcon],
  template: `
    <ng-icon name="lucideGitBranch" />
  `,
})
export class BranchBadge {}
```

**Correct:**

```angular-ts
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGitBranch } from '@ng-icons/lucide';

@Component({
  imports: [NgIcon],
  template: `
    <ng-icon name="lucideGitBranch" />
  `,
  viewProviders: [provideIcons({ lucideGitBranch })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchBadge {}
```

`viewProviders`, not `providers` — the registration has to reach the component's own view.

The name in the template is the imported symbol's name as a string. They must match exactly; `"gitBranch"` or `"lucide-git-branch"` will not resolve.

---

## The family comes from `components.json`

Read `icons` before importing anything. Today the registry publishes `lucide`, whose package is `@ng-icons/lucide` and whose symbols are prefixed `lucide` — but the catalogue is served by the registry at run time precisely so a new family works with a CLI that is already installed. Hardcoding the assumption is what breaks first.

```json
{ "icons": "lucide" }
```

The family also decides the prefix: `lucideCheck` in Lucide, a different symbol elsewhere. The translation table in `/r/icons.json` maps between them by a set-neutral key (`check`, `chevron-down`). If a row has no entry for a family, that family has no equivalent — say so rather than substituting a lookalike.

---

## Icons in a component are inputs, not content

Several components take the icon by name instead of by projection. Passing markup where a name is expected renders nothing.

**Incorrect:**

```angular-html
<z-alert>
  <ng-icon name="lucideInfo" />
  <h5>Heads up</h5>
</z-alert>
```

**Correct:**

```angular-html
<z-alert zIcon="lucideInfo" zTitle="Heads up" zDescription="You can add components to your app." />
<z-empty zIcon="lucideFolderCode" zTitle="No projects yet" zDescription="…" />
```

The symbol still has to be registered in the **consuming** component's `viewProviders`, even though it is drawn by the library component.

Buttons are the other way round — the icon is projected:

```angular-html
<button z-button zType="outline" zSize="sm">
  <ng-icon name="lucideGitBranch" />
  New branch
</button>
```

Read the component's documentation page when unsure which shape it takes.

---

## No sizing classes inside components

Components size their own icons through CSS. Adding `size-4` fights a rule that already exists and breaks when the button size changes.

**Incorrect:**

```angular-html
<button z-button zSize="sm">
  <ng-icon name="lucideGitBranch" class="mr-2 h-4 w-4" />
  New branch
</button>
```

**Correct:**

```angular-html
<button z-button zSize="sm">
  <ng-icon name="lucideGitBranch" />
  New branch
</button>
```

The gap is part of the button variant too — no `mr-2`.

A functional class is fine, since it is not sizing: `class="animate-spin"` on a loader.

---

## Icon-only buttons need a label

With no text, there is no accessible name.

**Incorrect:**

```angular-html
<button z-button zType="outline" zSize="icon">
  <ng-icon name="lucideTrash2" />
</button>
```

**Correct:**

```angular-html
<button z-button zType="outline" zSize="icon" aria-label="Delete project">
  <ng-icon name="lucideTrash2" />
</button>
```

---

## The catalogue

`/r/icons.json` lists the supported families and the translation table. It is fetched before any install, which is how the CLI knows which `@ng-icons/*` package to add and how to rewrite symbols when the project's family differs from the one the published files were written in.

Registry items carry their own icon list — `symbols` (as they appear in the code) and `tokens` (the set-neutral keys) — so an install knows exactly which icons come with a component. See [registry.md](../registry.md).
