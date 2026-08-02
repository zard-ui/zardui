import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardIdDirective } from '@/shared/core';

@Component({
  selector: 'z-demo-card-default',
  imports: [ZardCardImports, ZardButtonComponent, ZardIdDirective],
  template: `
    <z-card class="w-full md:w-94">
      <div z-card-header>
        <z-card-title zTitle="Login to your account" />
        <z-card-description zDescription="Enter your email below to login to your account" />
        <z-card-action>
          <button z-button type="button" zType="link" (click)="onSignUp()">Sign up</button>
        </z-card-action>
      </div>
      <div z-card-content>
        <div class="space-y-4">
          <div class="space-y-2" zardId="email" #e="zardId">
            <label
              [for]="e.id()"
              class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Email
            </label>
            <input
              [id]="e.id()"
              type="email"
              placeholder="m@example.com"
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center" zardId="password" #p="zardId">
              <label
                [for]="p.id()"
                class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
            </div>
            <input
              [id]="p.id()"
              type="password"
              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            />
          </div>
        </div>
      </div>
      <div z-card-footer class="flex-col gap-2">
        <z-button zType="default" class="w-full">Login</z-button>
        <z-button zType="outline" class="w-full">Login with Google</z-button>
      </div>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardDefaultComponent {
  protected onSignUp(): void {
    alert('Redirect to Sign Up');
  }
}
