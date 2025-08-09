```angular-ts showLineNumbers
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardCheckboxComponent } from '../../checkbox/checkbox.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardSelectItemComponent } from '../../select/select-item.component';
import { ZardSelectComponent } from '../../select/select.component';
import { ZardFormModule } from '../form.module';

@Component({
  selector: 'zard-demo-form-complex',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardInputDirective,
    ZardCheckboxComponent,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardFormModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form [formGroup]="complexForm" (ngSubmit)="onSubmit()" class="space-y-6 max-w-lg">
      <div class="grid grid-cols-2 gap-4">
        <z-form-field>
          <label z-form-label zRequired>First Name</label>
          <z-form-control>
            <input z-input type="text" placeholder="John" formControlName="firstName" />
          </z-form-control>
        </z-form-field>

        <z-form-field>
          <label z-form-label zRequired>Last Name</label>
          <z-form-control>
            <input z-input type="text" placeholder="Doe" formControlName="lastName" />
          </z-form-control>
        </z-form-field>
      </div>

      <z-form-field>
        <label z-form-label zRequired>Email</label>
        <z-form-control>
          <input z-input type="email" placeholder="john.doe@example.com" formControlName="email" />
        </z-form-control>
      </z-form-field>

      <z-form-field>
        <label z-form-label>Phone Number</label>
        <z-form-control>
          <input z-input type="tel" placeholder="+1 (555) 123-4567" formControlName="phone" />
        </z-form-control>
        <z-form-message>Include country code if outside US.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label zRequired>Country</label>
        <z-form-control>
          <z-select formControlName="country" placeholder="Select your country">
            <z-select-item value="us">United States</z-select-item>
            <z-select-item value="ca">Canada</z-select-item>
            <z-select-item value="uk">United Kingdom</z-select-item>
            <z-select-item value="au">Australia</z-select-item>
            <z-select-item value="de">Germany</z-select-item>
            <z-select-item value="fr">France</z-select-item>
            <z-select-item value="jp">Japan</z-select-item>
            <z-select-item value="br">Brazil</z-select-item>
          </z-select>
        </z-form-control>
      </z-form-field>

      <z-form-field>
        <label z-form-label>Company</label>
        <z-form-control>
          <input z-input type="text" placeholder="Your company name" formControlName="company" />
        </z-form-control>
        <z-form-message>Optional: Where do you work?</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label>Message</label>
        <z-form-control>
          <textarea z-input rows="4" placeholder="Tell us about your project or inquiry..." formControlName="message"></textarea>
        </z-form-control>
        <z-form-message>{{ messageControl.value?.length || 0 }}/500 characters</z-form-message>
      </z-form-field>

      <z-form-field>
        <z-form-control class="flex items-center space-x-2">
          <z-checkbox formControlName="newsletter" />
          <label z-form-label class="!mb-0">Subscribe to newsletter</label>
        </z-form-control>
        <z-form-message>Get updates about new features and releases.</z-form-message>
      </z-form-field>

      <z-form-field>
        <z-form-control class="flex items-center space-x-2">
          <z-checkbox formControlName="terms" zRequired />
          <label z-form-label class="!mb-0" zRequired>I agree to the terms and conditions</label>
        </z-form-control>
        @if (termsControl.invalid && termsControl.touched) {
          <z-form-message zType="error">You must accept the terms and conditions.</z-form-message>
        }
      </z-form-field>

      <div class="flex gap-2 pt-4">
        <button z-button zType="default" type="submit" [disabled]="complexForm.invalid">Submit Form</button>
        <button z-button zType="outline" type="button" (click)="reset()">Reset</button>
      </div>

      @if (submitted) {
        <div class="p-4 bg-green-50 border border-green-200 rounded-md">
          <z-form-message zType="success">✓ Form submitted successfully! We'll get back to you soon.</z-form-message>
        </div>
      }
    </form>
  `,
})
export class ZardDemoFormComplexComponent {
  submitted = false;

  complexForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    country: new FormControl('', [Validators.required]),
    company: new FormControl(''),
    message: new FormControl('', [Validators.maxLength(500)]),
    newsletter: new FormControl(false),
    terms: new FormControl(false, [Validators.requiredTrue]),
  });

  get messageControl() {
    return this.complexForm.get('message')!;
  }

  get termsControl() {
    return this.complexForm.get('terms')!;
  }

  onSubmit() {
    if (this.complexForm.valid) {
      this.submitted = true;
      console.log('Complex form submitted:', this.complexForm.value);

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.submitted = false;
      }, 5000);
    } else {
      // Mark all fields as touched to show validation errors
      this.complexForm.markAllAsTouched();
    }
  }

  reset() {
    this.complexForm.reset();
    this.submitted = false;
  }
}

```