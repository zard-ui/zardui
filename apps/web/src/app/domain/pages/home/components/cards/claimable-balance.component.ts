import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';
import { ZardSeparatorComponent } from '@zard/components/separator/separator.component';

const NET_ROYALTIES = 1248.75;
const PROCESSING_FEE = 37.46;

const formatCurrency = (amount: number) =>
  amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

@Component({
  selector: 'z-card-claimable-balance',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardBadgeComponent, ZardSeparatorComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <p z-card-description zDescription="Claimable Balance"></p>
        <z-card-title class="text-4xl! tabular-nums" [zTitle]="'$' + total" />
        <z-badge zType="outline">
          <span class="size-2 rounded-full bg-yellow-500"></span>
          Pending Setup
        </z-badge>
      </z-card-header>

      <z-card-content class="flex flex-1 flex-col justify-end">
        <z-item zVariant="muted" class="flex-col items-stretch">
          <z-item-content class="gap-3">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-sm">Net Royalties</span>
              <span class="text-sm font-medium tabular-nums">\${{ netRoyalties }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-sm">Processing Fee</span>
              <span class="text-sm font-medium tabular-nums">-\${{ processingFee }}</span>
            </div>
            <z-separator />
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-sm">Total Ready to Claim</span>
              <span class="text-sm font-semibold tabular-nums">\${{ total }} USD</span>
            </div>
          </z-item-content>
        </z-item>
      </z-card-content>

      <z-card-content class="flex items-center">
        <p
          z-card-description
          zDescription="Once your bank is connected, balances over $10.00 are automatically eligible for monthly distribution on the 15th of each month."
        ></p>
      </z-card-content>
    </z-card>
  `,
})
export class CardClaimableBalanceComponent {
  readonly netRoyalties = formatCurrency(NET_ROYALTIES);
  readonly processingFee = formatCurrency(PROCESSING_FEE);
  readonly total = formatCurrency(NET_ROYALTIES - PROCESSING_FEE);
}
