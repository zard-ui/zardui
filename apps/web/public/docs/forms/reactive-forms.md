---
title: Reactive Forms
description: Build forms in Angular using Reactive Forms and zard/ui.
---

# Reactive Forms

Build forms in Angular using Reactive Forms and zard/ui.

In this guide we will build forms with Reactive Forms — the explicit, strongly typed forms API that has shipped with Angular for years. We'll cover building a form with the `field` component, validation, error handling, accessibility and more.

## Demo

We are going to build the following form. It has a text input and a textarea. On submit we validate the form data and display any errors.

Bug Title

Description

0/100 characters

Include steps to reproduce, expected behavior, and what actually happened.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-reactive-demo',
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardTextareaComponent,
  ],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Bug Report</z-card-title>
        <z-card-description>Help us improve by reporting bugs you encounter.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-demo" [formGroup]="bugForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let title = bugForm.controls.title;
            @let titleInvalid = title.invalid && title.touched;
            <div z-field [attr.data-invalid]="titleInvalid || null">
              <label z-field-label for="forms-reactive-demo-title">Bug Title</label>
              <input
                z-input
                formControlName="title"
                id="forms-reactive-demo-title"
                autocomplete="off"
                placeholder="Login button not working on mobile"
                [attr.aria-invalid]="titleInvalid || null"
              />
              @if (titleInvalid) {
                <z-field-error>
                  @if (title.hasError('required') || title.hasError('minlength')) {
                    Bug title must be at least 5 characters.
                  } @else if (title.hasError('maxlength')) {
                    Bug title must be at most 32 characters.
                  }
                </z-field-error>
              }
            </div>

            @let description = bugForm.controls.description;
            @let descriptionInvalid = description.invalid && description.touched;
            <div z-field [attr.data-invalid]="descriptionInvalid || null">
              <label z-field-label for="forms-reactive-demo-description">Description</label>
              <z-input-group>
                <textarea
                  z-textarea
                  rows="6"
                  formControlName="description"
                  id="forms-reactive-demo-description"
                  class="min-h-24 resize-none"
                  placeholder="I'm having an issue with the login button on mobile."
                  [attr.aria-invalid]="descriptionInvalid || null"
                ></textarea>
                <z-input-group-addon zAlign="block-end">
                  <span z-input-group-text class="tabular-nums">{{ description.value.length }}/100 characters</span>
                </z-input-group-addon>
              </z-input-group>
              <p z-field-description>Include steps to reproduce, expected behavior, and what actually happened.</p>
              @if (descriptionInvalid) {
                <z-field-error>
                  @if (description.hasError('required') || description.hasError('minlength')) {
                    Description must be at least 20 characters.
                  } @else if (description.hasError('maxlength')) {
                    Description must be at most 100 characters.
                  }
                </z-field-error>
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="bugForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-demo">Submit</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveDemoComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly bugForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(32)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(100)],
    }),
  });

  protected onSubmit(): void {
    if (this.bugForm.invalid) {
      this.bugForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.bugForm.getRawValue(), null, 2),
    });
  }
}
```

## Approach

A reactive form is a tree of control objects you build in the component class. The template does not create the form, it only connects existing controls to the DOM — which makes the model easy to test, easy to reshape at runtime and fully typed.

- The `FormGroup / FormControl / FormArray` classes hold the value and the validation state.
- `[formGroup]` and `formControlName` bind them to controls in the template.
- `z-field` components give you complete control over the markup and the accessibility wiring.
- `nonNullable: true` keeps the control type free of `null` and makes `reset()` restore the initial value.

## Anatomy

Here is a single field: the control provides the state, formControlName binds it, and the field components render it.

```
@let title = bugForm.controls.title;
@let titleInvalid = title.invalid && title.touched;
<div z-field [attr.data-invalid]="titleInvalid || null">
  <label z-field-label for="bug-title">Bug Title</label>
  <input
    z-input
    formControlName="title"
    id="bug-title"
    placeholder="Login button not working on mobile"
    [attr.aria-invalid]="titleInvalid || null"
  />
  <p z-field-description>Provide a concise title for your bug report.</p>
  @if (titleInvalid) {
    <z-field-error>
      @if (title.hasError('required') || title.hasError('minlength')) {
        Bug title must be at least 5 characters.
      } @else if (title.hasError('maxlength')) {
        Bug title must be at most 32 characters.
      }
    </z-field-error>
  }
</div>
```

## Form

### Create the form model

Describe the shape of the form with controls and attach the validators each one needs.

bug-report-form.ts

```
import { FormControl, FormGroup, Validators } from '@angular/forms';

