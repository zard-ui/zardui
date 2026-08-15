import type { BooleanInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuLabelVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-navigation-menu-label, [z-navigation-menu-label]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-label',
    '[attr.data-inset]': 'inset() || null',
  },
  exportAs: 'zNavigationMenuLabel',
})
export class ZardNavigationMenuLabelComponent {
  readonly class = input<ClassValue>('');
  readonly inset = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  protected readonly classes = computed(() =>
    mergeClasses(
      navigationMenuLabelVariants({
        inset: this.inset(),
      }),
      this.class(),
    ),
  );
}
