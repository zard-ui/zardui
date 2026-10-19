import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import {
  ZardHoverCardComponent,
  ZardHoverCardDirective,
  type ZardHoverCardSide,
} from '@/shared/components/hover-card/hover-card.component';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

interface HoverCardRtlValues {
  name: string;
  price: string;
  'inline-start': string;
  left: string;
  top: string;
  bottom: string;
  right: string;
  'inline-end': string;
}

const translations: ZardRtlTranslations<HoverCardRtlValues> = {
  en: {
    dir: 'ltr',
    values: {
      name: 'Wireless Headphones',
      price: '$99.99',
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
      name: 'سماعات لاسلكية',
      price: '٩٩.٩٩ $',
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
      name: 'אוזניות אלחוטיות',
      price: '99.99 $',
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
  selector: 'z-demo-hover-card-rtl',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <div class="grid gap-4">
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of physicalSides; track side) {
          <button
            type="button"
            z-button
            zType="outline"
            [zHoverCard]="content"
            [zPlacement]="side"
            [zOpenDelay]="100"
            [zCloseDelay]="100"
          >
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
      <div class="flex flex-wrap justify-center gap-2">
        @for (side of logicalSides; track side) {
          <button
            type="button"
            z-button
            zType="outline"
            [zHoverCard]="content"
            [zPlacement]="side"
            [zOpenDelay]="100"
            [zCloseDelay]="100"
          >
            {{ i18n.t()[side] }}
          </button>
        }
      </div>
    </div>

    <ng-template #content>
      <z-hover-card class="flex w-64 flex-col gap-1">
        <div class="font-semibold">{{ i18n.t().name }}</div>
        <div class="text-muted-foreground text-sm">{{ i18n.t().price }}</div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly physicalSides: ZardHoverCardSide[] = ['left', 'top', 'bottom', 'right'];
  protected readonly logicalSides: ZardHoverCardSide[] = ['inline-start', 'inline-end'];
}
