import { Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClock2 } from '@ng-icons/lucide';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';

import { ZardCalendarComponent } from '../calendar.component';

@Component({
  selector: 'z-demo-calendar-with-time',
  imports: [
    ZardCalendarComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputGroupImports,
    ZardInputComponent,
    NgIcon,
  ],
  standalone: true,
  template: `
    <z-card zSize="sm" class="mx-auto w-fit">
      <z-card-content>
        <z-calendar zMode="single" class="p-0" [(value)]="selectedDate" />
      </z-card-content>
      <z-card-footer zFooterBorder>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="calendar-time-from">Start Time</label>
            <z-input-group>
              <input
                z-input
                id="calendar-time-from"
                type="time"
                step="1"
                value="10:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
              <z-input-group-addon>
                <ng-icon name="lucideClock2" class="text-muted-foreground" />
              </z-input-group-addon>
            </z-input-group>
          </div>

          <div z-field>
            <label z-field-label for="calendar-time-to">End Time</label>
            <z-input-group>
              <input
                z-input
                id="calendar-time-to"
                type="time"
                step="1"
                value="12:30:00"
                class="appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
              <z-input-group-addon>
                <ng-icon name="lucideClock2" class="text-muted-foreground" />
              </z-input-group-addon>
            </z-input-group>
          </div>
        </div>
      </z-card-footer>
    </z-card>
  `,
  viewProviders: [provideIcons({ lucideClock2 })],
})
export class ZardDemoCalendarWithTimeComponent {
  readonly selectedDate = signal<Date | null>(new Date());
}