// `nonNullable: true` keeps the control type as `string` instead of `string | null`
// and makes `reset()` restore the initial value instead of `null`.
protected readonly bugForm = new FormGroup({
  title: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5), Validators.maxLength(32)],
  }),
  description: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(20), Validators.maxLength(100)],
  }),
});
```

### Or build it with FormBuilder

`FormBuilder` is the same model with less ceremony: an array is read as `[initialValue, validators]` . Both styles produce identical, equally typed controls — pick one and stay with it.

bug-report-form.ts

```
import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

private readonly fb = inject(FormBuilder);

// `fb.nonNullable` builds every control with `{ nonNullable: true }`, so the same
// guarantees apply without repeating the option on each control.
protected readonly bugForm = this.fb.nonNullable.group({
  title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
  description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
});
```

### Set up the component

Import `ReactiveFormsModule` and handle the submit. Angular does not mark controls as touched on submit, so call `markAllAsTouched()` yourself to reveal the errors of fields the user never focused.

bug-report-form.ts

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

@Component({
  selector: 'bug-report-form',
  imports: [ReactiveFormsModule, ZardFieldImports, ZardInputComponent],
  templateUrl: './bug-report-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BugReportForm {
  protected readonly bugForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(32)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(100)],
    }),
  });

  protected onSubmit(): void {
    // Angular does not mark controls as touched on submit — do it yourself so
    // the errors of untouched fields become visible.
    if (this.bugForm.invalid) {
      this.bugForm.markAllAsTouched();
      return;
    }

    console.log(this.bugForm.getRawValue());
  }
}
```

### Bind it in the template

```
<form id="bug-report" [formGroup]="bugForm" (ngSubmit)="onSubmit()">
  <div z-field-group>
    <div z-field>
      <label z-field-label for="bug-title">Bug Title</label>
      <input z-input id="bug-title" formControlName="title" />
    </div>
  </div>
</form>
```

### Done

That's it. You now have a fully accessible form with client-side validation. Read the values with `getRawValue()` which — unlike `value` — includes disabled controls and keeps the exact type of your model.

## Validation

### Built-in validators

`Validators` covers the common rules. Pass one, or an array, to the control options.

account-form.ts

```
import { FormControl, FormGroup, Validators } from '@angular/forms';

protected readonly accountForm = new FormGroup({
  // Presence
  username: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
  }),
  // Formats
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  slug: new FormControl('', { nonNullable: true, validators: [Validators.pattern(/^[a-z0-9-]+$/)] }),
  // Numbers
  seats: new FormControl(1, { nonNullable: true, validators: [Validators.min(1), Validators.max(50)] }),
  // Booleans that must be `true` (terms, consent, ...)
  terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
});
```

### Custom and cross-field validators

A validator is a function from a control to an error map, or to `null` when the value is valid. Attach cross-field rules to the group that owns both controls — not to the individual controls.

signup-form.ts

```
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

/** Single field: return `null` when valid, an error map otherwise. */
function noReservedWords(control: AbstractControl): ValidationErrors | null {
  const reserved = ['admin', 'root', 'support'];
  return reserved.includes((control.value ?? '').toLowerCase()) ? { reserved: true } : null;
}

/** Cross-field: attach it to the group, not to the individual controls. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return !confirmPassword || password === confirmPassword ? null : { passwordMismatch: true };
}

protected readonly signupForm = new FormGroup(
  {
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, noReservedWords] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  },
  { validators: passwordsMatch },
);
```

### Async validators

An async validator returns a `Promise` or an `Observable` of the same error map, and goes in `asyncValidators` . Angular only runs them once every synchronous validator passes, and while the request is in flight the control reports `status === 'PENDING'` — neither valid nor invalid, which is what a submit button should wait on.

signup-form.ts

```
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

/** Returns the validator so the dependency stays out of the validator signature. */
function usernameAvailable(api: SignupApi): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> =>
    api.isUsernameTaken(control.value).pipe(map(taken => (taken ? { usernameTaken: true } : null)));
}

protected readonly signupForm = new FormGroup({
  username: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
    asyncValidators: [usernameAvailable(this.api)],
    // Async validators run on every change by default — 'blur' keeps the requests down.
    updateOn: 'blur',
  }),
});
```

### Validation modes

`updateOn` decides when the value and the validators are recomputed.

| Mode | Description |
| --- | --- |
| `'change'` | Validates on every change. The default. |
| `'blur'` | Validates when the control loses focus. |
| `'submit'` | Validates only when the parent form is submitted. |

```
// Per control
const title = new FormControl('', {
  nonNullable: true,
  updateOn: 'blur',
  validators: [Validators.required],
});

// Or for the whole group — every control inherits it unless it sets its own.
const bugForm = new FormGroup(
  { title, description },
  { updateOn: 'submit' },
);
```

## Control State

