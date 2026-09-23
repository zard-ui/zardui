# Composition

Compose what exists before inventing markup. Almost every "custom" piece of UI is two or three components that are already installed.

## Contents

- Use the component, not styled markup
- Use the full composition
- Items belong to their group
- Dialogs and sheets are opened by a service
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

## Dialogs and sheets are opened by a service

This is where zard/ui differs most from a trigger-and-content library. A dialog is not a `z-dialog` in the template toggled by a boolean — it is created imperatively, with a component as its content.

**Incorrect:**

```angular-html
<z-dialog [open]="showEdit()">
  <h2>Edit profile</h2>
  <app-profile-form />
</z-dialog>
<button z-button (click)="showEdit.set(true)">Edit</button>
```

**Correct:**

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

The content component reads what was passed with `inject(Z_MODAL_DATA)`. `z-sheet` and `z-alert-dialog` follow the same shape, through `ZardSheetService` and `ZardAlertDialogService`.

`z-drawer` is the exception: it takes **both**. `ZardDrawerService.create()` works like the others, and `<z-drawer [(zVisible)]="open">` with projected content is equally valid — so the boolean-flag form is not a mistake there. Pick the service when the content is its own component, the template when the drawer belongs to the page it lives in.

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

| Ask                        | Composition                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| Settings page              | `z-tab-group` + `z-card` + `z-field-group` + inputs + `z-button` |
| Dashboard                  | `z-layout` + `z-card` + `z-chart` + `z-table`                    |
| Sidebar layout             | `z-layout` + `z-sidebar` + `z-header` + `z-content`              |
| Confirm destructive action | `ZardAlertDialogService`                                         |
| Data list with actions     | `z-item-group` + `z-item` + `z-dropdown`                         |
| Search palette             | `z-command`                                                      |
| Login screen               | the `login-*` blocks — `get-block` in [mcp.md](../mcp.md)        |

Ten blocks are published (`login-01` … `signup-05`). For an auth screen, start there instead of assembling one.
