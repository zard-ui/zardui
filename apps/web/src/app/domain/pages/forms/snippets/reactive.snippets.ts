import type { FormSnippetMap } from './snippet.types';

/** Prose code snippets for the Reactive Forms guide. */
export const REACTIVE_SNIPPETS: FormSnippetMap = {
  anatomy: {
    language: 'angular-html',
    highlightLines: [1, 3, 6, 12],
    code: `@let title = bugForm.controls.title;
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
</div>`,
  },
  arrayMutate: {
    language: 'angular-ts',
    code: `protected addEmail(): void {
  if (this.emails.length >= 5) return;
  this.emails.push(createEmailGroup());
}

protected removeEmail(index: number): void {
  if (this.emails.length <= 1) return;
  this.emails.removeAt(index);
}`,
  },
  arraySetup: {
    language: 'angular-ts',
    title: 'contact-form.ts',
    highlightLines: [5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20],
    code: `import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

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
}`,
  },
  arrayStructure: {
    language: 'angular-html',
    highlightLines: [5, 6, 8],
    code: `<fieldset z-field-set class="gap-4">
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
</fieldset>`,
  },
  asyncValidator: {
    language: 'angular-ts',
    title: 'signup-form.ts',
    highlightLines: [5, 6, 7, 8, 9, 16, 17],
    code: `import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
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
});`,
  },
  bind: {
    language: 'angular-html',
    highlightLines: [1, 7],
    code: `<form id="bug-report" [formGroup]="bugForm" (ngSubmit)="onSubmit()">
  <div z-field-group>
    <div z-field>
      <label z-field-label for="bug-title">Bug Title</label>
      <input z-input id="bug-title" formControlName="title" />
    </div>
  </div>
</form>`,
  },
  customValidator: {
    language: 'angular-ts',
    title: 'signup-form.ts',
    highlightLines: [3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 22],
    code: `import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

/** Single field: return \`null\` when valid, an error map otherwise. */
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
);`,
  },
  changes: {
    language: 'angular-ts',
    highlightLines: [6, 12, 13, 14],
    code: `import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TouchedChangeEvent, ValueChangeEvent } from '@angular/forms';

// \`valueChanges\` emits the value only. \`getRawValue()\` seeds it so the signal is
// never \`undefined\` and keeps the disabled controls.
protected readonly value = toSignal(this.bugForm.valueChanges, {
  initialValue: this.bugForm.getRawValue(),
});

constructor() {
  // \`events\` is the single stream for value, status, pristine, touched, submit and reset.
  this.bugForm.events.pipe(takeUntilDestroyed()).subscribe(event => {
    if (event instanceof ValueChangeEvent) {
      this.saveDraft(event.value);
    } else if (event instanceof TouchedChangeEvent) {
      this.trackFirstInteraction();
    }
  });
}`,
  },
  disabling: {
    language: 'angular-ts',
    highlightLines: [3, 9, 10],
    code: `protected readonly checkoutForm = new FormGroup({
  plan: new FormControl('free', { nonNullable: true }),
  // The boxed \`{ value, disabled }\` object is how a control starts out disabled.
  coupon: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
});

protected onPlanChange(plan: string): void {
  const coupon = this.checkoutForm.controls.coupon;
  // A disabled control is skipped by validation and left out of \`value\` —
  // \`getRawValue()\` is what reads it back on submit.
  plan === 'free' ? coupon.disable() : coupon.enable();
}`,
  },
  errors: {
    language: 'angular-html',
    highlightLines: [2, 3, 9, 12],
    code: `@let emailControl = signupForm.controls.email;
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
</div>`,
  },
  formBuilder: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    highlightLines: [6, 8, 9, 10],
    code: `import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

private readonly fb = inject(FormBuilder);

// \`fb.nonNullable\` builds every control with \`{ nonNullable: true }\`, so the same
// guarantees apply without repeating the option on each control.
protected readonly bugForm = this.fb.nonNullable.group({
  title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]],
  description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(100)]],
});`,
  },
  runtimeValidators: {
    language: 'angular-ts',
    highlightLines: [6, 7, 12, 13],
    code: `// Rules can change with the shape of the form — a field that only becomes
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
}`,
  },
  reset: {
    language: 'angular-ts',
    code: `// Back to the initial value of every \`nonNullable\` control, and back to
// pristine/untouched — so errors disappear until the user interacts again.
protected onReset(): void {
  this.bugForm.reset();
}

// Pass a partial value to reset to something other than the defaults.
protected onResetToDefaults(): void {
  this.subscriptionForm.reset({ plan: 'basic' });
}`,
  },
  schema: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    code: `import { FormControl, FormGroup, Validators } from '@angular/forms';

// \`nonNullable: true\` keeps the control type as \`string\` instead of \`string | null\`
// and makes \`reset()\` restore the initial value instead of \`null\`.
protected readonly bugForm = new FormGroup({
  title: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5), Validators.maxLength(32)],
  }),
  description: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(20), Validators.maxLength(100)],
  }),
});`,
  },
  setup: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    highlightLines: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
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
}`,
  },
  updating: {
    language: 'angular-ts',
    highlightLines: [2, 5, 8],
    code: `// \`setValue\` demands the whole shape — a missing or unknown key throws.
this.profileForm.setValue({ username: 'shadcn', email: 'me@example.com' });

// \`patchValue\` takes any subset and silently ignores what it does not recognise.
this.profileForm.patchValue({ username: 'shadcn' });

// Both accept \`{ emitEvent: false }\` when the update should not trigger \`valueChanges\`.
this.profileForm.patchValue({ username: 'shadcn' }, { emitEvent: false });`,
  },
  updateOn: {
    language: 'angular-ts',
    highlightLines: [4, 10],
    code: `// Per control
const title = new FormControl('', {
  nonNullable: true,
  updateOn: 'blur',
  validators: [Validators.required],
});

// Or for the whole group — every control inherits it unless it sets its own.
const bugForm = new FormGroup(
  { title, description },
  { updateOn: 'submit' },
);`,
  },
  validators: {
    language: 'angular-ts',
    title: 'account-form.ts',
    code: `import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  // Booleans that must be \`true\` (terms, consent, ...)
  terms: new FormControl(false, { nonNullable: true, validators: [Validators.requiredTrue] }),
});`,
  },
};
