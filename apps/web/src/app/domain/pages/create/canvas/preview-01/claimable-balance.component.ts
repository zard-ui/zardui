import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCardImports } from '@zard/components/card';
import { ZardItemImports } from '@zard/components/item';
import { ZardSeparatorComponent } from '@zard/components/separator';

@Component({
  selector: 'z-preview-01-claimable-balance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardBadgeComponent, ZardSeparatorComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-description zDescription="Claimable Balance" />
        <z-card-title class="text-5xl tabular-nums" zTitle="$0.00" />
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
              <span class="text-sm font-medium tabular-nums">$0.00</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-sm">Processing Fee</span>
              <span class="text-sm font-medium tabular-nums">-$0.00</span>
            </div>
            <z-separator />
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground text-sm">Total Ready to Claim</span>
              <span class="text-sm font-semibold tabular-nums">$0.00 USD</span>
            </div>
          </z-item-content>
        </z-item>
      </z-card-content>
      <z-card-footer>
        <z-card-description
          zDescription="Once your bank is connected, balances over $10.00 are automatically eligible for monthly distribution on the 15th of each month."
        />
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01ClaimableBalanceComponent {}
