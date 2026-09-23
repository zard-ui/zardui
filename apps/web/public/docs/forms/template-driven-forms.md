---
title: Template-driven Forms
description: Build forms in Angular using Template-driven Forms and zard/ui.
---

# Template-driven Forms

Build forms in Angular using Template-driven Forms and zard/ui.

In this guide we will build forms with Template-driven Forms — the simplest of the three approaches. The template is the source of truth: `ngModel` creates the controls and validation attributes declare the rules. We'll cover building a form with the `field` component, validation, error handling, accessibility and more.

## Demo

We are going to build the following form. It has a text input and a textarea. On submit we validate the form data and display any errors.

Bug Title

Description

0/100 characters

Include steps to reproduce, expected behavior, and what actually happened.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

interface BugReport {
  title: string;
  description: string;
}

@Component({
  selector: 'z-forms-template-demo',
  imports: [
    FormsModule,
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
        <form novalidate id="forms-template-demo" #bugForm="ngForm" (ngSubmit)="onSubmit(bugForm)">
          <div z-field-group>
            @let titleInvalid = title.invalid && title.touched;
            <div z-field [attr.data-invalid]="titleInvalid || null">
              <label z-field-label for="forms-template-demo-title">Bug Title</label>
              <input
                z-input
                required
                minlength="5"
                maxlength="32"
                name="title"
                #title="ngModel"
                id="forms-template-demo-title"
                autocomplete="off"
                placeholder="Login button not working on mobile"
                [(ngModel)]="model.title"
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

            @let descriptionInvalid = description.invalid && description.touched;
            <div z-field [attr.data-invalid]="descriptionInvalid || null">
              <label z-field-label for="forms-template-demo-description">Description</label>
              <z-input-group>
                <textarea
                  z-textarea
                  required
                  rows="6"
                  minlength="20"
                  maxlength="100"
                  name="description"
                  #description="ngModel"
                  id="forms-template-demo-description"
                  class="min-h-24 resize-none"
                  placeholder="I'm having an issue with the login button on mobile."
                  [(ngModel)]="model.description"
                  [attr.aria-invalid]="descriptionInvalid || null"
                ></textarea>
                <z-input-group-addon zAlign="block-end">
                  <span z-input-group-text class="tabular-nums">{{ model.description.length }}/100 characters</span>
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
          <button z-button zType="outline" type="button" (click)="onReset(bugForm)">Reset</button>
          <button z-button type="submit" form="forms-template-demo">Submit</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateDemoComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model: BugReport = { title: '', description: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ title: '', description: '' });
  }
}
```

## Approach

There is no form model in the component: you bind a plain object with `[(ngModel)]` and Angular assembles an `NgForm` behind the scenes from every named control it finds. Less setup, less control.

- `name` is what registers a control on the parent form — without it, nothing is tracked.
- `#ctrl="ngModel"` exposes the control's state to the template so you can render errors.
- Validation rules are HTML attributes such as `required / minlength / email` on the control itself.
- `z-field` components give you complete control over the markup and the accessibility wiring.

i

#### When to reach for something else

The model is never typed by the form, and any rule the attributes cannot express costs you a custom directive. For dynamic forms, complex validation or anything you want to unit test in isolation, prefer [Reactive Forms](/docs/forms/reactive-forms) or [Signal Forms](/docs/forms/signal-forms) instead

## Anatomy

Here is a single field: ngModel creates the control, the template reference exposes its state, and the field components render it.

```
@let titleInvalid = title.invalid && title.touched;
<div z-field [attr.data-invalid]="titleInvalid || null">
  <label z-field-label for="bug-title">Bug Title</label>
  <input
    z-input
    required
    minlength="5"
    name="title"
    #title="ngModel"
    id="bug-title"
    placeholder="Login button not working on mobile"
    [(ngModel)]="model.title"
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

### Define the model

The shape of the form is the shape of the object you bind to it.

bug-report-form.ts

```
// There is no schema object here: the shape of the form is the shape of the
// model, and the rules live in the template as validation attributes.
interface BugReport {
  title: string;
  description: string;
}

protected model: BugReport = { title: '', description: '' };
```

### Set up the component

Import `FormsModule` and take the `NgForm` from the template on submit.

bug-report-form.ts

```
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';

