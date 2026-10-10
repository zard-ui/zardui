import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideCircleDashed } from '@ng-icons/lucide';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@/shared/components/navigation-menu';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface NavigationMenuRtlValues {
  gettingStarted: string;
  introduction: string;
  introductionDesc: string;
  installation: string;
  installationDesc: string;
  typography: string;
  typographyDesc: string;
  components: string;
  alertDialog: string;
  alertDialogDesc: string;
  hoverCard: string;
  hoverCardDesc: string;
  progress: string;
  progressDesc: string;
  scrollArea: string;
  scrollAreaDesc: string;
  tabs: string;
  tabsDesc: string;
  tooltip: string;
  tooltipDesc: string;
  withIcon: string;
  backlog: string;
  toDo: string;
  done: string;
  docs: string;
}

type ComponentKey = 'alertDialog' | 'hoverCard' | 'progress' | 'scrollArea' | 'tabs' | 'tooltip';

const translations: ZardRtlTranslations<NavigationMenuRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      gettingStarted: 'Getting started',
      introduction: 'Introduction',
      introductionDesc: 'Re-usable components built with Tailwind CSS.',
      installation: 'Installation',
      installationDesc: 'How to install dependencies and structure your app.',
      typography: 'Typography',
      typographyDesc: 'Styles for headings, paragraphs, lists...etc',
      components: 'Components',
      alertDialog: 'Alert Dialog',
      alertDialogDesc: 'A modal dialog that interrupts the user with important content and expects a response.',
      hoverCard: 'Hover Card',
      hoverCardDesc: 'For sighted users to preview content available behind a link.',
      progress: 'Progress',
      progressDesc:
        'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
      scrollArea: 'Scroll-area',
      scrollAreaDesc: 'Visually or semantically separates content.',
      tabs: 'Tabs',
      tabsDesc: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
      tooltip: 'Tooltip',
      tooltipDesc:
        'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      withIcon: 'With Icon',
      backlog: 'Backlog',
      toDo: 'To Do',
      done: 'Done',
      docs: 'Docs',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      gettingStarted: 'البدء',
      introduction: 'مقدمة',
      introductionDesc: 'مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.',
      installation: 'التثبيت',
      installationDesc: 'كيفية تثبيت التبعيات وتنظيم تطبيقك.',
      typography: 'الطباعة',
      typographyDesc: 'أنماط للعناوين والفقرات والقوائم...إلخ',
      components: 'المكونات',
      alertDialog: 'حوار التنبيه',
      alertDialogDesc: 'حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.',
      hoverCard: 'بطاقة التحويم',
      hoverCardDesc: 'للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.',
      progress: 'التقدم',
      progressDesc: 'يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط تقدم.',
      scrollArea: 'منطقة التمرير',
      scrollAreaDesc: 'يفصل المحتوى بصريًا أو دلاليًا.',
      tabs: 'التبويبات',
      tabsDesc: 'مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح التبويب—التي يتم عرضها واحدة في كل مرة.',
      tooltip: 'تلميح',
      tooltipDesc:
        'نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس فوقه.',
      withIcon: 'مع أيقونة',
      backlog: 'قائمة الانتظار',
      toDo: 'المهام',
      done: 'منجز',
      docs: 'الوثائق',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      gettingStarted: 'התחלה',
      introduction: 'הקדמה',
      introductionDesc: 'רכיבים לשימוש חוזר שנבנו עם Tailwind CSS.',
      installation: 'התקנה',
      installationDesc: 'כיצד להתקין תלויות ולבנות את האפליקציה שלך.',
      typography: 'טיפוגרפיה',
      typographyDesc: "סגנונות לכותרות, פסקאות, רשימות...וכו'",
      components: 'רכיבים',
      alertDialog: 'דיאלוג התראה',
      alertDialogDesc: 'דיאלוג מודאלי שמפריע למשתמש עם תוכן חשוב ומצפה לתגובה.',
      hoverCard: 'כרטיס ריחוף',
      hoverCardDesc: 'למשתמשים רואים כדי להציג תצוגה מקדימה של תוכן זמין מאחורי קישור.',
      progress: 'התקדמות',
      progressDesc: 'מציג אינדיקטור המציג את התקדמות ההשלמה של משימה, בדרך כלל מוצג כסרגל התקדמות.',
      scrollArea: 'אזור גלילה',
      scrollAreaDesc: 'מפריד תוכן חזותית או סמנטית.',
      tabs: 'כרטיסיות',
      tabsDesc: 'קבוצה של חלקי תוכן מרובדים—המכונים לוחות כרטיסיות—המוצגים אחד בכל פעם.',
      tooltip: 'טולטיפ',
      tooltipDesc: 'חלון קופץ המציג מידע הקשור לאלמנט כאשר האלמנט מקבל מיקוד מקלדת או כאשר העכבר מרחף מעליו.',
      withIcon: 'עם אייקון',
      backlog: 'רשימת המתנה',
      toDo: 'לעשות',
      done: 'הושלם',
      docs: 'תיעוד',
    },
  },
};

