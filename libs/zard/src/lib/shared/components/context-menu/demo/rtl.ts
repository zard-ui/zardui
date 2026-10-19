import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight, lucideRotateCw } from '@ng-icons/lucide';

import { ZardContextMenuImports } from '@/shared/components/context-menu/context-menu.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface ContextMenuRtlValues {
  rightClick: string;
  navigation: string;
  back: string;
  forward: string;
  reload: string;
  moreTools: string;
  savePage: string;
  createShortcut: string;
  nameWindow: string;
  developerTools: string;
  delete: string;
  showBookmarks: string;
  showFullUrls: string;
  people: string;
  pedro: string;
  colm: string;
}

const translations: ZardRtlTranslations<ContextMenuRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      rightClick: 'Right click here',
      navigation: 'Navigation',
      back: 'Back',
      forward: 'Forward',
      reload: 'Reload',
      moreTools: 'More Tools',
      savePage: 'Save Page...',
      createShortcut: 'Create Shortcut...',
      nameWindow: 'Name Window...',
      developerTools: 'Developer Tools',
      delete: 'Delete',
      showBookmarks: 'Show Bookmarks',
      showFullUrls: 'Show Full URLs',
      people: 'People',
      pedro: 'Pedro Duarte',
      colm: 'Colm Tuite',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      rightClick: 'انقر بزر الماوس الأيمن هنا',
      navigation: 'التنقل',
      back: 'رجوع',
      forward: 'تقدم',
      reload: 'إعادة تحميل',
      moreTools: 'المزيد من الأدوات',
      savePage: 'حفظ الصفحة...',
      createShortcut: 'إنشاء اختصار...',
      nameWindow: 'تسمية النافذة...',
      developerTools: 'أدوات المطور',
      delete: 'حذف',
      showBookmarks: 'إظهار الإشارات المرجعية',
      showFullUrls: 'إظهار عناوين URL الكاملة',
      people: 'الأشخاص',
      pedro: 'Pedro Duarte',
      colm: 'Colm Tuite',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      rightClick: 'לחץ לחיצה ימנית כאן',
      navigation: 'ניווט',
      back: 'חזור',
      forward: 'קדימה',
      reload: 'רענן',
      moreTools: 'כלים נוספים',
      savePage: 'שמור עמוד...',
      createShortcut: 'צור קיצור דרך...',
      nameWindow: 'שם חלון...',
      developerTools: 'כלי מפתח',
      delete: 'מחק',
      showBookmarks: 'הצג סימניות',
      showFullUrls: 'הצג כתובות URL מלאות',
      people: 'אנשים',
      pedro: 'Pedro Duarte',
      colm: 'Colm Tuite',
    },
  },
};

@Component({
  selector: 'z-demo-context-menu-rtl',
  imports: [ZardContextMenuImports, NgIcon],
  template: `
    <div
      z-context-menu
      [zContextMenuTriggerFor]="menu"
      class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
    >
      {{ i18n.t().rightClick }}
    </div>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-48">
      <z-dropdown-menu-sub-trigger [zSubMenu]="navigation">{{ i18n.t().navigation }}</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #navigation="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>
          <ng-icon name="lucideArrowLeft" class="size-4 rtl:rotate-180" />
          {{ i18n.t().back }}
          <z-dropdown-menu-shortcut>⌘[</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item zDisabled>
          <ng-icon name="lucideArrowRight" class="size-4 rtl:rotate-180" />
          {{ i18n.t().forward }}
          <z-dropdown-menu-shortcut>⌘]</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
        <z-dropdown-menu-item>
          <ng-icon name="lucideRotateCw" class="size-4" />
          {{ i18n.t().reload }}
          <z-dropdown-menu-shortcut>⌘R</z-dropdown-menu-shortcut>
        </z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>

      <z-dropdown-menu-sub-trigger [zSubMenu]="moreTools">{{ i18n.t().moreTools }}</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #moreTools="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>{{ i18n.t().savePage }}</z-dropdown-menu-item>
        <z-dropdown-menu-item>{{ i18n.t().createShortcut }}</z-dropdown-menu-item>
        <z-dropdown-menu-item>{{ i18n.t().nameWindow }}</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item>{{ i18n.t().developerTools }}</z-dropdown-menu-item>
        <z-dropdown-menu-separator />
        <z-dropdown-menu-item zType="destructive">{{ i18n.t().delete }}</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        {{ i18n.t().showBookmarks }}
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">
        {{ i18n.t().showFullUrls }}
      </z-dropdown-menu-checkbox-item>

      <z-dropdown-menu-separator />

      <z-dropdown-menu-radio-group [(zValue)]="person">
        <z-dropdown-menu-label>{{ i18n.t().people }}</z-dropdown-menu-label>
        <z-dropdown-menu-radio-item zValue="pedro">{{ i18n.t().pedro }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="colm">{{ i18n.t().colm }}</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowLeft, lucideArrowRight, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoContextMenuRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly showBookmarks = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly person = signal('pedro');
}
