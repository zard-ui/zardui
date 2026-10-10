import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardProgressComponent } from '@/shared/components/progress/progress.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Upload progress',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'تقدم الرفع',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'התקדמות ההעלאה',
    },
  },
};

@Component({
  selector: 'z-demo-progress-rtl',
  imports: [ZardProgressComponent, ...ZardFieldImports],
  template: `
    <z-field class="w-full min-w-sm">
      <z-field-label for="progress-upload-rtl">
        <span>{{ i18n.t().label }}</span>
        <span class="ms-auto">66%</span>
      </z-field-label>
      <z-progress id="progress-upload-rtl" [value]="66" />
    </z-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoProgressRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
