import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardSelectImports } from '@zard/components/select';
import { ZardSliderComponent } from '@zard/components/slider';
import { ZardTextareaComponent } from '@zard/components/textarea';

import { CURRENCIES } from './currencies';

@Component({
  selector: 'z-preview-01-payout-threshold',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardFieldImports,
    ZardSelectImports,
    ZardSliderComponent,
    ZardTextareaComponent,
    ZardButtonComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Payout Threshold" />
        <z-card-description zDescription="Set the minimum balance required before a payout is triggered." />
        <z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Close">
            <ng-icon name="lucideX" />
          </button>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-preferred-currency">Preferred Currency</label>
            <z-select id="p01-preferred-currency" class="w-full" zValue="usd">
              <z-select-group>
                @for (currency of currencies; track currency.value) {
                  <z-select-item [zValue]="currency.value">{{ currency.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </z-field>
          <z-field>
            <div class="flex items-baseline justify-between">
              <label z-field-label for="p01-min-payout">Minimum Payout Amount</label>
              <span class="text-2xl font-semibold tabular-nums">\${{ amount()[0].toFixed(2) }}</span>
            </div>
            <z-slider
              id="p01-min-payout"
              [zValue]="amount()"
              (zSlideIndexChange)="amount.set($event)"
              zMin="50"
              zMax="10000"
              zStep="50"
            />
            <div class="flex items-center justify-between">
              <p z-field-description>$50 (MIN)</p>
              <p z-field-description>$10,000 (MAX)</p>
            </div>
          </z-field>
          <z-field>
            <label z-field-label for="p01-payout-notes">Notes</label>
            <textarea
              z-textarea
              id="p01-payout-notes"
              placeholder="Add any notes for this payout configuration..."
              class="min-h-[100px]"
            ></textarea>
          </z-field>
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">Save Threshold</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01PayoutThresholdComponent {
  protected readonly currencies = CURRENCIES;
  protected readonly amount = signal([2500]);
}
