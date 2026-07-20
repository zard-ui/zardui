---
title: Form
description: Building forms with proper structure, validation, and accessibility using composable form components.
---

# Form

Building forms with proper structure, validation, and accessibility using composable form components.

## Installation

### CLI

```bash
npx zard-cli@latest add form
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  formControlVariants,
  formFieldVariants,
  formLabelVariants,
  formMessageVariants,
  type ZardFormMessageTypeVariants,
} from '@/shared/components/form/form.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-form-field, [z-form-field]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormField',
})
export class ZardFormFieldComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(formFieldVariants(), this.class()));
}

@Component({
  selector: 'z-form-control, [z-form-control]',
  imports: [],
  template: `
    <div class="relative">
      <ng-content />
    </div>
    @if (errorMessage() || helpText()) {
      <div class="mt-1.5 min-h-5">
        @if (errorMessage()) {
          <p class="text-sm text-red-500">{{ errorMessage() }}</p>
        } @else if (helpText()) {
          <p class="text-muted-foreground text-sm">{{ helpText() }}</p>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormControl',
})
export class ZardFormControlComponent {
  readonly class = input<ClassValue>('');
  readonly errorMessage = input<string>('');
  readonly helpText = input<string>('');

  protected readonly classes = computed(() => mergeClasses(formControlVariants(), this.class()));
}

@Component({
  selector: 'z-form-label, label[z-form-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormLabel',
})
export class ZardFormLabelComponent {
  readonly class = input<ClassValue>('');
  readonly zRequired = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(formLabelVariants({ zRequired: this.zRequired() }), this.class()),
  );
}

@Component({
  selector: 'z-form-message, [z-form-message]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zFormMessage',
})
export class ZardFormMessageComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<ZardFormMessageTypeVariants>('default');

  protected readonly classes = computed(() => mergeClasses(formMessageVariants({ zType: this.zType() }), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const formFieldVariants = cva('grid gap-2');

export const formLabelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      zRequired: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      },
    },
  },
);

export const formControlVariants = cva('');

export const formMessageVariants = cva('text-sm', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      error: 'text-red-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardFormMessageTypeVariants = NonNullable<VariantProps<typeof formMessageVariants>['zType']>;
```

```angular-ts
import {
  ZardFormControlComponent,
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent,
} from '@/shared/components/form/form.component';

export const ZardFormImports = [
  ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormControlComponent,
  ZardFormMessageComponent,
] as const;
```

```angular-ts
export * from '@/shared/components/form/form.component';
export * from '@/shared/components/form/form.imports';
export * from '@/shared/components/form/form.variants';
```

## Usage

```angular-ts
import { ZardFormImports } from '@/shared/components/form/form.imports';
```

```angular-html
<z-form-field>
  <z-form-label>Email</z-form-label>
  <z-form-control>
    <input z-input placeholder="email@example.com" />
  </z-form-control>
  <z-form-message>Enter your email address.</z-form-message>
</z-form-field>
```

## Examples

### Default

```angular-ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardIdDirective } from '@/shared/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputComponent } from '../../input/input.component';
import { ZardFormImports } from '../form.imports';

