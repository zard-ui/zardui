import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardSheetImports } from '@/shared/components/sheet/sheet.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface SheetRtlStrings {
  open: string;
  editProfile: string;
  description: string;
  name: string;
  username: string;
  save: string;
  close: string;
}

const translations: ZardRtlTranslations<SheetRtlStrings> = {
  en: {
    dir: 'ltr',
    values: {
      open: 'Open',
      editProfile: 'Edit profile',
      description: "Make changes to your profile here. Click save when you're done.",
      name: 'Name',
      username: 'Username',
      save: 'Save changes',
      close: 'Close',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      open: 'فتح',
      editProfile: 'تعديل الملف الشخصي',
      description: 'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.',
      name: 'الاسم',
      username: 'اسم المستخدم',
      save: 'حفظ التغييرات',
      close: 'إغلاق',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      open: 'פתח',
      editProfile: 'עריכת פרופיל',
      description: 'בצע שינויים בפרופיל שלך כאן. לחץ שמור כשתסיים.',
      name: 'שם',
      username: 'שם משתמש',
      save: 'שמור שינויים',
      close: 'סגור',
    },
  },
};

@Component({
  selector: 'z-demo-sheet-rtl',
  imports: [ZardButtonComponent, ZardInputComponent, ZardSheetImports],
  template: `
    @let t = i18n.t();
    <button type="button" z-button zType="outline" (click)="visible.set(true)">{{ t.open }}</button>

    <!-- zSide stays physical: in RTL the sheet opens from the left, as it opens from the right in LTR. -->
    <z-sheet [(zVisible)]="visible" [zSide]="i18n.dir() === 'rtl' ? 'left' : 'right'">
      <z-sheet-header>
        <z-sheet-title>{{ t.editProfile }}</z-sheet-title>
        <z-sheet-description>{{ t.description }}</z-sheet-description>
      </z-sheet-header>

      <div class="grid gap-4 px-4">
        <div class="grid gap-3">
          <label for="sheet-rtl-name" class="text-sm leading-none font-medium select-none">{{ t.name }}</label>
          <input z-input id="sheet-rtl-name" value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <label for="sheet-rtl-username" class="text-sm leading-none font-medium select-none">
            {{ t.username }}
          </label>
          <input z-input id="sheet-rtl-username" value="peduarte" />
        </div>
      </div>

      <z-sheet-footer>
        <button type="button" z-button z-sheet-close>{{ t.save }}</button>
        <button type="button" z-button zType="outline" z-sheet-close>{{ t.close }}</button>
      </z-sheet-footer>
    </z-sheet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSheetRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly visible = signal(false);
}