The control object is not read-only: you can disable it, write to it and listen to it at runtime.

### Disabling controls

`disable()` and `enable()` flip a control at runtime, and the boxed `{ value, disabled }` object starts it out disabled. Either way the control stops being validated and drops out of `value` — which is the whole reason `getRawValue()` exists.

```
protected readonly checkoutForm = new FormGroup({
  plan: new FormControl('free', { nonNullable: true }),
  // The boxed `{ value, disabled }` object is how a control starts out disabled.
  coupon: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
});

protected onPlanChange(plan: string): void {
  const coupon = this.checkoutForm.controls.coupon;
  // A disabled control is skipped by validation and left out of `value` —
  // `getRawValue()` is what reads it back on submit.
  plan === 'free' ? coupon.disable() : coupon.enable();
}
```

### Updating values programmatically

`setValue()` is the strict one and `patchValue()` the forgiving one. Reach for `setValue()` when the whole shape is at hand — it turns a renamed field into a compile error instead of a silent no-op.

```
// `setValue` demands the whole shape — a missing or unknown key throws.
this.profileForm.setValue({ username: 'shadcn', email: 'me@example.com' });

// `patchValue` takes any subset and silently ignores what it does not recognise.
this.profileForm.patchValue({ username: 'shadcn' });

// Both accept `{ emitEvent: false }` when the update should not trigger `valueChanges`.
this.profileForm.patchValue({ username: 'shadcn' }, { emitEvent: false });
```

### Changing validators at runtime

`addValidators()` , `removeValidators()` and `setValidators()` rewrite the rules of a control after the fact. The catch is that none of them revalidates by itself — without `updateValueAndValidity()` the control keeps the status it had before.

```
// Rules can change with the shape of the form — a field that only becomes
// required once another one is filled, for instance.
protected onDeliveryChange(method: string): void {
  const address = this.checkoutForm.controls.address;

  if (method === 'pickup') {
    address.removeValidators(Validators.required);
  } else {
    address.addValidators(Validators.required);
  }

  // Neither call re-runs validation on its own — the control keeps its old
  // status until you ask for a recalculation.
  address.updateValueAndValidity();
}
```

### Reacting to changes

`valueChanges` and `statusChanges` are the classic streams; `events` carries all of them — value, status, pristine, touched, submit and reset — in one place. Bridge either into a signal with `toSignal()` so the template stays free of subscriptions.

```
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TouchedChangeEvent, ValueChangeEvent } from '@angular/forms';

// `valueChanges` emits the value only. `getRawValue()` seeds it so the signal is
// never `undefined` and keeps the disabled controls.
protected readonly value = toSignal(this.bugForm.valueChanges, {
  initialValue: this.bugForm.getRawValue(),
});

constructor() {
  // `events` is the single stream for value, status, pristine, touched, submit and reset.
  this.bugForm.events.pipe(takeUntilDestroyed()).subscribe(event => {
    if (event instanceof ValueChangeEvent) {
      this.saveDraft(event.value);
    } else if (event instanceof TouchedChangeEvent) {
      this.trackFirstInteraction();
    }
  });
}
```

## Displaying Errors

Display errors next to the field with z-field-error. For styling and accessibility:

- Add `data-invalid` to the `z-field` element.
- Add `aria-invalid` to the control itself — the input, textarea, select, checkbox, and so on.
- Gate both on `invalid && touched` so an untouched field never shows an error, and branch on `hasError()` to pick the message.

```
@let emailControl = signupForm.controls.email;
@let emailInvalid = emailControl.invalid && emailControl.touched;
<div z-field [attr.data-invalid]="emailInvalid || null">
  <label z-field-label for="signup-email">Email</label>
  <input
    z-input
    type="email"
    id="signup-email"
    formControlName="email"
    [attr.aria-invalid]="emailInvalid || null"
  />
  @if (emailInvalid) {
    <z-field-error>
      @if (emailControl.hasError('required')) {
        Email is required.
      } @else if (emailControl.hasError('email')) {
        Enter a valid email address.
      }
    </z-field-error>
  }
</div>
```

## Working with Different Field Types

Every zard/ui form control implements a value accessor, so formControlName binds to all of them the same way.

### input

For text inputs, bind

formControlName

and mirror the control's invalid state with

aria-invalid

Username

This is your public display name. Must be between 3 and 10 characters. Must only contain letters, numbers, and underscores.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

