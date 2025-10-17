import type { Block } from '@zard/domain/components/block-container/block-container.component';

import { Authentication01Component } from './authentication-01.component';

export const authentication01Block: Block = {
  id: 'authentication-01',
  title: 'Authentication page',
  description: 'A modern authentication page with email/password.',
  component: Authentication01Component,
  category: 'Authentication',
  image: {
    light: '/blocks/authentication-01/light.png',
    dark: '/blocks/authentication-01/dark.png',
  },
  files: [
    {
      name: 'authentication-01.component.ts',
      path: 'src/components/authentication-01/authentication-01.component.ts',
      content: `import { ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent } from '@zard/components/form/form.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardInputDirective } from '@zard/components/input/input.directive';
import { ZardCardComponent } from '@zard/components/card/card.component';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'z-authentication-01',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardCheckboxComponent,
    ZardInputDirective,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
  ],
  templateUrl: './authentication-01.component.html',
})
export class Authentication01Component {
  protected readonly isLoading = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false),
  });
}
`,
      language: 'typescript',
    },
    {
      name: 'authentication-01.component.html',
      path: 'src/components/authentication-01/authentication-01.component.html',
      content: `<div class="flex min-h-screen flex-col lg:flex-row">
  <div class="flex flex-1 items-center justify-center bg-background p-4 sm:p-8">
    <div class="w-full max-w-md space-y-6 sm:space-y-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold sm:text-3xl">Welcome back</h1>
        <p class="mt-2 text-sm text-muted-foreground sm:text-base">Sign in to your account to continue</p>
      </div>

      <z-card class="p-4 sm:p-6 lg:p-8">
        <form [formGroup]="loginForm" class="space-y-4 sm:space-y-6">
          <z-form-field>
            <z-form-label [zRequired]="true">Email</z-form-label>
            <z-form-control>
              <input z-input type="email" formControlName="email" placeholder="name@zard.com" class="w-full" />
            </z-form-control>
          </z-form-field>

          <z-form-field>
            <div class="flex items-center justify-between">
              <z-form-label [zRequired]="true">Password</z-form-label>
              <a z-button zType="link" class="p-0">Forgot password?</a>
            </div>
            <z-form-control>
              <input z-input type="password" formControlName="password" placeholder="••••••••" class="w-full" />
            </z-form-control>
          </z-form-field>

          <div class="flex items-center gap-2">
            <z-checkbox id="remember" formControlName="rememberMe"></z-checkbox>
            <label for="remember" class="text-sm cursor-pointer select-none">Remember me for 30 days</label>
          </div>

          <button type="submit" z-button zFull [zLoading]="isLoading()" [disabled]="isLoading()">Sign in</button>
        </form>
      </z-card>

      <p class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <a z-button zType="link" href="#" class="px-0">Sign up</a>
      </p>
    </div>
  </div>
  <aside class="hidden flex-1 items-center justify-center bg-muted p-8 lg:flex"></aside>
</div>
`,
      language: 'html',
    },
  ],
};
