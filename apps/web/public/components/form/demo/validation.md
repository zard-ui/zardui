```angular-ts showLineNumbers copyButton
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardFormModule } from '../form.module';

@Component({
  selector: 'zard-demo-form-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ZardButtonComponent, ZardInputDirective, ZardFormModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form [formGroup]="validationForm" (ngSubmit)="onSubmit()" class="space-y-6 max-w-sm">
      <z-form-field>
        <label z-form-label zRequired>Name</label>
        <z-form-control>
          <input z-input type="text" placeholder="Your full name" formControlName="name" [zStatus]="nameControl.invalid && nameControl.touched ? 'error' : undefined" />
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
        <label z-form-label zRequired>Email</label>
        <z-form-control>
          <input z-input type="email" placeholder="your.email@example.com" formControlName="email" [zStatus]="emailControl.invalid && emailControl.touched ? 'error' : undefined" />
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
        <label z-form-label>Website</label>
        <z-form-control>
          <input
            z-input
            type="url"
            placeholder="https://example.com"
            formControlName="website"
            [zStatus]="websiteControl.invalid && websiteControl.touched ? 'error' : websiteControl.valid && websiteControl.touched ? 'success' : undefined"
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