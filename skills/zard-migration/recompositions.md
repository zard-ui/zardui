# Recompositions

Three components kept their registry name and their file names but changed shape. A rename table does
not migrate these — the old and new markup have to be read side by side, so `grep` for an old class name
finds nothing and the project looks fine until it renders.

## `card`

**Before** — a single component with content-shaping inputs and one projected slot
(`libs/zard/src/lib/shared/components/card/demo/default.ts` before
[73b544f5](https://github.com/zard-ui/zardui/commit/73b544f5)):

```angular-html
<z-card
  class="w-full md:w-94"
  zTitle="Login to your account"
  zDescription="Enter your email below to login to your account"
  zAction="Sign Up"
  (zActionClick)="onActionClick()"
>
  <!-- everything — the form fields — went here, in the single content slot -->
  <div class="space-y-4">…</div>

  <div card-footer class="flex w-full flex-col gap-2">
    <z-button zType="default">Login</z-button>
  </div>
</z-card>
```

**After** — composable sub-components, imported as a group:

```angular-ts
import { ZardCardImports } from '@/shared/components/card/card.imports';
```

```angular-html
<z-card class="w-full md:w-94">
  <z-card-header>
    <z-card-title>Login to your account</z-card-title>
    <z-card-description>Enter your email below to login to your account</z-card-description>
    <z-card-action>
      <button z-button zType="link">Sign Up</button>
    </z-card-action>
  </z-card-header>

  <z-card-content>
    <div class="space-y-4">…</div>
  </z-card-content>

  <z-card-footer class="flex w-full flex-col gap-2">
    <z-button zType="default">Login</z-button>
  </z-card-footer>
</z-card>
```

`zTitle` / `zDescription` / `zAction` / `(zActionClick)` and the `card-footer` attribute marker are gone.
`zard-cli add card --overwrite`, then move the projected content into `z-card-header` /
`z-card-title` / `z-card-description` / `z-card-action` / `z-card-content` / `z-card-footer` by hand —
there is no mechanical rewrite, because the old single slot mixed what the new version keeps apart.

## `pagination`

**Before** — one component, numbers rendered for you
(`libs/zard/src/lib/shared/components/pagination/demo/default.ts` before
[be59da5c](https://github.com/zard-ui/zardui/commit/be59da5c)):

```angular-html
<z-pagination [zTotal]="5" [(zPageIndex)]="currentPage" />
```

**After** — the same call now needs `zSimple` to keep that auto-numbered behaviour; without it, the
component expects the shadcn-shaped composition passed through `zContent`:

```angular-html
<!-- equivalent to the old default -->
<z-pagination [zTotal]="5" [(zPageIndex)]="currentPage" zSimple />

<!-- the new default shape: full control over the markup -->
<z-pagination [zTotal]="totalPages" [(zPageIndex)]="currentPage" [zContent]="content" />

<ng-template #content>
  <ul z-pagination-content>
    <li z-pagination-item>
      <z-pagination-previous (click)="goToPrevious()" [zDisabled]="currentPage() === 1" />
    </li>
    @for (page of pages(); track page) {
      <li z-pagination-item>
        <button type="button" z-pagination-button [zActive]="page === currentPage()" (click)="goToPage(page)">
          {{ page }}
        </button>
      </li>
    }
    <li z-pagination-item>
      <z-pagination-ellipsis />
    </li>
    <li z-pagination-item>
      <z-pagination-next (click)="goToNext()" [zDisabled]="currentPage() === totalPages" />
    </li>
  </ul>
</ng-template>
```

`zard-cli add pagination --overwrite`. If the project only ever used the auto-numbered form, adding
`zSimple` is the whole migration. If it customised the rendering, it was already reaching past the
public API — rebuild it with `z-pagination-content` / `z-pagination-item` / `z-pagination-button` /
`z-pagination-ellipsis` / `z-pagination-previous` / `z-pagination-next`.

## `input-group`

**Before** — addons were inputs on the group itself, string or `TemplateRef`
(`libs/zard/src/lib/shared/components/input-group/demo/default.ts` before
[d2245133](https://github.com/zard-ui/zardui/commit/d2245133)):

```angular-html
<z-input-group [zAddonBefore]="search" zAddonAfter="12 results">
  <input z-input placeholder="Search..." />
</z-input-group>

<ng-template #search><ng-icon name="lucideSearch" /></ng-template>
```

**After** — addons are projected children, positioned with `zAlign`:

```angular-ts
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
```

```angular-html
<z-input-group>
  <input z-input placeholder="Search..." />
  <z-input-group-addon>
    <ng-icon name="lucideSearch" />
  </z-input-group-addon>
</z-input-group>

<z-input-group>
  <input z-input placeholder="Card number" />
  <z-input-group-addon zAlign="inline-end">
    <ng-icon name="lucideCheck" />
  </z-input-group-addon>
</z-input-group>
```

`zAddonBefore` / `zAddonAfter` are gone, along with the old `zBorderless`, `zLoading` and `zSize` inputs
that lived on the group itself. `zard-cli add input-group --overwrite`, then turn every addon into a
`z-input-group-addon` child (`zAlign="inline-start"` — the default — or `"inline-end"`); a loading state
is now a `z-spinner` placed the same way.

## The `core` / `utils` / `utilities` split

Before [927f8232](https://github.com/zard-ui/zardui/commit/927f8232), `scroll-fade` and `shimmer`
shipped inside `core`, in `core/css/tailwind.css`. They are now their own registry item, `utilities`,
and `core`'s stylesheet moved and was renamed to `core/css/zard.css`.

A project that predates this split has, in its global CSS:

```css
@import '<core-alias>/css/tailwind';
```

Change it to:

```css
@import '<core-alias>/css/zard';
```

using whatever `aliases.core` resolves to. If the project uses `scroll-fade` or `shimmer` anywhere,
`zard-cli add utilities` — they render nothing once the old `tailwind.css` import is gone, because that
file no longer exists in the registry.

`utils` did not move — `mergeClasses()` is unaffected.

## The scrollbar migration

Verbatim from `apps/web/public/documentation/setup/shared/styles.md` — task #62's migration note:

> Want a thinner, theme-colored scrollbar instead of the browser default? Zard ships that as an opt-in
> utility, `scrollbar-thin`, instead of global CSS, so it never repaints scroll surfaces you did not ask
> it to. Add the class to `html` (or any container that scrolls) to opt in.
>
> **Upgrading an existing project:** if you ran `zard-cli init` before this change, your `styles.css`
> already has a bare `::-webkit-scrollbar { ... }` block appended after `@layer base`. It is safe to
> delete — it was restyling every scrollbar in your app, not just zard's, and repainting them whenever
> `--muted` / `--muted-foreground` changed. Delete it, and add the `scrollbar-thin` class to `html` if
> you want to keep the same look.

The block being described looks like this:

```css
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

Delete it; add `class="scrollbar-thin"` to `<html>` in `index.html` (or to whichever scroll container
should keep the styled scrollbar) if the look is worth keeping. Source:
[6c9e21ce](https://github.com/zard-ui/zardui/commit/6c9e21ce).
