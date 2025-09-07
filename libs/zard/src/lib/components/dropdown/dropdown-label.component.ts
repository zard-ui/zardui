import type { ClassValue } from 'clsx';

import { Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { dropdownLabelVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-label, [z-dropdown-menu-label]',
  exportAs: 'zDropdownMenuLabel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
    '[attr.data-inset]': 'inset() || null',
  },
})
export class ZardDropdownMenuLabelComponent {
  readonly inset = input(false, { transform });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownLabelVariants({
        inset: this.inset(),
      }),
      this.class(),
    ),
  );
}
