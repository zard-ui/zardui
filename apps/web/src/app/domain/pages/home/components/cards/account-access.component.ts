import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideCircleAlert, lucideLock } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardIdDirective } from '@zard/core';

@Component({
  selector: 'z-card-account-access',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardIdDirective,
    ZardCardImports,
    ZardFieldImports,
    ZardItemImports,
    ZardInputComponent,
    ZardButtonComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideChevronRight, lucideCircleAlert, lucideLock })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Account Access" />
        <p z-card-description zDescription="Update your credentials or re-authenticate."></p>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          <div z-field zardId="account-email" #email="zardId">
            <label z-field-label [for]="email.id()">Email Address</label>
            <input
              z-input
              [id]="email.id()"
              type="email"
              placeholder="artist@studio.inc"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              data-1p-ignore
              data-lpignore="true"
            />
          </div>

          <div z-field zardId="account-password" #password="zardId">
            <div class="flex items-center justify-between">
              <label z-field-label [for]="password.id()">Current Password</label>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground text-xs font-medium tracking-wider uppercase"
              >
                Forgot?
              </a>
            </div>
            <input
              z-input
              [id]="password.id()"
              type="password"
              placeholder="••••••••••••••••"
              autocomplete="new-password"
              data-1p-ignore
              data-lpignore="true"
            />
          </div>
        </div>
      </z-card-content>

      <z-card-content class="flex flex-col gap-4">
        <button type="button" z-button class="w-full">
          <ng-icon name="lucideLock" />
          Update Security
        </button>

        <a z-item href="#" zVariant="muted" class="w-full">
          <div z-item-media zVariant="icon">
            <ng-icon name="lucideCircleAlert" class="text-destructive" />
          </div>
          <div z-item-content>
            <div z-item-title>Danger Zone</div>
            <p z-item-description class="line-clamp-1">Archive account and remove catalog</p>
          </div>
          <ng-icon name="lucideChevronRight" class="size-4 shrink-0" />
        </a>
      </z-card-content>
    </z-card>
  `,
})
export class CardAccountAccessComponent {}
