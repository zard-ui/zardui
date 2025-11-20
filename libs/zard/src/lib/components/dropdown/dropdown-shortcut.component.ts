import { Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownShortcutVariants } from './dropdown.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-dropdown-menu-shortcut, [z-dropdown-menu-shortcut]',
  standalone: true,
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zDropdownMenuShortcut',
})
export class ZardDropdownMenuShortcutComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dropdownShortcutVariants(), this.class()));
}
