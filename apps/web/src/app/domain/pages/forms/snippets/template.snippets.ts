import type { FormSnippetMap } from './snippet.types';

/** Prose code snippets for the Template-driven Forms guide. */
export const TEMPLATE_SNIPPETS: FormSnippetMap = {
  anatomy: {
    language: 'angular-html',
    highlightLines: [1, 2, 7, 8, 9, 13],
    code: `@let titleInvalid = title.invalid && title.touched;
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
</div>`,
  },
  arrayMutate: {
    language: 'angular-ts',
    code: `/** Each entry keeps a stable object identity so \`track\` survives insert/remove. */
protected emails: { address: string }[] = [{ address: '' }, { address: '' }];

protected addEmail(): void {
  if (this.emails.length >= 5) return;
  this.emails = [...this.emails, { address: '' }];
}

protected removeEmail(index: number): void {
  if (this.emails.length <= 1) return;
  this.emails = this.emails.filter((_, position) => position !== index);
}`,
  },
  arrayStructure: {
    language: 'angular-html',
    highlightLines: [2, 3, 9],
    code: `<div z-field-group class="gap-4">
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
</div>`,
  },
  asyncValidator: {
    language: 'angular-ts',
    title: 'username-available.directive.ts',
    highlightLines: [3, 4, 10, 11, 12],
    code: `@Directive({
  selector: '[zUsernameAvailable]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UsernameAvailableDirective), multi: true },
  ],
})
export class UsernameAvailableDirective implements AsyncValidator {
  private readonly api = inject(SignupApi);

  // Async validators only run once the synchronous ones pass. While the request is
  // in flight the control is \`PENDING\` — neither valid nor invalid.
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.api.isUsernameTaken(control.value).pipe(map(taken => (taken ? { usernameTaken: true } : null)));
  }
}`,
  },
  bind: {
    language: 'angular-html',
    highlightLines: [1, 6, 7],
    code: `<form id="bug-report" #bugForm="ngForm" (ngSubmit)="onSubmit(bugForm)">
  <div z-field-group>
    <div z-field>
      <label z-field-label for="bug-title">Bug Title</label>
      <!-- \`name\` is what registers the control on the parent \`NgForm\`. -->
      <input z-input required id="bug-title" name="title" [(ngModel)]="model.title" />
    </div>
  </div>
</form>`,
  },
  crossField: {
    language: 'angular-ts',
    title: 'subscription-form.ts',
    code: `// Template-driven forms have no declarative place for count, value or
// cross-field rules. Keep them as getters next to the model and check them
// on submit, together with \`form.invalid\`.
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
}`,
  },
  disabling: {
    language: 'angular-html',
    highlightLines: [2, 8],
    code: `<!-- A disabled control keeps its value in your model, but drops out of \`form.value\`
     and stops being validated. -->
<input z-input name="coupon" [disabled]="model.plan === 'free'" [(ngModel)]="model.coupon" />

<!-- \`standalone\` keeps the control out of the parent form entirely: no \`name\` needed,
     no effect on \`form.valid\`, and its value never lands in \`form.value\`. Use it for
     controls that filter or search rather than submit. -->
<input z-input [ngModel]="query" [ngModelOptions]="{ standalone: true }" (ngModelChange)="onSearch($event)" />`,
  },
  errors: {
    language: 'angular-html',
    highlightLines: [1, 2, 10, 12],
    code: `@let emailInvalid = emailControl.invalid && emailControl.touched;
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
</div>`,
  },
  model: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    code: `// There is no schema object here: the shape of the form is the shape of the
// model, and the rules live in the template as validation attributes.
interface BugReport {
  title: string;
  description: string;
}

protected model: BugReport = { title: '', description: '' };`,
  },
  modelGroup: {
    language: 'angular-html',
    highlightLines: [2, 3, 12],
    code: `<form novalidate #checkoutForm="ngForm" (ngSubmit)="onSubmit(checkoutForm)">
  <!-- The group name becomes a key in \`checkoutForm.value\`, so the flat list of
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
</form>`,
  },
  reset: {
    language: 'angular-ts',
    code: `// \`resetForm()\` clears the values *and* the pristine/touched state.
// Pass the initial value so \`nonNullable\`-like defaults come back.
protected onReset(form: NgForm): void {
  this.model = { title: '', description: '' };
  form.resetForm(this.model);
}`,
  },
  setup: {
    language: 'angular-ts',
    title: 'bug-report-form.ts',
    highlightLines: [14, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    code: `import { ChangeDetectionStrategy, Component } from '@angular/core';
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

  // \`NgForm\` comes from the template via \`#bugForm="ngForm"\`.
  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    console.log(this.model);
  }
}`,
  },
  validatorDirective: {
    language: 'angular-ts',
    title: 'forbidden-names.directive.ts',
    highlightLines: [3, 12, 13, 14, 15, 16, 24, 25, 26],
    code: `@Directive({
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

// <input z-input name="username" [zForbiddenNames]="['admin', 'root']" [(ngModel)]="model.username" />`,
  },
  updateOn: {
    language: 'angular-html',
    highlightLines: [2, 7],
    code: `<!-- Per control -->
<input z-input name="title" [(ngModel)]="model.title" [ngModelOptions]="{ updateOn: 'blur' }" />

<!-- Or for the whole form — every control inherits it unless it sets its own. -->
<form #bugForm="ngForm" [ngFormOptions]="{ updateOn: 'submit' }" (ngSubmit)="onSubmit(bugForm)">
  <!-- ... -->
</form>`,
  },
  validators: {
    language: 'angular-html',
    code: `<!-- Presence -->
<input z-input required name="username" [(ngModel)]="model.username" />

<!-- Length -->
<input z-input minlength="3" maxlength="10" name="username" [(ngModel)]="model.username" />

<!-- Formats -->
<input z-input email type="email" name="email" [(ngModel)]="model.email" />
<input z-input pattern="^[a-z0-9-]+$" name="slug" [(ngModel)]="model.slug" />

<!-- Numbers -->
<input z-input type="number" min="1" max="50" name="seats" [(ngModel)]="model.seats" />

<!-- Custom controls work the same way: they register through \`name\` + \`ngModel\` -->
<z-select required name="country" [(ngModel)]="model.country">
  <z-select-item zValue="br">Brazil</z-select-item>
</z-select>`,
  },
};
