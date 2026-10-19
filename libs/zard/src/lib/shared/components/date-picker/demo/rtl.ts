import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { CalendarValue } from '@/shared/components/calendar/calendar.types';
import { ZardDatePickerComponent } from '@/shared/components/date-picker/date-picker.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; placeholder: string; locale: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Date of birth',
      placeholder: 'Pick a date',
      locale: 'en',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'تاريخ الميلاد',
      placeholder: 'اختر تاريخًا',
      locale: 'ar',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'תאריך לידה',
      placeholder: 'בחרו תאריך',
      locale: 'he',
    },
  },
};

@Component({
  selector: 'z-demo-date-picker-rtl',
  imports: [ZardDatePickerComponent],
  template: `
    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">{{ i18n.t().label }}</span>
      <z-date-picker [zPlaceholder]="i18n.t().placeholder" [zLocale]="i18n.t().locale" [(value)]="selectedDate" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDatePickerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly selectedDate = signal<CalendarValue>(null);
}
