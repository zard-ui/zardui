import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideChevronRight } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardItemImports } from '@/shared/components/item/item.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ title: string; description: string; action: string; verified: string }> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Basic Item',
      description: 'A simple item with title and description.',
      action: 'Action',
      verified: 'Your profile has been verified.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'عنصر أساسي',
      description: 'عنصر بسيط يحتوي على عنوان ووصف.',
      action: 'إجراء',
      verified: 'تم التحقق من ملفك الشخصي.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'פריט בסיסי',
      description: 'פריט פשוט עם כותרת ותיאור.',
      action: 'פעולה',
      verified: 'הפרופיל שלך אומת.',
    },
  },
};

@Component({
  selector: 'z-demo-item-rtl',
  imports: [ZardButtonComponent, NgIcon, ...ZardItemImports],
  template: `
    <div class="flex w-full min-w-md flex-col gap-6">
      <z-item zVariant="outline">
        <z-item-content>
          <z-item-title>{{ i18n.t().title }}</z-item-title>
          <z-item-description>{{ i18n.t().description }}</z-item-description>
        </z-item-content>
        <z-item-actions>
          <button type="button" z-button zType="outline" zSize="sm">{{ i18n.t().action }}</button>
        </z-item-actions>
      </z-item>

      <a z-item href="#" zVariant="outline" zSize="sm">
        <z-item-media>
          <ng-icon name="lucideBadgeCheck" size="1.25rem" />
        </z-item-media>
        <z-item-content>
          <z-item-title>{{ i18n.t().verified }}</z-item-title>
        </z-item-content>
        <z-item-actions>
          <ng-icon name="lucideChevronRight" size="1rem" class="rtl:rotate-180" />
        </z-item-actions>
      </a>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideChevronRight })],
})
export class ZardDemoItemRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
