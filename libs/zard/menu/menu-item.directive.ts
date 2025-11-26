import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, signal, untracked } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@ngzard/ui/core';

import { menuItemVariants, type ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: 'button[z-menu-item], [z-menu-item]',
  standalone: true,
  host: {
    '[class]': 'classes()',
    '[attr.data-orientation]': "'horizontal'",
    '[attr.data-state]': 'isOpenState()',
    '[attr.aria-disabled]': "disabledState() ? '' : undefined",
    '[attr.data-disabled]': "disabledState() ? '' : undefined",
    '[attr.data-highlighted]': "highlightedState() ? '' : undefined",

    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(pointermove)': 'onPointerMove($event)',
  },
  hostDirectives: [
    {
      directive: CdkMenuItem,
      outputs: ['cdkMenuItemTriggered: menuItemTriggered'],
    },
  ],
})
export class ZardMenuItemDirective {
  private readonly cdkMenuItem = inject(CdkMenuItem, { host: true });

  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zInset = input<ZardMenuItemVariants['inset']>(false);
  readonly class = input<ClassValue>('');

  private readonly isFocused = signal(false);

  protected readonly disabledState = computed(() => this.zDisabled());

  protected readonly isOpenState = computed(() => this.cdkMenuItem.isMenuOpen());

  protected readonly highlightedState = computed(() => this.isFocused());

  protected readonly classes = computed(() =>
    mergeClasses(
      menuItemVariants({
        inset: this.zInset(),
      }),
      this.class(),
    ),
  );

  constructor() {
    effect(() => {
      const disabled = this.zDisabled();
      untracked(() => {
        this.cdkMenuItem.disabled = disabled;
      });
    });
  }

  onFocus(): void {
    if (!this.zDisabled()) {
      this.isFocused.set(true);
    }
  }

  onBlur(): void {
    this.isFocused.set(false);
  }

  onPointerMove(event: PointerEvent) {
    if (event.defaultPrevented) return;

    if (!(event.pointerType === 'mouse')) return;

    if (!this.zDisabled()) {
      const item = event.currentTarget;
      (item as HTMLElement)?.focus({ preventScroll: true });
    }
  }
}
