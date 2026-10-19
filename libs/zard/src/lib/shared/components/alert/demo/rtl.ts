import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideInfo } from '@ng-icons/lucide';

import { ZardAlertComponent } from '@/shared/components/alert/alert.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface AlertRtlValues {
  paymentTitle: string;
  paymentDescription: string;
  featureTitle: string;
  featureDescription: string;
  enable: string;
}

const translations: ZardRtlTranslations<AlertRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      paymentTitle: 'Payment successful',
      paymentDescription: 'Your payment of $29.99 has been processed. A receipt has been sent to your email address.',
      featureTitle: 'New feature available',
      featureDescription: "We've added dark mode support. You can enable it in your account settings.",
      enable: 'Enable',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      paymentTitle: 'تم الدفع بنجاح',
      paymentDescription: 'تمت معالجة دفعتك البالغة 29.99 دولارًا. تم إرسال إيصال إلى عنوان بريدك الإلكتروني.',
      featureTitle: 'ميزة جديدة متاحة',
      featureDescription: 'لقد أضفنا دعم الوضع الداكن. يمكنك تفعيله في إعدادات حسابك.',
      enable: 'تفعيل',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      paymentTitle: 'התשלום בוצע בהצלחה',
      paymentDescription: 'התשלום שלך בסך 29.99 דולר עובד. קבלה נשלחה לכתובת האימייל שלך.',
      featureTitle: 'תכונה חדשה זמינה',
      featureDescription: 'הוספנו תמיכה במצב כהה. אתה יכול להפעיל אותו בהגדרות החשבון שלך.',
      enable: 'הפעל',
    },
  },
};

@Component({
  selector: 'z-demo-alert-rtl',
  imports: [ZardAlertComponent, ZardButtonComponent],
  template: `
    <ng-template #actionTpl>
      <button type="button" z-button zSize="xs">{{ i18n.t().enable }}</button>
    </ng-template>

    <div class="grid w-full max-w-md items-start gap-4">
      <z-alert
        zIcon="lucideCircleCheck"
        [zTitle]="i18n.t().paymentTitle"
        [zDescription]="i18n.t().paymentDescription"
      />

      <z-alert
        zIcon="lucideInfo"
        [zTitle]="i18n.t().featureTitle"
        [zDescription]="i18n.t().featureDescription"
        [zAction]="actionTpl"
      />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideInfo })],
})
export class ZardDemoAlertRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