@Component({
  selector: 'z-demo-navigation-menu-rtl',
  imports: [ZardNavigationMenuImports, NgIcon],
  template: `
    <nav aria-label="Main" class="contents">
      <z-navigation-menu>
        <ul z-navigation-menu-list>
          <li z-navigation-menu-item>
            <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="gettingStarted">
              {{ i18n.t().gettingStarted }}
            </button>

            <ng-template #gettingStarted>
              <div z-navigation-menu-content>
                <ul class="w-96">
                  <li>
                    <a z-navigation-menu-link href="#">
                      <div class="flex flex-col gap-1 text-sm">
                        <div class="leading-none font-medium">{{ i18n.t().introduction }}</div>
                        <div class="text-muted-foreground line-clamp-2">{{ i18n.t().introductionDesc }}</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a z-navigation-menu-link href="#">
                      <div class="flex flex-col gap-1 text-sm">
                        <div class="leading-none font-medium">{{ i18n.t().installation }}</div>
                        <div class="text-muted-foreground line-clamp-2">{{ i18n.t().installationDesc }}</div>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a z-navigation-menu-link href="#">
                      <div class="flex flex-col gap-1 text-sm">
                        <div class="leading-none font-medium">{{ i18n.t().typography }}</div>
                        <div class="text-muted-foreground line-clamp-2">{{ i18n.t().typographyDesc }}</div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </ng-template>
          </li>

          <li z-navigation-menu-item class="hidden md:flex">
            <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="componentsMenu">
              {{ i18n.t().components }}
            </button>

            <ng-template #componentsMenu>
              <div z-navigation-menu-content>
                <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  @for (component of components; track component.key) {
                    <li>
                      <a z-navigation-menu-link href="#">
                        <div class="flex flex-col gap-1 text-sm">
                          <div class="leading-none font-medium">{{ i18n.t()[component.key] }}</div>
                          <div class="text-muted-foreground line-clamp-2">{{ i18n.t()[component.description] }}</div>
                        </div>
                      </a>
                    </li>
                  }
                </ul>
              </div>
            </ng-template>
          </li>

          <li z-navigation-menu-item>
            <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="withIcon">
              {{ i18n.t().withIcon }}
            </button>

            <ng-template #withIcon>
              <div z-navigation-menu-content>
                <ul class="grid w-[200px]">
                  <li>
                    <a z-navigation-menu-link href="#" class="flex-row items-center gap-2">
                      <ng-icon name="lucideCircleAlert" />
                      {{ i18n.t().backlog }}
                    </a>
                    <a z-navigation-menu-link href="#" class="flex-row items-center gap-2">
                      <ng-icon name="lucideCircleDashed" />
                      {{ i18n.t().toDo }}
                    </a>
                    <a z-navigation-menu-link href="#" class="flex-row items-center gap-2">
                      <ng-icon name="lucideCircleCheck" />
                      {{ i18n.t().done }}
                    </a>
                  </li>
                </ul>
              </div>
            </ng-template>
          </li>

          <li z-navigation-menu-item>
            <a z-navigation-menu-link href="#" [class]="triggerClass">{{ i18n.t().docs }}</a>
          </li>
        </ul>
      </z-navigation-menu>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideCircleDashed })],
})
export class ZardDemoNavigationMenuRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  /** A plain link styled like a trigger, so it lines up with the rest of the bar. */
  protected readonly triggerClass = navigationMenuTriggerVariants();

  protected readonly components: { key: ComponentKey; description: `${ComponentKey}Desc` }[] = [
    { key: 'alertDialog', description: 'alertDialogDesc' },
    { key: 'hoverCard', description: 'hoverCardDesc' },
    { key: 'progress', description: 'progressDesc' },
    { key: 'scrollArea', description: 'scrollAreaDesc' },
    { key: 'tabs', description: 'tabsDesc' },
    { key: 'tooltip', description: 'tooltipDesc' },
  ];
}
