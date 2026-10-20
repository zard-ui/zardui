import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ label: string; description: string; placeholder: string }> = {
  en: {
    dir: 'ltr',
    values: {
      label: 'Message',
      description: 'Enter your message below.',
      placeholder: 'Type your message here.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      label: 'الرسالة',
      description: 'أدخل رسالتك أدناه.',
      placeholder: 'اكتب رسالتك هنا.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      label: 'הודעה',
      description: 'הזן את הודעתך למטה.',
      placeholder: 'הקלד את הודעתך כאן.',
    },
  },
};

@Component({
  selector: 'z-demo-textarea-rtl',
  imports: [ZardTextareaComponent, ...ZardFieldImports],
  template: `
    <div z-field class="w-72">
      <label z-field-label for="textarea-rtl-message">{{ i18n.t().label }}</label>
      <p z-field-description>{{ i18n.t().description }}</p>
      <textarea z-textarea id="textarea-rtl-message" [placeholder]="i18n.t().placeholder"></textarea>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