@Component({
  selector: 'z-forms-reactive-input',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Profile Settings</z-card-title>
        <z-card-description>Update your profile information below.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-input" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let username = profileForm.controls.username;
            @let usernameInvalid = username.invalid && username.touched;
            <div z-field [attr.data-invalid]="usernameInvalid || null">
              <label z-field-label for="forms-reactive-input-username">Username</label>
              <input
                z-input
                formControlName="username"
                id="forms-reactive-input-username"
                autocomplete="username"
                placeholder="shadcn"
                [attr.aria-invalid]="usernameInvalid || null"
              />
              <p z-field-description>
                This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
                numbers, and underscores.
              </p>
              @if (usernameInvalid) {
                <z-field-error>
                  @if (username.hasError('required') || username.hasError('minlength')) {
                    Username must be at least 3 characters.
                  } @else if (username.hasError('maxlength')) {
                    Username must be at most 10 characters.
                  } @else if (username.hasError('pattern')) {
                    Username can only contain letters, numbers, and underscores.
                  }
                </z-field-error>
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="profileForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-input">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveInputComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly profileForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(USERNAME_PATTERN),
      ],
    }),
  });

  protected onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.profileForm.getRawValue(), null, 2),
    });
  }
}
```

### textarea

Textareas work exactly like inputs. Add

z-field-description

for the helper copy below the control.

More about you

Tell us more about yourself. This will be used to help us personalize your experience.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-reactive-textarea',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardTextareaComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Personalization</z-card-title>
        <z-card-description>Customize your experience by telling us more about yourself.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-textarea" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let about = profileForm.controls.about;
            @let aboutInvalid = about.invalid && about.touched;
            <div z-field [attr.data-invalid]="aboutInvalid || null">
              <label z-field-label for="forms-reactive-textarea-about">More about you</label>
              <textarea
                z-textarea
                formControlName="about"
                id="forms-reactive-textarea-about"
                class="min-h-[120px]"
                placeholder="I'm a software engineer..."
                [attr.aria-invalid]="aboutInvalid || null"
              ></textarea>
              <p z-field-description>
                Tell us more about yourself. This will be used to help us personalize your experience.
              </p>
              @if (aboutInvalid) {
                <z-field-error>
                  @if (about.hasError('required') || about.hasError('minlength')) {
                    Please provide at least 10 characters.
                  } @else if (about.hasError('maxlength')) {
                    Please keep it under 200 characters.
                  }
                </z-field-error>
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="profileForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-textarea">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveTextareaComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly profileForm = new FormGroup({
    about: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
    }),
  });

  protected onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.profileForm.getRawValue(), null, 2),
    });
  }
}
```

### select

z-select

is a value accessor too. Use

zOrientation="responsive"

with

z-field-content

to put the label and the control side by side on wider screens. "Auto" is listed but rejected by a custom validator — a value rule, not a presence one.

Spoken Language

For best results, select the language you speak.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'de', label: 'German' },
  { id: 'it', label: 'Italian' },
  { id: 'zh', label: 'Chinese' },
  { id: 'ja', label: 'Japanese' },
] as const;

/** `auto` is offered in the list, but it is not an acceptable answer. */
function specificLanguage(control: AbstractControl): ValidationErrors | null {
  return control.value === 'auto' ? { autoNotAllowed: true } : null;
}

@Component({
  selector: 'z-forms-reactive-select',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSelectImports],
  template: `
    <z-card class="w-full sm:max-w-lg">
      <z-card-header>
        <z-card-title>Language Preferences</z-card-title>
        <z-card-description>Select your preferred spoken language.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-select" [formGroup]="preferencesForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let language = preferencesForm.controls.language;
            @let languageInvalid = language.invalid && language.touched;
            <div z-field zOrientation="responsive" [attr.data-invalid]="languageInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-reactive-select-language">Spoken Language</label>
                <p z-field-description>For best results, select the language you speak.</p>
                @if (languageInvalid) {
                  <z-field-error>
                    @if (language.hasError('required')) {
                      Please select your spoken language.
                    } @else if (language.hasError('autoNotAllowed')) {
                      Auto-detection is not allowed. Please select a specific language.
                    }
                  </z-field-error>
                }
              </div>
              <z-select
                formControlName="language"
                id="forms-reactive-select-language"
                class="min-w-[120px]"
                zPlaceholder="Select"
                [zInvalid]="languageInvalid"
              >
                <z-select-item zValue="auto">Auto</z-select-item>
                <z-select-separator />
                @for (option of languages; track option.id) {
                  <z-select-item [zValue]="option.id">{{ option.label }}</z-select-item>
                }
              </z-select>
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="preferencesForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-select">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveSelectComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly languages = LANGUAGES;

  protected readonly preferencesForm = new FormGroup({
    language: new FormControl('', { nonNullable: true, validators: [Validators.required, specificLanguage] }),
  });

  protected onSubmit(): void {
    if (this.preferencesForm.invalid) {
      this.preferencesForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.preferencesForm.getRawValue(), null, 2),
    });
  }
}
```

### checkbox

A checkbox group maps cleanly to a

FormArray

of booleans: one control per option, plus a group-level validator for the 'pick at least one' rule. The first group holds a single disabled control that ships checked —

getRawValue()

is what reads it back. Remember

data-slot="checkbox-group"

on the

z-field-group

Responses

Get notified for requests that take time, like research or image generation.

Push notifications

Tasks

Get notified when tasks you've created have updates.

Push notifications

Email notifications

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const TASKS = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
] as const;

