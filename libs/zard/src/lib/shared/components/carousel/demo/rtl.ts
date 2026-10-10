import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardCarouselImports } from '@/shared/components/carousel/carousel.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

/** The carousel has no text of its own; each language only picks the numerals of the slides. */
const translations: ZardRtlTranslations<{ locale: string }> = {
  en: { dir: 'ltr', values: { locale: 'en-US' } },
  ar: { dir: 'rtl', values: { locale: 'ar-EG' } },
  he: { dir: 'rtl', values: { locale: 'he-IL' } },
};

@Component({
  selector: 'z-demo-carousel-rtl',
  imports: [ZardCarouselImports, ZardCardImports],
  template: `
    <!-- Embla and the arrows follow the direction: ArrowLeft goes to the next slide in RTL. -->
    <div class="w-full max-w-48 sm:max-w-xs">
      <z-carousel>
        <z-carousel-content>
          @for (slide of slides(); track slide.index) {
            <z-carousel-item>
              <div class="p-1">
                <z-card>
                  <z-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-4xl font-semibold">{{ slide.label }}</span>
                  </z-card-content>
                </z-card>
              </div>
            </z-carousel-item>
          }
        </z-carousel-content>
      </z-carousel>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCarouselRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly slides = computed(() => {
    const formatter = new Intl.NumberFormat(this.i18n.t().locale);
    return Array.from({ length: 5 }, (_, index) => ({ index, label: formatter.format(index + 1) }));
  });
}
