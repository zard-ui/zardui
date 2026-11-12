import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface Strings {
  messages: string[];
  jump: string;
}

const translations: ZardRtlTranslations<Strings> = {
  en: {
    dir: 'ltr',
    values: {
      jump: 'Jump to latest',
      messages: [
        'Is the release still on for Friday?',
        'Yes, both branches are frozen.',
        'Did QA finish the checkout flow?',
        'They are on the last scenario.',
        'Great, ping me when it is green.',
        'Will do.',
        'Anything blocking the migration?',
        'Nothing. It ships a release ahead.',
        'Perfect, thanks.',
        'Anytime.',
      ],
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      jump: 'الانتقال إلى الأحدث',
      messages: [
        'هل الإصدار ما زال مقررا يوم الجمعة؟',
        'نعم، تم تجميد الفرعين.',
        'هل أنهى فريق الجودة مسار الدفع؟',
        'هم في آخر سيناريو.',
        'ممتاز، أخبرني عندما ينجح كل شيء.',
        'سأفعل.',
        'هل هناك ما يعيق الترحيل؟',
        'لا شيء. سيصدر قبل الإصدار بنسخة.',
        'رائع، شكرا.',
        'على الرحب والسعة.',
      ],
    },
  },
  he: {
    dir: 'rtl',
    values: {
      jump: 'קפיצה לאחרונה',
      messages: [
        'האם הגרסה עדיין מתוכננת ליום שישי?',
        'כן, שני הענפים הוקפאו.',
        'האם ה-QA סיימו את תהליך התשלום?',
        'הם בתרחיש האחרון.',
        'מעולה, תעדכן אותי כשהכול ירוק.',
        'אעשה זאת.',
        'האם משהו חוסם את המיגרציה?',
        'שום דבר. היא יוצאת גרסה לפני.',
        'מושלם, תודה.',
        'בכל עת.',
      ],
    },
  },
};

@Component({
  selector: 'z-demo-message-scroller-rtl',
  imports: [...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller class="h-80 w-full max-w-md rounded-lg border">
      @for (text of i18n.t().messages; track $index) {
        <z-message-scroller-item [zMessageId]="'m' + $index">
          <z-message [zAlign]="$index % 2 === 0 ? 'end' : 'start'" [zVariant]="$index % 2 === 0 ? 'default' : 'muted'">
            {{ text }}
          </z-message>
        </z-message-scroller-item>
      }

      <button type="button" z-message-scroller-button zDirection="end" [attr.aria-label]="i18n.t().jump"></button>
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
