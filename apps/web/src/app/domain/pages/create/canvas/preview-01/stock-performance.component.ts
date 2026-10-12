import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardCardImports } from '@zard/components/card';
import {
  ZardChartImports,
  type ZardChartConfig,
  type ZardChartOptionOverride,
  type ZardChartSeries,
} from '@zard/components/chart';
import { ZardComboboxImports } from '@zard/components/combobox';
import { ZardFieldImports } from '@zard/components/field';
import { ZardSeparatorComponent } from '@zard/components/separator';

const TICKERS = ['VOO', 'VIG', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'] as const;

const CHART_DATA: Record<string, readonly { month: string; price: number }[]> = {
  VOO: [
    { month: 'Jan', price: 412 },
    { month: 'Feb', price: 438 },
    { month: 'Mar', price: 395 },
    { month: 'Apr', price: 450 },
    { month: 'May', price: 420 },
    { month: 'Jun', price: 462 },
  ],
  AAPL: [
    { month: 'Jan', price: 185 },
    { month: 'Feb', price: 210 },
    { month: 'Mar', price: 172 },
    { month: 'Apr', price: 198 },
    { month: 'May', price: 178 },
    { month: 'Jun', price: 215 },
  ],
};

const DEFAULT_DATA = [
  { month: 'Jan', price: 100 },
  { month: 'Feb', price: 118 },
  { month: 'Mar', price: 95 },
  { month: 'Apr', price: 125 },
  { month: 'May', price: 108 },
  { month: 'Jun', price: 130 },
] as const;

const CHART_CONFIG: ZardChartConfig = {
  price: { label: 'Price', color: 'var(--chart-1)' },
};

const CHART_SERIES: ZardChartSeries[] = [{ dataKey: 'price', smooth: true, strokeWidth: 2 }];

/** shadcn's `fillPrice` gradient (30% at the top) and its dashed horizontal grid, through ECharts. */
const CHART_OPTION: ZardChartOptionOverride = {
  grid: { left: 0, right: 0, top: 8, bottom: 0 },
  yAxis: { splitLine: { lineStyle: { type: [3, 3] } } },
  series: [
    {
      areaStyle: {
        opacity: 0.3,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'var(--chart-1)' },
            { offset: 1, color: 'transparent' },
          ],
        },
      },
    },
  ],
};

@Component({
  selector: 'z-preview-01-stock-performance',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardChartImports, ZardComboboxImports, ZardFieldImports, ZardSeparatorComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Stock Performance" />
        <z-card-description zDescription="6-month price history." />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <z-field-group>
          <z-field>
            <label z-field-label for="p01-ticker-select">Ticker</label>
            <z-combobox [zValue]="ticker()" (zValueChange)="selectTicker($event)">
              <z-combobox-input id="p01-ticker-select" placeholder="Search ticker..." />
              <z-combobox-content>
                <z-combobox-empty>No tickers found.</z-combobox-empty>
                <z-combobox-list>
                  @for (item of tickers; track item) {
                    <z-combobox-item [zValue]="item">{{ item }}</z-combobox-item>
                  }
                </z-combobox-list>
              </z-combobox-content>
            </z-combobox>
          </z-field>
        </z-field-group>
        <z-separator class="style-sera:hidden" />
        <z-chart
          zType="area"
          [zConfig]="config"
          [zData]="data()"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxis]="false"
          zGrid="horizontal"
          [zOption]="option"
          class="h-[200px] w-full"
        >
          <z-chart-tooltip zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01StockPerformanceComponent {
  protected readonly tickers = TICKERS;
  protected readonly config = CHART_CONFIG;
  protected readonly series = CHART_SERIES;
  protected readonly option = CHART_OPTION;
  protected readonly ticker = signal('VOO');
  protected readonly data = computed(() => CHART_DATA[this.ticker()] ?? DEFAULT_DATA);

  protected selectTicker(value: string | string[] | null): void {
    if (typeof value === 'string') this.ticker.set(value);
  }
}
