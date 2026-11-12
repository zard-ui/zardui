import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardMenubarImports } from '@/shared/components/menubar/menubar.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface MenubarRtlValues {
  file: string;
  edit: string;
  view: string;
  profiles: string;
  newTab: string;
  newWindow: string;
  share: string;
  emailLink: string;
  messages: string;
  print: string;
  undo: string;
  redo: string;
  cut: string;
  copy: string;
  paste: string;
  showBookmarks: string;
  showFullUrls: string;
  andy: string;
  benoit: string;
  luis: string;
}

const translations: ZardRtlTranslations<MenubarRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      file: 'File',
      edit: 'Edit',
      view: 'View',
      profiles: 'Profiles',
      newTab: 'New Tab',
      newWindow: 'New Window',
      share: 'Share',
      emailLink: 'Email link',
      messages: 'Messages',
      print: 'Print...',
      undo: 'Undo',
      redo: 'Redo',
      cut: 'Cut',
      copy: 'Copy',
      paste: 'Paste',
      showBookmarks: 'Always Show Bookmarks Bar',
      showFullUrls: 'Always Show Full URLs',
      andy: 'Andy',
      benoit: 'Benoit',
      luis: 'Luis',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      file: 'ملف',
      edit: 'تحرير',
      view: 'عرض',
      profiles: 'الملفات الشخصية',
      newTab: 'علامة تبويب جديدة',
      newWindow: 'نافذة جديدة',
      share: 'مشاركة',
      emailLink: 'رابط البريد الإلكتروني',
      messages: 'الرسائل',
      print: 'طباعة...',
      undo: 'تراجع',
      redo: 'إعادة',
      cut: 'قص',
      copy: 'نسخ',
      paste: 'لصق',
      showBookmarks: 'إظهار شريط الإشارات دائمًا',
      showFullUrls: 'إظهار العناوين الكاملة دائمًا',
      andy: 'أندي',
      benoit: 'بنوا',
      luis: 'لويس',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      file: 'קובץ',
      edit: 'עריכה',
      view: 'תצוגה',
      profiles: 'פרופילים',
      newTab: 'לשונית חדשה',
      newWindow: 'חלון חדש',
      share: 'שיתוף',
      emailLink: 'קישור באימייל',
      messages: 'הודעות',
      print: 'הדפסה...',
      undo: 'בטל',
      redo: 'בצע שוב',
      cut: 'גזור',
      copy: 'העתק',
      paste: 'הדבק',
      showBookmarks: 'הצג תמיד את סרגל הסימניות',
      showFullUrls: 'הצג תמיד כתובות מלאות',
      andy: 'אנדי',
      benoit: 'בנואה',
      luis: 'לואיס',
    },
  },
};

@Component({
  selector: 'z-demo-menubar-rtl',
  imports: [ZardMenubarImports],
  template: `
    <z-menubar>
      <button type="button" z-menubar-trigger [zMenubarMenu]="fileMenu">{{ i18n.t().file }}</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="editMenu">{{ i18n.t().edit }}</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="viewMenu">{{ i18n.t().view }}</button>
      <button type="button" z-menubar-trigger [zMenubarMenu]="profilesMenu">{{ i18n.t().profiles }}</button>
    </z-menubar>

    <z-dropdown-menu-content #fileMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        {{ i18n.t().newTab }}
        <z-dropdown-menu-shortcut>⌘T</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        {{ i18n.t().newWindow }}
        <z-dropdown-menu-shortcut>⌘N</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-sub-trigger [zSubMenu]="shareMenu">{{ i18n.t().share }}</z-dropdown-menu-sub-trigger>
      <z-dropdown-menu-sub-content #shareMenu="zDropdownMenuSubContent" class="w-44">
        <z-dropdown-menu-item>{{ i18n.t().emailLink }}</z-dropdown-menu-item>
        <z-dropdown-menu-item>{{ i18n.t().messages }}</z-dropdown-menu-item>
      </z-dropdown-menu-sub-content>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        {{ i18n.t().print }}
        <z-dropdown-menu-shortcut>⌘P</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #editMenu="zDropdownMenuContent" class="w-56">
      <z-dropdown-menu-item>
        {{ i18n.t().undo }}
        <z-dropdown-menu-shortcut>⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        {{ i18n.t().redo }}
        <z-dropdown-menu-shortcut>⇧⌘Z</z-dropdown-menu-shortcut>
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>{{ i18n.t().cut }}</z-dropdown-menu-item>
      <z-dropdown-menu-item>{{ i18n.t().copy }}</z-dropdown-menu-item>
      <z-dropdown-menu-item>{{ i18n.t().paste }}</z-dropdown-menu-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #viewMenu="zDropdownMenuContent" class="w-64">
      <z-dropdown-menu-checkbox-item [(zChecked)]="showBookmarks">
        {{ i18n.t().showBookmarks }}
      </z-dropdown-menu-checkbox-item>
      <z-dropdown-menu-checkbox-item [(zChecked)]="showFullUrls">
        {{ i18n.t().showFullUrls }}
      </z-dropdown-menu-checkbox-item>
    </z-dropdown-menu-content>

    <z-dropdown-menu-content #profilesMenu="zDropdownMenuContent" class="w-44">
      <z-dropdown-menu-radio-group [(zValue)]="profile">
        <z-dropdown-menu-radio-item zValue="andy">{{ i18n.t().andy }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="benoit">{{ i18n.t().benoit }}</z-dropdown-menu-radio-item>
        <z-dropdown-menu-radio-item zValue="luis">{{ i18n.t().luis }}</z-dropdown-menu-radio-item>
      </z-dropdown-menu-radio-group>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMenubarRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly showBookmarks = signal(true);
  protected readonly showFullUrls = signal(false);
  protected readonly profile = signal('benoit');
}
