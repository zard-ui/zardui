import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import {
  ZardToggleGroupComponent,
  type ZardToggleGroupItem,
} from '@/shared/components/toggle-group/toggle-group.component';

const SPACING_OPTIONS = [
  { className: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
  { className: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
  { className: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
  { className: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' },
];

@Component({
  selector: 'z-demo-card-spacing',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent, ZardToggleGroupComponent],
  template: `
    <div class="mx-auto grid w-full min-w-sm gap-4">
      <z-toggle-group
        zMode="single"
        zType="outline"
        zSize="sm"
        class="justify-center"
        [zItems]="items"
        [zValue]="spacing()"
        (valueChange)="onSpacingChange($event)"
      />
      <z-card [class]="selectedSpacing()">
        <z-card-header>
          <z-card-title zTitle="Login to your account" />
          <z-card-description zDescription="Enter your email below to login to your account" />
          <z-card-action>
            <a z-button zType="link" href="#">Sign Up</a>
          </z-card-action>
        </z-card-header>
        <z-card-content>
          <div z-field-group>
            <div z-field>
              <label z-field-label for="card-spacing-email">Email</label>
              <input z-input id="card-spacing-email" type="email" placeholder="m@example.com" required />
            </div>
            <div z-field>
              <div class="flex items-center">
                <label z-field-label for="card-spacing-password">Password</label>
                <a href="#" class="ml-auto text-sm underline-offset-4 hover:underline">Forgot your password?</a>
              </div>
              <input z-input id="card-spacing-password" type="password" required />
            </div>
          </div>
        </z-card-content>
        <z-card-footer class="flex-col gap-2">
          <z-button class="w-full">Login</z-button>
          <z-button zType="outline" class="w-full">Login with Google</z-button>
        </z-card-footer>
      </z-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardSpacingComponent {
  readonly items: ZardToggleGroupItem[] = SPACING_OPTIONS.map(({ value, label }) => ({ value, label }));

  readonly spacing = signal('4');

  readonly selectedSpacing = computed(() => SPACING_OPTIONS.find(option => option.value === this.spacing())?.className);

  onSpacingChange(value: string | string[]) {
    const next = Array.isArray(value) ? value[0] : value;
    if (next) {
      this.spacing.set(next);
    }
  }
}
