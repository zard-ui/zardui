import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button';
import { ZardCardImports } from '@zard/components/card';
import { ZardChartImports, type ZardChartConfig, type ZardChartOptionOverride } from '@zard/components/chart';
import { ZardItemImports } from '@zard/components/item';

import { injectRoundedBars } from './rounded-bars';

const CHART_DATA = [
  { month: 'Dec', amount: 800 },
  { month: 'Jan', amount: 1100 },
  { month: 'Feb', amount: 900 },
  { month: 'Mar', amount: 1300 },
  { month: 'Apr', amount: 750 },
  { month: 'May', amount: 1400 },
] as const;

const CHART_CONFIG: ZardChartConfig = {
  amount: { label: 'Contribution', color: 'var(--chart-2)' },
};

const CHART_OPTION: ZardChartOptionOverride = {
  grid: { left: 0, right: 0, top: 8, bottom: 0 },
  series: [{ barMaxWidth: 40 }],
};

@Component({
  selector: 'z-preview-01-contribution-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardChartImports, ZardItemImports, ZardButtonComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Contribution History" />
        <z-card-description zDescription="Last 6 months of activity" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series()"
          zXAxisKey="month"
          [zGrid]="false"
          [zOption]="option"
          class="h-[200px] w-full"
        >
          <z-chart-tooltip zHideLabel class="min-w-40" />
        </z-chart>
      </z-card-content>
      <z-card-content>
        <div class="grid w-full grid-cols-1 gap-3 md:grid-cols-2">
          <z-item zVariant="muted" class="flex-col items-stretch">
            <z-item-content class="gap-1">
              <p z-item-description class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Upcoming
              </p>
              <span class="cn-font-heading text-lg font-semibold">May 25, 2024</span>
              <span class="text-muted-foreground text-sm">$1,000 scheduled</span>
            </z-item-content>
          </z-item>
          <z-item zVariant="muted" class="flex-col items-stretch">
            <z-item-content class="gap-1">
              <p z-item-description class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Auto-Save Plan
              </p>
              <span class="cn-font-heading text-lg font-semibold">Accelerated</span>
              <span class="text-muted-foreground text-sm">Recurring weekly</span>
            </z-item-content>
          </z-item>
        </div>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">View Full Report</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview01ContributionHistoryComponent {
  private readonly rounded = injectRoundedBars();

  protected readonly data = CHART_DATA;
  protected readonly config = CHART_CONFIG;
  protected readonly option = CHART_OPTION;
  protected readonly series = computed(() => [{ dataKey: 'amount', radius: this.rounded() ? [6, 6, 0, 0] : 0 }]);
}
