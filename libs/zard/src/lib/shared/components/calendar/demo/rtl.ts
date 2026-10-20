import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardCalendarComponent } from '@/shared/components/calendar/calendar.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ locale: string }> = {
  en: {
    dir: 'ltr',
    values: {
      locale: 'en',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      locale: 'ar',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      locale: 'he',
    },
  },
};

@Component({
  selector: 'z-demo-calendar-rtl',
  imports: [ZardCalendarComponent],
  template: `
    <z-calendar zMode="single" class="rounded-lg border" [zLocale]="i18n.t().locale" [(value)]="selectedDate" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCalendarRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly selectedDate = signal<Date | null>(new Date());
}
