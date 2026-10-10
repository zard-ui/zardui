import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideBadgeCheck,
  lucideBell,
  lucideBookOpen,
  lucideBot,
  lucideChevronRight,
  lucideChevronsUpDown,
  lucideCreditCard,
  lucideFolder,
  lucideForward,
  lucideFrame,
  lucideGalleryVerticalEnd,
  lucideLogOut,
  lucideMap,
  lucideMoreHorizontal,
  lucidePieChart,
  lucideSettings2,
  lucideSparkles,
  lucideSquareTerminal,
  lucideTrash2,
} from '@ng-icons/lucide';

import { ZardAvatarComponent } from '@/shared/components/avatar/avatar.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardSidebarImports } from '@/shared/components/sidebar/sidebar.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface SidebarRtlStrings {
  teamName: string;
  teamPlan: string;
  platform: string;
  projects: string;
  viewProject: string;
  shareProject: string;
  deleteProject: string;
  more: string;
  upgradeToPro: string;
  account: string;
  billing: string;
  notifications: string;
  logOut: string;
  playground: string;
  history: string;
  starred: string;
  settings: string;
  models: string;
  genesis: string;
  explorer: string;
  quantum: string;
  documentation: string;
  introduction: string;
  getStarted: string;
  tutorials: string;
  changelog: string;
  general: string;
  team: string;
  limits: string;
  designEngineering: string;
  salesMarketing: string;
  travel: string;
  insetText: string;
}

const translations: ZardRtlTranslations<SidebarRtlStrings> = {
  en: {
    dir: 'ltr',
    values: {
      teamName: 'Acme Inc',
      teamPlan: 'Enterprise',
      platform: 'Platform',
      projects: 'Projects',
      viewProject: 'View Project',
      shareProject: 'Share Project',
      deleteProject: 'Delete Project',
      more: 'More',
      upgradeToPro: 'Upgrade to Pro',
      account: 'Account',
      billing: 'Billing',
      notifications: 'Notifications',
      logOut: 'Log out',
      playground: 'Playground',
      history: 'History',
      starred: 'Starred',
      settings: 'Settings',
      models: 'Models',
      genesis: 'Genesis',
      explorer: 'Explorer',
      quantum: 'Quantum',
      documentation: 'Documentation',
      introduction: 'Introduction',
      getStarted: 'Get Started',
      tutorials: 'Tutorials',
      changelog: 'Changelog',
      general: 'General',
      team: 'Team',
      limits: 'Limits',
      designEngineering: 'Design Engineering',
      salesMarketing: 'Sales & Marketing',
      travel: 'Travel',
      insetText: 'The sidebar docks on the left; the trigger icon points the way it will collapse.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      teamName: 'شركة أكمي',
      teamPlan: 'المؤسسة',
      platform: 'المنصة',
      projects: 'المشاريع',
      viewProject: 'عرض المشروع',
      shareProject: 'مشاركة المشروع',
      deleteProject: 'حذف المشروع',
      more: 'المزيد',
      upgradeToPro: 'ترقية إلى Pro',
      account: 'الحساب',
      billing: 'الفوترة',
      notifications: 'الإشعارات',
      logOut: 'تسجيل الخروج',
      playground: 'ملعب',
      history: 'السجل',
      starred: 'المميز',
      settings: 'الإعدادات',
      models: 'النماذج',
      genesis: 'جينيسيس',
      explorer: 'إكسبلورر',
      quantum: 'كوانتوم',
      documentation: 'التوثيق',
      introduction: 'مقدمة',
      getStarted: 'ابدأ',
      tutorials: 'الدروس',
      changelog: 'سجل التغييرات',
      general: 'عام',
      team: 'الفريق',
      limits: 'الحدود',
      designEngineering: 'هندسة التصميم',
      salesMarketing: 'المبيعات والتسويق',
      travel: 'السفر',
      insetText: 'يظهر الشريط الجانبي على اليمين، وتشير أيقونة الزر إلى اتجاه الطي.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      teamName: 'אקמי בע״מ',
      teamPlan: 'ארגוני',
      platform: 'פלטפורמה',
      projects: 'פרויקטים',
      viewProject: 'הצג פרויקט',
      shareProject: 'שתף פרויקט',
      deleteProject: 'מחק פרויקט',
      more: 'עוד',
      upgradeToPro: 'שדרג ל-Pro',
      account: 'חשבון',
      billing: 'חיוב',
      notifications: 'התראות',
      logOut: 'התנתק',
      playground: 'מגרש משחקים',
      history: 'היסטוריה',
      starred: 'מועדפים',
      settings: 'הגדרות',
      models: 'מודלים',
      genesis: "ג'נסיס",
      explorer: 'אקספלורר',
      quantum: 'קוונטום',
      documentation: 'תיעוד',
      introduction: 'מבוא',
      getStarted: 'התחל',
      tutorials: 'מדריכים',
      changelog: 'יומן שינויים',
      general: 'כללי',
      team: 'צוות',
      limits: 'מגבלות',
      designEngineering: 'הנדסת עיצוב',
      salesMarketing: 'מכירות ושיווק',
      travel: 'נסיעות',
      insetText: 'סרגל הצד מוצג בצד ימין, וסמל הכפתור מצביע לכיוון הקיפול.',
    },
  },
};

