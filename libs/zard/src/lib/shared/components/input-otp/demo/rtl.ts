import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; description: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Verification code',
      description: 'Enter the 6-digit code we sent to your phone.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'رمز التحقق',
      description: 'أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى هاتفك.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'קוד אימות',
      description: 'הזינו את הקוד בן 6 הספרות ששלחנו לטלפון שלכם.',
    },
  },
};

@Component({
  selector: 'z-demo-input-otp-rtl',
  imports: [...ZardInputOtpImports],
  template: `
    <div class="flex flex-col items-start gap-2">
      <span class="text-sm font-medium">{{ i18n.t().label }}</span>
      <z-input-otp [zMaxLength]="6">
        <z-input-otp-group>
          <z-input-otp-slot [zIndex]="0" />
          <z-input-otp-slot [zIndex]="1" />
          <z-input-otp-slot [zIndex]="2" />
        </z-input-otp-group>
        <z-input-otp-separator />
        <z-input-otp-group>
          <z-input-otp-slot [zIndex]="3" />
          <z-input-otp-slot [zIndex]="4" />
          <z-input-otp-slot [zIndex]="5" />
        </z-input-otp-group>
      </z-input-otp>
      <p class="text-muted-foreground text-sm">{{ i18n.t().description }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
