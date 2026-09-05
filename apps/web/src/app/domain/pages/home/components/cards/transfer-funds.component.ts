import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardSelectItemComponent } from '@zard/components/select/select-item.component';
import { ZardSelectComponent } from '@zard/components/select/select.component';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';
import { ZardIdDirective } from '@zard/core';

interface Account {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'z-card-transfer-funds',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardIdDirective,
    ZardCardImports,
    ZardFieldImports,
    ZardItemImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardSelectComponent,
    ZardSelectItemComponent,
    ZardSeparatorComponent,
    ZardButtonComponent,
    NgIcon,
  ],
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Transfer Funds" />
        <p z-card-description zDescription="Move money between your connected accounts."></p>
        <div z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Dismiss">
            <ng-icon name="lucideX" />
          </button>
        </div>
      </z-card-header>

      <z-card-content>
        <div z-field-group>
          <div z-field zardId="transfer-amount" #amount="zardId">
            <label z-field-label [for]="amount.id()">Amount to Transfer</label>
            <z-input-group>
              <z-input-group-addon>
                <z-input-group-text>$</z-input-group-text>
              </z-input-group-addon>
              <input z-input [id]="amount.id()" value="1,200.00" />
            </z-input-group>
          </div>

          <div z-field>
            <label z-field-label for="transfer-from">From Account</label>
            <z-select id="transfer-from" class="w-full" [zValue]="'checking'">
              @for (account of fromAccounts; track account.value) {
                <z-select-item [zValue]="account.value">{{ account.label }}</z-select-item>
              }
            </z-select>
          </div>

          <div z-field>
            <label z-field-label for="transfer-to">To Account</label>
            <z-select id="transfer-to" class="w-full" [zValue]="'savings'">
              @for (account of toAccounts; track account.value) {
                <z-select-item [zValue]="account.value">{{ account.label }}</z-select-item>
              }
            </z-select>
          </div>

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
        </div>
      </z-card-content>

      <z-card-content class="flex items-center">
        <button type="button" z-button class="w-full">Confirm Transfer</button>
      </z-card-content>
    </z-card>
  `,
})
export class CardTransferFundsComponent {
  readonly fromAccounts: readonly Account[] = [
    { value: 'checking', label: 'Main Checking (··8402) — $12,450.00' },
    { value: 'business', label: 'Business (··7731) — $8,920.00' },
  ];

  readonly toAccounts: readonly Account[] = [
    { value: 'savings', label: 'High Yield Savings (··1192) — $42,100.00' },
    { value: 'investment', label: 'Investment (··3349) — $18,200.00' },
  ];
}
