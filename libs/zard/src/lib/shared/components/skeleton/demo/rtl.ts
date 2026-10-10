import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardSkeletonComponent } from '@/shared/components/skeleton/skeleton.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ caption: string }> = {
  en: {
    dir: 'ltr',
    values: {
      caption: 'Loading profile',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      caption: 'جارٍ تحميل الملف الشخصي',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      caption: 'טוען פרופיל',
    },
  },
};

@Component({
  selector: 'z-demo-skeleton-rtl',
  imports: [ZardSkeletonComponent],
  template: `
    <div class="flex w-fit items-center gap-4" role="status" [attr.aria-label]="i18n.t().caption">
      <z-skeleton class="size-10 shrink-0 rounded-full" />
      <div class="grid gap-2">
        <z-skeleton class="h-4 w-[150px]" />
        <z-skeleton class="h-4 w-[100px]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSkeletonRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
