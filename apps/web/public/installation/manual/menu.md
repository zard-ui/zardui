

```angular-ts title="menu.directive.ts" copyButton showLineNumbers
import { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { booleanAttribute, Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';

import { ZardMenuManagerService } from './menu-manager.service';

export type ZardMenuPlacement = 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
export type ZardMenuTrigger = 'click' | 'hover';

@Directive({
  selector: '[z-menu]',
  standalone: true,
  hostDirectives: [
    {
      directive: CdkMenuTrigger,
      inputs: ['cdkMenuTriggerFor: zMenuTriggerFor'],
    },
  ],
  host: {
    role: 'button',
    '[attr.aria-haspopup]': "'menu'",
    '[attr.aria-expanded]': 'cdkTrigger.isOpen()',
    '[attr.data-state]': "cdkTrigger.isOpen() ? 'open': 'closed'",
    '[attr.data-disabled]': "zDisabled() ? '' : undefined",
    '[style.cursor]': "'pointer'",
  },
})
export class ZardMenuDirective implements OnInit, OnDestroy {
  private static readonly MENU_OVERLAY_SELECTOR = '.cdk-overlay-container .cdk-overlay-pane:last-child';
  private static readonly MENU_CONTENT_SELECTOR = '.cdk-overlay-pane [z-menu-content]';

  protected readonly cdkTrigger = inject(CdkMenuTrigger, { host: true });
  private readonly elementRef = inject(ElementRef);
  private readonly menuManager = inject(ZardMenuManagerService);

  private closeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly cleanupFunctions: Array<() => void> = [];

  readonly zMenuTriggerFor = input.required();
  readonly zDisabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  readonly zTrigger = input<ZardMenuTrigger>('click');
  readonly zHoverDelay = input<number>(100);

  ngOnInit(): void {
    if (this.zTrigger() === 'hover') {
      this.initializeHoverBehavior();
    }
  }

  ngOnDestroy(): void {
    this.cancelScheduledClose();
    this.menuManager.unregisterHoverMenu(this);
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions.length = 0;
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
    const overlays = this.getAllMenuOverlays();
    overlays.forEach(overlay => {
      this.addEventListenerWithCleanup(overlay, 'mouseenter', () => this.cancelScheduledClose());
      this.addEventListenerWithCleanup(overlay, 'mouseleave', event => this.scheduleCloseIfNeeded(event as MouseEvent));
    });
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
    const isMovingToAnyMenu = this.isMovingToMenuHierarchy(relatedTarget);
    const isMovingToOtherTrigger = relatedTarget.matches('[z-menu]') && !this.elementRef.nativeElement.contains(relatedTarget);

    if (isMovingToOtherTrigger) {
      return false;
    }

    return isMovingToTrigger || isMovingToAnyMenu;
  }

  private isMovingToMenuHierarchy(relatedTarget: Element): boolean {
    // Check if moving to any menu content (including nested submenus)
    const isMovingToMenuContent = !!relatedTarget.closest(ZardMenuDirective.MENU_CONTENT_SELECTOR);

    // Check if moving to any CDK overlay that contains menu content
    const isMovingToMenuOverlay = !!relatedTarget.closest('.cdk-overlay-pane');

    // Also check if the target is within any menu trigger that might have submenus
    const isMovingToSubMenuTrigger = !!relatedTarget.closest('[z-menu]');

    return isMovingToMenuContent || (isMovingToMenuOverlay && this.hasMenuContentInOverlay(relatedTarget)) || isMovingToSubMenuTrigger;
  }

  private hasMenuContentInOverlay(element: Element): boolean {
    const overlay = element.closest('.cdk-overlay-pane');
    if (!overlay) return false;

    return !!overlay.querySelector('[z-menu-content]');
  }

  private scheduleMenuClose(): void {
    this.closeTimeout = setTimeout(() => {
      this.cdkTrigger.close();
    }, this.zHoverDelay());
  }

  private cancelScheduledClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }

  private getMenuOverlay(): Element | null {
    return document.querySelector(ZardMenuDirective.MENU_OVERLAY_SELECTOR);
  }

  private getAllMenuOverlays(): Element[] {
    return Array.from(document.querySelectorAll('.cdk-overlay-container .cdk-overlay-pane')).filter(overlay => overlay.querySelector('[z-menu-content]'));
  }

  private addEventListenerWithCleanup(element: Element, eventType: string, handler: (event: MouseEvent | Event) => void): void {
    element.addEventListener(eventType, handler);
    this.cleanupFunctions.push(() => element.removeEventListener(eventType, handler));
  }

  close(): void {
    this.cancelScheduledClose();
    this.cdkTrigger.close();
  }
}

```



```angular-ts title="menu.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const menuContentVariants = cva(
  'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-2 text-popover-foreground shadow-lg animate-in data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
);

export const menuItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left',
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



```angular-ts title="menu-content.directive.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { CdkMenu } from '@angular/cdk/menu';
import { computed, Directive, input } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { menuContentVariants } from './menu.variants';

@Directive({
  selector: '[z-menu-content]',
  standalone: true,
  hostDirectives: [CdkMenu],
  host: {
    '[class]': 'classes()',
  },
})
export class ZardMenuContentDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(menuContentVariants(), this.class()));
}

```



```angular-ts title="menu-item.directive.ts" copyButton showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { BooleanInput } from '@angular/cdk/coercion';
import { CdkMenuItem } from '@angular/cdk/menu';
import { booleanAttribute, computed, Directive, effect, inject, input, signal, untracked } from '@angular/core';

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



```angular-ts title="menu-manager.service.ts" copyButton showLineNumbers
import { Injectable } from '@angular/core';

import { ZardMenuDirective } from './menu.directive';

@Injectable({
  providedIn: 'root',
})
export class ZardMenuManagerService {
  private activeHoverMenu: ZardMenuDirective | null = null;
  private menuHierarchy = new Map<ZardMenuDirective, ZardMenuDirective[]>();

  registerHoverMenu(menu: ZardMenuDirective): void {
    if (this.activeHoverMenu && this.activeHoverMenu !== menu && !this.isMenuInHierarchy(this.activeHoverMenu, menu)) {
      this.activeHoverMenu.close();
    }
    this.activeHoverMenu = menu;
  }

  unregisterHoverMenu(menu: ZardMenuDirective): void {
    if (this.activeHoverMenu === menu) {
      this.activeHoverMenu = null;
    }
    this.menuHierarchy.delete(menu);
  }

  closeActiveMenu(): void {
    if (this.activeHoverMenu) {
      this.activeHoverMenu.close();
      this.activeHoverMenu = null;
    }
  }

  addToHierarchy(parent: ZardMenuDirective, child: ZardMenuDirective): void {
    if (!this.menuHierarchy.has(parent)) {
      this.menuHierarchy.set(parent, []);
    }
    this.menuHierarchy.get(parent)?.push(child);
  }

  private isMenuInHierarchy(parent: ZardMenuDirective, child: ZardMenuDirective): boolean {
    const children = this.menuHierarchy.get(parent);
    if (!children) return false;

    return children.includes(child) || children.some(c => this.isMenuInHierarchy(c, child));
  }
}

```



```angular-ts title="menu.module.ts" copyButton showLineNumbers
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

