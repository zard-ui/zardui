import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardRadioGroupImports } from '@zard/components/radio-group';

@Component({
  selector: 'z-preview-01-receiving-method',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardFieldImports, ZardInputComponent, ZardRadioGroupImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-description zDescription="Payout Preferences" />
        <z-card-title zTitle="Receiving Method" />
        <z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Close">
            <ng-icon name="lucideX" />
          </button>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-account-holder">Account Holder Name</label>
            <input z-input id="p01-account-holder" value="Synthetic Horizons Music LLC" />
          </z-field>
          <fieldset z-field-set>
            <legend z-field-legend zVariant="label">Receiving Method</legend>
            <z-radio-group
              [(value)]="method"
              class="style-sera:grid-cols-1 grid grid-cols-1 items-start gap-3 md:grid-cols-2"
            >
              <label z-field-label for="p01-method-bank">
                <z-field zOrientation="horizontal" class="pb-2.5">
                  <z-radio value="bank" zId="p01-method-bank" />
                  <z-field-content>
                    <div z-field-title>Bank Transfer</div>
                    <p z-field-description>SWIFT / IBAN</p>
                  </z-field-content>
                </z-field>
              </label>
              <label z-field-label for="p01-method-paypal">
                <z-field zOrientation="horizontal" class="pb-2.5">
                  <z-radio value="paypal" zId="p01-method-paypal" />
                  <z-field-content>
                    <div z-field-title>PayPal</div>
                    <p z-field-description class="line-clamp-1">Instant Payout</p>
                  </z-field-content>
                </z-field>
              </label>
            </z-radio-group>
          </fieldset>
          <z-field>
            <label z-field-label for="p01-iban">IBAN / Account Number</label>
            <input z-input id="p01-iban" placeholder="DE89 3704 0044 ...." />
          </z-field>
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full" zDisabled>Save Payout Settings</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01ReceivingMethodComponent {
  protected readonly method = signal<unknown>('bank');
}
