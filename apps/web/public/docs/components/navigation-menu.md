---
title: Navigation Menu
description: A collection of links for navigating websites.
---

# Navigation Menu

A collection of links for navigating websites.

## About

The navigation menu is built on top of the Angular CDK Menu.

[Angular CDK Menu](https://material.angular.dev/cdk/menu/overview)

## Installation

### CLI

```bash
npx zard-cli@latest add navigation-menu
```

### Manual

```angular-ts
import type { BooleanInput } from '@angular/cdk/coercion';
import { PARENT_OR_NEW_MENU_STACK_PROVIDER } from '@angular/cdk/menu';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  navigationMenuVariants,
  type ZardNavigationMenuAlign,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuViewportComponent } from './navigation-menu-viewport.component';
import { ZardNavigationMenuService } from './navigation-menu.service';

/**
 * Root of a navigation bar. With `zViewport` enabled (the default) every trigger inside shares a
 * single animated popup; with it disabled each trigger opens its own popup in an overlay.
 */
@Component({
  selector: 'z-navigation-menu, [z-navigation-menu]',
  imports: [ZardNavigationMenuViewportComponent],
  template: `
    <ng-content />

    @if (zViewport()) {
      <z-navigation-menu-viewport />
    }
  `,
  // The menu stack covers links declared straight on an item, with no content above them to provide it.
  providers: [ZardNavigationMenuService, PARENT_OR_NEW_MENU_STACK_PROVIDER],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu',
    '[attr.data-viewport]': 'zViewport()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(keydown.escape)': 'onEscape()',
  },
  exportAs: 'zNavigationMenu',
})
export class ZardNavigationMenuComponent {
  private readonly service = inject(ZardNavigationMenuService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly viewportRef = viewChild(ZardNavigationMenuViewportComponent);

  readonly class = input<ClassValue>('');
  readonly zViewport = input<boolean, BooleanInput>(true, { transform: booleanAttribute });
  readonly zAlign = input<ZardNavigationMenuAlign>('start');
  readonly zHoverDelay = input<number>(100);

  protected readonly classes = computed(() => mergeClasses(navigationMenuVariants(), this.class()));

  constructor() {
    this.service.rootElement.set(this.elementRef.nativeElement);

    effect(() => this.service.viewport.set(this.zViewport()));
    effect(() => this.service.hoverDelay.set(this.zHoverDelay()));
    effect(() => this.viewportRef()?.align.set(this.zAlign()));
  }

  protected onMouseEnter(): void {
    this.service.cancelScheduledClose();
  }

  /** Leaving the bar altogether closes the viewport, after the grace period of `zHoverDelay`. */
  protected onMouseLeave(): void {
    this.service.scheduleClose();
  }

  protected onEscape(): void {
    this.service.close();
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const navigationMenuVariants = cva([
  'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
]);

export const navigationMenuListVariants = cva(['group flex flex-1 list-none items-center justify-center gap-0']);

export const navigationMenuItemVariants = cva(['relative']);

export const navigationMenuTriggerVariants = cva([
  'group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center gap-1 rounded-lg px-2.5 py-1.5',
  'text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted',
  'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1',
  'disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50',
  'data-[state=open]:bg-muted/50 data-[state=open]:hover:bg-muted data-[state=open]:focus:bg-muted',
]);

export const navigationMenuTriggerIconVariants = cva([
  'relative top-px size-3 shrink-0 transition-transform duration-300',
  'group-data-[state=open]/navigation-menu-trigger:rotate-180',
]);

export const navigationMenuContentVariants = cva(
  [
    'h-full w-auto p-1 outline-none',
    'transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
    'data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out',
    'data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out',
    'data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52',
    'data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52',
  ],
  {
    variants: {
      viewport: {
        true: '',
        false: [
          'relative z-50 min-w-32 rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10',
          // The overlay is offset by 8px from the trigger, and that gap belongs to no element: a
          // pointer crossing it slowly would schedule the close before reaching the popup. This
          // invisible collar covers the offset on every side, since submenus open sideways too.
          "before:absolute before:-inset-2 before:-z-10 before:content-['']",
          'animate-in data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        ],
      },
    },
    defaultVariants: {
      viewport: false,
    },
  },
);

/**
 * Lives inside a CDK overlay pane anchored to the bar, so it needs no positioning of its own —
 * the horizontal offset that tracks the active trigger is applied as an inline `translate`, and
 * the transition here is what makes that tracking slide instead of jump. The top padding doubles
 * as the bridge the pointer crosses on its way from the trigger to the popup.
 */
export const navigationMenuViewportWrapperVariants = cva([
  'flex pt-1.5 transition-[translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
]);

export const navigationMenuViewportVariants = cva([
  'relative h-(--zard-navigation-menu-viewport-height) w-(--zard-navigation-menu-viewport-width)',
  'origin-top overflow-hidden rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10',
  'transition-[opacity,transform,width,height] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none',
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-90',
  'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-90',
  'data-[state=closed]:duration-150',
]);

export const navigationMenuLinkVariants = cva(
  [
    'relative flex w-full cursor-default select-none items-center gap-2 rounded-md p-2 text-left text-sm',
    'transition-all outline-none hover:bg-muted focus:bg-muted',
    'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1',
    'data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 [&>i]:mr-2 [&>z-icon]:mr-2 [&>ng-icon]:shrink-0",
  ],
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
      zType: {
        default: '',
        destructive: 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive',
      },
    },
    defaultVariants: {
      inset: false,
      zType: 'default',
    },
  },
);

export const navigationMenuIndicatorVariants = cva([
  'pointer-events-none absolute top-full left-0 z-1 flex h-1.5 items-end justify-center overflow-hidden',
  'transition-[translate,width,opacity] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)]',
]);

export const navigationMenuSubmenuArrowVariants = cva([
  'ml-auto opacity-60 transition-opacity duration-150',
  'text-muted-foreground dark:text-gray-400',
  'group-hover:opacity-100 group-focus:opacity-100',
]);

export const navigationMenuLabelVariants = cva(
  'relative flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground',
  {
    variants: {
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      inset: false,
    },
  },
);

export const navigationMenuShortcutVariants = cva('ml-auto text-xs tracking-widest text-muted-foreground');

export type ZardNavigationMenuLinkTypeVariants = NonNullable<VariantProps<typeof navigationMenuLinkVariants>['zType']>;

/** Which edge of the active trigger the shared viewport lines up with. */
export type ZardNavigationMenuAlign = 'start' | 'center' | 'end';
```

```angular-ts
/**
 * The context menu lives in its own component folder — it is not navigation, and as long as it
 * lived here it had no docs page, no demos and no install path. This file stays so the old import
 * keeps resolving.
 *
 * @deprecated Import from `@/shared/components/context-menu` instead.
 */
export { ZardContextMenuDirective } from '@/shared/components/context-menu/context-menu.directive';
```

```angular-ts
export * from '@/shared/components/navigation-menu/context-menu.directive';
export * from '@/shared/components/navigation-menu/navigation-menu-content.directive';
export * from '@/shared/components/navigation-menu/navigation-menu-indicator.component';
export * from '@/shared/components/navigation-menu/navigation-menu-item.directive';
export * from '@/shared/components/navigation-menu/navigation-menu-label.component';
export * from '@/shared/components/navigation-menu/navigation-menu-link.directive';
export * from '@/shared/components/navigation-menu/navigation-menu-list.directive';
export * from '@/shared/components/navigation-menu/navigation-menu-manager.service';
export * from '@/shared/components/navigation-menu/navigation-menu-positions';
export * from '@/shared/components/navigation-menu/navigation-menu-shortcut.component';
export * from '@/shared/components/navigation-menu/navigation-menu-trigger.directive';
export * from '@/shared/components/navigation-menu/navigation-menu-viewport.component';
export * from '@/shared/components/navigation-menu/navigation-menu.component';
export * from '@/shared/components/navigation-menu/navigation-menu.imports';
export * from '@/shared/components/navigation-menu/navigation-menu.service';
export * from '@/shared/components/navigation-menu/navigation-menu.variants';
```

```angular-ts
import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, inject, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuContentVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuService } from './navigation-menu.service';

/**
 * Holds the links of one trigger. In the shared viewport it is plain content — the viewport draws
 * the surface; in overlay mode it *is* the popup, so it gets the background, ring and shadow.
 */
@Directive({
  selector: '[z-navigation-menu-content]',
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-content',
    tabindex: '0',
    '[attr.data-state]': "'open'",
    '[attr.data-motion]': 'motion()',
  },
  // No focus trap: a navigation popup is not a modal. Trapping would also mean auto-capturing the
  // focus on open, which for a hover-opened menu lands `focus:bg-muted` and the focus ring on a
  // link the pointer never touched. Keyboard access is `CdkMenu`'s job, as it is in the dropdown.
  hostDirectives: [CdkMenu],
  exportAs: 'zNavigationMenuContent',
})
export class ZardNavigationMenuContentDirective {
  /** Present when the content is declared inside a `<z-navigation-menu>`. */
  private readonly service = inject(ZardNavigationMenuService, { optional: true });

  readonly class = input<ClassValue>('');

  private readonly isViewportMode = computed(() => this.service?.viewport() ?? false);

  /** Drives the directional slide of the CVA when the viewport morphs between two triggers. */
  protected readonly motion = computed(() => (this.isViewportMode() ? this.service?.motion() : null));

  protected readonly classes = computed(() =>
    mergeClasses(navigationMenuContentVariants({ viewport: this.isViewportMode() }), this.class()),
  );
}
```

```angular-ts
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  PLATFORM_ID,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuIndicatorVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuService } from './navigation-menu.service';

/** The arrow that slides along the bar to point at the trigger currently owning the viewport. */
@Component({
  selector: 'z-navigation-menu-indicator, [z-navigation-menu-indicator]',
  template: `
    <div class="bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-indicator',
    'aria-hidden': 'true',
    '[attr.data-state]': "visible() ? 'visible' : 'hidden'",
    '[style.translate]': 'geometry().translate',
    '[style.width.px]': 'geometry().width',
    '[style.opacity]': 'visible() ? 1 : 0',
  },
  exportAs: 'zNavigationMenuIndicator',
})
export class ZardNavigationMenuIndicatorComponent {
  private readonly service = inject(ZardNavigationMenuService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly class = input<ClassValue>('');

  /** Kept as the last known position so hiding fades out in place instead of jumping to zero. */
  private readonly measured = signal({ translate: '0px', width: 0 });

  protected readonly visible = computed(() => this.service.isOpen());
  protected readonly geometry = this.measured.asReadonly();
  protected readonly classes = computed(() => mergeClasses(navigationMenuIndicatorVariants(), this.class()));

  constructor() {
    effect(() => {
      const active = this.service.active();
      const root = this.service.rootElement();

      if (!active || !root || !isPlatformBrowser(this.platformId)) return;

      const trigger = active.element.getBoundingClientRect();
      const bar = root.getBoundingClientRect();

      this.measured.set({ translate: `${trigger.left - bar.left}px`, width: trigger.width });
    });
  }
}
```

```angular-ts
import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { navigationMenuItemVariants } from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Directive({
  selector: '[z-navigation-menu-item]',
  host: {
    '[class]': 'classes()',
    'data-slot': 'navigation-menu-item',
  },
  exportAs: 'zNavigationMenuItem',
})
export class ZardNavigationMenuItemDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(navigationMenuItemVariants(), this.class()));
}
```

```angular-ts
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
```

```angular-ts
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
```

```angular-ts
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
```

```angular-ts
import { Injectable } from '@angular/core';

