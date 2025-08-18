```angular-ts showLineNumbers copyButton
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardCheckboxComponent } from '../../checkbox/checkbox.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardSelectItemComponent } from '../../select/select-item.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardFormModule } from '../form.module';

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
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardInputDirective, ZardCheckboxComponent, ZardSelectComponent, ZardSelectItemComponent, ZardFormModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-6 max-w-lg">
      <!-- Name Fields Row -->
      <div class="grid grid-cols-2 gap-4">
        <z-form-field>
          <label z-form-label zRequired>First Name</label>
          <z-form-control [errorMessage]="isFieldInvalid('firstName') ? 'First name is required' : ''">
            <input z-input type="text" placeholder="John" formControlName="firstName" />
          </z-form-control>
        </z-form-field>

        <z-form-field>
          <label z-form-label zRequired>Last Name</label>
          <z-form-control [errorMessage]="isFieldInvalid('lastName') ? 'Last name is required' : ''">
            <input z-input type="text" placeholder="Doe" formControlName="lastName" />
          </z-form-control>
        </z-form-field>
      </div>

      <!-- Email Field -->
      <z-form-field>
        <label z-form-label zRequired>Email</label>
        <z-form-control [errorMessage]="isFieldInvalid('email') ? getEmailError() : ''">
          <input z-input type="email" placeholder="john.doe@example.com" formControlName="email" />
        </z-form-control>
      </z-form-field>

      <!-- Phone Field -->
      <z-form-field>
        <label z-form-label>Phone Number</label>
        <z-form-control helpText="Include country code if outside US">
          <input z-input type="tel" placeholder="+1 (555) 123-4567" formControlName="phone" />
        </z-form-control>
      </z-form-field>

      <!-- Country Selector -->
      <z-form-field>
        <label z-form-label zRequired>Country</label>
        <z-form-control [errorMessage]="isFieldInvalid('country') ? 'Please select a country' : ''">
          <z-select formControlName="country" placeholder="Select your country">
            @for (country of countries; track country.value) {
              <z-select-item [value]="country.value">{{ country.label }}</z-select-item>
            }
          </z-select>
        </z-form-control>
      </z-form-field>

      <!-- Company Field -->
      <z-form-field>
        <label z-form-label>Company</label>
        <z-form-control helpText="Optional: Where do you work?">
          <input z-input type="text" placeholder="Your company name" formControlName="company" />
        </z-form-control>
      </z-form-field>

      <!-- Message Field -->
      <z-form-field>
        <label z-form-label>Message</label>
        <z-form-control
          [errorMessage]="isFieldInvalid('message') ? 'Message is too long (max 500 characters)' : ''"
          [helpText]="!isFieldInvalid('message') ? messageLength() + '/500 characters' : ''"
        >
          <textarea z-input rows="4" placeholder="Tell us about your project or inquiry..." formControlName="message"></textarea>
        </z-form-control>
      </z-form-field>

      <!-- Newsletter Checkbox -->
      <z-form-field>
        <z-form-control helpText="Get updates about new features and releases" class="flex flex-col">
          <div class="flex items-center space-x-2">
            <z-checkbox formControlName="newsletter" />
            <label z-form-label class="!mb-0">Subscribe to newsletter</label>
          </div>
        </z-form-control>
      </z-form-field>

      <!-- Terms Checkbox -->
      <z-form-field>
        <z-form-control [errorMessage]="isFieldInvalid('terms') ? 'You must accept the terms and conditions' : ''" class="flex flex-col">
          <div class="flex items-center space-x-2">
            <z-checkbox formControlName="terms" />
            <label z-form-label class="!mb-0" zRequired>I agree to the terms and conditions</label>
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
        <div class="p-4 bg-green-50 border border-green-200 rounded-md">
          <z-form-message zType="success">✓ Form submitted successfully! We'll get back to you soon.</z-form-message>
        </div>
      }
    </form>
  `,
})
export class ZardDemoFormComplexComponent {
  private readonly fb = inject(FormBuilder);

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
    this.form.controls.message.valueChanges.subscribe(value => {
      this.messageLength.set(value?.length || 0);
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