

```angular-ts title="menu.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import type { ConnectedPosition } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  type OnInit,
  PLATFORM_ID,
  untracked,
} from '@angular/core';

import { ZardMenuManagerService } from './menu-manager.service';
import { MENU_POSITIONS_MAP, type ZardMenuPlacement } from './menu-positions';

export type ZardMenuTrigger = 'click' | 'hover';

@Directive({
  selector: '[z-menu]',
  standalone: true,
  host: {
    role: 'button',
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open': 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : undefined",
    '[style.cursor]': "'pointer'",
  },
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: zMenuTriggerFor'],
    },
  ],
})
export class ZardMenuDirective implements OnInit, OnDestroy {
  private static readonly MENU_CONTENT_SELECTOR = '.cdk-overlay-pane [z-menu-content]';

  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  private readonly elementRef = inject(ElementRef);
  private readonly menuManager = inject(ZardMenuManagerService);
  private readonly platformId = inject(PLATFORM_ID);

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanupFunctions: Array<() => void> = [];

  readonly zMenuTriggerFor = input.required();
  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zTrigger = input<ZardMenuTrigger>('click');
  readonly zHoverDelay = input<number>(100);
  readonly zPlacement = input<ZardMenuPlacement>('bottomLeft');

  private readonly menuPositions = computed(() => this.getPositionsByPlacement(this.zPlacement()));

  constructor() {
    effect(() => {
      const positions = this.menuPositions();
      untracked(() => {
        this.cdkTrigger.menuPosition = positions;
      });
    });
  }

  private getPositionsByPlacement(placement: ZardMenuPlacement): ConnectedPosition[] {
    return MENU_POSITIONS_MAP[placement] || MENU_POSITIONS_MAP['bottomLeft'];
  }

  ngOnInit(): void {
    const isMobile = this.isMobileDevice();

    // If trigger is hover but device is mobile, skip hover behavior
    // The CDK MenuTrigger will handle click by default
    if (this.zTrigger() === 'hover' && !isMobile) {
      this.initializeHoverBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cancelScheduledClose();
    this.menuManager.unregisterHoverMenu(this);
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions.length = 0;
  }

  close(): void {
    this.cancelScheduledClose();
    this.cdkTrigger.close();
  }

  private initializeHoverBehavior(): void {
    this.setupTriggerListeners();
    this.setupMenuOpenListener();
  }

  private setupTriggerListeners(): void {
    const element = this.elementRef.nativeElement;

    this.addEventListenerWithCleanup(element, 'mouseenter', () => {
      if (this.zDisabled()) return;

      this.cancelScheduledClose();
      this.menuManager.registerHoverMenu(this);
      this.cdkTrigger.open();
    });

    this.addEventListenerWithCleanup(element, 'mouseleave', event => this.scheduleCloseIfNeeded(event as MouseEvent));
  }

  private setupMenuOpenListener(): void {
    const openSubscription = this.cdkTrigger.opened.subscribe(() => {
      setTimeout(() => this.setupMenuContentListeners(), 0);
    });

    const closeSubscription = this.cdkTrigger.closed.subscribe(() => {
      this.menuManager.unregisterHoverMenu(this);
    });

    this.cleanupFunctions.push(
      () => openSubscription.unsubscribe(),
      () => closeSubscription.unsubscribe(),
    );
  }

  private setupMenuContentListeners(): void {
    const menuContent = document.querySelector(ZardMenuDirective.MENU_CONTENT_SELECTOR);
    if (!menuContent) return;

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
    if (this.shouldKeepMenuOpen(event.relatedTarget as Element)) {
      return;
    }

    this.scheduleMenuClose();
  }

  private shouldKeepMenuOpen(relatedTarget: Element | null): boolean {
    if (!relatedTarget) return false;

    const isMovingToTrigger = this.elementRef.nativeElement.contains(relatedTarget);
    const isMovingToMenu = relatedTarget.closest(ZardMenuDirective.MENU_CONTENT_SELECTOR);
    const isMovingToOtherTrigger =
      relatedTarget.matches('[z-menu]') && !this.elementRef.nativeElement.contains(relatedTarget);

    if (isMovingToOtherTrigger) {
      return false;
    }

    return isMovingToTrigger || !!isMovingToMenu;
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

    // Check for touch support
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



```angular-ts title="menu.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const menuContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-lg animate-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export const menuItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left [&>i]:mr-2 [&>z-icon]:mr-2',
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

export type ZardMenuContentVariants = VariantProps<typeof menuContentVariants>;
export type ZardMenuItemVariants = VariantProps<typeof menuItemVariants>;

```



```angular-ts title="menu-content.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { menuContentVariants } from './menu.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Directive({
  selector: '[z-menu-content]',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
  hostDirectives: [CdkMenu],
})
export class ZardMenuContentDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuContentVariants(), this.class()));
}

```



```angular-ts title="menu-item.directive.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, signal, untracked } from '@angular/core';

import type { ClassValue } from 'clsx';

import { menuItemVariants, type ZardMenuItemVariants } from './menu.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

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

```



```angular-ts title="menu-manager.service.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Injectable } from '@angular/core';

import type { ZardMenuDirective } from './menu.directive';

@Injectable({
  providedIn: 'root',
})
export class ZardMenuManagerService {
  private activeHoverMenu: ZardMenuDirective | null = null;

  registerHoverMenu(menu: ZardMenuDirective): void {
    if (this.activeHoverMenu && this.activeHoverMenu !== menu) {
      this.activeHoverMenu.close();
    }
    this.activeHoverMenu = menu;
  }

  unregisterHoverMenu(menu: ZardMenuDirective): void {
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



```angular-ts title="menu-positions.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import type { ConnectedPosition } from '@angular/cdk/overlay';

export const MENU_POSITIONS_MAP: { [key: string]: ConnectedPosition[] } = {
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

export type ZardMenuPlacement =
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



```angular-ts title="menu.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import { ZardMenuContentDirective } from './menu-content.directive';
import { ZardMenuItemDirective } from './menu-item.directive';
import { ZardMenuDirective } from './menu.directive';

const MENU_COMPONENTS = [ZardMenuContentDirective, ZardMenuItemDirective, ZardMenuDirective];

@NgModule({
  imports: [MENU_COMPONENTS],
  exports: [MENU_COMPONENTS],
})
export class ZardMenuModule {}

```