@Component({
  selector: 'bug-report-form',
  imports: [FormsModule, ZardFieldImports, ZardInputComponent],
  templateUrl: './bug-report-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BugReportForm {
  protected model = { title: '', description: '' };

  // `NgForm` comes from the template via `#bugForm="ngForm"`.
  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    console.log(this.model);
  }
}
```

### Bind it in the template

```
<form id="bug-report" #bugForm="ngForm" (ngSubmit)="onSubmit(bugForm)">
  <div z-field-group>
    <div z-field>
      <label z-field-label for="bug-title">Bug Title</label>
      <!-- `name` is what registers the control on the parent `NgForm`. -->
      <input z-input required id="bug-title" name="title" [(ngModel)]="model.title" />
    </div>
  </div>
</form>
```

### Grouping fields with ngModelGroup

Control names are flat by default, so a nested model and the form drift apart. `ngModelGroup` nests them back: the group name becomes a key in `form.value` , and the group exposes the aggregated `valid / touched / dirty` of everything inside it — which is what lets you validate a whole section at once.

```
<form novalidate #checkoutForm="ngForm" (ngSubmit)="onSubmit(checkoutForm)">
  <!-- The group name becomes a key in `checkoutForm.value`, so the flat list of
       controls gains the same shape as your model. -->
  <fieldset z-field-set ngModelGroup="address" #address="ngModelGroup">
    <legend z-field-legend zVariant="label">Address</legend>

    <input z-input required name="street" [(ngModel)]="model.address.street" />
    <input z-input required name="city" [(ngModel)]="model.address.city" />
  </fieldset>

  <!-- The group carries the aggregated state of every control inside it. -->
  @if (address.invalid && address.touched) {
    <z-field-error>Complete the address before continuing.</z-field-error>
  }
</form>
```

### Done

That's it. You now have a fully accessible form with client-side validation. The values are already in your model object — there is nothing extra to read out of the form.

## Validation

### Validation attributes

Angular maps the standard HTML validation attributes onto its own validators. Custom controls pick them up through the same `name` + `ngModel` pairing.

```
<!-- Presence -->
<input z-input required name="username" [(ngModel)]="model.username" />

<!-- Length -->
<input z-input minlength="3" maxlength="10" name="username" [(ngModel)]="model.username" />

<!-- Formats -->
<input z-input email type="email" name="email" [(ngModel)]="model.email" />
<input z-input pattern="^[a-z0-9-]+$" name="slug" [(ngModel)]="model.slug" />

<!-- Numbers -->
<input z-input type="number" min="1" max="50" name="seats" [(ngModel)]="model.seats" />

<!-- Custom controls work the same way: they register through `name` + `ngModel` -->
<z-select required name="country" [(ngModel)]="model.country">
  <z-select-item zValue="br">Brazil</z-select-item>
</z-select>
```

### Cross-field rules

The attributes cannot express everything — a minimum number of selected options, a value the control offers but the form must reject, or a rule that spans two fields. The quick way out is a getter next to the model, checked on submit alongside `form.invalid` . It costs nothing, but the rule stays invisible to the form: the control never turns invalid on its own.

subscription-form.ts

```
// Template-driven forms have no declarative place for count, value or
// cross-field rules. Keep them as getters next to the model and check them
// on submit, together with `form.invalid`.
protected get selectedAddons(): string[] {
  return ADDONS.filter(addon => this.model[addon.id]).map(addon => addon.id);
}

protected onSubmit(form: NgForm): void {
  const selected = this.selectedAddons;

  if (form.invalid || selected.length < 1 || selected.length > 3) {
    form.control.markAllAsTouched();
    return;
  }

  console.log(this.model);
}
```

### Custom validator directives

A getter checked on submit is fine for one form. When the rule travels, wrap it in a directive that registers itself in `NG_VALIDATORS` : it becomes an attribute like `required` , and the error lands on the control itself, so `form.invalid` finally accounts for it.

forbidden-names.directive.ts

```
@Directive({
  selector: '[zForbiddenNames]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => ForbiddenNamesDirective), multi: true }],
})
export class ForbiddenNamesDirective implements Validator {
  readonly zForbiddenNames = input<readonly string[]>([]);

  private onValidatorChange: () => void = () => {};

