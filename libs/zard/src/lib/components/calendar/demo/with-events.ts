import { Component } from '@angular/core';

import { CalendarEvent } from '../models/calendar.models';
import { CalendarComponent } from '../calendar.component';

@Component({
  standalone: true,
  imports: [CalendarComponent],
  template: ` <z-calendar [defaultView]="'month'" [events]="events" [config]="{ firstDayOfWeek: 1, locale: 'en-US' }" (dateSelected)="onDateSelected($event)"></z-calendar> `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
})
export class ZardDemoCalendarWithEventsComponent {
  // Sample events
  events: CalendarEvent[] = [
    {
      id: '1',
      title: 'Team Meeting',
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 11, 30),
      color: '#4CAF50',
      status: 'success',
    },
    {
      id: '2',
      title: 'Product Launch',
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 9, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 20, 17, 0),
      color: '#2196F3',
      status: 'info',
    },
    {
      id: '3',
      title: 'Client Call',
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 14, 0),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 15, 0),
      color: '#FF9800',
      status: 'warning',
    },
  ];

  onDateSelected(dates: Date[]): void {
    console.log('Selected dates:', dates);
  }
}
