import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAspectRatioComponent } from '@/shared/components/aspect-ratio/aspect-ratio.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

const translations: ZardRtlTranslations<{ caption: string }> = {
  en: {
    dir: 'ltr',
    values: {
      caption: 'Beautiful landscape',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      caption: 'منظر طبيعي جميل',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      caption: 'נוף יפהפה',
    },
  },
};

@Component({
  selector: 'z-demo-aspect-ratio-rtl',
  imports: [ZardAspectRatioComponent, NgOptimizedImage],
  template: `
    <figure class="w-full max-w-sm">
      <z-aspect-ratio [zRatio]="16 / 9" class="bg-muted rounded-lg">
        <img
          ngSrc="https://avatar.vercel.sh/shadcn1"
          alt="Photo"
          fill
          class="rounded-lg object-cover grayscale dark:brightness-20"
        />
      </z-aspect-ratio>
      <figcaption class="text-muted-foreground mt-2 text-center text-sm">{{ i18n.t().caption }}</figcaption>
    </figure>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoAspectRatioRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);
}
