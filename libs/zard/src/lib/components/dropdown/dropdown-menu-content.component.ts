import { Component, computed, input, type TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownContentVariants } from './dropdown.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-dropdown-menu-content',
  exportAs: 'zDropdownMenuContent',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  template: `
    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu" tabindex="-1" [attr.aria-orientation]="'vertical'">
        <ng-content></ng-content>
      </div>
    </ng-template>
  `,
})
export class ZardDropdownMenuContentComponent {
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}
