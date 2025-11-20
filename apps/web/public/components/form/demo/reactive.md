```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardFormModule } from '../form.module';

@Component({
  selector: 'zard-demo-form-reactive',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardInputDirective, ZardFormModule],
  standalone: true,
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="max-w-sm space-y-6">
      <z-form-field>
        <label z-form-label zRequired>Username</label>
        <z-form-control>
          <input z-input type="text" placeholder="Choose a username" formControlName="username" />
        </z-form-control>
        <z-form-message zType="default">Username must be 3-20 characters long.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label zRequired>Email</label>
        <z-form-control>
          <input z-input type="email" placeholder="Enter your email" formControlName="email" />
        </z-form-control>
        <z-form-message zType="default">We'll use this for account notifications.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label zRequired>Password</label>
        <z-form-control>
          <input z-input type="password" placeholder="Create a password" formControlName="password" />
        </z-form-control>
        <z-form-message zType="default">Password must be at least 6 characters.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit" [disabled]="profileForm.invalid">Create Account</button>
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