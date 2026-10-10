import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ volume: string; range: string }> = {
  en: {
    dir: 'ltr',
    values: {
      volume: 'Volume',
      range: 'Price range',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      volume: 'مستوى الصوت',
      range: 'نطاق السعر',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      volume: 'עוצמת קול',
      range: 'טווח מחירים',
    },
  },
};

@Component({
  selector: 'z-demo-slider-rtl',
  imports: [ZardSliderComponent],
  template: `
    <div class="flex w-full max-w-xs flex-col gap-6">
      <div class="flex flex-col gap-3">
        <span class="text-sm font-medium">{{ i18n.t().volume }}</span>
        <z-slider [zDefault]="[75]" />
      </div>
      <div class="flex flex-col gap-3">
        <span class="text-sm font-medium">{{ i18n.t().range }}</span>
        <z-slider [zDefault]="[20, 60]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSliderRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