  constructor() {
    // Without this the control keeps the verdict it reached with the previous input
    // value — Angular only revalidates when the validator says it changed.
    effect(() => {
      this.zForbiddenNames();
      this.onValidatorChange();
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').toLowerCase();
    return this.zForbiddenNames().includes(value) ? { forbiddenName: true } : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }
}

// <input z-input name="username" [zForbiddenNames]="['admin', 'root']" [(ngModel)]="model.username" />
```

The `registerOnValidatorChange` wiring is what makes a validator with inputs revalidate when those inputs change — leave it out and the control keeps the verdict it reached with the old value.

### Async validators

Same idea against `NG_ASYNC_VALIDATORS` , returning a `Promise` or an `Observable` . Pair it with `[ngModelOptions]="{ updateOn: 'blur' }"` so you are not firing a request per keystroke.

username-available.directive.ts

```
@Directive({
  selector: '[zUsernameAvailable]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UsernameAvailableDirective), multi: true },
  ],
})
export class UsernameAvailableDirective implements AsyncValidator {
  private readonly api = inject(SignupApi);

  // Async validators only run once the synchronous ones pass. While the request is
  // in flight the control is `PENDING` — neither valid nor invalid.
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.api.isUsernameTaken(control.value).pipe(map(taken => (taken ? { usernameTaken: true } : null)));
  }
}
```

### Validation modes

`updateOn` decides when the value and the validators are recomputed. Set it per control through `[ngModelOptions]` or once for the whole form through `[ngFormOptions]` on the form element.

| Mode | Description |
| --- | --- |
| `'change'` | Validates on every change. The default. |
| `'blur'` | Validates when the control loses focus. |
| `'submit'` | Validates only when the form is submitted. |

```
<!-- Per control -->
<input z-input name="title" [(ngModel)]="model.title" [ngModelOptions]="{ updateOn: 'blur' }" />

<!-- Or for the whole form — every control inherits it unless it sets its own. -->
<form #bugForm="ngForm" [ngFormOptions]="{ updateOn: 'submit' }" (ngSubmit)="onSubmit(bugForm)">
  <!-- ... -->
</form>
```

## Control State

Two attributes decide how much of the form a control takes part in.

```
<!-- A disabled control keeps its value in your model, but drops out of `form.value`
     and stops being validated. -->
<input z-input name="coupon" [disabled]="model.plan === 'free'" [(ngModel)]="model.coupon" />

<!-- `standalone` keeps the control out of the parent form entirely: no `name` needed,
     no effect on `form.valid`, and its value never lands in `form.value`. Use it for
     controls that filter or search rather than submit. -->
<input z-input [ngModel]="query" [ngModelOptions]="{ standalone: true }" (ngModelChange)="onSearch($event)" />
```

Both leave the value in your model — they only change what the `NgForm` sees. That is worth remembering on submit: read the model, not `form.value` , when a disabled control still matters to you.

## Displaying Errors

Display errors next to the field with z-field-error. For styling and accessibility:

- Add `data-invalid` to the `z-field` element.
- Add `aria-invalid` to the control itself — the input, textarea, select, checkbox, and so on.
- Expose the control with `#ctrl="ngModel"` then gate the error UI on `invalid && touched` and branch on `hasError()` to pick the message.

```
@let emailInvalid = emailControl.invalid && emailControl.touched;
<div z-field [attr.data-invalid]="emailInvalid || null">
  <label z-field-label for="signup-email">Email</label>
  <input
    z-input
    required
    email
    type="email"
    name="email"
    #emailControl="ngModel"
    id="signup-email"
    [(ngModel)]="model.email"
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

Every zard/ui form control implements a value accessor, so name + [(ngModel)] binds to all of them the same way.

### input

For text inputs, add the validation attributes and expose the control with

#ctrl="ngModel"

Username

This is your public display name. Must be between 3 and 10 characters. Must only contain letters, numbers, and underscores.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

@Component({
  selector: 'z-forms-template-input',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Profile Settings</z-card-title>
        <z-card-description>Update your profile information below.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-input" #profileForm="ngForm" (ngSubmit)="onSubmit(profileForm)">
          <div z-field-group>
            @let usernameInvalid = username.invalid && username.touched;
            <div z-field [attr.data-invalid]="usernameInvalid || null">
              <label z-field-label for="forms-template-input-username">Username</label>
              <input
                z-input
                required
                minlength="3"
                maxlength="10"
                pattern="[a-zA-Z0-9_]+"
                name="username"
                #username="ngModel"
                id="forms-template-input-username"
                autocomplete="username"
                placeholder="shadcn"
                [(ngModel)]="model.username"
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
          <button z-button zType="outline" type="button" (click)="onReset(profileForm)">Reset</button>
          <button z-button type="submit" form="forms-template-input">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateInputComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model = { username: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ username: '' });
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
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-template-textarea',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardTextareaComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Personalization</z-card-title>
        <z-card-description>Customize your experience by telling us more about yourself.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-textarea" #profileForm="ngForm" (ngSubmit)="onSubmit(profileForm)">
          <div z-field-group>
            @let aboutInvalid = about.invalid && about.touched;
            <div z-field [attr.data-invalid]="aboutInvalid || null">
              <label z-field-label for="forms-template-textarea-about">More about you</label>
              <textarea
                z-textarea
                required
                minlength="10"
                maxlength="200"
                name="about"
                #about="ngModel"
                id="forms-template-textarea-about"
                class="min-h-[120px]"
                placeholder="I'm a software engineer..."
                [(ngModel)]="model.about"
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
          <button z-button zType="outline" type="button" (click)="onReset(profileForm)">Reset</button>
          <button z-button type="submit" form="forms-template-textarea">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateTextareaComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model = { about: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ about: '' });
  }
}
```

