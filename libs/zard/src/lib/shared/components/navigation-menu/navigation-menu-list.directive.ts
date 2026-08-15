import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuListVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Directive({
  selector: '[z-navigation-menu-list]',
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-list',
  },
  exportAs: 'zNavigationMenuList',
})
export class ZardNavigationMenuListDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(navigationMenuListVariants(), this.class()));
}
