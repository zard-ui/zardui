import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ first: string; second: string; third: string; delivered: string }> = {
  en: {
    dir: 'ltr',
    values: {
      first: 'Deploying to prod real quick.',
      second: "It's 4:55 PM. On a Friday.",
      third: "It's a one-line change.",
      delivered: 'Delivered',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      first: 'سأنشر على الإنتاج بسرعة.',
      second: 'الساعة 4:55 مساءً. يوم الجمعة.',
      third: 'إنه تغيير من سطر واحد.',
      delivered: 'تم التسليم',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      first: 'אני מעלה לפרודקשן מהר.',
      second: 'השעה 4:55 אחר הצהריים. ביום שישי.',
      third: 'זה שינוי של שורה אחת.',
      delivered: 'נמסר',
    },
  },
};

@Component({
  selector: 'z-demo-message-rtl',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>{{ i18n.t().first }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>{{ i18n.t().second }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>{{ i18n.t().third }}</z-bubble-content>
          </z-bubble>
          <z-message-footer>{{ i18n.t().delivered }}</z-message-footer>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
