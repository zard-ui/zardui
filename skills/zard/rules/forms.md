# Forms

All three Angular form APIs are supported, and the markup is the same in all three — only the binding changes. Documented at `/docs/forms`, one page per approach.

## Contents

- Follow the project's existing approach
- Layout is `z-field-group` + `z-field`
- Validation state: `data-invalid` and `aria-invalid`
- Errors go in `z-field-error`
- Label and control are associated
- Grouping related controls
- The three approaches side by side

---

## Follow the project's existing approach

Signal Forms are the newest and the one the docs lead with, but a project on Reactive Forms should stay on Reactive Forms. Mixing them inside one feature means two sources of truth for the same state.

Check the imports of a neighbouring form before choosing:

| Import                                            | Approach        |
| ------------------------------------------------- | --------------- |
| `form`, `FormField` from `@angular/forms/signals` | Signal Forms    |
| `FormGroup`, `FormControl`, `ReactiveFormsModule` | Reactive Forms  |
| `FormsModule`, `ngModel`, `NgForm`                | Template-driven |

---

## Layout is `z-field-group` + `z-field`

**Incorrect:**

```angular-html
<form class="space-y-4">
  <div>
    <label class="text-sm font-medium">Username</label>
    <input z-input />
    <p class="text-muted-foreground text-xs">Your public display name.</p>
  </div>
</form>
```

**Correct:**

```angular-html
<form novalidate>
  <div z-field-group>
    <div z-field>
      <label z-field-label for="username">Username</label>
      <input z-input id="username" />
      <p z-field-description>Your public display name.</p>
    </div>
  </div>
</form>
```

`z-field-group` owns the spacing between fields; `z-field` owns the spacing inside one. Both have attribute selectors, so they sit on a plain `div` without adding an element.

For a row of actions, `z-field` takes an orientation:

```angular-html
<div z-field zOrientation="horizontal">
  <button z-button zType="outline" type="button">Reset</button>
  <button z-button type="submit">Save</button>
</div>
```

---

## Validation state: `data-invalid` and `aria-invalid`

Two attributes, two jobs: `data-invalid` on the **field** drives the styling of the whole block; `aria-invalid` on the **control** is what assistive technology reads. Set both, and only once touched — flagging an untouched field is noise.

**Incorrect:**

```angular-html
<div z-field>
  <label z-field-label for="email">Email</label>
  <input z-input id="email" class="border-red-500" />
</div>
```

**Correct:**

```angular-html
@let emailInvalid = email.invalid && email.touched;

<div z-field [attr.data-invalid]="emailInvalid || null">
  <label z-field-label for="email">Email</label>
  <input z-input id="email" [attr.aria-invalid]="emailInvalid || null" />
</div>
```

`|| null` matters: binding `false` renders `data-invalid="false"`, which is still a present attribute and still matches the selector.

---

## Errors go in `z-field-error`

**Incorrect:**

```angular-html
@if (invalid) {
  <p class="mt-1 text-xs text-red-600">Username must be at least 3 characters.</p>
}
```

**Correct:**

```angular-html
@if (usernameInvalid) {
  <z-field-error>
    @if (username.hasError('required') || username.hasError('minlength')) {
      Username must be at least 3 characters.
    } @else if (username.hasError('pattern')) {
      Username can only contain letters, numbers, and underscores.
    }
  </z-field-error>
}
```

With Signal Forms the errors are already objects, so pass them:

```angular-html
@if (usernameInvalid) {
  <z-field-error [zErrors]="username.errors()" />
}
```

---

## Label and control are associated

`for` on the label, matching `id` on the control. Without it, clicking the label does nothing and the accessible name is missing.

Prefix ids with the form name when a page holds more than one form — two fields called `username` on the same page produce duplicate ids, and the wrong label wins.

---

## Grouping related controls

Related checkboxes or radios belong in a `z-field-set` with a `z-field-legend`, not a `div` with a heading — the grouping is semantic, and a screen reader announces it.

```angular-html
<fieldset z-field-set>
  <legend z-field-legend>Notifications</legend>
  <div z-field-group>
    <div z-field zOrientation="horizontal">
      <z-checkbox id="email-notifications" />
      <label z-field-label for="email-notifications">Email</label>
    </div>
  </div>
</fieldset>
```

---

## The three approaches side by side

Same markup, same field parts, different binding.

**Signal Forms** — validation declared next to the model:

```angular-ts
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

private readonly model = signal({ username: '' });

protected readonly profileForm = form(this.model, path => {
  required(path.username, { message: 'Username must be at least 3 characters.' });
  minLength(path.username, 3, { message: 'Username must be at least 3 characters.' });
  maxLength(path.username, 10, { message: 'Username must be at most 10 characters.' });
});

// template
// @let username = profileForm.username();
// <input z-input [formField]="profileForm.username" />

protected async onSubmit(event: Event): Promise<void> {
  event.preventDefault();
  await submit(this.profileForm, async submitted => this.save(submitted().value()));
}
```

**Reactive Forms** — validators on the control:

```angular-ts
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

protected readonly profileForm = new FormGroup({
  username: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
  }),
});

// template
// <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
// <input z-input formControlName="username" />

protected onSubmit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }
  this.save(this.profileForm.getRawValue());
}
```

**Template-driven** — validation as attributes:

```angular-ts
import { FormsModule, NgForm } from '@angular/forms';

protected model = { username: '' };

// template
// <form #profileForm="ngForm" (ngSubmit)="onSubmit(profileForm)">
// <input z-input required minlength="3" maxlength="10" name="username" #username="ngModel" [(ngModel)]="model.username" />

protected onSubmit(form: NgForm): void {
  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }
  this.save(this.model);
}
```

In all three: `novalidate` on the `<form>` so the browser's own bubbles do not compete with the field errors, and `markAllAsTouched()` on an invalid submit so the messages actually appear.

The submit button can live outside the `<form>` via `form="<id>"` — which is what lets it sit in `z-card-footer` while the form is in `z-card-content`.