/** A `FormArray` of booleans is valid only when at least one entry is checked. */
function atLeastOneSelected(control: AbstractControl): ValidationErrors | null {
  const selected = (control.value as boolean[]).filter(Boolean).length;
  return selected > 0 ? null : { atLeastOneSelected: true };
}

@Component({
  selector: 'z-forms-reactive-checkbox',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Notifications</z-card-title>
        <z-card-description>Manage your notification preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-checkbox" [formGroup]="notificationsForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Responses</legend>
              <p z-field-description>Get notified for requests that take time, like research or image generation.</p>

              <div z-field-group data-slot="checkbox-group">
                <div z-field zOrientation="horizontal">
                  <span z-checkbox formControlName="responses" zId="forms-reactive-checkbox-responses"></span>
                  <label z-field-label for="forms-reactive-checkbox-responses" class="font-normal">
                    Push notifications
                  </label>
                </div>
              </div>
            </fieldset>

            <z-field-separator />

            @let tasks = notificationsForm.controls.tasks;
            @let tasksInvalid = tasks.invalid && tasks.touched;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Tasks</legend>
              <p z-field-description>Get notified when tasks you've created have updates.</p>

              <div z-field-group data-slot="checkbox-group" formArrayName="tasks">
                @for (task of allTasks; track task.id; let index = $index) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="tasksInvalid || null">
                    <span
                      z-checkbox
                      [formControlName]="index"
                      [zId]="'forms-reactive-checkbox-' + task.id"
                      [zInvalid]="tasksInvalid"
                    ></span>
                    <label z-field-label [for]="'forms-reactive-checkbox-' + task.id" class="font-normal">
                      {{ task.label }}
                    </label>
                  </div>
                }
              </div>
              @if (tasksInvalid) {
                <z-field-error>Please select at least one notification type.</z-field-error>
              }
            </fieldset>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="notificationsForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-checkbox">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveCheckboxComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly allTasks = TASKS;

  protected readonly notificationsForm = new FormGroup({
    responses: new FormControl({ value: true, disabled: true }, { nonNullable: true }),
    tasks: new FormArray(
      TASKS.map(() => new FormControl(false, { nonNullable: true })),
      atLeastOneSelected,
    ),
  });

  protected onSubmit(): void {
    if (this.notificationsForm.invalid) {
      this.notificationsForm.markAllAsTouched();
      return;
    }

    // `getRawValue()` is what reads the disabled `responses` control.
    const { responses, tasks } = this.notificationsForm.getRawValue();
    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(
        { responses, tasks: TASKS.filter((_, index) => tasks[index]).map(task => task.id) },
        null,
        2,
      ),
    });
  }
}
```

### radio group

Bind

formControlName

to

z-radio-group

— the individual

z-radio

items only carry their value.

Plan

You can upgrade or downgrade your plan at any time.

Starter (100K tokens/month)For everyday use with basic features.

Pro (1M tokens/month)For advanced AI usage with more features.

Enterprise (Unlimited tokens)For large teams and heavy usage.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const PLANS = [
  { id: 'starter', title: 'Starter (100K tokens/month)', description: 'For everyday use with basic features.' },
  { id: 'pro', title: 'Pro (1M tokens/month)', description: 'For advanced AI usage with more features.' },
  { id: 'enterprise', title: 'Enterprise (Unlimited tokens)', description: 'For large teams and heavy usage.' },
] as const;

@Component({
  selector: 'z-forms-reactive-radio',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardRadioGroupImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Subscription Plan</z-card-title>
        <z-card-description>See pricing and features for each plan.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-radio" [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()">
          @let plan = subscriptionForm.controls.plan;
          @let planInvalid = plan.invalid && plan.touched;
          <fieldset z-field-set>
            <legend z-field-legend>Plan</legend>
            <p z-field-description>You can upgrade or downgrade your plan at any time.</p>

            <z-radio-group class="gap-3" formControlName="plan">
              @for (item of plans; track item.id) {
                <label z-field-label [for]="'forms-reactive-radio-' + item.id">
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                    <div z-field-content>
                      <span z-field-title>{{ item.title }}</span>
                      <p z-field-description>{{ item.description }}</p>
                    </div>
                    <z-radio [zId]="'forms-reactive-radio-' + item.id" [value]="item.id" [zInvalid]="planInvalid" />
                  </div>
                </label>
              }
            </z-radio-group>
            @if (planInvalid) {
              <z-field-error>You must select a subscription plan to continue.</z-field-error>
            }
          </fieldset>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="subscriptionForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-radio">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveRadioComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;

  protected readonly subscriptionForm = new FormGroup({
    plan: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  protected onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.subscriptionForm.getRawValue(), null, 2),
    });
  }
}
```

