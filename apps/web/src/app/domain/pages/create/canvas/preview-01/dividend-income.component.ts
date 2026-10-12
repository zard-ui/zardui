import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardChartImports, type ZardChartConfig, type ZardChartOptionOverride } from '@zard/components/chart';
import { ZardItemImports } from '@zard/components/item';

import { injectRoundedBars } from './rounded-bars';

const HOLDINGS = [
  {
    name: 'Vanguard VIG',
    shares: '450 Shares',
    amount: '$1,842.10',
    data: [
      { q: 'Q1', value: 380 },
      { q: 'Q2', value: 420 },
      { q: 'Q3', value: 390 },
      { q: 'Q4', value: 652 },
    ],
  },
  {
    name: 'S&P 500 VOO',
    shares: '112 Shares',
    amount: '$928.40',
    data: [
      { q: 'Q1', value: 180 },
      { q: 'Q2', value: 210 },
      { q: 'Q3', value: 320 },
      { q: 'Q4', value: 218 },
    ],
  },
  {
    name: 'Apple AAPL',
    shares: '85 Shares',
    amount: '$340.00',
    data: [
      { q: 'Q1', value: 60 },
      { q: 'Q2', value: 70 },
      { q: 'Q3', value: 120 },
      { q: 'Q4', value: 90 },
    ],
  },
  {
    name: 'Realty Income',
    shares: '320 Shares',
    amount: '$1,139.50',
    data: [
      { q: 'Q1', value: 240 },
      { q: 'Q2', value: 260 },
      { q: 'Q3', value: 280 },
      { q: 'Q4', value: 360 },
    ],
  },
] as const;

const MINI_CHART_CONFIG: ZardChartConfig = {
  value: { label: 'Dividend', color: 'var(--chart-2)' },
};

const MINI_CHART_OPTION: ZardChartOptionOverride = {
  grid: { left: 0, right: 0, top: 0, bottom: 0 },
};

@Component({
  selector: 'z-preview-01-dividend-income',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardChartImports, ZardItemImports, ZardButtonComponent, NgIcon],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Q2 Dividend Income" />
        <z-card-description zDescription="Quarterly dividend payouts across your portfolio holdings." />
        <z-card-action>
          <button type="button" z-button zType="ghost" zSize="icon-sm" class="bg-muted" aria-label="Close">
            <ng-icon name="lucideX" />
          </button>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <z-item-group>
          @for (holding of holdings; track holding.name) {
            <z-item zVariant="muted">
              <z-item-content>
                <z-item-title>{{ holding.name }}</z-item-title>
                <p z-item-description>{{ holding.shares }}</p>
              </z-item-content>
              <z-chart
                zType="bar"
                [zConfig]="config"
                [zData]="holding.data"
                [zSeries]="series()"
                zXAxisKey="q"
                [zXAxis]="false"
                [zGrid]="false"
                [zOption]="option"
                class="hidden h-8 w-24 md:block"
              >
                <z-chart-tooltip zHideLabel />
              </z-chart>
              <span class="hidden text-sm font-semibold tabular-nums md:block">{{ holding.amount }}</span>
            </z-item>
          }
        </z-item-group>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01DividendIncomeComponent {
  private readonly rounded = injectRoundedBars();

  protected readonly holdings = HOLDINGS;
  protected readonly config = MINI_CHART_CONFIG;
  protected readonly option = MINI_CHART_OPTION;
  protected readonly series = computed(() => [{ dataKey: 'value', radius: this.rounded() ? [3, 3, 0, 0] : 0 }]);
}
