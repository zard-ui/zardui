import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  title: string;
  description: string;
  body: string;
  action: string;
  cancel: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Welcome back',
      description: 'Text, spacing and icons follow the reading direction.',
      body: 'Switch the language above to watch the card mirror with no extra code.',
      action: 'Continue',
      cancel: 'Cancel',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'مرحبا بعودتك',
      description: 'يتبع النص والمسافات والأيقونات اتجاه القراءة.',
      body: 'غيّر اللغة من الأعلى لترى البطاقة تنعكس دون أي شيفرة إضافية.',
      action: 'متابعة',
      cancel: 'إلغاء',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'ברוכים השבים',
      description: 'הטקסט, הריווח והסמלים עוקבים אחרי כיוון הקריאה.',
      body: 'החליפו שפה למעלה כדי לראות את הכרטיס מתהפך ללא קוד נוסף.',
      action: 'המשך',
      cancel: 'ביטול',
    },
  },
};

/** The card at the top of the RTL guide, rendered through the RTL preview of the code box. */
@Component({
  selector: 'z-rtl-card-demo',
  imports: [ZardCardImports, ZardButtonComponent],
  template: `
    <div z-card class="w-full max-w-sm">
      <div z-card-header>
        <z-card-title [zTitle]="i18n.t().title" />
        <z-card-description [zDescription]="i18n.t().description" />
      </div>
      <div z-card-content class="text-sm">{{ i18n.t().body }}</div>
      <div z-card-footer class="gap-2">
        <button type="button" z-button>{{ i18n.t().action }}</button>
        <button type="button" z-button zType="outline">{{ i18n.t().cancel }}</button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class RtlCardDemoComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
