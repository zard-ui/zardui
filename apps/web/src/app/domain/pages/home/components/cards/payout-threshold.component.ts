import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardProgressComponent } from '@zard/components/progress/progress.component';
import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSelectComponent } from '@zard/components/select/select.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';
import { ZardIdDirective } from '@zard/core';

interface Currency {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'z-card-payout-threshold',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardIdDirective,
    ZardCardImports,
    ZardFieldImports,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardProgressComponent,
    ZardTextareaComponent,
    ZardButtonComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Payout Threshold" />
        <p z-card-description zDescription="Set the minimum balance required before a payout is triggered."></p>
        <div z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Dismiss">
            <ng-icon name="lucideX" />
          </button>
        </div>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          <div z-field zardId="payout-currency" #currency="zardId">
            <label z-field-label [for]="currency.id()">Preferred Currency</label>
            <z-select [id]="currency.id()" class="w-full" [zValue]="'usd'">
              @for (currency of currencies; track currency.value) {
                <z-select-item [zValue]="currency.value">{{ currency.label }}</z-select-item>
              }
            </z-select>
          </div>

          <div z-field zardId="payout-minimum" #minimum="zardId">
            <div class="flex items-baseline justify-between">
              <div z-field-title [id]="minimum.id()">Minimum Payout Amount</div>
              <span class="text-2xl font-semibold tabular-nums">$2500.00</span>
            </div>
            <z-progress [value]="25" [attr.aria-labelledby]="minimum.id()" />
            <div class="flex items-center justify-between">
              <p z-field-description>$50 (MIN)</p>
              <p z-field-description>$10,000 (MAX)</p>
            </div>
          </div>

          <div z-field zardId="payout-notes" #notes="zardId">
            <label z-field-label [for]="notes.id()">Notes</label>
            <textarea
              z-textarea
              [id]="notes.id()"
              class="min-h-[100px] resize-none"
              placeholder="Add any notes for this payout configuration..."
            ></textarea>
          </div>
        </div>
      </z-card-content>

      <z-card-content class="flex items-center">
        <button type="button" z-button class="w-full">Save Threshold</button>
      </z-card-content>
    </z-card>
  `,
})
export class CardPayoutThresholdComponent {
  readonly currencies: readonly Currency[] = [
    { value: 'usd', label: 'USD — United States Dollar' },
    { value: 'eur', label: 'EUR — Euro' },
    { value: 'gbp', label: 'GBP — British Pound' },
    { value: 'jpy', label: 'JPY — Japanese Yen' },
  ];
}