import type { ZardNavigationMenuTriggerDirective } from './navigation-menu-trigger.directive';

/**
 * Global guard for hover triggers running in overlay mode — opening one closes the previous.
 * Triggers sharing a viewport are coordinated by `ZardNavigationMenuService` instead, which is
 * scoped to each root.
 */
@Injectable({
  providedIn: 'root',
})
export class ZardNavigationMenuManagerService {
  private activeHoverMenu: ZardNavigationMenuTriggerDirective | null = null;

  registerHoverMenu(menu: ZardNavigationMenuTriggerDirective): void {
    if (this.activeHoverMenu && this.activeHoverMenu !== menu) {
      this.activeHoverMenu.close();
    }
    this.activeHoverMenu = menu;
  }

  unregisterHoverMenu(menu: ZardNavigationMenuTriggerDirective): void {
    if (this.activeHoverMenu === menu) {
      this.activeHoverMenu = null;
    }
  }

  closeActiveMenu(): void {
    if (this.activeHoverMenu) {
      this.activeHoverMenu.close();
      this.activeHoverMenu = null;
    }
  }
}
```

```angular-ts
import type { ConnectedPosition } from '@angular/cdk/overlay';

export const NAVIGATION_MENU_POSITIONS_MAP: { [key: string]: ConnectedPosition[] } = {
  bottomLeft: [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ],
  bottomCenter: [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ],
  bottomRight: [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
  ],
  topLeft: [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8,
    },
  ],
  topCenter: [
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -8,
    },
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 8,
    },
  ],
  topRight: [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8,
    },
  ],
  leftTop: [
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: -8,
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 8,
    },
  ],
  leftCenter: [
    {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -8,
    },
    {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 8,
    },
  ],
  leftBottom: [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: -8,
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 8,
    },
  ],
  rightTop: [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: 8,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: -8,
    },
  ],
  rightCenter: [
    {
      originX: 'end',
      originY: 'center',
      overlayX: 'start',
      overlayY: 'center',
      offsetX: 8,
    },
    {
      originX: 'start',
      originY: 'center',
      overlayX: 'end',
      overlayY: 'center',
      offsetX: -8,
    },
  ],
  rightBottom: [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: 8,
    },
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: -8,
    },
  ],
};

