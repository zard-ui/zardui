import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

const FITNESS_WEEKLY_LOAD = [
  { day: 'M', load: 84 },
  { day: 'T', load: 52 },
  { day: 'W', load: 73 },
  { day: 'T', load: 66 },
  { day: 'F', load: 91 },
  { day: 'S', load: 48 },
  { day: 'S', load: 61 },
] as const;

@Component({
  selector: 'z-preview-02-weekly-fitness-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Weekly Fitness Summary" />
        <z-card-description zDescription="Calories and workout load by day" />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <div class="grid grid-cols-7 gap-1.5">
          @for (day of days; track $index) {
            <div class="ring-border rounded-md p-1.5 text-center ring">
              <div class="text-muted-foreground text-sm">{{ day.day }}</div>
              <div class="bg-muted relative mt-1 h-16 overflow-hidden rounded-sm">
                <div class="bg-chart-3 absolute inset-x-0 bottom-0 rounded-sm" [style.height.%]="day.load"></div>
              </div>
            </div>
          }
        </div>
      </z-card-content>
      <z-card-footer>
        <button type="button" z-button class="w-full">View details</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02WeeklyFitnessSummaryComponent {
  protected readonly days = FITNESS_WEEKLY_LOAD;
}