### switch

Switches bind to a boolean control.

Validators.requiredTrue

is the rule for "must be enabled".

Multi-factor authentication

Enable multi-factor authentication to secure your account.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-forms-reactive-switch',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Security Settings</z-card-title>
        <z-card-description>Manage your account security preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-switch" [formGroup]="securityForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let twoFactor = securityForm.controls.twoFactor;
            @let twoFactorInvalid = twoFactor.invalid && twoFactor.touched;
            <div z-field zOrientation="horizontal" [attr.data-invalid]="twoFactorInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-reactive-switch-two-factor">Multi-factor authentication</label>
                <p z-field-description>Enable multi-factor authentication to secure your account.</p>
                @if (twoFactorInvalid) {
                  <z-field-error>It is highly recommended to enable two-factor authentication.</z-field-error>
                }
              </div>
              <z-switch
                formControlName="twoFactor"
                zId="forms-reactive-switch-two-factor"
                [zInvalid]="twoFactorInvalid"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="securityForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-switch">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveSwitchComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly securityForm = new FormGroup({
    twoFactor: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
  });

  protected onSubmit(): void {
    if (this.securityForm.invalid) {
      this.securityForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.securityForm.getRawValue(), null, 2),
    });
  }
}
```

### complex forms

Everything above, composed into one form with fieldsets, separators, a validator that rejects unknown plan values and count rules on the add-ons array.

Subscription Plan

Choose your subscription plan.

Basic For individuals and small teams

Pro For businesses with higher demands

Billing Period

Choose how often you want to be billed.

Add-ons

Select additional features you'd like to include.

Analytics

Advanced analytics and reporting

Backup

Automated daily backups

Priority Support

24/7 premium customer support

Email Notifications

Receive email updates about your subscription

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardRadioGroupImports } from '@zard/components/radio-group/radio-group.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

const PLANS = [
  { id: 'basic', title: 'Basic', description: 'For individuals and small teams' },
  { id: 'pro', title: 'Pro', description: 'For businesses with higher demands' },
] as const;

const ADDONS = [
  { id: 'analytics', title: 'Analytics', description: 'Advanced analytics and reporting' },
  { id: 'backup', title: 'Backup', description: 'Automated daily backups' },
  { id: 'support', title: 'Priority Support', description: '24/7 premium customer support' },
] as const;

const MAX_ADDONS = 3;

/** The radio group only offers the plans above — anything else is a tampered value. */
function knownPlan(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  return !value || PLANS.some(plan => plan.id === value) ? null : { unknownPlan: true };
}

/** A `FormArray` of booleans carries the count rules of the whole group. */
function addonRange(control: AbstractControl): ValidationErrors | null {
  const selected = (control.value as boolean[]).filter(Boolean).length;

  if (selected < 1) {
    return { addonsMin: true };
  }

  return selected > MAX_ADDONS ? { addonsMax: true } : null;
}

@Component({
  selector: 'z-forms-reactive-complex',
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardImports,
    ZardCheckboxComponent,
    ZardFieldImports,
    ZardRadioGroupImports,
    ZardSelectImports,
    ZardSwitchComponent,
  ],
  template: `
    <z-card class="w-full max-w-sm">
      <z-card-header class="border-b">
        <z-card-title>You're almost there!</z-card-title>
        <z-card-description>Choose your subscription plan and billing period.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-complex" [formGroup]="subscriptionForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let plan = subscriptionForm.controls.plan;
            @let planInvalid = plan.invalid && plan.touched;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Subscription Plan</legend>
              <p z-field-description>Choose your subscription plan.</p>

              <z-radio-group class="gap-3" formControlName="plan">
                @for (item of plans; track item.id) {
                  <label z-field-label [for]="'forms-reactive-complex-plan-' + item.id">
                    <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                      <div z-field-content>
                        <span z-field-title>{{ item.title }}</span>
                        <p z-field-description>{{ item.description }}</p>
                      </div>
                      <z-radio
                        [zId]="'forms-reactive-complex-plan-' + item.id"
                        [value]="item.id"
                        [zInvalid]="planInvalid"
                      />
                    </div>
                  </label>
                }
              </z-radio-group>
              @if (planInvalid) {
                <z-field-error>
                  @if (plan.hasError('required')) {
                    Please select a subscription plan
                  } @else if (plan.hasError('unknownPlan')) {
                    Invalid plan selection. Please choose Basic or Pro
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            @let billingPeriod = subscriptionForm.controls.billingPeriod;
            @let billingPeriodInvalid = billingPeriod.invalid && billingPeriod.touched;
            <div z-field [attr.data-invalid]="billingPeriodInvalid || null">
              <label z-field-label for="forms-reactive-complex-billing-period">Billing Period</label>
              <z-select
                formControlName="billingPeriod"
                id="forms-reactive-complex-billing-period"
                zPlaceholder="Select"
                [zInvalid]="billingPeriodInvalid"
              >
                <z-select-item zValue="monthly">Monthly</z-select-item>
                <z-select-item zValue="yearly">Yearly</z-select-item>
              </z-select>
              <p z-field-description>Choose how often you want to be billed.</p>
              @if (billingPeriodInvalid) {
                <z-field-error>Please select a billing period</z-field-error>
              }
            </div>

            <z-field-separator />

            @let addons = subscriptionForm.controls.addons;
            @let addonsInvalid = addons.invalid && addons.touched;
            <fieldset z-field-set>
              <legend z-field-legend>Add-ons</legend>
              <p z-field-description>Select additional features you'd like to include.</p>

              <div z-field-group data-slot="checkbox-group" formArrayName="addons">
                @for (addon of allAddons; track addon.id; let index = $index) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="addonsInvalid || null">
                    <span
                      z-checkbox
                      [formControlName]="index"
                      [zId]="'forms-reactive-complex-addon-' + addon.id"
                      [zInvalid]="addonsInvalid"
                    ></span>
                    <div z-field-content>
                      <label z-field-label [for]="'forms-reactive-complex-addon-' + addon.id" class="font-normal">
                        {{ addon.title }}
                      </label>
                      <p z-field-description>{{ addon.description }}</p>
                    </div>
                  </div>
                }
              </div>
              @if (addonsInvalid) {
                <z-field-error>
                  @if (addons.hasError('addonsMin')) {
                    Please select at least one add-on
                  } @else if (addons.hasError('addonsMax')) {
                    You can select up to {{ maxAddons }} add-ons
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <div z-field-content>
                <label z-field-label for="forms-reactive-complex-email-notifications">Email Notifications</label>
                <p z-field-description>Receive email updates about your subscription</p>
              </div>
              <z-switch formControlName="emailNotifications" zId="forms-reactive-complex-email-notifications" />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field>
          <button z-button type="submit" form="forms-reactive-complex">Save Preferences</button>
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveComplexComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;
  protected readonly allAddons = ADDONS;
  protected readonly maxAddons = MAX_ADDONS;

  protected readonly subscriptionForm = new FormGroup({
    plan: new FormControl('basic', { nonNullable: true, validators: [Validators.required, knownPlan] }),
    billingPeriod: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    addons: new FormArray(
      ADDONS.map(() => new FormControl(false, { nonNullable: true })),
      addonRange,
    ),
    emailNotifications: new FormControl(false, { nonNullable: true }),
  });

  protected onReset(): void {
    this.subscriptionForm.reset({ plan: 'basic' });
  }

  protected onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      this.subscriptionForm.markAllAsTouched();
      return;
    }

    const { addons, ...rest } = this.subscriptionForm.getRawValue();
    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(
        { ...rest, addons: ADDONS.filter((_, index) => addons[index]).map(addon => addon.id) },
        null,
        2,
      ),
    });
  }
}
```

## Resetting the Form

reset() restores the values and clears the pristine/touched state, so the errors disappear until the user interacts again.

```
// Back to the initial value of every `nonNullable` control, and back to
// pristine/untouched — so errors disappear until the user interacts again.
protected onReset(): void {
  this.bugForm.reset();
}

