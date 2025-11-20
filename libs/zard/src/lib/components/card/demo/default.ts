import { Component } from '@angular/core';

import { generateId } from '../../../shared/utils/utils';
import { ZardButtonComponent } from '../../button/button.component';
import { ZardCardComponent } from '../card.component';

@Component({
  selector: 'z-demo-card-default',
  imports: [ZardCardComponent, ZardButtonComponent],
  standalone: true,
  template: `
    <z-card
      class="w-full max-w-sm"
      zTitle="Login to your account"
      zDescription="Enter your email below to login to your account"
    >
      <div class="space-y-4">
        <div class="space-y-2">
          <label
            [for]="idEmail"
            class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email
          </label>
          <input
            [id]="idEmail"
            type="email"
            placeholder="m@example.com"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
        <div class="space-y-2">
          <div class="flex items-center">
            <label
              [for]="idPassword"
              class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Password
            </label>
            <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline"> Forgot your password? </a>
          </div>
          <input
            [id]="idPassword"
            type="password"
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            required
          />
        </div>
        <div class="space-y-2">
          <z-button zType="default" class="w-full">Login</z-button>
          <z-button zType="outline" class="w-full">Login with Google</z-button>
        </div>
      </div>
    </z-card>
  `,
})
export class ZardDemoCardDefaultComponent {
  protected readonly idEmail = generateId('email');
  protected readonly idPassword = generateId('password');
}