### select

z-select

is a value accessor too, so

required

and

[(ngModel)]

behave exactly as on a native control. "Auto" is listed but rejected on submit — a value rule with no attribute equivalent, so it lives in the component.

Spoken Language

For best results, select the language you speak.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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
  selector: 'z-forms-template-select',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSelectImports],
  template: `
    <z-card class="w-full sm:max-w-lg">
      <z-card-header>
        <z-card-title>Language Preferences</z-card-title>
        <z-card-description>Select your preferred spoken language.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-select" #preferencesForm="ngForm" (ngSubmit)="onSubmit(preferencesForm)">
          <div z-field-group>
            @let languageInvalid = (language.invalid || autoSelected) && language.touched;
            <div z-field zOrientation="responsive" [attr.data-invalid]="languageInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-template-select-language">Spoken Language</label>
                <p z-field-description>For best results, select the language you speak.</p>
                @if (languageInvalid) {
                  <z-field-error>
                    @if (autoSelected) {
                      Auto-detection is not allowed. Please select a specific language.
                    } @else {
                      Please select your spoken language.
                    }
                  </z-field-error>
                }
              </div>
              <z-select
                required
                name="language"
                #language="ngModel"
                id="forms-template-select-language"
                class="min-w-[120px]"
                zPlaceholder="Select"
                [(ngModel)]="model.language"
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
          <button z-button zType="outline" type="button" (click)="onReset(preferencesForm)">Reset</button>
          <button z-button type="submit" form="forms-template-select">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateSelectComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly languages = LANGUAGES;

  protected model = { language: '' };

  /** Value rules have no declarative home in template-driven forms — they live here. */
  protected get autoSelected(): boolean {
    return this.model.language === 'auto';
  }

  protected onSubmit(form: NgForm): void {
    if (form.invalid || this.autoSelected) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ language: '' });
  }
}
```

### checkbox

A checkbox group is one boolean per option in the model. The 'pick at least one' rule has no attribute equivalent, so it lives in the component. The first group is a single control kept checked and locked with the

disabled

attribute.

Responses

Get notified for requests that take time, like research or image generation.

Push notifications

Tasks

Get notified when tasks you've created have updates.

Push notifications

Email notifications

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const TASKS = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
] as const;

/** Keys match the control names, so `resetForm()` can restore the whole form at once. */
const INITIAL_VALUE: Record<string, boolean> = { responses: true, push: false, email: false };