// Pass a partial value to reset to something other than the defaults.
protected onResetToDefaults(): void {
  this.subscriptionForm.reset({ plan: 'basic' });
}
```

## Array Fields

FormArray manages a list of controls you can grow and shrink at runtime — one group per row keeps each item independently validated.

Email Addresses

Add up to 5 email addresses where we can contact you.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const MAX_EMAILS = 5;
const INITIAL_EMAILS = 2;

type EmailGroup = FormGroup<{ address: FormControl<string> }>;

function createEmailGroup(): EmailGroup {
  return new FormGroup({
    address: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });
}

@Component({
  selector: 'z-forms-reactive-array',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
  ],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header class="border-b">
        <z-card-title>Contact Emails</z-card-title>
        <z-card-description>Manage your contact email addresses.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-array" [formGroup]="contactForm" (ngSubmit)="onSubmit()">
          <fieldset z-field-set class="gap-4">
            <legend z-field-legend zVariant="label">Email Addresses</legend>
            <p z-field-description>Add up to {{ maxEmails }} email addresses where we can contact you.</p>

            <div z-field-group class="gap-4" formArrayName="emails">
              @for (group of emails.controls; track group; let index = $index) {
                @let address = group.controls.address;
                @let addressInvalid = address.invalid && address.touched;
                <div
                  z-field
                  zOrientation="horizontal"
                  [formGroupName]="index"
                  [attr.data-invalid]="addressInvalid || null"
                >
                  <div z-field-content>
                    <z-input-group>
                      <input
                        z-input
                        type="email"
                        formControlName="address"
                        autocomplete="email"
                        placeholder="name@example.com"
                        [id]="'forms-reactive-array-email-' + index"
                        [attr.aria-invalid]="addressInvalid || null"
                      />
                      @if (emails.length > 1) {
                        <z-input-group-addon zAlign="inline-end">
                          <button
                            type="button"
                            z-input-group-button
                            zSize="icon-xs"
                            [attr.aria-label]="'Remove email ' + (index + 1)"
                            (click)="removeEmail(index)"
                          >
                            <ng-icon name="lucideX" />
                          </button>
                        </z-input-group-addon>
                      }
                    </z-input-group>
                    @if (addressInvalid) {
                      <z-field-error>Enter a valid email address.</z-field-error>
                    }
                  </div>
                </div>
              }
            </div>

            @if (emails.hasError('minlength') || emails.hasError('maxlength')) {
              <z-field-error>
                @if (emails.hasError('minlength')) {
                  Add at least one email address.
                } @else {
                  You can add up to {{ maxEmails }} email addresses.
                }
              </z-field-error>
            }

            <button
              z-button
              type="button"
              zType="outline"
              zSize="sm"
              class="w-full"
              [zDisabled]="emails.length >= maxEmails"
              (click)="addEmail()"
            >
              Add Email Address
            </button>
          </fieldset>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-array">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveArrayComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly maxEmails = MAX_EMAILS;

  protected readonly contactForm = new FormGroup({
    emails: new FormArray<EmailGroup>(Array.from({ length: INITIAL_EMAILS }, createEmailGroup), [
      Validators.minLength(1),
      Validators.maxLength(MAX_EMAILS),
    ]),
  });

  protected get emails(): FormArray<EmailGroup> {
    return this.contactForm.controls.emails;
  }

  protected addEmail(): void {
    if (this.emails.length >= MAX_EMAILS) return;
    this.emails.push(createEmailGroup());
  }

  protected removeEmail(index: number): void {
    if (this.emails.length <= 1) return;
    this.emails.removeAt(index);
  }

  protected onReset(): void {
    this.emails.clear();
    for (let index = 0; index < INITIAL_EMAILS; index++) {
      this.emails.push(createEmailGroup());
    }
    this.contactForm.reset();
  }

  protected onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.contactForm.getRawValue(), null, 2),
    });
  }
}
```

