import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardColorPickerComponent } from '@/shared/components/color-picker/color-picker.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; placeholder: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Brand color',
      placeholder: 'Pick a color',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'لون العلامة التجارية',
      placeholder: 'اختر لونًا',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'צבע המותג',
      placeholder: 'בחרו צבע',
    },
  },
};

@Component({
  selector: 'z-demo-color-picker-rtl',
  imports: [ZardColorPickerComponent],
  template: `
    <div class="flex flex-col gap-2">
      <span class="text-sm font-medium">{{ i18n.t().label }}</span>
      <z-color-picker zShowValue zAlpha [zPlaceholder]="i18n.t().placeholder" [zPresets]="presets" [(value)]="color" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoColorPickerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly presets = ['#dc2626', '#f59e0b', '#16a34a', '#2563eb', '#7c3aed'];
  protected readonly color = signal<string | null>('#2563eb');
}
