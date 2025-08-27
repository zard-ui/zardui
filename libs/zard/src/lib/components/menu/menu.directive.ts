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
    const overlay = document.querySelector(ZardMenuDirective.MENU_OVERLAY_SELECTOR);
    if (!overlay) return;

    this.addEventListenerWithCleanup(overlay, 'mouseenter', () => this.cancelScheduledClose());
    this.addEventListenerWithCleanup(overlay, 'mouseleave', event => this.scheduleCloseIfNeeded(event as MouseEvent));
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
    const isMovingToOtherTrigger = relatedTarget.matches('[z-menu]') && !this.elementRef.nativeElement.contains(relatedTarget);

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

  private addEventListenerWithCleanup(element: Element, eventType: string, handler: (event: MouseEvent | Event) => void): void {
    element.addEventListener(eventType, handler);
    this.cleanupFunctions.push(() => element.removeEventListener(eventType, handler));
  }
}