export type ZardNavigationMenuPlacement =
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'leftTop'
  | 'leftCenter'
  | 'leftBottom'
  | 'rightTop'
  | 'rightCenter'
  | 'rightBottom';
```

```angular-ts
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
```

```angular-ts
import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  computed,
  Directive,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  type OnDestroy,
  type OnInit,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  untracked,
  ViewContainerRef,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  navigationMenuTriggerIconVariants,
  navigationMenuTriggerVariants,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuManagerService } from './navigation-menu-manager.service';
import { NAVIGATION_MENU_POSITIONS_MAP, type ZardNavigationMenuPlacement } from './navigation-menu-positions';
import { ZardNavigationMenuService } from './navigation-menu.service';

export type ZardNavigationMenuTriggerMode = 'click' | 'hover';

/**
 * Opens the content bound to `[zNavigationMenuTriggerFor]`. It works in two modes:
 *
 * - **viewport** — inside a `<z-navigation-menu>` with `zViewport` on, the content is handed to the
 *   shared viewport, which morphs between triggers instead of opening one overlay per item;
 * - **overlay** — standalone, or with `[zViewport]="false"`, the CDK opens a popup anchored to the
 *   trigger and positioned by `zPlacement`.
 *
 * `CdkMenuTrigger` stays applied in both modes but is left inert in the viewport one: its `open()`
 * is a no-op while `menuTemplateRef` is null.
 */
