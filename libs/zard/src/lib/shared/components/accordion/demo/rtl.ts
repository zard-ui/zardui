import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAccordionImports } from '@/shared/components/accordion/accordion.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface AccordionRtlValues {
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  question3: string;
  answer3: string;
}

const translations: ZardRtlTranslations<AccordionRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      question1: 'How do I reset my password?',
      answer1:
        "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password.",
      question2: 'Can I change my subscription plan?',
      answer2:
        'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.',
      question3: 'What payment methods do you accept?',
      answer3:
        'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      question1: 'كيف يمكنني إعادة تعيين كلمة المرور؟',
      answer1:
        "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.",
      question2: 'هل يمكنني تغيير خطة الاشتراك الخاصة بي؟',
      answer2: 'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.',
      question3: 'ما هي طرق الدفع التي تقبلونها؟',
      answer3:
        'نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      question1: 'איך אני מאפס את הסיסמה שלי?',
      answer1:
        "לחץ על 'שכחתי סיסמה' בעמוד ההתחברות, הזן את כתובת האימייל שלך, ונשלח לך קישור לאיפוס הסיסמה. הקישור יפוג תוך 24 שעות.",
      question2: 'האם אני יכול לשנות את תוכנית המנוי שלי?',
      answer2:
        'כן, אתה יכול לשדרג או להוריד את התוכנית שלך בכל עת מההגדרות של החשבון שלך. השינויים יבואו לידי ביטוי במחזור החיוב הבא.',
      question3: 'אילו אמצעי תשלום אתם מקבלים?',
      answer3: 'אנו מקבלים כרטיסי אשראי, PayPal והעברות בנקאיות.',
    },
  },
};

@Component({
  selector: 'z-demo-accordion-rtl',
  imports: [ZardAccordionImports],
  template: `
    <div z-accordion zDefaultValue="item-1" zType="single" class="max-w-md">
      <z-accordion-item zValue="item-1" [zTitle]="i18n.t().question1">{{ i18n.t().answer1 }}</z-accordion-item>
      <z-accordion-item zValue="item-2" [zTitle]="i18n.t().question2">{{ i18n.t().answer2 }}</z-accordion-item>
      <z-accordion-item zValue="item-3" [zTitle]="i18n.t().question3">{{ i18n.t().answer3 }}</z-accordion-item>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoAccordionRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
