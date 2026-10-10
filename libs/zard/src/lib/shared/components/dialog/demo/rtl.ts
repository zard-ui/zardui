import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardDialogImports } from '@/shared/components/dialog/dialog.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface DialogRtlStrings {
  openDialog: string;
  editProfile: string;
  description: string;
  name: string;
  username: string;
  cancel: string;
  saveChanges: string;
}

const translations: ZardRtlTranslations<DialogRtlStrings> = {
  en: {
    dir: 'ltr',
    values: {
      openDialog: 'Open Dialog',
      editProfile: 'Edit profile',
      description: "Make changes to your profile here. Click save when you're done.",
      name: 'Name',
      username: 'Username',
      cancel: 'Cancel',
      saveChanges: 'Save changes',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      openDialog: 'فتح الحوار',
      editProfile: 'تعديل الملف الشخصي',
      description: 'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.',
      name: 'الاسم',
      username: 'اسم المستخدم',
      cancel: 'إلغاء',
      saveChanges: 'حفظ التغييرات',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      openDialog: 'פתח דיאלוג',
      editProfile: 'ערוך פרופיל',
      description: 'בצע שינויים בפרופיל שלך כאן. לחץ על שמור כשתסיים.',
      name: 'שם',
      username: 'שם משתמש',
      cancel: 'בטל',
      saveChanges: 'שמור שינויים',
    },
  },
};

@Component({
  selector: 'z-demo-dialog-rtl',
  imports: [ZardButtonComponent, ZardDialogImports, ZardInputComponent],
  template: `
    @let t = i18n.t();
    <button type="button" z-button zType="outline" (click)="visible.set(true)">{{ t.openDialog }}</button>

    <z-dialog [(zVisible)]="visible">
      <z-dialog-header>
        <z-dialog-title>{{ t.editProfile }}</z-dialog-title>
        <z-dialog-description>{{ t.description }}</z-dialog-description>
      </z-dialog-header>

      <div class="grid gap-4">
        <div class="grid gap-3">
          <label for="dialog-rtl-name" class="text-sm leading-none font-medium select-none">{{ t.name }}</label>
          <input z-input id="dialog-rtl-name" value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <label for="dialog-rtl-username" class="text-sm leading-none font-medium select-none">
            {{ t.username }}
          </label>
          <input z-input id="dialog-rtl-username" value="&#64;peduarte" />
        </div>
      </div>

      <z-dialog-footer>
        <button type="button" z-button zType="outline" z-dialog-close>{{ t.cancel }}</button>
        <button type="button" z-button (click)="visible.set(false)">{{ t.saveChanges }}</button>
      </z-dialog-footer>
    </z-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoDialogRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly visible = signal(false);
}