@Component({
  selector: 'z-forms-template-checkbox',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Notifications</z-card-title>
        <z-card-description>Manage your notification preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form
          novalidate
          id="forms-template-checkbox"
          #notificationsForm="ngForm"
          (ngSubmit)="onSubmit(notificationsForm)"
        >
          <div z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Responses</legend>
              <p z-field-description>Get notified for requests that take time, like research or image generation.</p>

              <div z-field-group data-slot="checkbox-group">
                <div z-field zOrientation="horizontal">
                  <span
                    z-checkbox
                    disabled
                    name="responses"
                    zId="forms-template-checkbox-responses"
                    [(ngModel)]="model['responses']"
                  ></span>
                  <label z-field-label for="forms-template-checkbox-responses" class="font-normal">
                    Push notifications
                  </label>
                </div>
              </div>
            </fieldset>

            <z-field-separator />

            @let tasksInvalid = submitted && selectedTasks.length === 0;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Tasks</legend>
              <p z-field-description>Get notified when tasks you've created have updates.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (task of allTasks; track task.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="tasksInvalid || null">
                    <span
                      z-checkbox
                      [name]="task.id"
                      [zId]="'forms-template-checkbox-' + task.id"
                      [zInvalid]="tasksInvalid"
                      [(ngModel)]="model[task.id]"
                    ></span>
                    <label z-field-label [for]="'forms-template-checkbox-' + task.id" class="font-normal">
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
          <button z-button zType="outline" type="button" (click)="onReset(notificationsForm)">Reset</button>
          <button z-button type="submit" form="forms-template-checkbox">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateCheckboxComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly allTasks = TASKS;
  protected submitted = false;

  protected model: Record<string, boolean> = { ...INITIAL_VALUE };

  /** Template-driven forms have no group validator, so the rule lives in the component. */
  protected get selectedTasks(): string[] {
    return TASKS.filter(task => this.model[task.id]).map(task => task.id);
  }

  protected onSubmit(form: NgForm): void {
    this.submitted = true;

    if (form.invalid || this.selectedTasks.length === 0) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify({ responses: this.model['responses'], tasks: this.selectedTasks }, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    this.submitted = false;
    form.resetForm({ ...INITIAL_VALUE });
  }
}
```

### radio group

Bind

[(ngModel)]

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
import { FormsModule, NgForm } from '@angular/forms';

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
  selector: 'z-forms-template-radio',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardRadioGroupImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Subscription Plan</z-card-title>
        <z-card-description>See pricing and features for each plan.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-radio" #subscriptionForm="ngForm" (ngSubmit)="onSubmit(subscriptionForm)">
          @let planInvalid = plan.invalid && plan.touched;
          <fieldset z-field-set>
            <legend z-field-legend>Plan</legend>
            <p z-field-description>You can upgrade or downgrade your plan at any time.</p>

            <z-radio-group required class="gap-3" name="plan" #plan="ngModel" [(ngModel)]="model.plan">
              @for (item of plans; track item.id) {
                <label z-field-label [for]="'forms-template-radio-' + item.id">
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                    <div z-field-content>
                      <span z-field-title>{{ item.title }}</span>
                      <p z-field-description>{{ item.description }}</p>
                    </div>
                    <z-radio [zId]="'forms-template-radio-' + item.id" [value]="item.id" [zInvalid]="planInvalid" />
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
          <button z-button zType="outline" type="button" (click)="onReset(subscriptionForm)">Reset</button>
          <button z-button type="submit" form="forms-template-radio">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateRadioComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;

  protected model = { plan: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ plan: '' });
  }
}
```

### switch

Switches bind to a boolean. Watch out:

required

only rejects

null

and

undefined

, never

false

, and there is no

requiredTrue

attribute — so the "must be enabled" rule lives in the component.

Multi-factor authentication

Enable multi-factor authentication to secure your account.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardSwitchComponent } from '@zard/components/switch/switch.component';

@Component({
  selector: 'z-forms-template-switch',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Security Settings</z-card-title>
        <z-card-description>Manage your account security preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-switch" #securityForm="ngForm" (ngSubmit)="onSubmit(securityForm)">
          <div z-field-group>
            @let twoFactorInvalid = mustBeEnabled;
            <div z-field zOrientation="horizontal" [attr.data-invalid]="twoFactorInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-template-switch-two-factor">Multi-factor authentication</label>
                <p z-field-description>Enable multi-factor authentication to secure your account.</p>
                @if (twoFactorInvalid) {
                  <z-field-error>It is highly recommended to enable two-factor authentication.</z-field-error>
                }
              </div>
              <z-switch
                name="twoFactor"
                zId="forms-template-switch-two-factor"
                [(ngModel)]="model.twoFactor"
                [zInvalid]="twoFactorInvalid"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset(securityForm)">Reset</button>
          <button z-button type="submit" form="forms-template-switch">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateSwitchComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model = { twoFactor: false };
  protected submitted = false;

  /**
   * `required` on a boolean control only rejects `null`/`undefined`, never `false` —
   * there is no `requiredTrue` attribute in template-driven forms, so the rule lives here.
   */
  protected get mustBeEnabled(): boolean {
    return this.submitted && !this.model.twoFactor;
  }

  protected onSubmit(form: NgForm): void {
    this.submitted = true;

    if (form.invalid || this.mustBeEnabled) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    this.submitted = false;
    form.resetForm({ twoFactor: false });
  }
}
```

### complex forms

Everything above, composed into one form with fieldsets, separators and the count and value rules handled in the component, since attributes cannot express them.

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
import { FormsModule, NgForm } from '@angular/forms';

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

/** Keys match the control names, so `resetForm()` can restore the whole form at once. */
const INITIAL_VALUE: Record<string, string | boolean> = {
  plan: 'basic',
  billingPeriod: '',
  analytics: false,
  backup: false,
  support: false,
  emailNotifications: false,
};

@Component({
  selector: 'z-forms-template-complex',
  imports: [
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
        <form novalidate id="forms-template-complex" #subscriptionForm="ngForm" (ngSubmit)="onSubmit(subscriptionForm)">
          <div z-field-group>
            @let planInvalid = (plan.invalid || unknownPlan) && plan.touched;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Subscription Plan</legend>
              <p z-field-description>Choose your subscription plan.</p>

              <z-radio-group required class="gap-3" name="plan" #plan="ngModel" [(ngModel)]="model['plan']">
                @for (item of plans; track item.id) {
                  <label z-field-label [for]="'forms-template-complex-plan-' + item.id">
                    <div z-field zOrientation="horizontal" [attr.data-invalid]="planInvalid || null">
                      <div z-field-content>
                        <span z-field-title>{{ item.title }}</span>
                        <p z-field-description>{{ item.description }}</p>
                      </div>
                      <z-radio
                        [zId]="'forms-template-complex-plan-' + item.id"
                        [value]="item.id"
                        [zInvalid]="planInvalid"
                      />
                    </div>
                  </label>
                }
              </z-radio-group>
              @if (planInvalid) {
                <z-field-error>
                  @if (unknownPlan) {
                    Invalid plan selection. Please choose Basic or Pro
                  } @else {
                    Please select a subscription plan
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            @let billingPeriodInvalid = billingPeriod.invalid && billingPeriod.touched;
            <div z-field [attr.data-invalid]="billingPeriodInvalid || null">
              <label z-field-label for="forms-template-complex-billing-period">Billing Period</label>
              <z-select
                required
                name="billingPeriod"
                #billingPeriod="ngModel"
                id="forms-template-complex-billing-period"
                zPlaceholder="Select"
                [(ngModel)]="model['billingPeriod']"
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

            @let selected = selectedAddons.length;
            @let addonsInvalid = submitted && (selected < 1 || selected > maxAddons);
            <fieldset z-field-set>
              <legend z-field-legend>Add-ons</legend>
              <p z-field-description>Select additional features you'd like to include.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (addon of allAddons; track addon.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="addonsInvalid || null">
                    <span
                      z-checkbox
                      [name]="addon.id"
                      [zId]="'forms-template-complex-addon-' + addon.id"
                      [zInvalid]="addonsInvalid"
                      [(ngModel)]="model[addon.id]"
                    ></span>
                    <div z-field-content>
                      <label z-field-label [for]="'forms-template-complex-addon-' + addon.id" class="font-normal">
                        {{ addon.title }}
                      </label>
                      <p z-field-description>{{ addon.description }}</p>
                    </div>
                  </div>
                }
              </div>
              @if (addonsInvalid) {
                <z-field-error>
                  @if (selected < 1) {
                    Please select at least one add-on
                  } @else {
                    You can select up to {{ maxAddons }} add-ons
                  }
                </z-field-error>
              }
            </fieldset>

            <z-field-separator />

            <div z-field zOrientation="horizontal">
              <div z-field-content>
                <label z-field-label for="forms-template-complex-email-notifications">Email Notifications</label>
                <p z-field-description>Receive email updates about your subscription</p>
              </div>
              <z-switch
                name="emailNotifications"
                zId="forms-template-complex-email-notifications"
                [(ngModel)]="model['emailNotifications']"
              />
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer class="border-t">
        <div z-field>
          <button z-button type="submit" form="forms-template-complex">Save Preferences</button>
          <button z-button zType="outline" type="button" (click)="onReset(subscriptionForm)">Reset</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateComplexComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly plans = PLANS;
  protected readonly allAddons = ADDONS;
  protected readonly maxAddons = MAX_ADDONS;

  protected model: Record<string, string | boolean> = { ...INITIAL_VALUE };
  protected submitted = false;

  /** Count and value rules have no declarative home in template-driven forms — they live here. */
  protected get selectedAddons(): string[] {
    return ADDONS.filter(addon => this.model[addon.id]).map(addon => addon.id);
  }

  protected get unknownPlan(): boolean {
    const plan = this.model['plan'] as string;
    return !!plan && !PLANS.some(item => item.id === plan);
  }

  protected onSubmit(form: NgForm): void {
    this.submitted = true;
    const selected = this.selectedAddons;

    if (form.invalid || this.unknownPlan || selected.length < 1 || selected.length > MAX_ADDONS) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(
        {
          plan: this.model['plan'],
          billingPeriod: this.model['billingPeriod'],
          addons: selected,
          emailNotifications: this.model['emailNotifications'],
        },
        null,
        2,
      ),
    });
  }

  protected onReset(form: NgForm): void {
    this.submitted = false;
    form.resetForm({ ...INITIAL_VALUE });
  }
}
```

## Resetting the Form

resetForm() clears the values and the pristine/touched state. Pass the initial value so the defaults come back.

```
// `resetForm()` clears the values *and* the pristine/touched state.
// Pass the initial value so `nonNullable`-like defaults come back.
protected onReset(form: NgForm): void {
  this.model = { title: '', description: '' };
  form.resetForm(this.model);
}
```

## Array Fields

There is no FormArray here: loop over a plain array and give every row a unique control name.

Email Addresses

Add up to 5 email addresses where we can contact you.

```
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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
  selector: 'z-forms-template-array',
  imports: [
    FormsModule,
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
        <form novalidate id="forms-template-array" #contactForm="ngForm" (ngSubmit)="onSubmit(contactForm)">
          <fieldset z-field-set class="gap-4">
            <legend z-field-legend zVariant="label">Email Addresses</legend>
            <p z-field-description>Add up to {{ maxEmails }} email addresses where we can contact you.</p>

            <div z-field-group class="gap-4">
              @for (entry of emails; track entry; let index = $index) {
                @let control = contactForm.controls['email-' + index];
                @let addressInvalid = !!control && control.invalid && control.touched;
                <div z-field zOrientation="horizontal" [attr.data-invalid]="addressInvalid || null">
                  <div z-field-content>
                    <z-input-group>
                      <input
                        z-input
                        required
                        email
                        type="email"
                        autocomplete="email"
                        placeholder="name@example.com"
                        [name]="'email-' + index"
                        [id]="'forms-template-array-email-' + index"
                        [(ngModel)]="entry.address"
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

            @if (emails.length < 1 || emails.length > maxEmails) {
              <z-field-error>
                @if (emails.length < 1) {
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
          <button z-button type="submit" form="forms-template-array">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateArrayComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly maxEmails = MAX_EMAILS;

  /** Each entry keeps a stable object identity so `track` survives insert/remove. */
  protected emails = createEmails();

  protected addEmail(): void {
    if (this.emails.length >= MAX_EMAILS) return;
    this.emails = [...this.emails, { address: '' }];
  }

  protected removeEmail(index: number): void {
    if (this.emails.length <= 1) return;
    this.emails = this.emails.filter((_, position) => position !== index);
  }

  /** Fresh entries mean fresh controls — the form starts clean without touching `NgForm`. */
  protected onReset(): void {
    this.emails = createEmails();
  }

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify({ emails: this.emails }, null, 2),
    });
  }
}
```

### Array field structure

The control name has to be unique per row, so derive it from the index. Read the control back from `form.controls` when you need its error state.

```
<div z-field-group class="gap-4">
  @for (entry of emails; track entry; let index = $index) {
    @let control = contactForm.controls['email-' + index];
    <div z-field zOrientation="horizontal">
      <input
        z-input
        required
        email
        type="email"
        [name]="'email-' + index"
        [(ngModel)]="entry.address"
      />
    </div>
  }
</div>
```

### Adding and removing items

Track by the item object, not by index — removing a row would otherwise shift every control name below it and Angular would reuse the wrong control state.

```
/** Each entry keeps a stable object identity so `track` survives insert/remove. */
protected emails: { address: string }[] = [{ address: '' }, { address: '' }];

protected addEmail(): void {
  if (this.emails.length >= 5) return;
  this.emails = [...this.emails, { address: '' }];
}

protected removeEmail(index: number): void {
  if (this.emails.length <= 1) return;
  this.emails = this.emails.filter((_, position) => position !== index);
}
```
