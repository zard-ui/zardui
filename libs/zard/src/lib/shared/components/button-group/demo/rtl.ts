import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideEllipsis, lucideSearch } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardButtonGroupComponent } from '@/shared/components/button-group/button-group.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  back: string;
  archive: string;
  report: string;
  snooze: string;
  more: string;
  search: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      back: 'Go back',
      archive: 'Archive',
      report: 'Report',
      snooze: 'Snooze',
      more: 'More options',
      search: 'Search...',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      back: 'رجوع',
      archive: 'أرشفة',
      report: 'إبلاغ',
      snooze: 'تأجيل',
      more: 'خيارات أخرى',
      search: 'بحث...',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      back: 'חזרה',
      archive: 'ארכיון',
      report: 'דיווח',
      snooze: 'נודניק',
      more: 'אפשרויות נוספות',
      search: 'חיפוש...',
    },
  },
};

@Component({
  selector: 'z-demo-button-group-rtl',
  imports: [ZardButtonGroupComponent, ZardButtonComponent, NgIcon, ZardInputComponent],
  template: `
    <div class="flex flex-col items-start gap-4">
      <z-button-group>
        <z-button-group>
          <button type="button" z-button zType="outline" [attr.aria-label]="i18n.t().back">
            <ng-icon name="lucideArrowLeft" class="rtl:rotate-180" />
          </button>
        </z-button-group>

        <z-button-group>
          <button type="button" z-button zType="outline">{{ i18n.t().archive }}</button>
          <button type="button" z-button zType="outline">{{ i18n.t().report }}</button>
        </z-button-group>

        <z-button-group>
          <button type="button" z-button zType="outline">{{ i18n.t().snooze }}</button>
          <button type="button" z-button zType="outline" [attr.aria-label]="i18n.t().more">
            <ng-icon name="lucideEllipsis" />
          </button>
        </z-button-group>
      </z-button-group>

      <z-button-group>
        <input z-input [placeholder]="i18n.t().search" [attr.aria-label]="i18n.t().search" />
        <button type="button" z-button zType="outline" [attr.aria-label]="i18n.t().search">
          <ng-icon name="lucideSearch" />
        </button>
      </z-button-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowLeft, lucideEllipsis, lucideSearch })],
})
export class ZardDemoButtonGroupRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
