import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button';
import type { ZardTooltipSide } from '@/shared/components/tooltip/tooltip-positions';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface TooltipRtlValues {
  content: string;
  'inline-start': string;
  left: string;
  top: string;
  bottom: string;
  right: string;
  'inline-end': string;
}

const translations: ZardRtlTranslations<TooltipRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      content: 'Add to library',
      'inline-start': 'Inline Start',
      left: 'Left',
      top: 'Top',
      bottom: 'Bottom',
      right: 'Right',
      'inline-end': 'Inline End',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      content: 'إضافة إلى المكتبة',
      'inline-start': 'بداية السطر',
      left: 'يسار',
      top: 'أعلى',
      bottom: 'أسفل',
      right: 'يمين',
      'inline-end': 'نهاية السطر',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      content: 'הוסף לספרייה',
      'inline-start': 'תחילת השורה',
      left: 'שמאל',
      top: 'למעלה',
      bottom: 'למטה',
      right: 'ימין',
      'inline-end': 'סוף השורה',
    },
  },
};

@Component({
  selector: 'z-demo-tooltip-rtl',
  imports: [ZardButtonComponent, ZardTooltipImports],
  template: `
    <div class="grid gap-4">
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of physicalSides; track side) {
          <button type="button" z-button zType="outline" [zTooltip]="i18n.t().content" [zPosition]="side">
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of logicalSides; track side) {
          <button type="button" z-button zType="outline" [zTooltip]="i18n.t().content" [zPosition]="side">
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTooltipRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly physicalSides: ZardTooltipSide[] = ['left', 'top', 'bottom', 'right'];
  protected readonly logicalSides: ZardTooltipSide[] = ['inline-start', 'inline-end'];
}