@Component({
  selector: 'zard-demo-form-default',
  imports: [FormsModule, ZardButtonComponent, ZardInputComponent, ZardFormImports, ZardIdDirective],
  template: `
    <form class="max-w-sm space-y-6">
      <z-form-field zardId="fullName" #f="zardId">
        <label z-form-label zRequired [for]="f.id()">Full Name</label>
        <z-form-control>
          <input
            z-input
            type="text"
            [id]="f.id()"
            placeholder="Enter your full name"
            [(ngModel)]="fullName"
            name="fullName"
          />
        </z-form-control>
        <z-form-message>This is your display name.</z-form-message>
      </z-form-field>

      <z-form-field zardId="email" #e="zardId">
        <label z-form-label zRequired [for]="e.id()">Email</label>
        <z-form-control>
          <input z-input type="email" [id]="e.id()" placeholder="Enter your email" [(ngModel)]="email" name="email" />
        </z-form-control>
        <z-form-message>We'll never share your email with anyone else.</z-form-message>
      </z-form-field>

      <z-form-field zardId="bio" #b="zardId">
        <label z-form-label [for]="b.id()">Bio</label>
        <z-form-control>
          <textarea
            z-input
            [id]="b.id()"
            placeholder="Tell us about yourself"
            rows="3"
            [(ngModel)]="bio"
            name="bio"
          ></textarea>
        </z-form-control>
        <z-form-message>Optional: Brief description about yourself.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormDefaultComponent {
  fullName = '';
  email = '';
  bio = '';
}
```

### Reactive

```angular-ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFormImports } from '@/shared/components/form/form.imports';
import { ZardInputComponent } from '@/shared/components/input';

@Component({
  selector: 'zard-demo-form-reactive',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardInputComponent, ZardFormImports],
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="max-w-sm space-y-6">
      <z-form-field>
        <label for="username" z-form-label zRequired>Username</label>
        <z-form-control>
          <input id="username" z-input type="text" placeholder="Choose a username" formControlName="username" />
        </z-form-control>
        <z-form-message zType="default">Username must be 3-20 characters long.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label for="email" z-form-label zRequired>Email</label>
        <z-form-control>
          <input id="email" z-input type="email" placeholder="Enter your email" formControlName="email" />
        </z-form-control>
        <z-form-message zType="default">We'll use this for account notifications.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label for="password" z-form-label zRequired>Password</label>
        <z-form-control>
          <input id="password" z-input type="password" placeholder="Create a password" formControlName="password" />
        </z-form-control>
        <z-form-message zType="default">Password must be at least 6 characters.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit" [zDisabled]="profileForm.invalid">Create Account</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormReactiveComponent {
  profileForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form submitted:', this.profileForm.value);
    }
  }
}
```

### Signal Form

```angular-ts
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { form, required, email, minLength, maxLength, submit, FormField } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFormImports } from '@/shared/components/form/form.imports';
import { ZardInputComponent } from '@/shared/components/input';

@Component({
  selector: 'zard-demo-form-signal',
  imports: [ZardButtonComponent, ZardInputComponent, ZardFormImports, FormField],
  template: `
    <form (submit)="onSubmit($event)" class="max-w-sm space-y-6">
      <z-form-field>
        <label for="username" z-form-label zRequired>Username</label>
        <z-form-control>
          <input id="username" z-input type="text" placeholder="Choose a username" [formField]="profileForm.username" />
        </z-form-control>
        <z-form-message zType="default">Username must be 3-20 characters long.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label for="email" z-form-label zRequired>Email</label>
        <z-form-control>
          <input id="email" z-input type="email" placeholder="Enter your email" [formField]="profileForm.email" />
        </z-form-control>
        <z-form-message zType="default">We'll use this for account notifications.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label for="password" z-form-label zRequired>Password</label>
        <z-form-control>
          <input
            id="password"
            z-input
            type="password"
            placeholder="Create a password"
            [formField]="profileForm.password"
          />
        </z-form-control>
        <z-form-message zType="default">Password must be at least 6 characters.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit" [zDisabled]="profileForm().invalid()">Create Account</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormSignalComponent {
  private readonly loginModel = signal({
    username: '',
    email: '',
    password: '',
  });

  protected readonly profileForm = form(this.loginModel, login => {
    required(login.username);
    minLength(login.username, 3);
    maxLength(login.username, 20);

    required(login.email);
    email(login.email);

    required(login.password);
    minLength(login.password, 6);
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.profileForm, async form => {
      console.log('Form submitted:', form().value());
    });
  }
}
```

### Validation

```angular-ts
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputComponent } from '../../input/input.component';
import { ZardFormImports } from '../form.imports';

