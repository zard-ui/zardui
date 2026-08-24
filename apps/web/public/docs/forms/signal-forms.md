---
title: Signal Forms
description: Build forms in Angular using Signal Forms and zard/ui.
---

# Signal Forms

Build forms in Angular using Signal Forms and zard/ui.

In this guide we will build forms with Signal Forms, the signal-based forms API introduced in Angular 21. We'll cover building a form with the `field` component, defining a validation schema, error handling, accessibility and more.

## Demo

We are going to build the following form. It has a text input and a textarea. On submit we validate the form data and display any errors.

Bug Title

Description

0/100 characters

Include steps to reproduce, expected behavior, and what actually happened.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-signal-demo',
  imports: [
    FormField,
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
        <form novalidate id="forms-signal-demo" (submit)="onSubmit($event)">
          <div z-field-group>
            @let title = bugForm.title();
            @let titleInvalid = title.invalid() && title.touched();
            <div z-field [attr.data-invalid]="titleInvalid || null">
              <label z-field-label for="forms-signal-demo-title">Bug Title</label>
              <input
                z-input
                id="forms-signal-demo-title"
                autocomplete="off"
                placeholder="Login button not working on mobile"
                [formField]="bugForm.title"
                [attr.aria-invalid]="titleInvalid || null"
              />
              @if (titleInvalid) {
                <z-field-error [zErrors]="title.errors()" />
              }
            </div>

            @let description = bugForm.description();
            @let descriptionInvalid = description.invalid() && description.touched();
            <div z-field [attr.data-invalid]="descriptionInvalid || null">
              <label z-field-label for="forms-signal-demo-description">Description</label>
              <z-input-group>
                <textarea
                  z-textarea
                  rows="6"
                  id="forms-signal-demo-description"
                  class="min-h-24 resize-none"
                  placeholder="I'm having an issue with the login button on mobile."
                  [formField]="bugForm.description"
                  [attr.aria-invalid]="descriptionInvalid || null"
                ></textarea>
                <z-input-group-addon zAlign="block-end">
                  <span z-input-group-text class="tabular-nums">{{ description.value().length }}/100 characters</span>
                </z-input-group-addon>
              </z-input-group>
              <p z-field-description>Include steps to reproduce, expected behavior, and what actually happened.</p>
              @if (descriptionInvalid) {
                <z-field-error [zErrors]="description.errors()" />
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-demo">Submit</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalDemoComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ title: '', description: '' });

  protected readonly bugForm = form(this.model, schemaPath => {
    required(schemaPath.title, { message: 'Bug title must be at least 5 characters.' });
    minLength(schemaPath.title, 5, { message: 'Bug title must be at least 5 characters.' });
    maxLength(schemaPath.title, 32, { message: 'Bug title must be at most 32 characters.' });

    required(schemaPath.description, { message: 'Description must be at least 20 characters.' });
    minLength(schemaPath.description, 20, { message: 'Description must be at least 20 characters.' });
    maxLength(schemaPath.description, 100, { message: 'Description must be at most 100 characters.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.bugForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    // `reset(value)` writes the value back into the model and clears touched/dirty in one call.
    this.bugForm().reset({ title: '', description: '' });
  }
}
```

## Approach

A signal form is a plain **writable signal holding your data** plus a **schema of rules** bound to it. The form never owns a second copy of the state — reading and writing the model signal is reading and writing the form.

- `form()` turns a model signal into a tree of fields.
- The `[formField]` directive binds one field of that tree to a UI control.
- `z-field` components give you complete control over the markup and the accessibility wiring.
- Every piece of state — `value() / errors() / touched() / invalid()` — is a signal, so templates stay fine-grained and there is nothing to unsubscribe from.

## Anatomy

Here is a single field: the field tree provides the state, the directive binds the control, and the field components render it.

```
@let title = bugForm.title();
@let titleInvalid = title.invalid() && title.touched();
<div z-field [attr.data-invalid]="titleInvalid || null">
  <label z-field-label for="bug-title">Bug Title</label>
  <input
    z-input
    id="bug-title"
    placeholder="Login button not working on mobile"
    [formField]="bugForm.title"
    [attr.aria-invalid]="titleInvalid || null"
  />
  <p z-field-description>Provide a concise title for your bug report.</p>
  @if (titleInvalid) {
    <z-field-error [zErrors]="title.errors()" />
  }
</div>
```

## Form

### Create a form schema

Start from the shape of your data. The second argument of `form()` is a schema function: it receives a path object mirroring the model and binds rules to it.

bug-report-form.ts

```
import { Component, signal } from '@angular/core';
import { form, maxLength, minLength, required } from '@angular/forms/signals';

@Component({
  /* ... */
})
export class BugReportForm {
  private readonly model = signal({ title: '', description: '' });

  protected readonly bugForm = form(this.model, schemaPath => {
    required(schemaPath.title, { message: 'Bug title must be at least 5 characters.' });
    minLength(schemaPath.title, 5, { message: 'Bug title must be at least 5 characters.' });
    maxLength(schemaPath.title, 32, { message: 'Bug title must be at most 32 characters.' });

    required(schemaPath.description, { message: 'Description must be at least 20 characters.' });
    minLength(schemaPath.description, 20, { message: 'Description must be at least 20 characters.' });
    maxLength(schemaPath.description, 100, { message: 'Description must be at most 100 characters.' });
  });
}
```

### Set up the form

Import `FormField` so the template can bind controls, and use `submit()` to run your action only when the form is valid.

bug-report-form.ts

```
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

@Component({
  selector: 'bug-report-form',
  imports: [FormField, ZardFieldImports, ZardInputComponent],
  templateUrl: './bug-report-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BugReportForm {
  private readonly model = signal({ title: '', description: '' });

  protected readonly bugForm = form(this.model, schemaPath => {
    required(schemaPath.title, { message: 'Bug title must be at least 5 characters.' });
    minLength(schemaPath.title, 5, { message: 'Bug title must be at least 5 characters.' });
    maxLength(schemaPath.title, 32, { message: 'Bug title must be at most 32 characters.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // `submit()` marks every field as touched, runs validation and only calls the
    // action when the form is valid — so the errors of a form nobody focused become
    // visible on the first submit. Errors returned by the action are applied back
    // onto the matching fields.
    await submit(this.bugForm, async submitted => {
      console.log(submitted().value());
    });
  }
}
```

### Build the form

Compose the markup with the field components. The full source of the demo above is the reference implementation — expand the code block in the Demo section to read it end to end.

### Server errors and submitting state

The action passed to `submit()` can return validation errors, and each one lands on the field it names — the server has the same reach over the error UI as a client-side validator, with no state of your own to keep.

signup-form.ts

```
protected async onSubmit(event: Event): Promise<void> {
  event.preventDefault();

  await submit(this.signupForm, async submitted => {
    const result = await this.api.signup(submitted().value());

    // Returning errors lands them on the field named by `fieldTree`, exactly like a
    // client-side validator. Return `undefined` when the request succeeded.
    if (result.usernameTaken) {
      return [{ fieldTree: this.signupForm.username, kind: 'server', message: 'Username already taken.' }];
    }

    return undefined;
  });
}
```

While the action is running the form reports `submitting()` , so `[zDisabled]="signupForm().submitting()"` is all a submit button needs. Concurrent submissions are rejected by `submit()` itself: a second call while one is in flight returns immediately without running the action.

### Done

That's it. You now have a fully accessible form with client-side validation. When the form is submitted, `submit()` calls your action with the validated data; if the data is invalid the action never runs and each field renders its own errors.

## Validation

### Built-in validators

Validators are functions you call inside the schema against a path. Each accepts a `message` used as the human-readable error.

account-form.ts

```
import { email, form, max, maxLength, min, minLength, pattern, required } from '@angular/forms/signals';

protected readonly accountForm = form(this.model, schemaPath => {
  // Presence
  required(schemaPath.username, { message: 'Username is required.' });

  // Strings, arrays, sets and maps
  minLength(schemaPath.username, 3, { message: 'Too short.' });
  maxLength(schemaPath.username, 10, { message: 'Too long.' });

  // Numbers and dates
  min(schemaPath.seats, 1, { message: 'At least one seat.' });
  max(schemaPath.seats, 50, { message: 'At most 50 seats.' });

  // Formats
  email(schemaPath.email, { message: 'Enter a valid email address.' });
  pattern(schemaPath.slug, /^[a-z0-9-]+$/, { message: 'Lowercase letters, numbers and dashes only.' });
});
```

### Custom and cross-field validation

Use `validate()` for a single field and `validateTree()` when a rule spans several fields.

signup-form.ts

```
import { form, validate, validateTree } from '@angular/forms/signals';

protected readonly signupForm = form(this.model, schemaPath => {
  // Single field: return an error object, or `undefined` when the value is valid.
  validate(schemaPath.terms, ({ value }) =>
    value() ? undefined : { kind: 'termsRequired', message: 'You must accept the terms of service.' },
  );

  // Cross-field: `validateTree` reads the whole value and can target a sibling
  // field through `fieldTreeOf()`, so the error lands on the right control.
  validateTree(schemaPath, ({ value, fieldTreeOf }) => {
    const { password, confirmPassword } = value();
    if (!confirmPassword || password === confirmPassword) return undefined;

    return {
      kind: 'passwordMismatch',
      message: 'Passwords do not match.',
      fieldTree: fieldTreeOf(schemaPath.confirmPassword),
    };
  });
});
```

### Async validation

`validateAsync()` wires a resource into the field. While the request is in flight the field is `pending()` — neither valid nor invalid — so use it to disable the submit button without showing a false error.

signup-form.ts

```
import { httpResource } from '@angular/common/http';
import { form, required, validateAsync } from '@angular/forms/signals';

protected readonly signupForm = form(this.model, schemaPath => {
  required(schemaPath.username);

  // Async validators only run once every synchronous validator passes.
  // While the request is in flight the field is `pending()`, not `invalid()`.
  validateAsync(schemaPath.username, {
    params: ({ value }) => value(),
    // Forms reports the params as `undefined` when the validator should not run —
    // return `undefined` from the request too, so no request is sent.
    factory: username =>
      httpResource<{ taken: boolean }>(() => (username() ? `/api/usernames/${username()}` : undefined)),
    onSuccess: result => (result.taken ? { kind: 'usernameTaken', message: 'Username already taken.' } : undefined),
    onError: () => ({ kind: 'usernameCheckFailed', message: 'Could not verify the username.' }),
  });
});
```

When the resource is a plain HTTP call, `validateHttp()` is the same thing with the `httpResource` wiring already done — you give it the request and the mapping, nothing else.

### Schema validation libraries

If the rules already live in a Zod, Valibot or ArkType schema, there is no need to restate them. `validateStandardSchema()` accepts any [Standard Schema](https://github.com/standard-schema/standard-schema) validator and routes each issue to the field it belongs to.

signup-form.ts

```
import { form, validateStandardSchema } from '@angular/forms/signals';
import * as z from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.email('Enter a valid email address.'),
});

protected readonly signupForm = form(this.model, schemaPath => {
  // Any Standard Schema validator works here — Zod, Valibot, ArkType — and its
  // issues land on the matching fields as regular validation errors.
  validateStandardSchema(schemaPath, signupSchema);
});
```

### When errors appear

Validators run on every value change, so a field is invalid from the first keystroke. To avoid shouting at someone who has not filled the form yet, gate the error UI on `touched()` — the pattern used across this page.

A field becomes touched when the user blurs it, and `submit()` marks the whole tree as touched before it validates. That is what makes the errors of a form nobody focused appear on the first submit, with no extra work on your side.

## Schema Logic

The schema holds more than validators: it is also where a field decides whether it is editable, and where rules get reused across forms.

### Disabled, readonly and hidden fields

`disabled()` , `readonly()` and `hidden()` take a reactive function and live in the schema next to the validators. All three stop the field from contributing to the validity of its parent, so a rule attached to a hidden field does not block the submit while the field is out of the way.

checkout-form.ts

```
import { disabled, form, hidden, readonly, required } from '@angular/forms/signals';

protected readonly checkoutForm = form(this.model, schemaPath => {
  // A string is both the flag and the reason, readable back from the field.
  disabled(schemaPath.coupon, ({ valueOf }) =>
    valueOf(schemaPath.plan) === 'free' ? 'Coupons are not available on the free plan' : false,
  );

  // Disabled, hidden and readonly fields stop contributing to the validation and to
  // the touched/dirty state of their parent — so this rule only applies while the
  // field is actually visible.
  hidden(schemaPath.companyName, ({ valueOf }) => valueOf(schemaPath.accountType) !== 'business');
  required(schemaPath.companyName, { message: 'Company name is required.' });

  readonly(schemaPath.email, ({ valueOf }) => valueOf(schemaPath.emailVerified));
});
```

A hidden field still exists in the model — guard it with `@if (!field().hidden())` in the template so the markup disappears with it.

### Reusable schemas

`schema()` packages the rules of one shape under a name. `apply()` binds it to a path and `applyWhen()` does it conditionally — the same composition `applyEach()` gives you for array items.

checkout-form.ts

```
import { apply, applyWhen, form, minLength, required, schema } from '@angular/forms/signals';

// `schema()` names a bundle of rules for one shape, so it can be reused as is.
const addressSchema = schema<Address>(address => {
  required(address.street, { message: 'Street is required.' });
  required(address.city, { message: 'City is required.' });
  minLength(address.zipCode, 5, { message: 'Enter a valid ZIP code.' });
});

protected readonly checkoutForm = form(this.model, schemaPath => {
  apply(schemaPath.billing, addressSchema);

  // Same rules, but only while the shipping address is not a copy of the billing one.
  applyWhen(schemaPath.shipping, ({ valueOf }) => !valueOf(schemaPath.sameAsBilling), addressSchema);
});
```

### Debouncing updates

Signal Forms has no `updateOn` — `debounce()` takes its place, and it is about the model rather than the validators: the UI keeps up while the field holds the update back, so validation and anything derived from the value settle with it.

```
import { debounce, form } from '@angular/forms/signals';

protected readonly searchForm = form(this.model, schemaPath => {
  // Milliseconds: the model waits for the typing to settle.
  debounce(schemaPath.query, 300);

  // Or hold every update until the field is blurred.
  debounce(schemaPath.coupon, 'blur');
});
```

## Displaying Errors

Display errors next to the field with z-field-error. For styling and accessibility:

- Add `data-invalid` to the `z-field` element.
- Add `aria-invalid` to the control itself — the input, textarea, select, checkbox, and so on.
- Pass `errors()` straight to `z-field-error` ; it renders one message, or a list when there is more than one.

```
@let emailField = signupForm.email();
@let emailInvalid = emailField.invalid() && emailField.touched();
<div z-field [attr.data-invalid]="emailInvalid || null">
  <label z-field-label for="signup-email">Email</label>
  <input
    z-input
    type="email"
    id="signup-email"
    [formField]="signupForm.email"
    [attr.aria-invalid]="emailInvalid || null"
  />
  @if (emailInvalid) {
    <z-field-error [zErrors]="emailField.errors()" />
  }
</div>
```

## Working with Different Field Types

Every zard/ui form control implements a value accessor, so [formField] binds to all of them the same way.

### input

For text inputs, bind

[formField]

to the field and mirror its invalid state with

aria-invalid

Username

This is your public display name. Must be between 3 and 10 characters. Must only contain letters, numbers, and underscores.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, pattern, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

@Component({
  selector: 'z-forms-signal-input',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Profile Settings</z-card-title>
        <z-card-description>Update your profile information below.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-input" (submit)="onSubmit($event)">
          <div z-field-group>
            @let username = profileForm.username();
            @let usernameInvalid = username.invalid() && username.touched();
            <div z-field [attr.data-invalid]="usernameInvalid || null">
              <label z-field-label for="forms-signal-input-username">Username</label>
              <input
                z-input
                id="forms-signal-input-username"
                autocomplete="username"
                placeholder="shadcn"
                [formField]="profileForm.username"
                [attr.aria-invalid]="usernameInvalid || null"
              />
              <p z-field-description>
                This is your public display name. Must be between 3 and 10 characters. Must only contain letters,
                numbers, and underscores.
              </p>
              @if (usernameInvalid) {
                <z-field-error [zErrors]="username.errors()" />
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-input">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalInputComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ username: '' });

  protected readonly profileForm = form(this.model, schemaPath => {
    required(schemaPath.username, { message: 'Username must be at least 3 characters.' });
    minLength(schemaPath.username, 3, { message: 'Username must be at least 3 characters.' });
    maxLength(schemaPath.username, 10, { message: 'Username must be at most 10 characters.' });
    pattern(schemaPath.username, USERNAME_PATTERN, {
      message: 'Username can only contain letters, numbers, and underscores.',
    });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.profileForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.profileForm().reset({ username: '' });
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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-signal-textarea',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardTextareaComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Personalization</z-card-title>
        <z-card-description>Customize your experience by telling us more about yourself.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-textarea" (submit)="onSubmit($event)">
          <div z-field-group>
            @let about = profileForm.about();
            @let aboutInvalid = about.invalid() && about.touched();
            <div z-field [attr.data-invalid]="aboutInvalid || null">
              <label z-field-label for="forms-signal-textarea-about">More about you</label>
              <textarea
                z-textarea
                id="forms-signal-textarea-about"
                class="min-h-[120px]"
                placeholder="I'm a software engineer..."
                [formField]="profileForm.about"
                [attr.aria-invalid]="aboutInvalid || null"
              ></textarea>
              <p z-field-description>
                Tell us more about yourself. This will be used to help us personalize your experience.
              </p>
              @if (aboutInvalid) {
                <z-field-error [zErrors]="about.errors()" />
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-textarea">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalTextareaComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ about: '' });

  protected readonly profileForm = form(this.model, schemaPath => {
    required(schemaPath.about, { message: 'Please provide at least 10 characters.' });
    minLength(schemaPath.about, 10, { message: 'Please provide at least 10 characters.' });
    maxLength(schemaPath.about, 200, { message: 'Please keep it under 200 characters.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.profileForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.profileForm().reset({ about: '' });
  }
}
```

### select

z-select

is a value accessor too. Use

zOrientation="responsive"

with

z-field-content

to put the label and the control side by side on wider screens. "Auto" is listed but rejected by a

validate()

rule — a value rule, not a presence one.

Spoken Language

For best results, select the language you speak.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';

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

@Component({
  selector: 'z-forms-signal-select',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSelectImports],
  template: `
    <z-card class="w-full sm:max-w-lg">
      <z-card-header>
        <z-card-title>Language Preferences</z-card-title>
        <z-card-description>Select your preferred spoken language.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-select" (submit)="onSubmit($event)">
          <div z-field-group>
            @let language = preferencesForm.language();
            @let languageInvalid = language.invalid() && language.touched();
            <div z-field zOrientation="responsive" [attr.data-invalid]="languageInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-signal-select-language">Spoken Language</label>
                <p z-field-description>For best results, select the language you speak.</p>
                @if (languageInvalid) {
                  <z-field-error [zErrors]="language.errors()" />
                }
              </div>
              <z-select
                id="forms-signal-select-language"
                class="min-w-[120px]"
                zPlaceholder="Select"
                [formField]="preferencesForm.language"
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
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-select">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalSelectComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly languages = LANGUAGES;

  private readonly model = signal({ language: '' });

  protected readonly preferencesForm = form(this.model, schemaPath => {
    required(schemaPath.language, { message: 'Please select your spoken language.' });

    // `auto` is offered in the list, but it is not an acceptable answer.
    validate(schemaPath.language, ({ value }) =>
      value() === 'auto'
        ? { kind: 'autoNotAllowed', message: 'Auto-detection is not allowed. Please select a specific language.' }
        : undefined,
    );
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.preferencesForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.preferencesForm().reset({ language: '' });
  }
}
```

### checkbox

A checkbox group edits an array field. Bind each box to

value().includes(id)

and update the field on change. The first group is a single boolean field turned read-only with

disabled()

in the schema. Remember

data-slot="checkbox-group"

on the

z-field-group

for the tighter spacing.

Responses

Get notified for requests that take time, like research or image generation.

Push notifications

Tasks

Get notified when tasks you've created have updates.

Push notifications

Email notifications

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField, minLength, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const TASKS = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
] as const;

const INITIAL_VALUE = { responses: true, tasks: [] as string[] };

@Component({
  selector: 'z-forms-signal-checkbox',
  imports: [FormField, FormsModule, ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Notifications</z-card-title>
        <z-card-description>Manage your notification preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-checkbox" (submit)="onSubmit($event)">
          <div z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Responses</legend>
              <p z-field-description>Get notified for requests that take time, like research or image generation.</p>

              <div z-field-group data-slot="checkbox-group">
                <div z-field zOrientation="horizontal">
                  <span
                    z-checkbox
                    zId="forms-signal-checkbox-responses"
                    [formField]="notificationsForm.responses"
                  ></span>
                  <label z-field-label for="forms-signal-checkbox-responses" class="font-normal">
                    Push notifications
                  </label>
                </div>
              </div>
            </fieldset>

            <z-field-separator />

            @let tasks = notificationsForm.tasks();
            @let tasksInvalid = tasks.invalid() && tasks.touched();
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Tasks</legend>
              <p z-field-description>Get notified when tasks you've created have updates.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (task of allTasks; track task.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="tasksInvalid || null">
                    <span
                      z-checkbox
                      [zId]="'forms-signal-checkbox-' + task.id"
                      [zInvalid]="tasksInvalid"
                      [ngModel]="tasks.value().includes(task.id)"
                      [ngModelOptions]="{ standalone: true }"
                      (ngModelChange)="toggleTask(task.id, $event)"
                    ></span>
                    <label z-field-label [for]="'forms-signal-checkbox-' + task.id" class="font-normal">
                      {{ task.label }}
                    </label>
                  </div>
                }
              </div>
              @if (tasksInvalid) {
                <z-field-error [zErrors]="tasks.errors()" />
              }
            </fieldset>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-checkbox">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalCheckboxComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly allTasks = TASKS;

  private readonly model = signal({ ...INITIAL_VALUE });

  protected readonly notificationsForm = form(this.model, schemaPath => {
    disabled(schemaPath.responses);
    minLength(schemaPath.tasks, 1, { message: 'Please select at least one notification type.' });
  });

  protected toggleTask(id: string, checked: boolean): void {
    const field = this.notificationsForm.tasks();
    field.value.update(tasks => (checked ? [...tasks, id] : tasks.filter(task => task !== id)));
    field.markAsTouched();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.notificationsForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.notificationsForm().reset({ ...INITIAL_VALUE });
  }
}
```

### radio group

Bind

[formField]

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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';

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
  selector: 'z-forms-signal-radio',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardRadioGroupImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Subscription Plan</z-card-title>
        <z-card-description>See pricing and features for each plan.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-radio" (submit)="onSubmit($event)">
          @let plan = subscriptionForm.plan();
          @let planInvalid = plan.invalid() && plan.touched();
          <fieldset z-field-set>
            <legend z-field-legend>Plan</legend>
            <p z-field-description>You can upgrade or downgrade your plan at any time.</p>

            <z-radio-group class="gap-3" [formField]="subscriptionForm.plan">
              @for (item of plans; track item.id) {
                <label z-field-label [for]="'forms-signal-radio-' + item.id">
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                    <div z-field-content>
                      <span z-field-title>{{ item.title }}</span>
                      <p z-field-description>{{ item.description }}</p>
                    </div>
                    <z-radio [zId]="'forms-signal-radio-' + item.id" [value]="item.id" [zInvalid]="planInvalid" />
                  </div>
                </label>
              }
            </z-radio-group>
            @if (planInvalid) {
              <z-field-error [zErrors]="plan.errors()" />
            }
          </fieldset>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-radio">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalRadioComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;

  private readonly model = signal({ plan: '' });

  protected readonly subscriptionForm = form(this.model, schemaPath => {
    required(schemaPath.plan, { message: 'You must select a subscription plan to continue.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.subscriptionForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.subscriptionForm().reset({ plan: '' });
  }
}
```

### switch

Switches bind to a boolean field. Use a horizontal field with

z-field-content

so the label and description sit next to the control.

Multi-factor authentication

Enable multi-factor authentication to secure your account.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, submit, validate } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-forms-signal-switch',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Security Settings</z-card-title>
        <z-card-description>Manage your account security preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-switch" (submit)="onSubmit($event)">
          <div z-field-group>
            @let twoFactor = securityForm.twoFactor();
            @let twoFactorInvalid = twoFactor.invalid() && twoFactor.touched();
            <div z-field zOrientation="horizontal" [attr.data-invalid]="twoFactorInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-signal-switch-two-factor">Multi-factor authentication</label>
                <p z-field-description>Enable multi-factor authentication to secure your account.</p>
                @if (twoFactorInvalid) {
                  <z-field-error [zErrors]="twoFactor.errors()" />
                }
              </div>
              <z-switch
                zId="forms-signal-switch-two-factor"
                [formField]="securityForm.twoFactor"
                [zInvalid]="twoFactorInvalid"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-switch">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalSwitchComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ twoFactor: false });

  protected readonly securityForm = form(this.model, schemaPath => {
    validate(schemaPath.twoFactor, ({ value }) =>
      value()
        ? undefined
        : { kind: 'twoFactorRequired', message: 'It is highly recommended to enable two-factor authentication.' },
    );
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.securityForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.securityForm().reset({ twoFactor: false });
  }
}
```

### complex forms

Everything above, composed into one form with fieldsets, separators, a

validate()

rule that rejects unknown plan values and length rules on the add-ons array.

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
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { form, FormField, maxLength, minLength, required, submit, validate } from '@angular/forms/signals';

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

const INITIAL_VALUE = {
  plan: 'basic',
  billingPeriod: '',
  addons: [] as string[],
  emailNotifications: false,
};

@Component({
  selector: 'z-forms-signal-complex',
  imports: [
    FormField,
    FormsModule,
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
        <form novalidate id="forms-signal-complex" (submit)="onSubmit($event)">
          <div z-field-group>
            @let plan = subscriptionForm.plan();
            @let planInvalid = plan.invalid() && plan.touched();
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Subscription Plan</legend>
              <p z-field-description>Choose your subscription plan.</p>

              <z-radio-group class="gap-3" [formField]="subscriptionForm.plan">
                @for (item of plans; track item.id) {
                  <label z-field-label [for]="'forms-signal-complex-plan-' + item.id">
                    <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                      <div z-field-content>
                        <span z-field-title>{{ item.title }}</span>
                        <p z-field-description>{{ item.description }}</p>
                      </div>
                      <z-radio
                        [zId]="'forms-signal-complex-plan-' + item.id"
                        [value]="item.id"
                        [zInvalid]="planInvalid"
                      />
                    </div>
                  </label>
                }
              </z-radio-group>
              @if (planInvalid) {
                <z-field-error [zErrors]="plan.errors()" />
              }
            </fieldset>

            <z-field-separator />

            @let billingPeriod = subscriptionForm.billingPeriod();
            @let billingPeriodInvalid = billingPeriod.invalid() && billingPeriod.touched();
            <div z-field [attr.data-invalid]="billingPeriodInvalid || null">
              <label z-field-label for="forms-signal-complex-billing-period">Billing Period</label>
              <z-select
                id="forms-signal-complex-billing-period"
                zPlaceholder="Select"
                [formField]="subscriptionForm.billingPeriod"
                [zInvalid]="billingPeriodInvalid"
              >
                <z-select-item zValue="monthly">Monthly</z-select-item>
                <z-select-item zValue="yearly">Yearly</z-select-item>
              </z-select>
              <p z-field-description>Choose how often you want to be billed.</p>
              @if (billingPeriodInvalid) {
                <z-field-error [zErrors]="billingPeriod.errors()" />
              }
            </div>

            <z-field-separator />

            @let addons = subscriptionForm.addons();
            @let addonsInvalid = addons.invalid() && addons.touched();
            <fieldset z-field-set>
              <legend z-field-legend>Add-ons</legend>
              <p z-field-description>Select additional features you'd like to include.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (addon of allAddons; track addon.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="addonsInvalid || null">
                    <span
                      z-checkbox
                      [zId]="'forms-signal-complex-addon-' + addon.id"
                      [zInvalid]="addonsInvalid"
                      [ngModel]="addons.value().includes(addon.id)"
                      [ngModelOptions]="{ standalone: true }"
                      (ngModelChange)="toggleAddon(addon.id, $event)"
                    ></span>
                    <div z-field-content>
                      <label z-field-label [for]="'forms-signal-complex-addon-' + addon.id" class="font-normal">
                        {{ addon.title }}
                      </label>
                      <p z-field-description>{{ addon.description }}</p>
                    </div>
                  </div>
                }
              </div>
              @if (addonsInvalid) {
                <z-field-error [zErrors]="addons.errors()" />
              }
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <div z-field-content>
                <label z-field-label for="forms-signal-complex-email-notifications">Email Notifications</label>
                <p z-field-description>Receive email updates about your subscription</p>
              </div>
              <z-switch
                zId="forms-signal-complex-email-notifications"
                [formField]="subscriptionForm.emailNotifications"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field>
          <button z-button type="submit" form="forms-signal-complex">Save Preferences</button>
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalComplexComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;
  protected readonly allAddons = ADDONS;

  private readonly model = signal({ ...INITIAL_VALUE });

  protected readonly subscriptionForm = form(this.model, schemaPath => {
    required(schemaPath.plan, { message: 'Please select a subscription plan' });

    // The radio group only offers the plans above — anything else is a tampered value.
    validate(schemaPath.plan, ({ value }) =>
      !value() || PLANS.some(plan => plan.id === value())
        ? undefined
        : { kind: 'unknownPlan', message: 'Invalid plan selection. Please choose Basic or Pro' },
    );

    required(schemaPath.billingPeriod, { message: 'Please select a billing period' });

    minLength(schemaPath.addons, 1, { message: 'Please select at least one add-on' });
    maxLength(schemaPath.addons, MAX_ADDONS, { message: `You can select up to ${MAX_ADDONS} add-ons` });
  });

  protected toggleAddon(id: string, checked: boolean): void {
    const field = this.subscriptionForm.addons();
    field.value.update(addons => (checked ? [...addons, id] : addons.filter(addon => addon !== id)));
    field.markAsTouched();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.subscriptionForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.subscriptionForm().reset({ ...INITIAL_VALUE });
  }
}
```

## Resetting the Form

reset() clears the touched and dirty state of the whole tree. Pass a value to put the data back where it started at the same time.

```
private readonly model = signal({ title: '', description: '' });

protected readonly bugForm = form(this.model, /* ... */);

// With a value: writes it back into the model *and* clears touched/dirty.
protected onReset(): void {
  this.bugForm().reset({ title: '', description: '' });
}

// Without a value: only clears touched/dirty, so the data stays as the user left it
// and the errors disappear until they interact again.
protected onClearErrors(): void {
  this.bugForm().reset();
}
```

## Array Fields

Array fields need no special API: the array lives in your model, and applyEach binds the same rules to every item.

Email Addresses

Add up to 5 email addresses where we can contact you.

```
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { applyEach, email, form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

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

function createEmails(): { address: string }[] {
  return Array.from({ length: INITIAL_EMAILS }, () => ({ address: '' }));
}

@Component({
  selector: 'z-forms-signal-array',
  imports: [
    FormField,
    NgIcon,
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
        <form novalidate id="forms-signal-array" (submit)="onSubmit($event)">
          <fieldset z-field-set class="gap-4">
            <legend z-field-legend zVariant="label">Email Addresses</legend>
            <p z-field-description>Add up to {{ maxEmails }} email addresses where we can contact you.</p>

            <div z-field-group class="gap-4">
              @for (emailField of contactForm.emails; track $index) {
                @let address = emailField.address();
                @let addressInvalid = address.invalid() && address.touched();
                <div z-field zOrientation="horizontal" [attr.data-invalid]="addressInvalid || null">
                  <div z-field-content>
                    <z-input-group>
                      <input
                        z-input
                        type="email"
                        autocomplete="email"
                        placeholder="name@example.com"
                        [id]="'forms-signal-array-email-' + $index"
                        [formField]="emailField.address"
                        [attr.aria-invalid]="addressInvalid || null"
                      />
                      @if (contactForm.emails.length > 1) {
                        <z-input-group-addon zAlign="inline-end">
                          <button
                            type="button"
                            z-input-group-button
                            zSize="icon-xs"
                            [attr.aria-label]="'Remove email ' + ($index + 1)"
                            (click)="removeEmail($index)"
                          >
                            <ng-icon name="lucideX" />
                          </button>
                        </z-input-group-addon>
                      }
                    </z-input-group>
                    @if (addressInvalid) {
                      <z-field-error [zErrors]="address.errors()" />
                    }
                  </div>
                </div>
              }
            </div>

            @let emailsErrors = contactForm.emails().errors();
            @if (emailsErrors.length > 0) {
              <z-field-error [zErrors]="emailsErrors" />
            }

            <button
              z-button
              type="button"
              zType="outline"
              zSize="sm"
              class="w-full"
              [zDisabled]="contactForm.emails.length >= maxEmails"
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
          <button z-button type="submit" form="forms-signal-array">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalArrayComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly maxEmails = MAX_EMAILS;

  private readonly model = signal<{ emails: { address: string }[] }>({ emails: createEmails() });

  protected readonly contactForm = form(this.model, schemaPath => {
    minLength(schemaPath.emails, 1, { message: 'Add at least one email address.' });
    maxLength(schemaPath.emails, MAX_EMAILS, { message: `You can add up to ${MAX_EMAILS} email addresses.` });

    applyEach(schemaPath.emails, entry => {
      required(entry.address, { message: 'Enter a valid email address.' });
      email(entry.address, { message: 'Enter a valid email address.' });
    });
  });

  protected addEmail(): void {
    this.model.update(model => ({ ...model, emails: [...model.emails, { address: '' }] }));
  }

  protected removeEmail(index: number): void {
    this.model.update(model => ({ ...model, emails: model.emails.filter((_, i) => i !== index) }));
  }

  protected onReset(): void {
    // `reset(value)` writes the value back into the model and clears touched/dirty in one call.
    this.contactForm().reset({ emails: createEmails() });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.contactForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }
}
```

### Validating every item with applyEach

contact-form.ts

```
import { applyEach, email, form, maxLength, minLength, required } from '@angular/forms/signals';

private readonly model = signal<{ emails: { address: string }[] }>({
  emails: [{ address: '' }, { address: '' }],
});

protected readonly contactForm = form(this.model, schemaPath => {
  minLength(schemaPath.emails, 1, { message: 'Add at least one email address.' });
  maxLength(schemaPath.emails, 5, { message: 'You can add up to 5 email addresses.' });

  // `applyEach` binds the same rules to every item of the array.
  applyEach(schemaPath.emails, entry => {
    required(entry.address, { message: 'Enter a valid email address.' });
    email(entry.address, { message: 'Enter a valid email address.' });
  });
});
```

### Array field structure

Wrap the items in a `z-field-set` with a legend and a description. The array field is iterable, so you can loop over it directly.

```
<fieldset z-field-set class="gap-4">
  <legend z-field-legend zVariant="label">Email Addresses</legend>
  <p z-field-description>Add up to 5 email addresses where we can contact you.</p>

  <div z-field-group class="gap-4">
    @for (emailField of contactForm.emails; track $index) {
      @let address = emailField.address();
      <div z-field zOrientation="horizontal">
        <input z-input type="email" [formField]="emailField.address" />
      </div>
    }
  </div>
</fieldset>
```

### Adding and removing items

```
// The array lives in the model signal — add and remove by updating the model.
// The field tree reconciles itself, keeping validation state per item.
protected addEmail(): void {
  this.model.update(model => ({ ...model, emails: [...model.emails, { address: '' }] }));
}

protected removeEmail(index: number): void {
  this.model.update(model => ({ ...model, emails: model.emails.filter((_, i) => i !== index) }));
}
```
