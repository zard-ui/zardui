import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuShortcutVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-navigation-menu-shortcut, [z-navigation-menu-shortcut]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-shortcut',
  },
  exportAs: 'zNavigationMenuShortcut',
})
export class ZardNavigationMenuShortcutComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(navigationMenuShortcutVariants(), this.class()));
}
