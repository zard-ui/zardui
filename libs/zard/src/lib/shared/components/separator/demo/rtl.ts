import { ChangeDetectionStrategy, Component } from '@angular/core';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardSeparatorComponent } from '../separator.component';

const translations: ZardRtlTranslations<{
  title: string;
  subtitle: string;
  body: string;
  docs: string;
  source: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Zard/ui',
      subtitle: 'The Next Level for Your Angular Projects',
      body: 'A set of beautifully designed components that you can customize, extend, and build on.',
      docs: 'Docs',
      source: 'Source',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'Zard/ui',
      subtitle: 'المستوى التالي لمشاريع Angular الخاصة بك',
      body: 'مجموعة من المكونات المصممة بشكل جميل يمكنك تخصيصها وتوسيعها والبناء عليها.',
      docs: 'التوثيق',
      source: 'المصدر',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'Zard/ui',
      subtitle: 'הרמה הבאה לפרויקטי Angular שלך',
      body: 'סט של רכיבים מעוצבים להפליא שאפשר להתאים אישית, להרחיב ולבנות עליהם.',
      docs: 'תיעוד',
      source: 'קוד מקור',
    },
  },
};

@Component({
  selector: 'z-demo-separator-rtl',
  imports: [ZardSeparatorComponent],
  template: `
    <div class="flex max-w-sm flex-col gap-4 text-sm">
      <div class="flex flex-col gap-1.5">
        <div class="leading-none font-medium">{{ i18n.t().title }}</div>
        <div class="text-muted-foreground">{{ i18n.t().subtitle }}</div>
      </div>
      <z-separator />
      <div>{{ i18n.t().body }}</div>
      <div class="flex h-5 items-center gap-4">
        <span>{{ i18n.t().docs }}</span>
        <z-separator zOrientation="vertical" />
        <span>{{ i18n.t().source }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSeparatorRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
