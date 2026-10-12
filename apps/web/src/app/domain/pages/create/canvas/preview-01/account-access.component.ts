import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCircleAlert, lucideLockKeyhole } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardItemImports } from '@zard/components/item';

@Component({
  selector: 'z-preview-01-account-access',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardInputComponent, ZardItemImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideArrowRight, lucideCircleAlert, lucideLockKeyhole })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Account Access" />
        <z-card-description zDescription="Update your credentials or re-authenticate." />
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-email-address">Email Address</label>
            <input z-input id="p01-email-address" type="email" value="artist@studio.inc" />
          </z-field>
          <z-field>
            <div class="flex items-center justify-between">
              <label z-field-label for="p01-current-password">Current Password</label>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground text-xs font-medium tracking-wider uppercase"
              >
                Forgot?
              </a>
            </div>
            <input z-input id="p01-current-password" type="password" value="password123" />
          </z-field>
        </z-field-group>
      </z-card-content>
      <z-card-footer class="flex-col gap-4">
        <button type="button" z-button class="w-full">
          <ng-icon name="lucideLockKeyhole" />
          Update Security
        </button>
        <a z-item href="#" zVariant="muted">
          <z-item-media zVariant="icon">
            <ng-icon name="lucideCircleAlert" class="text-destructive" />
          </z-item-media>
          <z-item-content>
            <z-item-title>Danger Zone</z-item-title>
            <p z-item-description class="line-clamp-1">Archive account and remove catalog</p>
          </z-item-content>
          <ng-icon name="lucideArrowRight" class="size-4" />
        </a>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01AccountAccessComponent {}