@Directive({
  selector: '[z-navigation-menu-trigger]',
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    role: 'button',
    'data-slot': 'navigation-menu-trigger',
    '[class]': 'classes()',
    '[attr.tabindex]': "'0'",
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : undefined",
    '[style.cursor]': "'pointer'",
    '(click)': 'onClick($event)',
    '(keydown)': 'onKeydown($event)',
  },
  hostDirectives: [CdkMenuTrigger],
  exportAs: 'zNavigationMenuTrigger',
})
export class ZardNavigationMenuTriggerDirective implements OnInit, OnDestroy {
  private static readonly TRIGGER_SELECTOR = '[z-navigation-menu-trigger]';

  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly menuManager = inject(ZardNavigationMenuManagerService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly injector = inject(Injector);
  /** Absent when the trigger is used outside a `<z-navigation-menu>`, which forces overlay mode. */
  private readonly service = inject(ZardNavigationMenuService, { optional: true });

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanupFunctions: Array<() => void> = [];
  private index = -1;
  /** Mirrors the CDK overlay state, whose own `isOpen()` is a plain method and so not reactive. */
  private readonly overlayOpen = signal(false);

  readonly zNavigationMenuTriggerFor = input.required<TemplateRef<void>>();
  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zTrigger = input<ZardNavigationMenuTriggerMode>();
  readonly zHoverDelay = input<number>(100);
  readonly zPlacement = input<ZardNavigationMenuPlacement>('bottomLeft');
  readonly zShowChevron = input<boolean | undefined, BooleanInput | undefined>(undefined, {
    transform: value => (value === undefined ? undefined : booleanAttribute(value)),
  });

  readonly class = input<ClassValue>('');

  /** True only inside a root whose `zViewport` is on — the only case the CDK trigger stays inert. */
  private readonly isViewportMode = computed(() => this.service?.viewport() ?? false);

  /**
   * Styling and the built-in chevron only kick in inside a root. Standalone the trigger stays
   * visually neutral, so the existing dropdown-style consumers keep rendering exactly as before.
   */
  protected readonly classes = computed(() =>
    this.service ? mergeClasses(navigationMenuTriggerVariants(), this.class()) : mergeClasses(this.class()),
  );

  protected readonly isOpen = computed(() =>
    this.isViewportMode() ? (this.service?.isActive(this.index) ?? false) : this.overlayOpen(),
  );

  private readonly menuPositions = computed(() => this.getPositionsByPlacement(this.zPlacement()));

  constructor() {
    effect(() => {
      const positions = this.menuPositions();
      untracked(() => {
        this.cdkTrigger.menuPosition = positions;
      });
    });

    // The switch that makes the dual mode work: with no template the CDK trigger cannot open.
    effect(() => {
      const template = this.zNavigationMenuTriggerFor();
      const viewportMode = this.isViewportMode();
      untracked(() => {
        this.cdkTrigger.menuTemplateRef = viewportMode ? null : template;
      });
    });

    // Keep the shared viewport pointed at this trigger's template while it owns it.
    effect(() => {
      const template = this.zNavigationMenuTriggerFor();
      if (!this.isViewportMode() || !this.service?.isActive(this.index)) return;

      untracked(() => this.openInViewport(template));
    });
  }

  ngOnInit(): void {
    this.index = this.service?.registerTrigger() ?? -1;

    this.trackOverlayState();

    if (this.shouldRenderChevron()) {
      this.renderChevron();
    }

    if (this.resolvedTrigger() === 'hover' && !this.isMobileDevice()) {
      this.initializeHoverBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cancelScheduledClose();
    this.menuManager.unregisterHoverMenu(this);
    this.service?.close(this.index);
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions.length = 0;
  }

  close(): void {
    this.cancelScheduledClose();

    if (this.isViewportMode()) {
      this.service?.close(this.index);
      return;
    }

    this.cdkTrigger.close();
  }

  open(): void {
    if (this.zDisabled()) return;

    if (this.isViewportMode()) {
      this.openInViewport(this.zNavigationMenuTriggerFor());
      return;
    }

    this.cdkTrigger.open();
  }

  /** Hover is the navigation-menu default; standalone triggers keep opening on click. */
  private resolvedTrigger(): ZardNavigationMenuTriggerMode {
    return this.zTrigger() ?? (this.service ? 'hover' : 'click');
  }

  private shouldRenderChevron(): boolean {
    return this.zShowChevron() ?? !!this.service;
  }

  private openInViewport(template: TemplateRef<void>): void {
    this.service?.open({ index: this.index, template, element: this.elementRef.nativeElement });
  }

  protected onClick(event: Event): void {
    if (this.zDisabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!this.isViewportMode()) return;

    // The CDK trigger is inert here, so the viewport toggle is ours to drive.
    event.preventDefault();
    this.toggle();
  }

  private toggle(): void {
    if (this.service?.isActive(this.index)) {
      this.close();
      return;
    }

    this.open();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isViewportMode() || this.zDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.open();
        this.focusFirstLink();
        break;
      case 'Escape':
        if (!this.service?.isActive(this.index)) return;
        event.preventDefault();
        this.close();
        this.elementRef.nativeElement.focus({ preventScroll: true });
        break;
    }
  }

  private focusFirstLink(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Waits for the viewport to render the freshly activated template.
    setTimeout(() => {
      const link = this.document.querySelector<HTMLElement>(
        '[data-slot="navigation-menu-viewport"] [z-navigation-menu-link]',
      );
      link?.focus({ preventScroll: true });
    });
  }

  private getPositionsByPlacement(placement: ZardNavigationMenuPlacement): ConnectedPosition[] {
    return NAVIGATION_MENU_POSITIONS_MAP[placement] || NAVIGATION_MENU_POSITIONS_MAP['bottomLeft'];
  }

  /**
   * The trigger is a directive — it has no template of its own — so the chevron is instantiated
   * imperatively and moved into the host element.
   */
  private renderChevron(): void {
    // The injector is explicit so NgIcon resolves the icon against this directive's `provideIcons`.
    const iconRef = this.viewContainerRef.createComponent(NgIcon, { injector: this.injector });
    iconRef.setInput('name', 'lucideChevronDown');

    // `class` is a host attribute on NgIcon, not an input, so it is set on the element itself.
    const icon = iconRef.location.nativeElement as HTMLElement;
    icon.className = navigationMenuTriggerIconVariants();
    icon.setAttribute('aria-hidden', 'true');
    this.elementRef.nativeElement.appendChild(icon);

    this.cleanupFunctions.push(() => iconRef.destroy());
  }

  private initializeHoverBehavior(): void {
    this.setupTriggerListeners();

    // Registered whatever the mode: the root pushes `zViewport` into the service through an effect,
    // which has not run by the time this init does, so the mode cannot be trusted here yet. It is
    // harmless in viewport mode — the CDK trigger stays inert there and never emits `opened`.
    this.setupMenuOpenListener();
  }

  private setupTriggerListeners(): void {
    const element = this.elementRef.nativeElement;

    this.addEventListenerWithCleanup(element, 'mouseenter', () => {
      if (this.zDisabled()) {
        return;
      }

      if (this.isViewportMode()) {
        this.service?.open({
          index: this.index,
          template: this.zNavigationMenuTriggerFor(),
          element,
        });
        return;
      }

      // Deliberately not focusing the trigger: the pointer must not move the focus, or the
      // `focus:bg-muted` and the focus ring would stay behind once the pointer moves away.
      this.cancelScheduledClose();
      this.menuManager.registerHoverMenu(this);
      this.cdkTrigger.open();
    });

    this.addEventListenerWithCleanup(element, 'mouseleave', event => this.scheduleCloseIfNeeded(event as MouseEvent));
  }

  /** Feeds `data-state` and the chevron rotation while the CDK owns the popup. */
  private trackOverlayState(): void {
    const openSubscription = this.cdkTrigger.opened.subscribe(() => this.overlayOpen.set(true));
    const closeSubscription = this.cdkTrigger.closed.subscribe(() => {
      this.overlayOpen.set(false);
      this.returnFocusFromMenu();
    });

    this.cleanupFunctions.push(
      () => openSubscription.unsubscribe(),
      () => closeSubscription.unsubscribe(),
    );
  }

  /**
   * Brings the focus back from a popup that is closing. The CDK hands it to whichever trigger owns
   * the shared menu stack, which is the wrong one once a bar has more than one. Skipped when the
   * focus is elsewhere — closing on hover-out must not pull it in.
   */
  private returnFocusFromMenu(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const menu = this.menuElement;
    const focused = this.document.activeElement;

    if (!menu || !focused || !menu.contains(focused)) return;

    // Deferred: the CDK moves the focus itself while tearing the overlay down.
    setTimeout(() => this.elementRef.nativeElement.focus({ preventScroll: true }));
  }

  private setupMenuOpenListener(): void {
    const openSubscription = this.cdkTrigger.opened.subscribe(() => {
      // After the render, not on a timer: the CDK only registers the child menu once change
      // detection has run, and until then there is no popup to attach the listeners to.
      afterNextRender({ read: () => this.setupMenuContentListeners() }, { injector: this.injector });
    });

    const closeSubscription = this.cdkTrigger.closed.subscribe(() => {
      this.menuManager.unregisterHoverMenu(this);
    });

    this.cleanupFunctions.push(
      () => openSubscription.unsubscribe(),
      () => closeSubscription.unsubscribe(),
    );
  }

  /**
   * The popup this trigger owns, while it is open. Asking the CDK trigger for it — instead of
   * querying the document — keeps the lookup from matching another bar's popup, including the
   * shared viewport, which also renders inside an overlay pane.
   */
  private get menuElement(): HTMLElement | null {
    return this.cdkTrigger.getMenu()?.nativeElement ?? null;
  }

  private setupMenuContentListeners(): void {
    const menuContent = this.menuElement;
    if (!menuContent) {
      return;
    }

    this.addEventListenerWithCleanup(menuContent, 'mouseenter', () => this.cancelScheduledClose());
    this.addEventListenerWithCleanup(menuContent, 'mouseleave', event =>
      this.scheduleCloseIfNeeded(event as MouseEvent),
    );
  }

  private cancelScheduledClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  private scheduleCloseIfNeeded(event: MouseEvent): void {
    if (this.isViewportMode()) {
      // The viewport owns the grace period — moving onto it cancels the close.
      this.service?.scheduleClose(this.index);
      return;
    }

    if (this.shouldKeepMenuOpen(event.relatedTarget as Element)) {
      return;
    }

    this.scheduleMenuClose();
  }

  private shouldKeepMenuOpen(relatedTarget: Element | null): boolean {
    if (!relatedTarget) {
      return false;
    }

    const isMovingToTrigger = this.elementRef.nativeElement.contains(relatedTarget);
    const isMovingToMenu = this.menuElement?.contains(relatedTarget) ?? false;
    const isMovingToOtherTrigger =
      relatedTarget.matches(ZardNavigationMenuTriggerDirective.TRIGGER_SELECTOR) &&
      !this.elementRef.nativeElement.contains(relatedTarget);

    if (isMovingToOtherTrigger) {
      return false;
    }

    return isMovingToTrigger || isMovingToMenu;
  }

  private scheduleMenuClose(): void {
    this.closeTimeout = setTimeout(() => {
      this.cdkTrigger.close();
    }, this.zHoverDelay());
  }

  private addEventListenerWithCleanup(
    element: Element,
    eventType: string,
    handler: (event: MouseEvent | Event) => void,
    options?: AddEventListenerOptions,
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      element.addEventListener(eventType, handler, options);
      this.cleanupFunctions.push(() => element.removeEventListener(eventType, handler, options));
    }
  }

