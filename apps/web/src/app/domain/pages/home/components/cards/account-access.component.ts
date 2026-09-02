import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideCircleAlert, lucideLock } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardItemImports } from '@zard/components/item/item.imports';

/**
 * Acesso à conta: dois campos e uma zona de perigo.
 *
 * A zona de perigo é um `item` clicável no rodapé, e não um botão vermelho: uma
 * ação destrutiva que se parece com um botão comum de destaque convida ao clique
 * exatamente onde não se quer convidar.
 */
@Component({
  selector: 'z-card-account-access',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardItemImports, ZardInputComponent, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideChevronRight, lucideCircleAlert, lucideLock })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Account Access"></h3>
        <p z-card-description zDescription="Update your credentials or re-authenticate."></p>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="account-email">Email Address</label>
            <input z-input id="account-email" type="email" placeholder="artist@studio.inc" />
          </div>

          <div z-field>
            <div class="flex items-center justify-between">
              <label z-field-label for="account-password">Current Password</label>
              <a
                href="#"
                class="text-muted-foreground hover:text-foreground text-xs font-medium tracking-wider uppercase"
              >
                Forgot?
              </a>
            </div>
            <input z-input id="account-password" type="password" placeholder="••••••••••••••••" />
          </div>
        </div>
      </z-card-content>

      <z-card-footer class="flex-col gap-4">
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
          <ng-icon name="lucideChevronRight" class="text-muted-foreground size-4 shrink-0" />
        </a>
      </z-card-footer>
    </z-card>
  `,
})
export class CardAccountAccessComponent {}
