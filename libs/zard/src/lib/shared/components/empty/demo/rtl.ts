import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardEmptyComponent } from '@/shared/components/empty';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface EmptyRtlValues {
  title: string;
  description: string;
  createProject: string;
  importProject: string;
  learnMore: string;
}

const translations: ZardRtlTranslations<EmptyRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'No Projects Yet',
      description: "You haven't created any projects yet. Get started by creating your first project.",
      createProject: 'Create Project',
      importProject: 'Import Project',
      learnMore: 'Learn More',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'لا توجد مشاريع بعد',
      description: 'لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.',
      createProject: 'إنشاء مشروع',
      importProject: 'استيراد مشروع',
      learnMore: 'تعرف على المزيد',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'אין פרויקטים עדיין',
      description: 'עדיין לא יצרת פרויקטים. התחל על ידי יצירת הפרויקט הראשון שלך.',
      createProject: 'צור פרויקט',
      importProject: 'ייבא פרויקט',
      learnMore: 'למד עוד',
    },
  },
};

@Component({
  selector: 'z-demo-empty-rtl',
  imports: [ZardButtonComponent, ZardEmptyComponent, NgIcon],
  template: `
    <z-empty
      zIcon="lucideFolderCode"
      [zTitle]="i18n.t().title"
      [zDescription]="i18n.t().description"
      [zActions]="[actionPrimary, actionSecondary]"
    >
      <ng-template #actionPrimary>
        <button type="button" z-button>{{ i18n.t().createProject }}</button>
      </ng-template>
      <ng-template #actionSecondary>
        <button type="button" z-button zType="outline">{{ i18n.t().importProject }}</button>
      </ng-template>
    </z-empty>
    <a z-button zType="link" zSize="sm" href="#" class="text-muted-foreground mx-auto flex w-fit">
      {{ i18n.t().learnMore }}
      <ng-icon name="lucideArrowUpRight" data-icon="inline-end" class="rtl:-rotate-90" />
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideFolderCode })],
})
export class ZardDemoEmptyRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
