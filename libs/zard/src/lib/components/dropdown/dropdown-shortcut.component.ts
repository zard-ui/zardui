import { Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { dropdownShortcutVariants } from './dropdown.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-dropdown-menu-shortcut, [z-dropdown-menu-shortcut]',
  exportAs: 'zDropdownMenuShortcut',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownMenuShortcutComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(dropdownShortcutVariants(), this.class()));
}
