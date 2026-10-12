import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardBadgeComponent } from '@zard/components/badge';
import { ZardCalendarComponent, type CalendarValue } from '@zard/components/calendar';
import { ZardCardImports } from '@zard/components/card';
import { ZardItemImports } from '@zard/components/item';

const PAYMENTS = [
  { title: 'Netflix Subscription', date: 'Apr 15, 2024', amount: '$19.99' },
  { title: 'Rent Payment', date: 'Apr 1, 2024', amount: '$2,400.00' },
  { title: 'Auto Insurance', date: 'Apr 22, 2024', amount: '$186.00' },
] as const;

@Component({
  selector: 'z-preview-01-upcoming-payments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardCalendarComponent, ZardItemImports, ZardBadgeComponent],
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Upcoming Payments" />
        <z-card-description zDescription="Select a date to view scheduled payments." />
      </z-card-header>
      <z-card-content class="flex flex-col gap-4">
        <z-item zVariant="outline" class="justify-center">
          <z-calendar
            [(value)]="date"
            class="style-sera:md:[--cell-size:--spacing(9)] w-full [--cell-size:--spacing(8)] md:[--cell-size:--spacing(10)]"
          />
        </z-item>
        <z-item-group class="w-full">
          @for (payment of payments; track payment.title) {
            <z-item zVariant="muted">
              <z-item-content>
                <z-item-title>{{ payment.title }}</z-item-title>
                <p z-item-description>{{ payment.date }}</p>
              </z-item-content>
              <z-badge zType="secondary">{{ payment.amount }}</z-badge>
            </z-item>
          }
        </z-item-group>
      </z-card-content>
    </z-card>
  `,
})
export class Preview01UpcomingPaymentsComponent {
  protected readonly payments = PAYMENTS;
  protected readonly date = signal<CalendarValue>(new Date());
}
