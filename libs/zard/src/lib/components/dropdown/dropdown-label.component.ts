import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownLabelVariants } from './dropdown.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

@Component({
  selector: 'z-dropdown-menu-label, [z-dropdown-menu-label]',
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    '[attr.data-inset]': 'inset() || null',
  },
  exportAs: 'zDropdownMenuLabel',
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
