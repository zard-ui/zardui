# Composition

Compose what exists before inventing markup. Almost every "custom" piece of UI is two or three components that are already installed.

## Contents

- Use the component, not styled markup
- Use the full composition
- Items belong to their group
- Dialogs, sheets, alert dialogs and drawers: template or service
- Toasts go through the service
- Avatars need a fallback
- Loading state is an input
- Compose a page from primitives

---

## Use the component, not styled markup

**Incorrect:**

```angular-html
<hr class="my-4 border-t" />
<div class="bg-muted h-4 w-32 animate-pulse rounded"></div>
<span class="bg-secondary rounded-full px-2 py-0.5 text-xs">New</span>
<div class="rounded-md border border-yellow-300 bg-yellow-50 p-4">Heads up.</div>
<div class="py-12 text-center text-sm text-gray-500">Nothing here yet.</div>
```

**Correct:**

```angular-html
<z-separator />
<z-skeleton class="h-4 w-32" />
<z-badge zType="secondary">New</z-badge>
<z-alert zIcon="lucideInfo" zTitle="Heads up" zDescription="…" />
<z-empty zIcon="lucideFolderCode" zTitle="Nothing here yet" zDescription="…" />
```

Before writing a styled `div`, check the component table in [SKILL.md](../SKILL.md) — and if you are unsure a component exists, list the registry rather than assuming it does not.

---

## Use the full composition

A card is a set of parts. Dumping everything into the content slot loses the spacing and typography the parts carry.

**Incorrect:**

```angular-html
<z-card>
  <z-card-content>
    <h3 class="text-lg font-semibold">Profile</h3>
    <p class="text-muted-foreground text-sm">Update your details.</p>
    <button z-button>Save</button>
  </z-card-content>
</z-card>
```

**Correct:**

```angular-html
<z-card>
  <z-card-header>
    <z-card-title>Profile</z-card-title>
    <z-card-description>Update your details.</z-card-description>
  </z-card-header>
  <z-card-content>…</z-card-content>
  <z-card-footer>
    <button z-button>Save</button>
  </z-card-footer>
</z-card>
```

The same applies to `z-item` (`z-item-media` / `z-item-content` / `z-item-title` / `z-item-description` / `z-item-actions`) and to `z-field` — see [forms.md](./forms.md).

Most parts also have an attribute selector, which is useful for keeping the native tag: `<p z-card-content>`, `<p z-item-description>`.

---

## Items belong to their group

**Incorrect:**

```angular-html
<z-select zPlaceholder="Pick one">
  <z-select-label>Fruits</z-select-label>
  <z-select-item zValue="apple">Apple</z-select-item>
</z-select>
```

**Correct:**

```angular-html
<z-select class="w-full min-w-48" zPlaceholder="Pick one" [(zValue)]="selected">
  <z-select-group>
    <z-select-label>Fruits</z-select-label>
    <z-select-item zValue="apple">Apple</z-select-item>
    <z-select-item zValue="banana">Banana</z-select-item>
  </z-select-group>
  <z-select-separator />
  <z-select-group>
    <z-select-label>Vegetables</z-select-label>
    <z-select-item zValue="carrot">Carrot</z-select-item>
  </z-select-group>
</z-select>
```

Tabs work the same way: `z-tab` inside `z-tab-group`, never on its own.

---

## Dialogs, sheets, alert dialogs and drawers: template or service

All four overlays come in two forms that render the same panel. Compose the overlay in the template when its content
belongs to the page, and open it from code when the trigger lives in a service, a guard or a handler that has no
template of its own.

**Template.** The root holds the open state through `[(zVisible)]` and projects header, content and footer:

```angular-html
<button z-button (click)="showEdit.set(true)">Edit</button>

<z-dialog [(zVisible)]="showEdit">
  <z-dialog-header>
    <z-dialog-title>Edit profile</z-dialog-title>
    <z-dialog-description>Make changes here. Save when you are done.</z-dialog-description>
  </z-dialog-header>
  <app-profile-form />
  <z-dialog-footer>
    <button z-button zType="outline" z-dialog-close>Cancel</button>
    <button z-button (click)="save()">Save changes</button>
  </z-dialog-footer>
</z-dialog>
```