  private isMobileDevice(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // Default to desktop behavior on server
    }

    const window = this.document.defaultView;
    if (!window) {
      return false;
    }

    const { navigator } = window;
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check for mobile user agent
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileUA = mobileRegex.test(navigator.userAgent);

    // Check viewport width for small screens
    const isSmallScreen = window.innerWidth <= 768;

    return hasTouch && (isMobileUA || isSmallScreen);
  }
}
```

```angular-ts
import { CdkConnectedOverlay, type ConnectedPosition, Overlay } from '@angular/cdk/overlay';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  Injector,
  PLATFORM_ID,
  signal,
  untracked,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';

import {
  navigationMenuViewportVariants,
  navigationMenuViewportWrapperVariants,
  type ZardNavigationMenuAlign,
} from '@/shared/components/navigation-menu/navigation-menu.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardNavigationMenuService } from './navigation-menu.service';

const AUTO_SIZE = { width: 'auto', height: 'auto' } as const;

/** Breathing room kept between the popup and the window edges when the bar sits near one. */
const WINDOW_MARGIN = 8;

/** Anchored to the bar itself; the offset to the active trigger is applied inside the pane. */
const OVERLAY_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
];

/**
 * The single popup shared by every trigger of a `<z-navigation-menu>`. It renders the active
 * trigger's template, morphs its own width/height to match and slides horizontally to line up with
 * whichever trigger owns it — the three transitions together produce the morph between items.
 *
 * It is rendered through a CDK overlay rather than inline: a navigation bar is routinely placed
 * inside containers that clip (`overflow: hidden`), and an inline popup would be cut off by them.
 */
