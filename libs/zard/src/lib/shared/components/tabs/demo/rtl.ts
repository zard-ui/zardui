import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardTabComponent, ZardTabGroupComponent } from '../tabs.component';

const translations: ZardRtlTranslations<{
  overview: string;
  analytics: string;
  reports: string;
  overviewText: string;
  analyticsText: string;
  reportsText: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      overview: 'Overview',
      analytics: 'Analytics',
      reports: 'Reports',
      overviewText: 'You have 12 active projects and 3 pending tasks.',
      analyticsText: 'Page views are up 25% compared to last month.',
      reportsText: 'Your weekly report is ready to download.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      overview: 'نظرة عامة',
      analytics: 'التحليلات',
      reports: 'التقارير',
      overviewText: 'لديك 12 مشروعًا نشطًا و3 مهام معلقة.',
      analyticsText: 'ارتفعت مشاهدات الصفحة بنسبة 25٪ مقارنة بالشهر الماضي.',
      reportsText: 'تقريرك الأسبوعي جاهز للتنزيل.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      overview: 'סקירה',
      analytics: 'ניתוח נתונים',
      reports: 'דוחות',
      overviewText: 'יש לך 12 פרויקטים פעילים ו-3 משימות ממתינות.',
      analyticsText: 'צפיות בדף עלו ב-25% בהשוואה לחודש שעבר.',
      reportsText: 'הדוח השבועי שלך מוכן להורדה.',
    },
  },
};

@Component({
  selector: 'z-demo-tabs-rtl',
  imports: [ZardTabComponent, ZardTabGroupComponent, ZardCardImports],
  template: `
    <z-tab-group class="w-[400px]">
      <z-tab [label]="i18n.t().overview">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="i18n.t().overview" />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">{{ i18n.t().overviewText }}</p>
        </z-card>
      </z-tab>
      <z-tab [label]="i18n.t().analytics">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="i18n.t().analytics" />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">{{ i18n.t().analyticsText }}</p>
        </z-card>
      </z-tab>
      <z-tab [label]="i18n.t().reports">
        <z-card>
          <z-card-header>
            <z-card-title [zTitle]="i18n.t().reports" />
          </z-card-header>
          <p z-card-content class="text-muted-foreground text-sm">{{ i18n.t().reportsText }}</p>
        </z-card>
      </z-tab>
    </z-tab-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTabsRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
