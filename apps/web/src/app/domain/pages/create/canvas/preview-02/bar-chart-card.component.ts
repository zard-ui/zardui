import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardChartImports } from '@zard/components/chart/chart.imports';
import type { ZardChartConfig, ZardChartSeries } from '@zard/components/chart/chart.types';

import { PreviewDesignContext } from '../../lib/preview-design.context';

const BAR_CHART_DATA = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const BAR_CHART_CONFIG: ZardChartConfig = {
  desktop: { label: 'Desktop', color: 'var(--chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--chart-2)' },
};

const DESKTOP_TOTAL = BAR_CHART_DATA.reduce((sum, item) => sum + item.desktop, 0);
const MOBILE_TOTAL = BAR_CHART_DATA.reduce((sum, item) => sum + item.mobile, 0);
const DESKTOP_DELTA = Math.round(((DESKTOP_TOTAL - MOBILE_TOTAL) / MOBILE_TOTAL) * 100);

@Component({
  selector: 'z-preview-02-bar-chart-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports, ZardChartImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Traffic channels" class="text-lg" />
        <z-card-description
          class="line-clamp-2 text-sm leading-snug"
          zDescription="Monthly desktop and mobile traffic for the last six months—compare volume and mix across platforms and devices at a glance."
        />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4 pt-0">
        <z-chart
          zType="bar"
          [zConfig]="config"
          [zData]="data"
          [zSeries]="series()"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          class="max-h-[180px] w-full"
        >
          <z-chart-tooltip zIndicator="dashed" />
          <z-chart-legend />
        </z-chart>
        <div class="divide-border/60 grid w-full grid-cols-3 divide-x">
          <div class="px-2 text-center">
            <div class="text-muted-foreground text-[0.65rem] uppercase">Desktop</div>
            <div class="text-sm font-medium tabular-nums">{{ desktopTotal }}</div>
          </div>
          <div class="px-2 text-center">
            <div class="text-muted-foreground text-[0.65rem] uppercase">Mobile</div>
            <div class="text-sm font-medium tabular-nums">{{ mobileTotal }}</div>
          </div>
          <div class="px-2 text-center">
            <div class="text-muted-foreground text-[0.65rem] uppercase">Mix Delta</div>
            <div class="text-sm font-medium tabular-nums">{{ delta }}</div>
          </div>
        </div>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">View report</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02BarChartCardComponent {
  private readonly context = inject(PreviewDesignContext);

  protected readonly config = BAR_CHART_CONFIG;
  protected readonly data = BAR_CHART_DATA;
  protected readonly desktopTotal = DESKTOP_TOTAL.toLocaleString('en-US');
  protected readonly mobileTotal = MOBILE_TOTAL.toLocaleString('en-US');
  protected readonly delta = `${DESKTOP_DELTA > 0 ? '+' : ''}${DESKTOP_DELTA}%`;

  protected readonly series = computed<ZardChartSeries[]>(() => {
    const rounded = !['lyra', 'sera'].includes(this.context.design().style);
    const radius = rounded ? [6, 6, 0, 0] : 0;
    return [
      { dataKey: 'desktop', radius },
      { dataKey: 'mobile', radius },
    ];
  });

  protected readonly shortMonth = (value: string) => String(value).slice(0, 3);
}
