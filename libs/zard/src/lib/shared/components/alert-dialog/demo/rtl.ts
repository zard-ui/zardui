import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBluetooth } from '@ng-icons/lucide';

import { ZardAlertDialogImports } from '@/shared/components/alert-dialog/alert-dialog.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface AlertDialogRtlStrings {
  showDialog: string;
  showDialogSm: string;
  title: string;
  description: string;
  cancel: string;
  continue: string;
  smallTitle: string;
  smallDescription: string;
  dontAllow: string;
  allow: string;
}

const translations: ZardRtlTranslations<AlertDialogRtlStrings> = {
  en: {
    dir: 'ltr',
    values: {
      showDialog: 'Show Dialog',
      showDialogSm: 'Show Dialog (sm)',
      title: 'Are you absolutely sure?',
      description: 'This action cannot be undone. This will permanently delete your account from our servers.',
      cancel: 'Cancel',
      continue: 'Continue',
      smallTitle: 'Allow accessory to connect?',
      smallDescription: 'Do you want to allow the USB accessory to connect to this device?',
      dontAllow: "Don't allow",
      allow: 'Allow',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      showDialog: 'إظهار الحوار',
      showDialogSm: 'إظهار الحوار (صغير)',
      title: 'هل أنت متأكد تمامًا؟',
      description: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.',
      cancel: 'إلغاء',
      continue: 'متابعة',
      smallTitle: 'السماح للملحق بالاتصال؟',
      smallDescription: 'هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟',
      dontAllow: 'عدم السماح',
      allow: 'السماح',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      showDialog: 'הצג דיאלוג',
      showDialogSm: 'הצג דיאלוג (קטן)',
      title: 'האם אתה בטוח לחלוטין?',
      description: 'פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את החשבון שלך מהשרתים שלנו.',
      cancel: 'ביטול',
      continue: 'המשך',
      smallTitle: 'לאפשר להתקן להתחבר?',
      smallDescription: 'האם אתה רוצה לאפשר להתקן USB להתחבר למכשיר זה?',
      dontAllow: 'אל תאפשר',
      allow: 'אפשר',
    },
  },
};

@Component({
  selector: 'z-demo-alert-dialog-rtl',
  imports: [ZardAlertDialogImports, ZardButtonComponent, NgIcon],
  template: `
    @let t = i18n.t();
    <div class="flex gap-4">
      <button type="button" z-button zType="outline" (click)="visible.set(true)">{{ t.showDialog }}</button>
      <button type="button" z-button zType="outline" (click)="smallVisible.set(true)">{{ t.showDialogSm }}</button>
    </div>

    <z-alert-dialog [(zVisible)]="visible">
      <z-alert-dialog-header>
        <z-alert-dialog-title>{{ t.title }}</z-alert-dialog-title>
        <z-alert-dialog-description>{{ t.description }}</z-alert-dialog-description>
      </z-alert-dialog-header>
      <z-alert-dialog-footer>
        <button type="button" z-button zType="outline" z-alert-dialog-close>{{ t.cancel }}</button>
        <button type="button" z-button (click)="visible.set(false)">{{ t.continue }}</button>
      </z-alert-dialog-footer>
    </z-alert-dialog>

    <z-alert-dialog [(zVisible)]="smallVisible" zSize="sm">
      <z-alert-dialog-header>
        <z-alert-dialog-media>
          <ng-icon name="lucideBluetooth" />
        </z-alert-dialog-media>
        <z-alert-dialog-title>{{ t.smallTitle }}</z-alert-dialog-title>
        <z-alert-dialog-description>{{ t.smallDescription }}</z-alert-dialog-description>
      </z-alert-dialog-header>
      <z-alert-dialog-footer>
        <button type="button" z-button zType="outline" z-alert-dialog-close>{{ t.dontAllow }}</button>
        <button type="button" z-button (click)="smallVisible.set(false)">{{ t.allow }}</button>
      </z-alert-dialog-footer>
    </z-alert-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideBluetooth })],
})
export class ZardDemoAlertDialogRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly visible = signal(false);
  protected readonly smallVisible = signal(false);
}