@Component({
  selector: 'z-demo-sidebar-rtl',
  imports: [ZardSidebarImports, ZardCollapsibleImports, ZardDropdownImports, ZardAvatarComponent, NgIcon],
  template: `
    @let t = i18n.t();
    <!--
      Containing block for the sidebar's fixed panel, so the demo stays inside the documentation page.
      The side follows the direction: a sidebar on the right is the natural choice in RTL, and it is declared
      first so the flex row (which mirrors with dir) puts its gap on the same side.
    -->
    <z-sidebar-provider
      zDefaultOpen="true"
      class="relative h-[34rem] min-h-0 w-full transform-gpu overflow-hidden rounded-xl border"
    >
      <z-sidebar
        zCollapsible="icon"
        zVariant="floating"
        class="h-full"
        [zSide]="i18n.dir() === 'rtl' ? 'right' : 'left'"
        [dir]="i18n.dir()"
      >
        <div z-sidebar-header>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <a z-sidebar-menu-button zSize="lg" href="#">
                <div
                  class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                >
                  <ng-icon name="lucideGalleryVerticalEnd" class="size-4" />
                </div>

                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-medium">{{ t.teamName }}</span>
                  <span class="text-xs">{{ t.teamPlan }}</span>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <z-sidebar-content>
          <div z-sidebar-group>
            <div z-sidebar-group-label>{{ t.platform }}</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (item of navMain(); track item.key) {
                  <li z-sidebar-menu-item z-collapsible class="group/collapsible" [zOpen]="item.open">
                    <button z-collapsible-trigger z-sidebar-menu-button [zTooltip]="item.title">
                      <ng-icon [name]="item.icon" />
                      <span>{{ item.title }}</span>
                      <ng-icon
                        name="lucideChevronRight"
                        class="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-[state=open]/collapsible:rotate-90"
                      />
                    </button>

                    <z-collapsible-content>
                      <ul z-sidebar-menu-sub>
                        @for (child of item.items; track child) {
                          <li z-sidebar-menu-sub-item>
                            <a z-sidebar-menu-sub-button href="#">{{ child }}</a>
                          </li>
                        }
                      </ul>
                    </z-collapsible-content>
                  </li>
                }
              </ul>
            </div>
          </div>

          <div z-sidebar-group class="group-data-[collapsible=icon]:hidden">
            <div z-sidebar-group-label>{{ t.projects }}</div>

            <div z-sidebar-group-content>
              <ul z-sidebar-menu>
                @for (project of projects(); track project.key) {
                  <li z-sidebar-menu-item>
                    <a z-sidebar-menu-button href="#">
                      <ng-icon [name]="project.icon" />
                      <span>{{ project.name }}</span>
                    </a>

                    <button z-sidebar-menu-action zShowOnHover z-dropdown [zDropdownMenu]="projectMenu">
                      <ng-icon name="lucideMoreHorizontal" />
                      <span class="sr-only">{{ t.more }}</span>
                    </button>
                  </li>
                }
                <li z-sidebar-menu-item>
                  <button z-sidebar-menu-button class="text-sidebar-foreground/70">
                    <ng-icon name="lucideMoreHorizontal" class="text-sidebar-foreground/70" />
                    <span>{{ t.more }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </z-sidebar-content>

        <div z-sidebar-footer>
          <ul z-sidebar-menu>
            <li z-sidebar-menu-item>
              <button z-sidebar-menu-button zSize="lg" z-dropdown [zDropdownMenu]="accountMenu">
                <z-avatar
                  class="size-8 rounded-lg"
                  zSrc="https://github.com/zard-ui.png"
                  zAlt="zard ui"
                  zFallback="ZU"
                />

                <div class="grid flex-1 text-start text-sm/tight">
                  <span class="truncate font-medium">zard ui</span>
                  <span class="truncate text-xs">m&#64;example.com</span>
                </div>

                <ng-icon name="lucideChevronsUpDown" class="ms-auto size-4" />
              </button>
            </li>
          </ul>
        </div>

        <button z-sidebar-rail aria-label="Toggle Sidebar"></button>
      </z-sidebar>

      <main z-sidebar-inset class="overflow-auto">
        <header class="flex h-16 shrink-0 items-center gap-2 px-4">
          <button z-sidebar-trigger class="-ms-1" aria-label="Toggle Sidebar"></button>
        </header>

        <p class="text-muted-foreground px-4 text-sm">{{ t.insetText }}</p>
      </main>

      <z-dropdown-menu-content
        #projectMenu="zDropdownMenuContent"
        class="w-48 rounded-lg"
        zSide="inline-end"
        zAlign="start"
      >
        <z-dropdown-menu-item>
          <ng-icon name="lucideFolder" class="text-muted-foreground" />
          <span>{{ t.viewProject }}</span>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideForward" class="text-muted-foreground" />
          <span>{{ t.shareProject }}</span>
        </z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>
          <ng-icon name="lucideTrash2" class="text-muted-foreground" />
          <span>{{ t.deleteProject }}</span>
        </z-dropdown-menu-item>
      </z-dropdown-menu-content>

      <z-dropdown-menu-content
        #accountMenu="zDropdownMenuContent"
        class="w-(--z-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        zSide="inline-end"
        zAlign="end"
      >
        <z-dropdown-menu-item>
          <ng-icon name="lucideSparkles" />
          {{ t.upgradeToPro }}
        </z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>
          <ng-icon name="lucideBadgeCheck" />
          {{ t.account }}
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideCreditCard" />
          {{ t.billing }}
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideBell" />
          {{ t.notifications }}
        </z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>
          <ng-icon name="lucideLogOut" />
          {{ t.logOut }}
        </z-dropdown-menu-item>
      </z-dropdown-menu-content>
    </z-sidebar-provider>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideBadgeCheck,
      lucideBell,
      lucideBookOpen,
      lucideBot,
      lucideChevronRight,
      lucideChevronsUpDown,
      lucideCreditCard,
      lucideFolder,
      lucideForward,
      lucideFrame,
      lucideGalleryVerticalEnd,
      lucideLogOut,
      lucideMap,
      lucideMoreHorizontal,
      lucidePieChart,
      lucideSettings2,
      lucideSparkles,
      lucideSquareTerminal,
      lucideTrash2,
    }),
  ],
})
export class ZardDemoSidebarRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly navMain = computed(() => {
    const t = this.i18n.t();
    return [
      {
        key: 'playground',
        title: t.playground,
        icon: 'lucideSquareTerminal',
        open: true,
        items: [t.history, t.starred, t.settings],
      },
      { key: 'models', title: t.models, icon: 'lucideBot', open: false, items: [t.genesis, t.explorer, t.quantum] },
      {
        key: 'documentation',
        title: t.documentation,
        icon: 'lucideBookOpen',
        open: false,
        items: [t.introduction, t.getStarted, t.tutorials, t.changelog],
      },
      {
        key: 'settings',
        title: t.settings,
        icon: 'lucideSettings2',
        open: false,
        items: [t.general, t.team, t.billing, t.limits],
      },
    ];
  });

  protected readonly projects = computed(() => {
    const t = this.i18n.t();
    return [
      { key: 'design', name: t.designEngineering, icon: 'lucideFrame' },
      { key: 'sales', name: t.salesMarketing, icon: 'lucidePieChart' },
      { key: 'travel', name: t.travel, icon: 'lucideMap' },
    ];
  });
}
