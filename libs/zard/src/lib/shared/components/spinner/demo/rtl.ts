import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSpinnerComponent } from '@/shared/components/spinner/spinner.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ loading: string; wait: string }> = {
  en: {
    dir: 'ltr',
    values: {
      loading: 'Loading...',
      wait: 'Please wait',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      loading: 'جارٍ التحميل...',
      wait: 'يرجى الانتظار',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      loading: 'טוען...',
      wait: 'אנא המתן',
    },
  },
};

@Component({
  selector: 'z-demo-spinner-rtl',
  imports: [ZardButtonComponent, ZardSpinnerComponent],
  template: `
    <div class="flex flex-col items-center gap-4">
      <button type="button" z-button zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        {{ i18n.t().loading }}
      </button>
      <button type="button" z-button zType="outline" zSize="sm" [zDisabled]="true">
        <z-spinner data-icon="inline-start" />
        {{ i18n.t().wait }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSpinnerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
