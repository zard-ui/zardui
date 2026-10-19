import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBadgeCheck, lucideBookmark } from '@ng-icons/lucide';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardBadgeComponent } from '../badge.component';

interface BadgeRtlValues {
  badge: string;
  secondary: string;
  destructive: string;
  outline: string;
  verified: string;
  bookmark: string;
}

const translations: ZardRtlTranslations<BadgeRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      badge: 'Badge',
      secondary: 'Secondary',
      destructive: 'Destructive',
      outline: 'Outline',
      verified: 'Verified',
      bookmark: 'Bookmark',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      badge: 'شارة',
      secondary: 'ثانوي',
      destructive: 'مدمر',
      outline: 'مخطط',
      verified: 'متحقق',
      bookmark: 'إشارة مرجعية',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      badge: 'תג',
      secondary: 'משני',
      destructive: 'הרסני',
      outline: 'קווי מתאר',
      verified: 'מאומת',
      bookmark: 'סימנייה',
    },
  },
};

@Component({
  selector: 'z-demo-badge-rtl',
  imports: [ZardBadgeComponent, NgIcon],
  template: `
    <div class="flex w-full flex-wrap justify-center gap-2">
      <z-badge>{{ i18n.t().badge }}</z-badge>
      <z-badge zType="secondary">{{ i18n.t().secondary }}</z-badge>
      <z-badge zType="destructive">{{ i18n.t().destructive }}</z-badge>
      <z-badge zType="outline">{{ i18n.t().outline }}</z-badge>
      <z-badge zType="secondary">
        <ng-icon name="lucideBadgeCheck" data-icon="inline-start" />
        {{ i18n.t().verified }}
      </z-badge>
      <z-badge zType="outline">
        {{ i18n.t().bookmark }}
        <ng-icon name="lucideBookmark" data-icon="inline-end" />
      </z-badge>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBadgeCheck, lucideBookmark })],
})
export class ZardDemoBadgeRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
