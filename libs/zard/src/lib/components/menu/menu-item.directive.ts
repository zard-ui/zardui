import { ClassValue } from 'class-variance-authority/dist/types';

import { Directive, computed, input, signal } from '@angular/core';

import { mergeClasses, transform } from '../../shared/utils/utils';
import { menuItemVariants, ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-item]',
  exportAs: 'zMenuItem',
  standalone: true,
  host: {
    role: 'menuitem',
    '[class]': 'classes()',
    '[attr.aria-disabled]': 'zDisabled()',
    '[tabindex]': 'tabIndex()',
  },
})
export class ZardMenuItemDirective {
  readonly zDisabled = input(false, { transform });
  readonly zLevel = input<ZardMenuItemVariants['zLevel']>(1);

  readonly class = input<ClassValue>('');

  private mode = signal<ZardMenuItemVariants['zMode']>('vertical');

  protected readonly classes = computed(() =>
    mergeClasses(
      menuItemVariants({
        zMode: this.mode(),
        zDisabled: this.zDisabled(),
        zLevel: this.zLevel(),
      }),
      this.class(),
    ),
  );

  protected readonly tabIndex = computed(() => {
    return this.zDisabled() ? -1 : 0;
  });

  setMode(mode: ZardMenuItemVariants['zMode']) {
    this.mode.set(mode);
  }
}
