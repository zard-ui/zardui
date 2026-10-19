import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; description: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Share across devices',
      description: 'Focus is shared across devices, and turns off when you leave the app.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'المشاركة عبر الأجهزة',
      description: 'تتم مشاركة التركيز عبر الأجهزة، ويتوقف عند مغادرة التطبيق.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'שיתוף בין מכשירים',
      description: 'המיקוד משותף בין מכשירים, ומתבטל כשעוזבים את האפליקציה.',
    },
  },
};

@Component({
  selector: 'z-demo-switch-rtl',
  imports: [...ZardFieldImports, ZardSwitchComponent],
  template: `
    <div z-field zOrientation="horizontal" class="max-w-sm">
      <div z-field-content>
        <label z-field-label for="switch-rtl">{{ i18n.t().label }}</label>
        <p z-field-description>{{ i18n.t().description }}</p>
      </div>
      <z-switch zId="switch-rtl" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
