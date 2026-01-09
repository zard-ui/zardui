```angular-ts showLineNumbers copyButton
import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { form, Field, required, email, minLength, maxLength, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardFormImports } from '@/shared/components/form/form.imports';
import { ZardInputDirective } from '@/shared/components/input';

@Component({
  selector: 'zard-demo-form-signal',
  imports: [ZardButtonComponent, ZardInputDirective, ZardFormImports, Field],
  template: `
    <form (submit)="onSubmit($event)" class="max-w-sm space-y-6">
      <z-form-field>
        <label for="username" z-form-label zRequired>Username</label>
        <z-form-control>
          <input id="username" z-input type="text" placeholder="Choose a username" [field]="profileForm.username" />
        </z-form-control>
        <z-form-message zType="default">Username must be 3-20 characters long.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label for="email" z-form-label zRequired>Email</label>
        <z-form-control>
          <input id="email" z-input type="email" placeholder="Enter your email" [field]="profileForm.email" />
        </z-form-control>
        <z-form-message zType="default">We'll use this for account notifications.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label for="password" z-form-label zRequired>Password</label>
        <z-form-control>
          <input id="password" z-input type="password" placeholder="Create a password" [field]="profileForm.password" />
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