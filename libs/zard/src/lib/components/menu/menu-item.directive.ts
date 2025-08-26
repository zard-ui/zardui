import { ClassValue } from 'class-variance-authority/dist/types';

import { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, signal } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuItemVariants, ZardMenuItemVariants } from './menu.variants';

@Directive({
  selector: 'button[z-menu-item], [z-menu-item]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuItem,
      outputs: ['cdkMenuItemTriggered: menuItemTriggered'],
    },
  ],
  host: {
    role: 'menuitem',
    tabindex: '-1',
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
})
export class ZardMenuItemDirective {
  private readonly cdkMenuItem = inject(CdkMenuItem, { host: true });

  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zInset = input<ZardMenuItemVariants['inset']>(false);
  readonly class = input<ClassValue>('');

  private readonly isFocused = signal(false);

  protected readonly disabledState = computed(() => this.zDisabled());

  protected readonly isOpenState = signal(false);

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
      this.cdkMenuItem.disabled = this.zDisabled();
      this.isOpenState.set(this.cdkMenuItem.isMenuOpen());
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
