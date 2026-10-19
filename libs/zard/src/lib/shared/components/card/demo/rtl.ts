import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface CardRtlValues {
  title: string;
  description: string;
  signUp: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  forgotPassword: string;
  login: string;
  loginWithGoogle: string;
}

const translations: ZardRtlTranslations<CardRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Login to your account',
      description: 'Enter your email below to login to your account',
      signUp: 'Sign Up',
      email: 'Email',
      emailPlaceholder: 'm@example.com',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      login: 'Login',
      loginWithGoogle: 'Login with Google',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      title: 'تسجيل الدخول إلى حسابك',
      description: 'أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك',
      signUp: 'إنشاء حساب',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'm@example.com',
      password: 'كلمة المرور',
      forgotPassword: 'نسيت كلمة المرور؟',
      login: 'تسجيل الدخول',
      loginWithGoogle: 'تسجيل الدخول باستخدام Google',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      title: 'התחבר לחשבון שלך',
      description: 'הזן את האימייל שלך למטה כדי להתחבר לחשבון שלך',
      signUp: 'הירשם',
      email: 'אימייל',
      emailPlaceholder: 'm@example.com',
      password: 'סיסמה',
      forgotPassword: 'שכחת את הסיסמה?',
      login: 'התחבר',
      loginWithGoogle: 'התחבר עם Google',
    },
  },
};

@Component({
  selector: 'z-demo-card-rtl',
  imports: [ZardCardImports, ZardButtonComponent, ...ZardFieldImports, ZardInputComponent],
  template: `
    <z-card class="w-full md:w-94">
      <z-card-header>
        <z-card-title [zTitle]="i18n.t().title" />
        <z-card-description [zDescription]="i18n.t().description" />
        <z-card-action>
          <a z-button zType="link" href="#">{{ i18n.t().signUp }}</a>
        </z-card-action>
      </z-card-header>
      <z-card-content>
        <div z-field-group>
          <div z-field>
            <label z-field-label for="card-rtl-email">{{ i18n.t().email }}</label>
            <input z-input id="card-rtl-email" type="email" [placeholder]="i18n.t().emailPlaceholder" required />
          </div>
          <div z-field>
            <div class="flex items-center">
              <label z-field-label for="card-rtl-password">{{ i18n.t().password }}</label>
              <a href="#" class="ms-auto text-sm underline-offset-4 hover:underline">{{ i18n.t().forgotPassword }}</a>
            </div>
            <input z-input id="card-rtl-password" type="password" required />
          </div>
        </div>
      </z-card-content>
      <z-card-footer class="flex-col gap-2">
        <z-button class="w-full">{{ i18n.t().login }}</z-button>
        <z-button zType="outline" class="w-full">{{ i18n.t().loginWithGoogle }}</z-button>
      </z-card-footer>
    </z-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCardRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
