import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';

@Component({
  imports: [ZardCardImports, ZardChartImports, ZardButtonComponent],
  template: `
    <z-card class="w-full">
      <z-card-header>
        <z-card-title zTitle="Pie Chart - Interactive" />
        <z-card-description zDescription="Pick a browser to read its share" />
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="browser"
          zInnerRadius="60%"
          [zCenterValue]="activeValue()"
          [zCenterLabel]="activeLabel()"
          class="mx-auto aspect-square h-[250px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
      <z-card-footer class="flex-wrap gap-2">
        @for (row of chartData; track row.browser) {
          <button
            z-button
            type="button"
            [zType]="active() === row.browser ? 'default' : 'outline'"
            zSize="sm"
            (click)="select(row.browser)"
          >
            {{ chartConfig[row.browser].label }}
          </button>
        }
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartPieInteractiveComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    chrome: { label: 'Chrome', color: 'var(--chart-1)' },
    safari: { label: 'Safari', color: 'var(--chart-2)' },
    firefox: { label: 'Firefox', color: 'var(--chart-3)' },
    edge: { label: 'Edge', color: 'var(--chart-4)' },
    other: { label: 'Other', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { browser: 'chrome', visitors: 275 },
    { browser: 'safari', visitors: 200 },
    { browser: 'firefox', visitors: 187 },
    { browser: 'edge', visitors: 173 },
    { browser: 'other', visitors: 90 },
  ];

  protected readonly series = ['visitors'];

  protected readonly active = signal('chrome');

  protected readonly activeLabel = computed(() => this.chartConfig[this.active()].label ?? '');

  protected readonly activeValue = computed(
    () => `${this.chartData.find(row => row.browser === this.active())?.visitors ?? 0}`,
  );

  protected select(browser: string): void {
    this.active.set(browser);
  }
}
