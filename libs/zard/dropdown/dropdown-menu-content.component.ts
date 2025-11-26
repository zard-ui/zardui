import { Component, computed, input, type TemplateRef, viewChild, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@ngzard/ui/core';

import { dropdownContentVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-content',
  standalone: true,
  template: `
    <ng-template #contentTemplate>
      <div [class]="contentClasses()" role="menu" tabindex="-1" [attr.aria-orientation]="'vertical'">
        <ng-content />
      </div>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  exportAs: 'zDropdownMenuContent',
})
export class ZardDropdownMenuContentComponent {
  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownContentVariants(), this.class()));
}
