import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-card-preview',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title zTitle="Login to your account" />
        <z-card-description zDescription="Enter your email below to login to your account" />
        <z-card-action>
          <a z-button zType="link" href="#">Sign up</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-login-email">Email</label>
            <input z-input id="card-login-email" type="email" placeholder="m@example.com" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-login-password">Password</label>
              <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <input z-input id="card-login-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">Login</z-button>
        <z-button zType="outline" class="w-full">Login with Google</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardPreviewComponent {}
