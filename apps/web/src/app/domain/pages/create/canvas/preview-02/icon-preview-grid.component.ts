import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowLeft,
  lucideArrowRight,
  lucideCheck,
  lucideChevronDown,
  lucideChevronRight,
  lucideCircleAlert,
  lucideCopy,
  lucideLoader2,
  lucideMinus,
  lucideMoreHorizontal,
  lucidePlus,
  lucideSearch,
  lucideSettings,
  lucideShare,
  lucideShoppingBag,
  lucideTrash,
} from '@ng-icons/lucide';

import { ZardCardImports } from '@zard/components/card/card.imports';

const PREVIEW_ICONS = [
  'lucideCopy',
  'lucideCircleAlert',
  'lucideTrash',
  'lucideShare',
  'lucideShoppingBag',
  'lucideMoreHorizontal',
  'lucideLoader2',
  'lucidePlus',
  'lucideMinus',
  'lucideArrowLeft',
  'lucideArrowRight',
  'lucideCheck',
  'lucideChevronDown',
  'lucideChevronRight',
  'lucideSearch',
  'lucideSettings',
] as const;

/** Drawn in lucide; the preview redraws every `<ng-icon>` in the icon library the user picked. */
@Component({
  selector: 'z-preview-02-icon-preview-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ZardCardImports],
  viewProviders: [
    provideIcons({
      lucideArrowLeft,
      lucideArrowRight,
      lucideCheck,
      lucideChevronDown,
      lucideChevronRight,
      lucideCircleAlert,
      lucideCopy,
      lucideLoader2,
      lucideMinus,
      lucideMoreHorizontal,
      lucidePlus,
      lucideSearch,
      lucideSettings,
      lucideShare,
      lucideShoppingBag,
      lucideTrash,
    }),
  ],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-content>
        <div class="grid grid-cols-8 place-items-center gap-4" data-icon-grid>
          @for (icon of icons; track icon) {
            <div
              class="ring-border style-sera:rounded-none flex size-8 items-center justify-center rounded-md ring *:[svg]:size-4"
            >
              <ng-icon [name]="icon" class="size-4" />
            </div>
          }
        </div>
      </z-card-content>
    </z-card>
  `,
})
export class Preview02IconPreviewGridComponent {
  protected readonly icons = PREVIEW_ICONS;
}
