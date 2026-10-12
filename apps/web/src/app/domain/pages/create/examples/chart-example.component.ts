import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

import { ZardCardImports } from '@zard/components/card';
import {
  ZardChartImports,
  type ZardChartConfig,
  type ZardChartOptionOverride,
  type ZardChartSeries,
} from '@zard/components/chart';

import { ExampleImports } from './example.component';
import { injectRoundedBars } from '../canvas/preview-01/rounded-bars';

const MONTHLY_DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
] as const;

const AREA_CHART_DATA = MONTHLY_DATA.map(({ month, desktop }) => ({ month, desktop }));

const AREA_CHART_CONFIG: ZardChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
};

const DESKTOP_MOBILE_CONFIG: ZardChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};

const PIE_CHART_DATA = [
  { browser: 'chrome', visitors: 275 },
  { browser: 'safari', visitors: 200 },
  { browser: 'firefox', visitors: 287 },
  { browser: 'edge', visitors: 173 },
  { browser: 'other', visitors: 190 },
] as const;

const PIE_CHART_CONFIG: ZardChartConfig = {
  visitors: { label: 'Visitors' },
  chrome: { label: 'Chrome', color: 'var(--chart-1)' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
  firefox: { label: 'Firefox', color: 'var(--chart-3)' },
  edge: { label: 'Edge', color: 'var(--chart-4)' },
  other: { label: 'Other', color: 'var(--chart-5)' },
};

const RADIAL_CHART_DATA = [{ browser: 'safari', visitors: 1260 }] as const;

const RADIAL_CHART_CONFIG: ZardChartConfig = {
  visitors: { label: 'Visitors' },
  safari: { label: 'Safari', color: 'var(--chart-2)' },
};

/**
 * The two discs shadcn paints behind the radial bar (`PolarGrid` with `first:fill-muted last:fill-background` at
 * radii 86 and 74 in a 210px box), as plain pie series under the chart's own.
 */
function radialDisc(radius: string, color: string) {
  return {
    type: 'pie',
    radius: ['0%', radius],
    center: ['50%', '50%'],
    data: [{ value: 1 }],
    itemStyle: { color },
    label: { show: false },
    labelLine: { show: false },
    silent: true,
    animation: false,
    z: 0,
  };
}

const RADIAL_BACKDROP = {
  series: [{}, radialDisc('82%', 'var(--muted)'), radialDisc('70%', 'var(--background)')],
} as unknown as ZardChartOptionOverride;

/** shadcn/ui's `chart-example`, in zard: the same charts and data, drawn by zard's ECharts-based `z-chart`. */
@Component({
  selector: 'z-chart-example',
  imports: [ExampleImports, NgIcon, ZardCardImports, ZardChartImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideTrendingUp })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Area Chart">
        <z-card class="w-full">
          <z-card-header>
            <z-card-title zTitle="Area Chart" />
            <z-card-description zDescription="Showing total visitors for the last 6 months" />
          </z-card-header>
          <z-card-content>
            <z-chart
              zType="area"
              class="w-full"
              zXAxisKey="month"
              [zConfig]="areaConfig"
              [zData]="areaData"
              [zSeries]="areaSeries"
              [zXAxisFormatter]="shortMonth"
            >
              <z-chart-tooltip zIndicator="line" />
            </z-chart>
          </z-card-content>
          <z-card-footer>
            <div class="flex w-full items-start gap-2">
              <div class="grid gap-2">
                <div class="flex items-center gap-2 leading-none font-medium">
                  Trending up by 5.2% this month
                  <ng-icon name="lucideTrendingUp" class="size-4" />
                </div>
                <div class="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>
              </div>
            </div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Bar Chart">
        <z-card class="w-full">
          <z-card-header>
            <z-card-title zTitle="Bar Chart - Multiple" />
            <z-card-description zDescription="January - June 2024" />
          </z-card-header>
          <z-card-content>
            <z-chart
              zType="bar"
              class="w-full"
              zXAxisKey="month"
              [zConfig]="desktopMobileConfig"
              [zData]="monthlyData"
              [zSeries]="barSeries()"
              [zXAxisFormatter]="shortMonth"
            >
              <z-chart-tooltip zIndicator="dashed" />
            </z-chart>
          </z-card-content>
          <z-card-footer class="flex-col items-start gap-2">
            <div class="flex gap-2 leading-none font-medium">
              Trending up by 5.2% this month
              <ng-icon name="lucideTrendingUp" class="size-4" />
            </div>
            <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Line Chart">
        <z-card class="w-full">
          <z-card-header>
            <z-card-title zTitle="Line Chart - Multiple" />
            <z-card-description zDescription="January - June 2024" />
          </z-card-header>
          <z-card-content>
            <z-chart
              zType="line"
              class="w-full"
              zXAxisKey="month"
              [zConfig]="desktopMobileConfig"
              [zData]="monthlyData"
              [zSeries]="lineSeries"
              [zXAxisFormatter]="shortMonth"
            >
              <z-chart-tooltip />
            </z-chart>
          </z-card-content>
          <z-card-footer>
            <div class="flex w-full items-start gap-2">
              <div class="grid gap-2">
                <div class="flex items-center gap-2 leading-none font-medium">
                  Trending up by 5.2% this month
                  <ng-icon name="lucideTrendingUp" class="size-4" />
                </div>
                <div class="text-muted-foreground flex items-center gap-2 leading-none">
                  Showing total visitors for the last 6 months
                </div>
              </div>
            </div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Pie Chart">
        <z-card class="w-full">
          <z-card-header class="items-center pb-0">
            <z-card-title zTitle="Pie Chart - Donut with Text" />
            <z-card-description zDescription="January - June 2024" />
          </z-card-header>
          <z-card-content class="flex-1 pb-0">
            <z-chart
              zType="pie"
              class="mx-auto aspect-square max-h-[250px]"
              zNameKey="browser"
              zInnerRadius="48%"
              zCenterLabel="Visitors"
              [zCenterValue]="totalVisitors"
              [zConfig]="pieConfig"
              [zData]="pieData"
              [zSeries]="visitorsSeries"
            >
              <z-chart-tooltip zTrigger="item" zHideLabel />
            </z-chart>
          </z-card-content>
          <z-card-footer class="flex-col gap-2">
            <div class="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month
              <ng-icon name="lucideTrendingUp" class="size-4" />
            </div>
            <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Radial Chart">
        <z-card class="w-full">
          <z-card-header>
            <z-card-title zTitle="Radial Chart - Shape" />
            <z-card-description zDescription="January - June 2024" />
          </z-card-header>
          <z-card-content class="flex-1 pb-0">
            <z-chart
              zType="radial"
              class="mx-auto aspect-square max-h-[210px]"
              zNameKey="browser"
              zInnerRadius="61%"
              zOuterRadius="90%"
              zCenterValue="1,260"
              zCenterLabel="Visitors"
              [zStartAngle]="0"
              [zEndAngle]="100"
              [zOption]="radialBackdrop"
              [zConfig]="radialConfig"
              [zData]="radialData"
              [zSeries]="visitorsSeries"
            >
              <z-chart-tooltip zTrigger="item" zHideLabel />
            </z-chart>
          </z-card-content>
          <z-card-footer class="flex-col gap-2">
            <div class="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month
              <ng-icon name="lucideTrendingUp" class="size-4" />
            </div>
            <div class="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
          </z-card-footer>
        </z-card>
      </z-example>

      <z-example zTitle="Radar Chart">
        <z-card class="w-full">
          <z-card-header class="items-center pb-4">
            <z-card-title zTitle="Radar Chart - Multiple" />
            <z-card-description zDescription="Showing total visitors for the last 6 months" />
          </z-card-header>
          <z-card-content class="pb-0">
            <z-chart
              zType="radar"
              class="mx-auto aspect-square max-h-[250px]"
              zNameKey="month"
              [zConfig]="desktopMobileConfig"
              [zData]="monthlyData"
              [zSeries]="radarSeries"
            >
              <z-chart-tooltip zTrigger="item" zIndicator="line" />
            </z-chart>
          </z-card-content>
          <z-card-footer class="flex-col gap-2">
            <div class="flex items-center gap-2 leading-none font-medium">
              Trending up by 5.2% this month
              <ng-icon name="lucideTrendingUp" class="size-4" />
            </div>
            <div class="text-muted-foreground flex items-center gap-2 leading-none">January - June 2024</div>
          </z-card-footer>
        </z-card>
      </z-example>
    </z-example-wrapper>
  `,
})
export class ChartExampleComponent {
  private readonly rounded = injectRoundedBars();

  protected readonly monthlyData = MONTHLY_DATA;
  protected readonly desktopMobileConfig = DESKTOP_MOBILE_CONFIG;

  protected readonly areaData = AREA_CHART_DATA;
  protected readonly areaConfig = AREA_CHART_CONFIG;
  protected readonly areaSeries: ZardChartSeries[] = [{ dataKey: 'desktop', smooth: true, fillOpacity: 0.4 }];

  protected readonly barSeries = computed<ZardChartSeries[]>(() => {
    const radius = this.rounded() ? 4 : 0;
    return [
      { dataKey: 'desktop', radius },
      { dataKey: 'mobile', radius },
    ];
  });

  protected readonly lineSeries: ZardChartSeries[] = [
    { dataKey: 'desktop', smooth: true, strokeWidth: 2, showSymbol: false },
    { dataKey: 'mobile', smooth: true, strokeWidth: 2, showSymbol: false },
  ];

  protected readonly pieData = PIE_CHART_DATA;
  protected readonly pieConfig = PIE_CHART_CONFIG;
  protected readonly totalVisitors = PIE_CHART_DATA.reduce((acc, curr) => acc + curr.visitors, 0).toLocaleString(
    'en-US',
  );

  protected readonly radialData = RADIAL_CHART_DATA;
  protected readonly radialConfig = RADIAL_CHART_CONFIG;
  protected readonly radialBackdrop = RADIAL_BACKDROP;
  protected readonly visitorsSeries = ['visitors'] as const;

  // recharts leaves the second radar's fill fully opaque; only the first gets `fillOpacity={0.6}`.
  protected readonly radarSeries: ZardChartSeries[] = [
    { dataKey: 'desktop', fillOpacity: 0.6 },
    { dataKey: 'mobile', fillOpacity: 1 },
  ];

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