@Component({
  selector: 'zard-demo-form-validation',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardInputComponent, ZardFormImports],
  template: `
    <form [formGroup]="validationForm" (ngSubmit)="onSubmit()" class="max-w-sm space-y-6">
      <z-form-field>
        <label for="name" z-form-label zRequired>Name</label>
        <z-form-control>
          <input
            z-input
            type="text"
            placeholder="Your full name"
            formControlName="name"
            [attr.aria-invalid]="nameControl.invalid && nameControl.touched ? 'true' : null"
          />
        </z-form-control>
        @if (nameControl.hasError('required') && nameControl.touched) {
          <z-form-message zType="error">Name is required.</z-form-message>
        } @else if (nameControl.hasError('minlength') && nameControl.touched) {
          <z-form-message zType="error">Name must be at least 2 characters long.</z-form-message>
        } @else {
          <z-form-message>Enter your full name.</z-form-message>
        }
      </z-form-field>

      <z-form-field>
        <label for="email" z-form-label zRequired>Email</label>
        <z-form-control>
          <input
            z-input
            type="email"
            placeholder="your.email@example.com"
            formControlName="email"
            [attr.aria-invalid]="emailControl.invalid && emailControl.touched ? 'true' : null"
          />
        </z-form-control>
        @if (emailControl.hasError('required') && emailControl.touched) {
          <z-form-message zType="error">Email is required.</z-form-message>
        } @else if (emailControl.hasError('email') && emailControl.touched) {
          <z-form-message zType="error">Please enter a valid email address.</z-form-message>
        } @else {
          <z-form-message>We'll never share your email.</z-form-message>
        }
      </z-form-field>

      <z-form-field>
        <label for="website" z-form-label>Website</label>
        <z-form-control>
          <input
            z-input
            type="url"
            placeholder="https://example.com"
            formControlName="website"
            [attr.aria-invalid]="websiteControl.invalid && websiteControl.touched ? 'true' : null"
          />
        </z-form-control>
        @if (websiteControl.hasError('pattern') && websiteControl.touched) {
          <z-form-message zType="error">Please enter a valid URL starting with http:// or https://</z-form-message>
        } @else if (websiteControl.valid && websiteControl.touched && websiteControl.value) {
          <z-form-message zType="success">Valid website URL!</z-form-message>
        } @else {
          <z-form-message>Optional: Your website or portfolio URL.</z-form-message>
        }
      </z-form-field>

      <div class="flex gap-2">
        <button z-button zType="default" type="submit" [disabled]="validationForm.invalid">Submit</button>
        <button z-button zType="outline" type="button" (click)="reset()">Reset</button>
      </div>

      @if (submitted) {
        <z-form-message zType="success" class="block">Form submitted successfully! ✓</z-form-message>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormValidationComponent {
  submitted = false;

  validationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    website: new FormControl('', [Validators.pattern(/^https?:\/\/.+/)]),
  });

  get nameControl() {
    return this.validationForm.get('name')!;
  }

  get emailControl() {
    return this.validationForm.get('email')!;
  }

  get websiteControl() {
    return this.validationForm.get('website')!;
  }

  onSubmit() {
    if (this.validationForm.valid) {
      this.submitted = true;
      console.log('Form submitted:', this.validationForm.value);

      // Hide success message after 3 seconds
      setTimeout(() => {
        this.submitted = false;
      }, 3000);
    }
  }

  reset() {
    this.validationForm.reset();
    this.submitted = false;
  }
}
```

### Complex

```angular-ts
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardCheckboxComponent } from '../../checkbox/checkbox.component';
import { ZardInputComponent } from '../../input/input.component';
import { ZardSelectItemComponent } from '../../select/select-item.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardFormImports } from '../form.imports';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  message: string;
  newsletter: boolean;
  terms: boolean;
}

@Component({
  selector: 'zard-demo-form-complex',
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardInputComponent,
    ZardCheckboxComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardFormImports,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="max-w-lg space-y-6">
      <!-- Name Fields Row -->
      <div class="flex items-start gap-4">
        <z-form-field>
          <label z-form-label zRequired for="firstName">First Name</label>
          <z-form-control [errorMessage]="isFieldInvalid('firstName') ? 'First name is required' : ''">
            <input z-input id="firstName" type="text" placeholder="John" formControlName="firstName" />
          </z-form-control>
        </z-form-field>

        <z-form-field>
          <label z-form-label zRequired for="lastName">Last Name</label>
          <z-form-control [errorMessage]="isFieldInvalid('lastName') ? 'Last name is required' : ''">
            <input z-input id="lastName" type="text" placeholder="Doe" formControlName="lastName" />
          </z-form-control>
        </z-form-field>
      </div>

      <!-- Email Field -->
      <z-form-field>
        <label z-form-label zRequired for="email">Email</label>
        <z-form-control [errorMessage]="isFieldInvalid('email') ? getEmailError() : ''">
          <input z-input id="email" type="email" placeholder="john.doe@example.com" formControlName="email" />
        </z-form-control>
      </z-form-field>

      <!-- Phone Field -->
      <z-form-field>
        <label z-form-label for="phone">Phone Number</label>
        <z-form-control helpText="Include country code if outside US">
          <input z-input id="phone" type="tel" placeholder="+1 (555) 123-4567" formControlName="phone" />
        </z-form-control>
      </z-form-field>

      <!-- Country Selector -->
      <z-form-field>
        <label z-form-label zRequired for="country">Country</label>
        <z-form-control [errorMessage]="isFieldInvalid('country') ? 'Please select a country' : ''">
          <z-select id="country" formControlName="country" placeholder="Select your country">
            @for (country of countries; track country.value) {
              <z-select-item [zValue]="country.value">{{ country.label }}</z-select-item>
            }
          </z-select>
        </z-form-control>
      </z-form-field>

      <!-- Company Field -->
      <z-form-field>
        <label z-form-label for="company">Company</label>
        <z-form-control helpText="Optional: Where do you work?">
          <input z-input id="company" type="text" placeholder="Your company name" formControlName="company" />
        </z-form-control>
      </z-form-field>

      <!-- Message Field -->
      <z-form-field>
        <label z-form-label for="message">Message</label>
        <z-form-control
          [errorMessage]="isFieldInvalid('message') ? 'Message is too long (max 500 characters)' : ''"
          [helpText]="!isFieldInvalid('message') ? messageLength() + '/500 characters' : ''"
        >
          <textarea
            z-input
            id="message"
            rows="4"
            placeholder="Tell us about your project or inquiry..."
            formControlName="message"
          ></textarea>
        </z-form-control>
      </z-form-field>

      <!-- Newsletter Checkbox -->
      <z-form-field>
        <z-form-control helpText="Get updates about new features and releases" class="flex flex-col">
          <div class="flex items-center space-x-2">
            <z-checkbox id="newsletter" formControlName="newsletter" />
            <label z-form-label class="mb-0!" for="newsletter">Subscribe to newsletter</label>
          </div>
        </z-form-control>
      </z-form-field>

      <!-- Terms Checkbox -->
      <z-form-field>
        <z-form-control
          [errorMessage]="isFieldInvalid('terms') ? 'You must accept the terms and conditions' : ''"
          class="flex flex-col"
        >
          <div class="flex items-center space-x-2">
            <z-checkbox id="terms" formControlName="terms" />
            <label z-form-label class="mb-0!" zRequired for="terms">I agree to the terms and conditions</label>
          </div>
        </z-form-control>
      </z-form-field>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-4">
        <button z-button zType="default" type="submit" [zDisabled]="isSubmitting()">
          {{ isSubmitting() ? 'Submitting...' : 'Submit Form' }}
        </button>
        <button z-button zType="outline" type="button" (click)="resetForm()">Reset</button>
      </div>

      <!-- Success Message -->
      @if (showSuccess()) {
        <div class="rounded-md border border-green-200 bg-green-50 p-4">
          <z-form-message zType="success">✓ Form submitted successfully! We'll get back to you soon.</z-form-message>
        </div>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormComplexComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly showSuccess = signal(false);
  readonly isSubmitting = signal(false);

  readonly countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'br', label: 'Brazil' },
  ] as const;

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    country: ['', Validators.required],
    company: [''],
    message: ['', Validators.maxLength(500)],
    newsletter: [false],
    terms: [false, Validators.requiredTrue],
  });

  readonly messageLength = signal(0);

  constructor() {
    // Track message length
    this.form.controls.message.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      this.messageLength.set(value?.length ?? 0);
    });
  }

  isFieldInvalid(fieldName: keyof FormData): boolean {
    const field = this.form.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getEmailError(): string {
    const email = this.form.get('email');
    if (email?.hasError('required')) {
      return 'Email is required';
    }
    if (email?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    await this.simulateApiCall();

    this.isSubmitting.set(false);
    this.showSuccess.set(true);

    console.log('Form submitted:', this.form.getRawValue());

    setTimeout(() => {
      this.showSuccess.set(false);
    }, 5000);
  }

  resetForm(): void {
    this.form.reset();
    this.showSuccess.set(false);
    this.messageLength.set(0);
  }

  private simulateApiCall(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

## API Reference

### ZardFormFieldComponent

Container component that provides proper spacing and structure for form elements.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |

### ZardFormLabelComponent

Accessible label component with optional required indicator.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |
| `zRequired` | Shows required indicator (*) | `boolean` | `false` |

### ZardFormControlComponent

Wrapper component for form controls that provides proper positioning and styling context.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |

### ZardFormMessageComponent

Component for displaying helper text, validation messages, and other form-related information.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `class` | Additional CSS classes | `ClassValue` | `''` |
| `zType` | Message type affecting color | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` |

---

[Open in browser](https://zardui.com/docs/components/form)
