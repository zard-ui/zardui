import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownItemVariants, type ZardDropdownItemTypeVariants } from './dropdown.variants';

@Component({
  selector: 'z-dropdown-menu-item, [z-dropdown-menu-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'dropdown-menu-item',
    '[attr.data-disabled]': 'isDisabled() || null',
    '[attr.data-variant]': 'itemVariant()',
    '[attr.data-inset]': 'isInset() || null',
    '[attr.aria-disabled]': 'isDisabled()',
    '(click.prevent-with-stop)': 'onClick()',
    role: 'menuitem',
    tabindex: '-1',
  },
  exportAs: 'zDropdownMenuItem',
})
export class ZardDropdownMenuItemComponent {
  private readonly dropdownService = inject(ZardDropdownService);

  readonly variant = input<ZardDropdownItemTypeVariants>('default');
  readonly zType = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zType' });
  readonly zVariant = input<ZardDropdownItemTypeVariants | undefined>(undefined, { alias: 'zVariant' });
  readonly inset = input(false, { transform: booleanAttribute });
  readonly zInset = input<boolean | undefined, unknown>(undefined, {
    alias: 'zInset',
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly disabled = input(false, { transform: booleanAttribute });
  readonly zDisabled = input<boolean | undefined, unknown>(undefined, {
    alias: 'zDisabled',
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly class = input<ClassValue>('');

  onClick() {
    if (this.isDisabled()) {
      return;
    }

    setTimeout(() => {
      this.dropdownService.closeAndFocusTrigger();
    }, 0);
  }

  protected readonly isDisabled = computed(() => this.zDisabled() ?? this.disabled());
  protected readonly itemVariant = computed(() => this.zType() ?? this.zVariant() ?? this.variant());
  protected readonly isInset = computed(() => this.zInset() ?? this.inset());

  protected readonly classes = computed(() =>
    mergeClasses(
      dropdownItemVariants({
        variant: this.itemVariant(),
        inset: this.isInset(),
      }),
      this.class(),
    ),
  );
}
