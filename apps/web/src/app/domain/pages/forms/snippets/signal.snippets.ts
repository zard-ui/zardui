import type { FormSnippetMap } from './snippet.types';

/** Prose code snippets for the Signal Forms guide. */
export const SIGNAL_SNIPPETS: FormSnippetMap = {
  anatomy: {
    language: 'angular-html',
    highlightLines: [1, 3, 6, 9],
    code: `@let title = bugForm.title();
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
</div>`,
  },
  arrayMutate: {
    language: 'angular-ts',
    code: `// The array lives in the model signal — add and remove by updating the model.
// The field tree reconciles itself, keeping validation state per item.
protected addEmail(): void {
  this.model.update(model => ({ ...model, emails: [...model.emails, { address: '' }] }));
}

protected removeEmail(index: number): void {
  this.model.update(model => ({ ...model, emails: model.emails.filter((_, i) => i !== index) }));
}`,
  },
  arraySchema: {
    language: 'angular-ts',
    title: 'contact-form.ts',
    highlightLines: [11, 12, 13, 14, 15],
    code: `import { applyEach, email, form, maxLength, minLength, required } from '@angular/forms/signals';

private readonly model = signal<{ emails: { address: string }[] }>({
  emails: [{ address: '' }, { address: '' }],
});

protected readonly contactForm = form(this.model, schemaPath => {
  minLength(schemaPath.emails, 1, { message: 'Add at least one email address.' });
  maxLength(schemaPath.emails, 5, { message: 'You can add up to 5 email addresses.' });

  // \`applyEach\` binds the same rules to every item of the array.
  applyEach(schemaPath.emails, entry => {
    required(entry.address, { message: 'Enter a valid email address.' });
    email(entry.address, { message: 'Enter a valid email address.' });
  });
});`,
  },
  arrayStructure: {
    language: 'angular-html',
    highlightLines: [5, 8],
    code: `<fieldset z-field-set class="gap-4">
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
</fieldset>`,
  },
  async: {
    language: 'angular-ts',
    title: 'signup-form.ts',
    code: `import { httpResource } from '@angular/common/http';
import { form, required, validateAsync } from '@angular/forms/signals';

protected readonly signupForm = form(this.model, schemaPath => {
  required(schemaPath.username);

  // Async validators only run once every synchronous validator passes.
  // While the request is in flight the field is \`pending()\`, not \`invalid()\`.
  validateAsync(schemaPath.username, {
    params: ({ value }) => value(),
    // Forms reports the params as \`undefined\` when the validator should not run —
    // return \`undefined\` from the request too, so no request is sent.
    factory: username =>
      httpResource<{ taken: boolean }>(() => (username() ? \`/api/usernames/\${username()}\` : undefined)),
    onSuccess: result => (result.taken ? { kind: 'usernameTaken', message: 'Username already taken.' } : undefined),
    onError: () => ({ kind: 'usernameCheckFailed', message: 'Could not verify the username.' }),
  });
});`,
  },
  debounce: {
    language: 'angular-ts',
    highlightLines: [4, 5, 7, 8],
    code: `import { debounce, form } from '@angular/forms/signals';

protected readonly searchForm = form(this.model, schemaPath => {
  // Milliseconds: the model waits for the typing to settle.
  debounce(schemaPath.query, 300);

  // Or hold every update until the field is blurred.
  debounce(schemaPath.coupon, 'blur');
});`,
  },
  customValidate: {
    language: 'angular-ts',
    title: 'signup-form.ts',
    highlightLines: [6, 7, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    code: `import { form, validate, validateTree } from '@angular/forms/signals';

protected readonly signupForm = form(this.model, schemaPath => {
  // Single field: return an error object, or \`undefined\` when the value is valid.
  validate(schemaPath.terms, ({ value }) =>
    value() ? undefined : { kind: 'termsRequired', message: 'You must accept the terms of service.' },
  );

  // Cross-field: \`validateTree\` reads the whole value and can target a sibling
  // field through \`fieldTreeOf()\`, so the error lands on the right control.
  validateTree(schemaPath, ({ value, fieldTreeOf }) => {
    const { password, confirmPassword } = value();
    if (!confirmPassword || password === confirmPassword) return undefined;

    return {
      kind: 'passwordMismatch',
      message: 'Passwords do not match.',
      fieldTree: fieldTreeOf(schemaPath.confirmPassword),
    };
  });
});`,
  },
  errors: {
    language: 'angular-html',
    highlightLines: [2, 3, 10, 13],
    code: `@let emailField = signupForm.email();
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
</div>`,
  },
  fieldState: {
    language: 'angular-ts',
    title: 'checkout-form.ts',
    highlightLines: [4, 5, 6, 7, 11, 14],
    code: `import { disabled, form, hidden, readonly, required } from '@angular/forms/signals';

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
});`,
  },
  reset: {
    language: 'angular-ts',
    highlightLines: [6, 12],
    code: `private readonly model = signal({ title: '', description: '' });

protected readonly bugForm = form(this.model, /* ... */);

// With a value: writes it back into the model *and* clears touched/dirty.
protected onReset(): void {
  this.bugForm().reset({ title: '', description: '' });
}

// Without a value: only clears touched/dirty, so the data stays as the user left it
// and the errors disappear until they interact again.
protected onClearErrors(): void {
  this.bugForm().reset();
}`,
  },
  reusableSchema: {
    language: 'angular-ts',
    title: 'checkout-form.ts',
    highlightLines: [3, 4, 5, 6, 7, 8, 11, 14],
    code: `import { apply, applyWhen, form, minLength, required, schema } from '@angular/forms/signals';

// \`schema()\` names a bundle of rules for one shape, so it can be reused as is.
const addressSchema = schema<Address>(address => {
  required(address.street, { message: 'Street is required.' });
  required(address.city, { message: 'City is required.' });
  minLength(address.zipCode, 5, { message: 'Enter a valid ZIP code.' });
});

protected readonly checkoutForm = form(this.model, schemaPath => {
  apply(schemaPath.billing, addressSchema);

  // Same rules, but only while the shipping address is not a copy of the billing one.
  applyWhen(schemaPath.shipping, ({ valueOf }) => !valueOf(schemaPath.sameAsBilling), addressSchema);
});`,
  },
  schema: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    code: `import { Component, signal } from '@angular/core';
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
}`,
  },
  standardSchema: {
    language: 'angular-ts',
    title: 'signup-form.ts',
    highlightLines: [10],
    code: `import { form, validateStandardSchema } from '@angular/forms/signals';
import * as z from 'zod';

const signupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.'),
  email: z.email('Enter a valid email address.'),
});

protected readonly signupForm = form(this.model, schemaPath => {
  // Any Standard Schema validator works here — Zod, Valibot, ArkType — and its
  // issues land on the matching fields as regular validation errors.
  validateStandardSchema(schemaPath, signupSchema);
});`,
  },
  serverErrors: {
    language: 'angular-ts',
    title: 'signup-form.ts',
    highlightLines: [8, 9, 10, 11, 12, 13],
    code: `protected async onSubmit(event: Event): Promise<void> {
  event.preventDefault();

  await submit(this.signupForm, async submitted => {
    const result = await this.api.signup(submitted().value());

    // Returning errors lands them on the field named by \`fieldTree\`, exactly like a
    // client-side validator. Return \`undefined\` when the request succeeded.
    if (result.usernameTaken) {
      return [{ fieldTree: this.signupForm.username, kind: 'server', message: 'Username already taken.' }];
    }

    return undefined;
  });
}`,
  },
  setup: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    highlightLines: [13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    code: `import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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

    // \`submit()\` marks every field as touched, runs validation and only calls the
    // action when the form is valid — so the errors of a form nobody focused become
    // visible on the first submit. Errors returned by the action are applied back
    // onto the matching fields.
    await submit(this.bugForm, async submitted => {
      console.log(submitted().value());
    });
  }
}`,
  },
  validators: {
    language: 'angular-ts',
    title: 'account-form.ts',
    code: `import { email, form, max, maxLength, min, minLength, pattern, required } from '@angular/forms/signals';

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
});`,
  },
};
