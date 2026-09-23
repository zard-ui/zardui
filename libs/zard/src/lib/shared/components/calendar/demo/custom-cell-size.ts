import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-custom-cell-size',
  imports: [ZardCalendarComponent, ZardCardImports],
  template: `
    <z-card zSize="sm" class="mx-auto w-fit">
      <z-card-content>
        <z-calendar
          zMode="range"
          zCaptionLayout="dropdown"
          class="p-0 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
          [(value)]="dateRange"
        />
      </z-card-content>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarCustomCellSizeComponent {
  readonly dateRange = signal<Date[] | null>(null);
}