@Component({
  selector: 'z-navigation-menu-viewport',
  imports: [CdkConnectedOverlay, NgTemplateOutlet],
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin()"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayScrollStrategy]="scrollStrategy"
      [cdkConnectedOverlayFlexibleDimensions]="false"
      [cdkConnectedOverlayPush]="false"
      (overlayKeydown)="onOverlayKeydown($event)"
    >
      <div
        [class]="wrapperClasses()"
        [style.translate]="offset()"
        (mouseenter)="onMouseEnter()"
        (mouseleave)="onMouseLeave()"
      >
        <div
          [class]="viewportClasses()"
          data-slot="navigation-menu-viewport"
          data-state="open"
          [style.--zard-navigation-menu-viewport-width]="size().width"
          [style.--zard-navigation-menu-viewport-height]="size().height"
        >
          <div #content class="w-max">
            <ng-container [ngTemplateOutlet]="template()!" />
          </div>
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // The popup lives in the overlay, so the host itself must not take part in the bar's layout.
  host: { class: 'contents' },
  exportAs: 'zNavigationMenuViewport',
})
export class ZardNavigationMenuViewportComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly service = inject(ZardNavigationMenuService);

  private readonly content = viewChild<ElementRef<HTMLElement>>('content');
  private readonly measured = signal<{ width: string; height: string }>({ ...AUTO_SIZE });
  private readonly offsetX = signal(0);
  /** Opening from closed would otherwise animate out of the previous item's size and position. */
  private readonly instant = signal(false);

  private resizeObserver: ResizeObserver | null = null;
  private observedContent: HTMLElement | null = null;
  private wasOpen = false;

  readonly align = signal<ZardNavigationMenuAlign>('start');

  protected readonly positions = OVERLAY_POSITIONS;
  protected readonly scrollStrategy = this.overlay.scrollStrategies.reposition();

  protected readonly template = this.service.activeTemplate;
  protected readonly size = this.measured.asReadonly();
  protected readonly isOpen = computed(() => this.template() !== null);
  protected readonly offset = computed(() => `${this.offsetX()}px 0`);
  /** Falls back to the host only before the root has registered itself, when nothing is open yet. */
  protected readonly origin = computed(() => this.service.rootElement() ?? this.elementRef.nativeElement);

  protected readonly wrapperClasses = computed(() =>
    mergeClasses(navigationMenuViewportWrapperVariants(), this.instant() && 'transition-none'),
  );

  protected readonly viewportClasses = computed(() =>
    mergeClasses(navigationMenuViewportVariants(), this.instant() && 'transition-none'),
  );

  constructor() {
    this.destroyRef.onDestroy(() => this.disconnectObserver());
    this.watchWindowResize();

    effect(() => {
      const template = this.template();

      if (!template) {
        this.wasOpen = false;
        return;
      }

      const fresh = !this.wasOpen;
      this.wasOpen = true;
      untracked(() => this.scheduleMeasure(fresh));
    });

    // Changing which edge to line up with has to re-run the offset maths.
    effect(() => {
      this.align();

      untracked(() => {
        if (this.isOpen()) this.scheduleMeasure(false);
      });
    });
  }

  protected onMouseEnter(): void {
    this.service.cancelScheduledClose();
  }

  protected onMouseLeave(): void {
    this.service.scheduleClose();
  }

  protected onOverlayKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return;

    // Captured before closing, since closing is what clears the active trigger.
    const trigger = this.service.active()?.element;

    event.preventDefault();
    this.service.close();
    trigger?.focus({ preventScroll: true });
  }

  private scheduleMeasure(fresh: boolean): void {
    this.instant.set(fresh || this.measured().width === AUTO_SIZE.width);

    afterNextRender(
      {
        read: () => {
          this.measure();

          if (this.instant()) {
            requestAnimationFrame(() => this.instant.set(false));
          }
        },
      },
      { injector: this.injector },
    );
  }

  private measure(): void {
    const element = this.content()?.nativeElement;
    if (!element) return;

    const size = { width: `${element.offsetWidth}px`, height: `${element.offsetHeight}px` };
    const current = this.measured();

    if (current.width !== size.width || current.height !== size.height) {
      this.measured.set(size);
    }

    this.updateOffset(element.offsetWidth);
    this.observe(element);
  }

  /** Slides the popup so the requested edge lines up with the active trigger, not with the bar. */
  private updateOffset(width: number): void {
    const active = this.service.active();
    const root = this.service.rootElement();
    const view = this.document.defaultView;

    if (!active || !root || !view || !isPlatformBrowser(this.platformId)) return;

    const trigger = active.element.getBoundingClientRect();
    const bar = root.getBoundingClientRect();

    let left: number;
    switch (this.align()) {
      case 'center':
        left = trigger.left + trigger.width / 2 - width / 2;
        break;
      case 'end':
        left = trigger.right - width;
        break;
      default:
        left = trigger.left;
    }

    const rightmost = view.innerWidth - WINDOW_MARGIN - width;
    const clamped = Math.max(WINDOW_MARGIN, Math.min(left, rightmost));

    // The pane already sits at the bar's left edge, so the offset is relative to it.
    this.offsetX.set(Math.round(clamped - bar.left));
  }

  /** Keeps the morph honest when the rendered content resizes after being mounted. */
  private observe(element: HTMLElement): void {
    if (!isPlatformBrowser(this.platformId) || typeof ResizeObserver === 'undefined') return;
    if (this.observedContent === element) return;

    this.resizeObserver ??= new ResizeObserver(() => this.measure());

    if (this.observedContent) {
      this.resizeObserver.unobserve(this.observedContent);
    }

    this.resizeObserver.observe(element);
    this.observedContent = element;
  }

  private watchWindowResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const view = this.document.defaultView;
    if (!view) return;

    const onResize = () => this.measure();
    view.addEventListener('resize', onResize);
    this.destroyRef.onDestroy(() => view.removeEventListener('resize', onResize));
  }

  private disconnectObserver(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.observedContent = null;
  }
}
```

```angular-ts
import { ZardContextMenuDirective } from '@/shared/components/navigation-menu/context-menu.directive';
import { ZardNavigationMenuContentDirective } from '@/shared/components/navigation-menu/navigation-menu-content.directive';
import { ZardNavigationMenuIndicatorComponent } from '@/shared/components/navigation-menu/navigation-menu-indicator.component';
import { ZardNavigationMenuItemDirective } from '@/shared/components/navigation-menu/navigation-menu-item.directive';
import { ZardNavigationMenuLabelComponent } from '@/shared/components/navigation-menu/navigation-menu-label.component';
import { ZardNavigationMenuLinkDirective } from '@/shared/components/navigation-menu/navigation-menu-link.directive';
import { ZardNavigationMenuListDirective } from '@/shared/components/navigation-menu/navigation-menu-list.directive';
import { ZardNavigationMenuShortcutComponent } from '@/shared/components/navigation-menu/navigation-menu-shortcut.component';
import { ZardNavigationMenuTriggerDirective } from '@/shared/components/navigation-menu/navigation-menu-trigger.directive';
import { ZardNavigationMenuViewportComponent } from '@/shared/components/navigation-menu/navigation-menu-viewport.component';
import { ZardNavigationMenuComponent } from '@/shared/components/navigation-menu/navigation-menu.component';

