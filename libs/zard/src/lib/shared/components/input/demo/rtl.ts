import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; placeholder: string; description: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Username',
      placeholder: 'Enter your username',
      description: 'Choose a unique username for your account.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'اسم المستخدم',
      placeholder: 'أدخل اسم المستخدم',
      description: 'اختر اسم مستخدم فريدًا لحسابك.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'שם משתמש',
      placeholder: 'הזן את שם המשתמש',
      description: 'בחר שם משתמש ייחודי לחשבון שלך.',
    },
  },
};

@Component({
  selector: 'z-demo-input-rtl',
  imports: [ZardInputComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="input-rtl-username">{{ i18n.t().label }}</label>
      <input z-input id="input-rtl-username" type="text" [placeholder]="i18n.t().placeholder" />
      <p z-field-description>{{ i18n.t().description }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
