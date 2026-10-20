import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{
  legend: string;
  description: string;
  name: string;
  namePlaceholder: string;
  nameHelp: string;
  email: string;
  emailPlaceholder: string;
  newsletter: string;
  newsletterHelp: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      legend: 'Profile',
      description: 'Update your personal details.',
      name: 'Full name',
      namePlaceholder: 'Jane Doe',
      nameHelp: 'This is how your name appears to others.',
      email: 'Email',
      emailPlaceholder: 'jane@example.com',
      newsletter: 'Subscribe to the newsletter',
      newsletterHelp: 'Get product updates once a month.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      legend: 'الملف الشخصي',
      description: 'حدّث بياناتك الشخصية.',
      name: 'الاسم الكامل',
      namePlaceholder: 'محمد أحمد',
      nameHelp: 'هكذا يظهر اسمك للآخرين.',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'mohamed@example.com',
      newsletter: 'الاشتراك في النشرة البريدية',
      newsletterHelp: 'احصل على تحديثات المنتج مرة واحدة شهريًا.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      legend: 'פרופיל',
      description: 'עדכנו את הפרטים האישיים שלכם.',
      name: 'שם מלא',
      namePlaceholder: 'ישראל ישראלי',
      nameHelp: 'כך השם שלכם מופיע לאחרים.',
      email: 'אימייל',
      emailPlaceholder: 'israel@example.com',
      newsletter: 'הרשמה לניוזלטר',
      newsletterHelp: 'קבלו עדכוני מוצר פעם בחודש.',
    },
  },
};

@Component({
  selector: 'z-demo-field-rtl',
  imports: [...ZardFieldImports, ZardCheckboxComponent, ZardInputComponent],
  template: `
    <div class="w-full min-w-xs">
      <fieldset z-field-set>
        <legend z-field-legend>{{ i18n.t().legend }}</legend>
        <p z-field-description>{{ i18n.t().description }}</p>

        <div z-field-group>
          <div z-field>
            <label z-field-label for="field-rtl-name">{{ i18n.t().name }}</label>
            <input z-input id="field-rtl-name" [placeholder]="i18n.t().namePlaceholder" />
            <p z-field-description>{{ i18n.t().nameHelp }}</p>
          </div>

          <div z-field>
            <label z-field-label for="field-rtl-email">{{ i18n.t().email }}</label>
            <input z-input id="field-rtl-email" type="email" [placeholder]="i18n.t().emailPlaceholder" />
          </div>

          <div z-field zOrientation="horizontal">
            <span z-checkbox zId="field-rtl-newsletter"></span>
            <div z-field-content>
              <label z-field-label for="field-rtl-newsletter">{{ i18n.t().newsletter }}</label>
              <p z-field-description>{{ i18n.t().newsletterHelp }}</p>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
