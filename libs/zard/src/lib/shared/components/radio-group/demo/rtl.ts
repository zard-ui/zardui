import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardRadioGroupImports } from '@/shared/components/radio-group/radio-group.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  defaultLabel: string;
  defaultDesc: string;
  comfortableLabel: string;
  comfortableDesc: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      defaultLabel: 'Default',
      defaultDesc: 'Standard spacing for most use cases.',
      comfortableLabel: 'Comfortable',
      comfortableDesc: 'More space between elements.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      defaultLabel: 'افتراضي',
      defaultDesc: 'تباعد قياسي لمعظم حالات الاستخدام.',
      comfortableLabel: 'مريح',
      comfortableDesc: 'مساحة أكبر بين العناصر.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      defaultLabel: 'ברירת מחדל',
      defaultDesc: 'ריווח סטנדרטי לרוב המקרים.',
      comfortableLabel: 'נוח',
      comfortableDesc: 'יותר מרחב בין האלמנטים.',
    },
  },
};

@Component({
  selector: 'z-demo-radio-group-rtl',
  imports: [...ZardRadioGroupImports, ...ZardFieldImports],
  template: `
    <z-radio-group value="comfortable" class="w-fit">
      <div z-field zOrientation="horizontal">
        <z-radio zId="rtl-r1" value="default" />
        <div z-field-content>
          <label z-field-label for="rtl-r1">{{ i18n.t().defaultLabel }}</label>
          <p z-field-description>{{ i18n.t().defaultDesc }}</p>
        </div>
      </div>
      <div z-field zOrientation="horizontal">
        <z-radio zId="rtl-r2" value="comfortable" />
        <div z-field-content>
          <label z-field-label for="rtl-r2">{{ i18n.t().comfortableLabel }}</label>
          <p z-field-description>{{ i18n.t().comfortableDesc }}</p>
        </div>
      </div>
    </z-radio-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoRadioGroupRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
