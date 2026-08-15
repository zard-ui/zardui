import type { BooleanInput } from '@angular/cdk/coercion';
import { CDK_MENU, CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, signal, untracked } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  navigationMenuLinkVariants,
  type ZardNavigationMenuLinkTypeVariants,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * A single entry of a navigation menu. Pair `[zActive]` with `routerLinkActive` to mark the link
 * matching the current route.
 */
@Directive({
  selector: 'button[z-navigation-menu-link], a[z-navigation-menu-link], [z-navigation-menu-link]',
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-link',
    '[attr.role]': 'role()',
    '[attr.data-orientation]': "'horizontal'",
    '[attr.data-state]': 'isOpenState()',
    '[attr.data-active]': "zActive() ? '' : undefined",
    '[attr.aria-current]': "zActive() ? 'page' : undefined",
    '[attr.aria-disabled]': "disabledState() ? '' : undefined",
    '[attr.data-disabled]': "disabledState() ? '' : undefined",
    '[attr.data-highlighted]': "highlightedState() ? '' : undefined",
    // No pointer-driven focus here: the pointer must not move the focus, or `focus:bg-muted` and
    // the focus ring stay behind on the last link the mouse crossed. Hovering is `hover:` alone.
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onClick($event)',
    '(keydown.space)': 'onClick($event)',
  },
  hostDirectives: [
    {
      directive: CdkMenuItem,
      outputs: ['cdkMenuItemTriggered: menuItemTriggered'],
    },
  ],
  exportAs: 'zNavigationMenuLink',
})
export class ZardNavigationMenuLinkDirective {
  private readonly cdkMenuItem = inject(CdkMenuItem, { host: true });
  /** Only present when the link sits inside a `[z-navigation-menu-content]`, which is a `CdkMenu`. */
  private readonly parentMenu = inject(CDK_MENU, { optional: true });

  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zInset = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zActive = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zType = input<ZardNavigationMenuLinkTypeVariants>('default');
  readonly class = input<ClassValue>('');

  private readonly isFocused = signal(false);

  /**
   * `CdkMenuItem` always stamps `role="menuitem"`, which is only valid inside a menu. A link
   * declared straight on the bar has no such parent, so axe flags it as `aria-required-parent`;
   * dropping the role there leaves the anchor with its own implicit `link` role.
   */
  protected readonly role = computed(() => (this.parentMenu ? 'menuitem' : null));

  protected readonly disabledState = computed(() => this.zDisabled());

  protected readonly isOpenState = computed(() => this.cdkMenuItem.isMenuOpen());

  protected readonly highlightedState = computed(() => this.isFocused());

  protected readonly classes = computed(() =>
    mergeClasses(
      navigationMenuLinkVariants({
        inset: this.zInset(),
        zType: this.zType(),
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

  onClick(event: Event) {
    if (this.disabledState()) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
