```html title="libs/blocks/src/lib/authentication-01/authentication-01.component.html" expandable="true" copyButton showLineNumbers
<div class="flex min-h-screen flex-col lg:flex-row">
  <div class="flex flex-1 items-center justify-center bg-background p-4 sm:p-8">
    <div class="w-full max-w-md space-y-6">
      <z-card class="p-4 sm:p-6 lg:p-8">
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <!-- Email Field with Validation -->
          <z-form-field>
            <z-form-label [zRequired]="true">Email</z-form-label>
            <z-form-control [errorMessage]="emailError()">
              <input
                z-input
                type="email"
                formControlName="email"
                placeholder="name@example.com"
                class="w-full" />
            </z-form-control>
          </z-form-field>

          <!-- Password Field with Validation -->
          <z-form-field>
            <div class="flex items-center justify-between">
              <z-form-label [zRequired]="true">Password</z-form-label>
              <a href="#" class="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <z-form-control [errorMessage]="passwordError()">
              <input
                z-input
                type="password"
                formControlName="password"
                placeholder="••••••••"
                class="w-full" />
            </z-form-control>
          </z-form-field>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center gap-2">
            <z-checkbox id="remember" formControlName="rememberMe"></z-checkbox>
            <label for="remember" class="text-sm">Remember me</label>
          </div>

          <!-- Submit Button with Loading State -->
          <z-button type="submit" class="w-full" [disabled]="isLoading()">
            @if (isLoading()) {
              Signing in...
            } @else {
              Sign in
            }
          </z-button>
        </form>
      </z-card>
    </div>
  </div>
</div>
```
