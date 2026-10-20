import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; description: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Accept terms and conditions',
      description: 'By clicking this checkbox, you agree to the terms and conditions.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'قبول الشروط والأحكام',
      description: 'بالنقر على هذا المربع، فإنك توافق على الشروط والأحكام.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'אישור התנאים וההגבלות',
      description: 'בלחיצה על תיבת הסימון, אתה מסכים לתנאים ולהגבלות.',
    },
  },
};

@Component({
  selector: 'z-demo-checkbox-rtl',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, FormsModule],
  template: `
    <div z-field-group class="mx-auto w-72">
      <div z-field zOrientation="horizontal">
        <z-checkbox zId="terms-checkbox-rtl" [ngModel]="true" />
        <div z-field-content>
          <label z-field-label for="terms-checkbox-rtl">{{ i18n.t().label }}</label>
          <p z-field-description>{{ i18n.t().description }}</p>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
