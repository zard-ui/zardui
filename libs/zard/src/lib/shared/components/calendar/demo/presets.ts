import { Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';

import { ZardCalendarComponent } from '../calendar.component';

interface CalendarPreset {
  label: string;
  days: number;
}

const PRESETS: CalendarPreset[] = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
];

@Component({
  selector: 'z-demo-calendar-presets',
  imports: [ZardCalendarComponent, ZardButtonComponent, ZardCardImports],
  standalone: true,
  template: `
    <z-card zSize="sm" class="mx-auto w-fit max-w-[300px]">
      <z-card-content>
        <z-calendar zMode="single" class="p-0 [--cell-size:--spacing(9.5)]" [(value)]="selectedDate" />
      </z-card-content>
      <z-card-footer zFooterBorder class="flex flex-wrap gap-2">
        @for (preset of presets; track preset.days) {
          <button z-button type="button" zType="outline" zSize="sm" class="flex-1" (click)="selectPreset(preset)">
            {{ preset.label }}
          </button>
        }
      </z-card-footer>
    </z-card>
  `,
})
export class ZardDemoCalendarPresetsComponent {
  readonly presets = PRESETS;
  readonly selectedDate = signal<Date | null>(new Date());

  selectPreset(preset: CalendarPreset): void {
    const date = new Date();
    date.setDate(date.getDate() + preset.days);
    this.selectedDate.set(date);
  }
}