export const ZardNavigationMenuImports = [
  ZardNavigationMenuComponent,
  ZardNavigationMenuListDirective,
  ZardNavigationMenuItemDirective,
  ZardNavigationMenuTriggerDirective,
  ZardNavigationMenuContentDirective,
  ZardNavigationMenuLinkDirective,
  ZardNavigationMenuIndicatorComponent,
  ZardNavigationMenuViewportComponent,
  ZardNavigationMenuLabelComponent,
  ZardNavigationMenuShortcutComponent,
  ZardContextMenuDirective,
] as const;
```

```angular-ts
import { computed, Injectable, signal, type TemplateRef } from '@angular/core';

/** Direction the content slides in from when moving between two triggers. */
export type ZardNavigationMenuMotion = 'from-start' | 'from-end' | null;

export interface ZardNavigationMenuActiveTrigger {
  /** Index of the trigger within the list, used to derive the slide direction. */
  index: number;
  template: TemplateRef<void>;
  element: HTMLElement;
}

/**
 * Scoped to each `<z-navigation-menu>` root — it holds which trigger owns the shared viewport,
 * the direction of the last transition and the geometry the indicator follows.
 */
@Injectable()
export class ZardNavigationMenuService {
  private readonly activeTrigger = signal<ZardNavigationMenuActiveTrigger | null>(null);
  private readonly previousIndex = signal<number | null>(null);
  private nextIndex = 0;
  private closeTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly viewport = signal(true);
  readonly hoverDelay = signal(100);
  /** Host of the root, used by the indicator to position itself against the active trigger. */
  readonly rootElement = signal<HTMLElement | null>(null);

  readonly active = this.activeTrigger.asReadonly();
  readonly isOpen = computed(() => this.activeTrigger() !== null);
  readonly activeTemplate = computed(() => this.activeTrigger()?.template ?? null);

  readonly motion = computed<ZardNavigationMenuMotion>(() => {
    const current = this.activeTrigger();
    const previous = this.previousIndex();

    if (!current || previous === null || previous === current.index) return null;

    return previous < current.index ? 'from-end' : 'from-start';
  });

  /** Called once per trigger on init so the service can derive the slide direction later. */
  registerTrigger(): number {
    return this.nextIndex++;
  }

  open(trigger: ZardNavigationMenuActiveTrigger): void {
    this.cancelScheduledClose();

    const current = this.activeTrigger();

    if (current?.index === trigger.index) {
      // Same trigger: refresh its template without replaying the slide.
      if (current.template !== trigger.template) {
        this.activeTrigger.set(trigger);
      }
      return;
    }

    this.previousIndex.set(current?.index ?? null);
    this.activeTrigger.set(trigger);
  }

  close(index?: number): void {
    this.cancelScheduledClose();

    const current = this.activeTrigger();
    if (!current) return;
    if (index !== undefined && current.index !== index) return;

    // Cleared so the next opening fades in instead of sliding from a stale position.
    this.previousIndex.set(null);
    this.activeTrigger.set(null);
  }

  /**
   * Closing is deferred so the pointer can travel from the trigger to the viewport without the
   * popup disappearing underneath it. Any `open()` or `cancelScheduledClose()` calls this off.
   */
  scheduleClose(index?: number): void {
    this.cancelScheduledClose();
    this.closeTimeout = setTimeout(() => {
      this.closeTimeout = null;
      this.close(index);
    }, this.hoverDelay());
  }

  cancelScheduledClose(): void {
    if (this.closeTimeout === null) return;

    clearTimeout(this.closeTimeout);
    this.closeTimeout = null;
  }

  isActive(index: number): boolean {
    return this.activeTrigger()?.index === index;
  }
}
```

## Usage

```angular-ts
import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu/navigation-menu.imports';
```

```angular-html
<z-navigation-menu>
  <ul z-navigation-menu-list>
    <li z-navigation-menu-item>
      <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="gettingStarted">
        Getting started
      </button>

      <ng-template #gettingStarted>
        <div z-navigation-menu-content>
          <ul class="w-64">
            <li><a z-navigation-menu-link href="#">Introduction</a></li>
            <li><a z-navigation-menu-link href="#">Installation</a></li>
          </ul>
        </div>
      </ng-template>
    </li>
  </ul>
