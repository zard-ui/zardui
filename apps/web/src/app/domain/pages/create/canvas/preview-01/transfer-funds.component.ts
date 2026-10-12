import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardFieldImports } from '@zard/components/field';
import { ZardInputComponent } from '@zard/components/input';
import { ZardInputGroupImports } from '@zard/components/input-group';
import { ZardItemImports } from '@zard/components/item';
import { ZardSelectImports } from '@zard/components/select';
import { ZardSeparatorComponent } from '@zard/components/separator';

const FROM_ACCOUNTS = [
  { value: 'checking', label: 'Main Checking (··8402) — $12,450.00' },
  { value: 'business', label: 'Business (··7731) — $8,920.00' },
] as const;

const TO_ACCOUNTS = [
  { value: 'savings', label: 'High Yield Savings (··1192) — $42,100.00' },
  { value: 'investment', label: 'Investment (··3349) — $18,200.00' },
] as const;

@Component({
  selector: 'z-preview-01-transfer-funds',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardSelectImports,
    ZardItemImports,
    ZardSeparatorComponent,
    ZardButtonComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Transfer Funds" />
        <z-card-description zDescription="Move money between your connected accounts." />
        <z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Close">
            <ng-icon name="lucideX" />
          </button>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-transfer-amount">Amount to Transfer</label>
            <z-input-group>
              <input z-input id="p01-transfer-amount" value="1,200.00" />
              <z-input-group-addon>
                <span z-input-group-text>$</span>
              </z-input-group-addon>
            </z-input-group>
          </z-field>
          <z-field>
            <label z-field-label for="p01-from-account">From Account</label>
            <z-select id="p01-from-account" class="w-full" zValue="checking">
              <z-select-group>
                @for (account of fromAccounts; track account.value) {
                  <z-select-item [zValue]="account.value">{{ account.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </z-field>
          <z-field>
            <label z-field-label for="p01-to-account">To Account</label>
            <z-select id="p01-to-account" class="w-full" zValue="savings">
              <z-select-group>
                @for (account of toAccounts; track account.value) {
                  <z-select-item [zValue]="account.value">{{ account.label }}</z-select-item>
                }
              </z-select-group>
            </z-select>
          </z-field>
          <z-item zVariant="muted" class="flex-col items-stretch">
            <z-item-content class="gap-3">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-sm">Estimated arrival</span>
                <span class="text-sm font-medium">Today, Apr 14</span>
              </div>
              <z-separator />
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground text-sm">Transaction fee</span>
                <span class="text-sm font-medium tabular-nums">$0.00</span>
              </div>
              <z-separator />
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium">Total amount</span>
                <span class="text-sm font-semibold tabular-nums">$1,200.00</span>
              </div>
            </z-item-content>
          </z-item>
        </z-field-group>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">Confirm Transfer</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01TransferFundsComponent {
  protected readonly fromAccounts = FROM_ACCOUNTS;
  protected readonly toAccounts = TO_ACCOUNTS;
}
