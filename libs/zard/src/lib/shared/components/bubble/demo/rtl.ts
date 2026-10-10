import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface BubbleRtlValues {
  question: string;
  answer: string;
  reply: string;
  reactionsLabel: string;
}

const translations: ZardRtlTranslations<BubbleRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      question: "I don't need tests, I know my code works.",
      answer: "Bold. Fine I'll add some tests. I'll let you know when they're done.",
      reply: 'Tests passed on the first try. All 142 of them. Looking good!',
      reactionsLabel: 'Reactions: thumbs up, surprised',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      question: 'لا أحتاج إلى اختبارات، أعرف أن الكود الخاص بي يعمل.',
      answer: 'جريء. حسنًا، سأضيف بعض الاختبارات. سأخبرك عندما تنتهي.',
      reply: 'نجحت الاختبارات من المحاولة الأولى. جميعها 142. يبدو رائعًا!',
      reactionsLabel: 'ردود الفعل: إعجاب، دهشة',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      question: 'אני לא צריך בדיקות, אני יודע שהקוד שלי עובד.',
      answer: 'נועז. בסדר, אוסיף כמה בדיקות. אעדכן אותך כשהן יסתיימו.',
      reply: 'הבדיקות עברו בניסיון הראשון. כל 142 מהן. נראה מצוין!',
      reactionsLabel: 'תגובות: לייק, הפתעה',
    },
  },
};

@Component({
  selector: 'z-demo-bubble-rtl',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
      <z-bubble zVariant="muted" zAlign="end">
        <z-bubble-content>{{ i18n.t().question }}</z-bubble-content>
        <z-bubble-reactions role="img" [attr.aria-label]="i18n.t().reactionsLabel" zAlign="start">
          <span>👍</span>
          <span>😮</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>{{ i18n.t().answer }}</z-bubble-content>
        <z-bubble-reactions role="img" [attr.aria-label]="i18n.t().reactionsLabel">
          <span>👀</span>
          <span>🚀</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zAlign="end">
        <z-bubble-content>{{ i18n.t().reply }}</z-bubble-content>
      </z-bubble>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoBubbleRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
