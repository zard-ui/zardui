import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardChartImports } from '@/shared/components/chart/chart.imports';
import type { ZardChartConfig } from '@/shared/components/chart/chart.types';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-chart-accessibility',
  imports: [ZardCardImports, ZardChartImports, ZardSwitchComponent],
  template: `
    <z-card class="w-full">
      <z-card-header class="flex flex-row items-center justify-between gap-4">
        <div>
          <z-card-title zTitle="Accessibility" />
          <z-card-description zDescription="zAccessibility puts an ARIA role and a generated label on the canvas" />
        </div>
        <z-switch zId="chart-accessibility" [(zChecked)]="accessible">zAccessibility</z-switch>
      </z-card-header>
      <z-card-content>
        <z-chart
          zType="bar"
          [zConfig]="chartConfig"
          [zData]="chartData"
          [zSeries]="series"
          zXAxisKey="month"
          [zXAxisFormatter]="shortMonth"
          [zAccessibility]="accessible()"
          class="h-[220px] w-full"
        />
        <p class="text-muted-foreground mt-3 font-mono text-xs">
          {{ accessible() ? 'role="img" aria-label="bar chart of Desktop, Mobile"' : 'role and aria-label removed' }}
        </p>
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoChartAccessibilityComponent {
  protected readonly chartConfig: ZardChartConfig = {
    desktop: { label: 'Desktop', color: 'var(--chart-1)' },
    mobile: { label: 'Mobile', color: 'var(--chart-2)' },
  };

  protected readonly chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];

  protected readonly series = ['desktop', 'mobile'];

  protected readonly accessible = signal(true);

  protected readonly shortMonth = (value: string) => value.slice(0, 3);
}
