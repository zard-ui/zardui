import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideGitBranch, lucidePlus } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ submit: string; learnMore: string; newBranch: string; add: string }> = {
  en: {
    dir: 'ltr',
    values: {
      submit: 'Submit',
      learnMore: 'Learn more',
      newBranch: 'New branch',
      add: 'Add',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      submit: 'إرسال',
      learnMore: 'اعرف المزيد',
      newBranch: 'فرع جديد',
      add: 'إضافة',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      submit: 'שליחה',
      learnMore: 'למידע נוסף',
      newBranch: 'ענף חדש',
      add: 'הוספה',
    },
  },
};

@Component({
  selector: 'z-demo-button-rtl',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" z-button>{{ i18n.t().submit }}</button>
      <button type="button" z-button zType="outline">
        {{ i18n.t().learnMore }}
        <ng-icon name="lucideArrowRight" data-icon="inline-end" class="rtl:rotate-180" />
      </button>
      <button type="button" z-button zType="secondary">
        <ng-icon name="lucideGitBranch" data-icon="inline-start" />
        {{ i18n.t().newBranch }}
      </button>
      <button type="button" z-button zType="outline" zSize="icon" [attr.aria-label]="i18n.t().add">
        <ng-icon name="lucidePlus" />
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowRight, lucideGitBranch, lucidePlus })],
})
export class ZardDemoButtonRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
