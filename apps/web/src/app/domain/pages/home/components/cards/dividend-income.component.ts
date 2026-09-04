import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';

interface Holding {
  readonly name: string;
  readonly shares: string;
  readonly bars: readonly number[];
}

@Component({
  selector: 'z-card-dividend-income',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Q2 Dividend Income"></h3>
        <p z-card-description zDescription="Quarterly dividend payouts across your portfolio holdings."></p>
        <div z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Dismiss">
            <ng-icon name="lucideX" />
          </button>
        </div>
      </z-card-header>

      <z-card-content>
        <div z-item-group role="list">
          @for (holding of holdings; track holding.name) {
            <z-item role="listitem" zVariant="muted">
              <z-item-content>
                <div z-item-title>{{ holding.name }}</div>
                <p z-item-description>{{ holding.shares }}</p>
              </z-item-content>
              <div
                class="hidden h-8 w-24 items-end gap-1 md:flex"
                role="img"
                [attr.aria-label]="holding.name + ' quarterly dividends'"
              >
                @for (bar of holding.bars; track $index) {
                  <div class="bg-chart-2 min-h-1 flex-1 rounded-t-sm" [style.height.%]="height(holding, bar)"></div>
                }
              </div>
            </z-item>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class CardDividendIncomeComponent {
  readonly holdings: readonly Holding[] = [
    { name: 'Vanguard', shares: '450 Shares', bars: [380, 420, 390, 652] },
    { name: 'S&P 500 VOO', shares: '112 Shares', bars: [180, 210, 320, 218] },
    { name: 'Apple AAPL', shares: '85 Shares', bars: [60, 70, 120, 90] },
    { name: 'Realty Income', shares: '320 Shares', bars: [240, 260, 280, 360] },
  ];

  height(holding: Holding, bar: number): number {
    return (bar / Math.max(...holding.bars)) * 100;
  }
}
