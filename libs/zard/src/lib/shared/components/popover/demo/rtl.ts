import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import type { ZardPopoverPlacement } from '@/shared/components/popover/popover.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface PopoverRtlValues {
  title: string;
  description: string;
  'inline-start': string;
  left: string;
  top: string;
  bottom: string;
  right: string;
  'inline-end': string;
}

const translations: ZardRtlTranslations<PopoverRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      title: 'Dimensions',
      description: 'Set the dimensions for the layer.',
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
      title: 'الأبعاد',
      description: 'تعيين الأبعاد للطبقة.',
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
      title: 'מימדים',
      description: 'הגדר את המימדים לשכבה.',
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
  selector: 'z-demo-popover-rtl',
  imports: [ZardButtonComponent, ...ZardPopoverImports],
  template: `
    <div class="grid gap-4">
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of physicalSides; track side) {
          <button type="button" z-button zPopover zType="outline" [zPlacement]="side" [zContent]="content">
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of logicalSides; track side) {
          <button type="button" z-button zPopover zType="outline" [zPlacement]="side" [zContent]="content">
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
    </div>

    <ng-template #content>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>{{ i18n.t().title }}</h4>
          <p z-popover-description>{{ i18n.t().description }}</p>
        </div>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly physicalSides: ZardPopoverPlacement[] = ['left', 'top', 'bottom', 'right'];
  protected readonly logicalSides: ZardPopoverPlacement[] = ['inline-start', 'inline-end'];
}