</z-navigation-menu>
```

## Composition

```text
z-navigation-menu
├── ul[z-navigation-menu-list]
│   └── li[z-navigation-menu-item]
│       ├── button[z-navigation-menu-trigger]
│       └── ng-template
│           └── div[z-navigation-menu-content]
│               ├── a[z-navigation-menu-link]
│               └── a[z-navigation-menu-link]
└── z-navigation-menu-indicator
```

## Examples

### Link

Use `routerLink` on the `[z-navigation-menu-link]` element to compose with the Angular Router.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-demo-navigation-menu-link',
  imports: [ZardNavigationMenuImports, RouterLink, RouterLinkActive],
  template: `
    <z-navigation-menu>
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <a
            z-navigation-menu-link
            routerLink="/docs/components/navigation-menu"
            routerLinkActive
            #navigationMenuLink="routerLinkActive"
            [zActive]="navigationMenuLink.isActive"
            [class]="triggerClass"
          >
            Navigation Menu
          </a>
        </li>
        <li z-navigation-menu-item>
          <a
            z-navigation-menu-link
            routerLink="/docs/components/dropdown"
            routerLinkActive
            #dropdownLink="routerLinkActive"
            [zActive]="dropdownLink.isActive"
            [class]="triggerClass"
          >
            Dropdown
          </a>
        </li>
        <li z-navigation-menu-item>
          <a
            z-navigation-menu-link
            routerLink="/docs/components/tabs"
            routerLinkActive
            #tabsLink="routerLinkActive"
            [zActive]="tabsLink.isActive"
            [class]="triggerClass"
          >
            Tabs
          </a>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNavigationMenuLinkComponent {
  protected readonly triggerClass = navigationMenuTriggerVariants();
}
```

### Simple

A bar of plain links, with no dropdown. Reuse `navigationMenuTriggerVariants()` to keep the height and spacing of a trigger.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { navigationMenuTriggerVariants, ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-demo-navigation-menu-simple',
  imports: [ZardNavigationMenuImports],
  template: `
    <z-navigation-menu>
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" zActive [class]="triggerClass">Overview</a>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Documentation</a>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Blocks</a>
        </li>
        <li z-navigation-menu-item>
          <a z-navigation-menu-link href="#" [class]="triggerClass">Changelog</a>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNavigationMenuSimpleComponent {
  /** Reuses the trigger CVA so plain links keep the height and spacing of the bar. */
  protected readonly triggerClass = navigationMenuTriggerVariants();
}
```

### No Viewport

Set `[zViewport]="false"` so each item opens its own popup, with its own background and ring, instead of sharing the animated viewport. The markup is the same in both modes — only the input changes.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardNavigationMenuImports } from '@/shared/components/navigation-menu';

@Component({
  selector: 'z-demo-navigation-menu-no-viewport',
  imports: [ZardNavigationMenuImports],
  template: `
    <z-navigation-menu [zViewport]="false">
      <ul z-navigation-menu-list>
        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="overview">Overview</button>

          <ng-template #overview>
            <div z-navigation-menu-content>
              <ul class="w-56">
                <li><a z-navigation-menu-link href="#">Introduction</a></li>
                <li><a z-navigation-menu-link href="#">Installation</a></li>
                <li><a z-navigation-menu-link href="#">Theming</a></li>
              </ul>
            </div>
          </ng-template>
        </li>

        <li z-navigation-menu-item>
          <button type="button" z-navigation-menu-trigger [zNavigationMenuTriggerFor]="resources">Resources</button>

          <ng-template #resources>
            <div z-navigation-menu-content>
              <ul class="w-56">
                <li><a z-navigation-menu-link href="#">Blocks</a></li>
                <li><a z-navigation-menu-link href="#">Changelog</a></li>
                <li><a z-navigation-menu-link href="#">Contributing</a></li>
              </ul>
            </div>
          </ng-template>
        </li>
      </ul>
    </z-navigation-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoNavigationMenuNoViewportComponent {}
```

## API Reference

### z-navigation-menu

Root of the navigation bar. Scopes the shared viewport to the triggers inside it.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zViewport]` | Share a single animated popup between every trigger. When false each trigger opens its own | `boolean` | `true` |
| `[zAlign]` | Which edge of the active trigger the shared viewport lines up with | `'start' \| 'center' \| 'end'` | `'start'` |
| `[zHoverDelay]` | Delay in ms before closing once the pointer leaves the bar | `number` | `100` |

### z-navigation-menu-list

The `<ul>` holding the items of the bar.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-navigation-menu-item

The `<li>` wrapping a trigger and its content, or a standalone link.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-navigation-menu-trigger

Opens the content it points to. Inside a root it opens on hover; standalone it opens on click.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zNavigationMenuTriggerFor]` | Reference to the content template | `TemplateRef<void>` | `required` |
| `[zDisabled]` | Whether the trigger is disabled | `boolean` | `false` |
| `[zTrigger]` | How the content is opened | `'click' \| 'hover'` | `'hover' inside a root, 'click' standalone` |
| `[zHoverDelay]` | Delay in ms before closing on hover exit | `number` | `100` |
| `[zPlacement]` | Popup position relative to the trigger. Overlay mode only | `ZardNavigationMenuPlacement` | `'bottomLeft'` |
| `[zShowChevron]` | Render the built-in chevron | `boolean` | `true inside a root, false standalone` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-navigation-menu-content

Container for the links of one trigger. Inside the shared viewport it is plain content; in overlay mode it is the popup itself.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-navigation-menu-link

A single entry. Pair `[zActive]` with `routerLinkActive` to mark the current route.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zActive]` | Marks the link as the current one | `boolean` | `false` |
| `[zDisabled]` | Whether the link is disabled | `boolean` | `false` |
| `[zInset]` | Add left padding for alignment | `boolean` | `false` |
| `[zType]` | Visual variant of the link | `'default' \| 'destructive'` | `'default'` |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[menuItemTriggered]` | Emits when the link is activated | `EventEmitter` |  |

### z-navigation-menu-indicator

The arrow that follows the trigger currently owning the viewport.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-navigation-menu-viewport

The shared popup. Rendered automatically by the root while `zViewport` is on — declare it manually only to place it yourself.

### z-navigation-menu-label

Label for grouping links inside a content block.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[inset]` | Adds left padding for alignment | `boolean` | `false` |

### z-navigation-menu-shortcut

Displays a keyboard shortcut aligned to the end of a link.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-context-menu

Opens a content template on right click, anchored to the pointer.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zContextMenuTriggerFor]` | Reference to the context menu content | `TemplateRef<void>` | `required` |

### navigationMenuTriggerVariants()

Helper that returns the trigger classes, for links that must line up with the triggers of the bar.

---

[Open in browser](https://zardui.com/docs/components/navigation-menu)
