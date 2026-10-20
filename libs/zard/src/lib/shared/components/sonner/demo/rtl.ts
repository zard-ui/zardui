import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ trigger: string; message: string; description: string; undo: string }> = {
  en: {
    dir: 'ltr',
    values: {
      trigger: 'Show Toast',
      message: 'Event has been created',
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      undo: 'Undo',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      trigger: 'إظهار الإشعار',
      message: 'تم إنشاء الحدث',
      description: 'الأحد، 03 ديسمبر 2023 الساعة 9:00 صباحًا',
      undo: 'تراجع',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      trigger: 'הצג התראה',
      message: 'האירוע נוצר',
      description: 'יום ראשון, 03 בדצמבר 2023 בשעה 9:00',
      undo: 'בטל',
    },
  },
};

@Component({
  selector: 'z-demo-sonner-rtl',
  imports: [ZardButtonComponent],
  template: `
    <button type="button" z-button zType="outline" (click)="show()">{{ i18n.t().trigger }}</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSonnerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  private readonly sonner = inject(ZardSonnerService);

  protected show() {
    const t = this.i18n.t();
    // The toaster is mounted once at the app root, outside this preview wrapper, so the direction is applied to the
    // toast itself. Its position stays physical (top-left, bottom-right, ...) in every direction.
    this.sonner.show(t.message, {
      description: t.description,
      class: this.i18n.dir() === 'rtl' ? '[direction:rtl]' : '[direction:ltr]',
      action: { label: t.undo, onClick: () => undefined },
    });
  }
}
