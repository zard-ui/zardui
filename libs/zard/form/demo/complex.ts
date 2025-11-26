import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardCheckboxComponent } from '@ngzard/ui/checkbox';
import { ZardFormModule } from '@ngzard/ui/form';
import { ZardInputDirective } from '@ngzard/ui/input';
import { ZardSelectItemComponent, ZardSelectComponent } from '@ngzard/ui/select';

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
    ZardInputDirective,
    ZardCheckboxComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardFormModule,
  ],
  standalone: true,
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
            <label z-form-label class="!mb-0" for="newsletter">Subscribe to newsletter</label>
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
            <label z-form-label class="!mb-0" zRequired for="terms">I agree to the terms and conditions</label>
          </div>
        </z-form-control>
      </z-form-field>

      <!-- Action Buttons -->
      <div class="flex gap-2 pt-4">
        <button z-button zType="default" type="submit" [disabled]="isSubmitting()">
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