### Setting up the FormArray

contact-form.ts

```
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

type EmailGroup = FormGroup<{ address: FormControl<string> }>;

function createEmailGroup(): EmailGroup {
  return new FormGroup({
    address: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  });
}

protected readonly contactForm = new FormGroup({
  emails: new FormArray<EmailGroup>(
    Array.from({ length: 2 }, createEmailGroup),
    [Validators.minLength(1), Validators.maxLength(5)],
  ),
});

protected get emails(): FormArray<EmailGroup> {
  return this.contactForm.controls.emails;
}
```

### Array field structure

Wrap the items in a `z-field-set` with a legend and a description. Inside a `formArrayName` block, each row is addressed by its index through the `[formGroupName]` directive.

```
<fieldset z-field-set class="gap-4">
  <legend z-field-legend zVariant="label">Email Addresses</legend>
  <p z-field-description>Add up to 5 email addresses where we can contact you.</p>

  <div z-field-group class="gap-4" formArrayName="emails">
    @for (group of emails.controls; track group; let index = $index) {
      @let address = group.controls.address;
      <div z-field zOrientation="horizontal" [formGroupName]="index">
        <input z-input type="email" formControlName="address" />
      </div>
    }
  </div>
</fieldset>
```

### Adding and removing items

```
protected addEmail(): void {
  if (this.emails.length >= 5) return;
  this.emails.push(createEmailGroup());
}

protected removeEmail(index: number): void {
  if (this.emails.length <= 1) return;
  this.emails.removeAt(index);
}
```

When the collection is keyed rather than ordered — a translation map, a set of feature flags — `FormRecord` is the counterpart of `FormArray` : a group whose keys are added and removed at runtime, with every control sharing one type.
