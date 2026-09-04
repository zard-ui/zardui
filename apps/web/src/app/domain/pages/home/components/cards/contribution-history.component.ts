import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardItemImports } from '@zard/components/item/item.imports';

interface Contribution {
  readonly month: string;
  readonly amount: number;
}

@Component({
  selector: 'z-card-contribution-history',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardItemImports, ZardButtonComponent],
  host: { class: 'block w-full' },
  template: `
    <z-card>
      <z-card-header>
        <h3 z-card-title zTitle="Contribution History"></h3>
        <p z-card-description zDescription="Last 6 months of activity"></p>
      </z-card-header>

      <z-card-content>
        <div class="flex h-[200px] w-full items-end gap-3" role="img" aria-label="Last 6 months of contributions">
          @for (item of chartData; track item.month; let index = $index) {
            <div class="flex h-full flex-1 flex-col justify-end gap-2">
              <div [class]="barClass(index)" [style.height.%]="(item.amount / maxAmount) * 100"></div>
              <span class="text-muted-foreground text-center text-xs">{{ item.month }}</span>
            </div>
          }
        </div>
      </z-card-content>

      <z-card-content>
        <div class="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
          <z-item zVariant="muted" class="flex-col items-stretch">
            <z-item-content class="gap-1">
              <p z-item-description class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Upcoming
              </p>
              <span class="text-base font-semibold">May 2024</span>
              <span class="text-muted-foreground text-sm">Scheduled</span>
            </z-item-content>
          </z-item>

          <z-item zVariant="muted" class="hidden flex-col items-stretch xl:flex">
            <z-item-content class="gap-1">
              <p z-item-description class="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Savings Plan
              </p>
              <span class="text-base font-semibold">Accelerated</span>
              <span class="text-muted-foreground text-sm">Recurring</span>
            </z-item-content>
          </z-item>
        </div>
      </z-card-content>

      <z-card-content class="flex items-center">
        <button type="button" z-button class="w-full">View Full Report</button>
      </z-card-content>
    </z-card>
  `,
})
export class CardContributionHistoryComponent {
  readonly chartData: readonly Contribution[] = [
    { month: 'Dec', amount: 800 },
    { month: 'Jan', amount: 1100 },
    { month: 'Feb', amount: 900 },
    { month: 'Mar', amount: 1300 },
    { month: 'Apr', amount: 750 },
  ];

  readonly maxAmount = Math.max(...this.chartData.map(item => item.amount));

  private readonly barColors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5'];

  barClass(index: number): string {
    return `min-h-2 rounded-lg ${this.barColors[index % this.barColors.length]}`;
  }
}
