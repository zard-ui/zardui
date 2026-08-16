import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartOptionOverride } from '@/shared/components/chart/chart.types';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  imports: [ZardCardImports, ZardChartImports, ZardSelectImports],
  template: `
    <z-card class="flex w-full flex-col">
      <z-card-header class="flex flex-row items-start pb-0">
        <div class="grid gap-1">
          <z-card-title zTitle="Pie Chart - Interactive" />
          <z-card-description zDescription="January - June 2024" />
        </div>
        <z-select class="ml-auto h-7 w-[130px] rounded-lg pl-2.5" [(zValue)]="active">
          @for (row of chartData; track row.month) {
            <z-select-item [zValue]="row.month" class="rounded-lg">
              <span class="flex items-center gap-2 text-xs">
                <span class="flex size-3 shrink-0 rounded-xs" [style.background-color]="row.fill"></span>
                {{ chartConfig[row.month].label }}
              </span>
            </z-select-item>
          }
        </z-select>
      </z-card-header>
      <z-card-content class="flex flex-1 justify-center pb-0">
        <z-chart
          zType="pie"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zNameKey="month"
          zInnerRadius="40%"
          zOuterRadius="80%"
          [zPadAngle]="3"
          [zOption]="activeSlice()"
          [zCenterValue]="activeValue()"
          zCenterLabel="Visitors"
          class="mx-auto aspect-square w-full max-w-[300px]"
        >
          <z-chart-tooltip zTrigger="item" zIndicator="dot" zHideLabel />
        </z-chart>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartPieInteractiveComponent {
  protected readonly chartConfig: ZardChartConfig = {
    visitors: { label: 'Visitors' },
    january: { label: 'January', color: 'var(--chart-1)' },
    february: { label: 'February', color: 'var(--chart-2)' },
    march: { label: 'March', color: 'var(--chart-3)' },
    april: { label: 'April', color: 'var(--chart-4)' },
    may: { label: 'May', color: 'var(--chart-5)' },
  };

  protected readonly chartData = [
    { month: 'january', desktop: 186, fill: 'var(--chart-1)' },
    { month: 'february', desktop: 305, fill: 'var(--chart-2)' },
    { month: 'march', desktop: 237, fill: 'var(--chart-3)' },
    { month: 'april', desktop: 173, fill: 'var(--chart-4)' },
    { month: 'may', desktop: 209, fill: 'var(--chart-5)' },
  ];

  protected readonly series = ['desktop'];

  protected readonly active = signal('january');

  protected readonly activeValue = computed(() =>
    (this.chartData.find(row => row.month === this.active())?.desktop ?? 0).toLocaleString(),
  );

  /**
   * The selected month reads bigger and gains an outer ring. ECharts sizes a pie per series, not
   * per slice, so the highlight is two more pies holding only that slice — one grown by 10px,
   * one a thin band beyond it — exactly the two `<Sector>`s shadcn draws.
   */
  protected readonly activeSlice = computed<ZardChartOptionOverride>(() => {
    const month = this.active();

    const onlyActive = (radius: [string, string]) => ({
      type: 'pie',
      radius,
      center: ['50%', '50%'],
      startAngle: 0,
      clockwise: false,
      padAngle: 3,
      silent: true,
      label: { show: false },
      labelLine: { show: false },
      data: this.chartData.map(row => ({
        value: row.desktop,
        name: row.month,
        itemStyle: { color: row.month === month ? row.fill : 'transparent' },
      })),
    });

    return {
      series: [{}, onlyActive(['40%', '86%']), onlyActive(['88%', '96%'])],
    } as unknown as ZardChartOptionOverride;
  });
}