`z-sheet`, `z-alert-dialog` and `z-drawer` follow the same vocabulary (`z-sheet-header`, `z-alert-dialog-media`,
`[z-drawer-close]`, …). Import the bundle (`ZardDialogImports`, `ZardSheetImports`, `ZardAlertDialogImports`,
`ZardDrawerImports`), never the panel or container components directly.

**Service.** The same panel from code, with the header and footer built from the options:

```angular-ts
import { ZardDialogService } from '@/shared/components/dialog/dialog.service';

export class ProfilePage {
  private readonly dialog = inject(ZardDialogService);

  openEdit(): void {
    this.dialog.create({
      zTitle: 'Edit profile',
      zDescription: 'Make changes here. Save when you are done.',
      zContent: ProfileFormComponent,
      zData: { name: 'Ada', username: '@ada' },
      zOkText: 'Save changes',
      zOnOk: instance => this.save(instance.form.value),
    });
  }
}
```

The content component reads what was passed with `inject(Z_MODAL_DATA)`. `ZardSheetService`, `ZardAlertDialogService`
and `ZardDrawerService` follow the same shape; `[z-dialog-close]`-style directives work inside service-opened content
too.

**Incorrect:** toggling the panel yourself with `@if` or an `open` flag, or querying the overlay from the DOM.

Read the component's documentation page before writing the options object — the option names are specific and inventing one fails silently.

---

## Toasts go through the service

**Incorrect:**

```angular-ts
this.toastMessage.set('Saved!');
setTimeout(() => this.toastMessage.set(null), 3000);
```

**Correct:**

```angular-ts
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

private readonly sonner = inject(ZardSonnerService);

this.sonner.success('Saved!');
this.sonner.error('Failed', { description: 'Try again later.' });
this.sonner.promise(save(), { loading: 'Saving…', success: 'Saved!', error: 'Failed.' });
```

---

## Avatars need a fallback

`zFallback` is what renders when the image fails or has not loaded. Without it the avatar is an empty circle on every slow connection.

**Incorrect:**

```angular-html
<z-avatar zSrc="/users/ada.jpg" />
```

**Correct:**

```angular-html
<z-avatar zSrc="/users/ada.jpg" zFallback="AL" />
```

---

## Loading state is an input

The button carries its own spinner. Do not build one next to it.

**Incorrect:**

```angular-html
<button z-button [zDisabled]="saving()">
  @if (saving()) {
    <span class="size-4 animate-spin rounded-full border-2 border-t-transparent"></span>
  }
  Save
</button>
```

**Correct:**

```angular-html
<button z-button [zLoading]="saving()" [zDisabled]="saving()">Save</button>
```

---

## Compose a page from primitives

| Ask                        | Composition                                                                 |
| -------------------------- | ------------------------------------------------------------------------------ |
| Settings page              | `z-tab-group` + `z-card` + `z-field-group` + inputs + `z-button`               |
| Dashboard                  | `z-sidebar-provider` + `z-sidebar` (+ `z-sidebar-inset`) + `z-card` + `z-chart` + `z-table` |
| Nested navigation          | `z-sidebar` + `z-sidebar-group` + `z-sidebar-menu` + `z-sidebar-menu-item`      |
| Confirm destructive action | `ZardAlertDialogService`                                                       |
| Data list with actions     | `z-item-group` + `z-item` + `z-dropdown`                                       |
| Search palette             | `z-command`                                                                    |
| Login / signup / dashboard screen | the published blocks — `get-block` in [mcp.md](../mcp.md)                |

27 blocks are published: `dashboard-01`; `login-01` … `login-05`; `sidebar-01` … `sidebar-16`;
`signup-01` … `signup-05`. `zard-cli add dashboard-01` (or any block id) installs it the same way as a
component — see [cli.md](../cli.md). For an auth screen, a dashboard shell, or a sidebar layout, start
there instead of assembling one from primitives.
