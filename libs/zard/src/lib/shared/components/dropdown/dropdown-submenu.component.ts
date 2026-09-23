import { Overlay, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  type OnDestroy,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardDropdownService } from './dropdown.service';
import { dropdownSubContentVariants, dropdownSubTriggerVariants } from './dropdown.variants';
import { findMenuItemByChar, getMenuItems, highlightMenuItem, isTypeaheadKey, nextMenuIndex } from './menu-keyboard';

/** How long the pointer may sit between the trigger and the popup before the submenu closes. */
const CLOSE_DELAY = 120;

/**
 * Holds the rows of one submenu. Like `z-dropdown-menu-content` it renders nothing where it is
 * declared — it hands a template to the sub-trigger, which opens it in its own overlay.
 */
@Component({
  selector: 'z-dropdown-menu-sub-content, [z-dropdown-menu-sub-content]',
  template: `
    <ng-template #contentTemplate>
      <div
        [class]="contentClasses()"
        role="menu"
        data-slot="dropdown-menu-sub-content"
        data-state="open"
        tabindex="-1"
        aria-orientation="vertical"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[style.display]': '"none"',
  },
  exportAs: 'zDropdownMenuSubContent',
})
export class ZardDropdownMenuSubContentComponent {
  readonly viewContainerRef = inject(ViewContainerRef);

  readonly contentTemplate = viewChild.required<TemplateRef<unknown>>('contentTemplate');

  readonly class = input<ClassValue>('');

  protected readonly contentClasses = computed(() => mergeClasses(dropdownSubContentVariants(), this.class()));
}

/**
 * A menu row that opens a nested menu to its side. Positioned by the CDK so it flips to the other
 * side near the viewport edge, and opened on hover, click, `Enter`, `Space` or `ArrowRight` —
 * `ArrowLeft` and `Escape` close it and hand the focus back to this row.
 */
@Component({
  selector: 'z-dropdown-menu-sub-trigger, [z-dropdown-menu-sub-trigger]',
  imports: [NgIcon],
  template: `
    <ng-content />
    <ng-icon name="lucideChevronRight" class="ml-auto size-4 shrink-0" aria-hidden="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  host: {
    '[class]': 'classes()',
    'data-slot': 'dropdown-menu-sub-trigger',
    role: 'menuitem',
    tabindex: '-1',
    'aria-haspopup': 'menu',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[attr.data-disabled]': 'zDisabled() || null',
    '[attr.data-inset]': 'zInset() || null',
    '[attr.aria-disabled]': 'zDisabled()',
    '(click)': 'onClick($event)',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'scheduleClose($event)',
    '(keydown)': 'onKeydown($event)',
  },
  exportAs: 'zDropdownMenuSubTrigger',
})
export class ZardDropdownMenuSubTriggerComponent implements OnDestroy {
  private readonly dropdownService = inject(ZardDropdownService);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewContainerRef = inject(ViewContainerRef);

  private overlayRef?: OverlayRef;
  private closeTimeout?: ReturnType<typeof setTimeout>;
  private readonly cleanups: Array<() => void> = [];
  private focusedIndex = -1;

  readonly zSubMenu = input.required<ZardDropdownMenuSubContentComponent | TemplateRef<unknown>>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInset = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  readonly isOpen = signal(false);

  protected readonly classes = computed(() =>
    mergeClasses(dropdownSubTriggerVariants({ inset: this.zInset() }), this.class()),
  );

  constructor() {
    /**
     * The rows of a menu are projected content, so they belong to the view that declared them and
     * outlive the overlay they are shown in — closing the parent menu never destroys this trigger.
     * Following the parent's state is therefore the only thing that keeps an open submenu from
     * being left behind on screen.
     */
    effect(() => {
      if (this.dropdownService.isOpen() || !this.isOpen()) {
        return;
      }

      this.close();
    });
  }

  ngOnDestroy(): void {
    this.close();
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  open(focusFirstItem = false): void {
    if (this.zDisabled() || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.cancelScheduledClose();

    if (this.isOpen()) {
      if (focusFirstItem) {
        this.focusItem(0);
      }
      return;
    }

    const template = this.resolveTemplate();
    const viewContainerRef = this.resolveViewContainerRef();
    if (!template) {
      return;
    }

    this.createOverlay();
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.attach(new TemplatePortal(template, viewContainerRef));
    this.isOpen.set(true);
    this.focusedIndex = -1;
    this.attachOverlayListeners();

    if (focusFirstItem) {
      setTimeout(() => this.focusItem(0));
    }
  }

  close(returnFocus = false): void {
    this.cancelScheduledClose();
    this.runCleanups();

    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }

    this.isOpen.set(false);
    this.focusedIndex = -1;

    if (returnFocus) {
      this.elementRef.nativeElement.focus();
    }
  }

  protected onClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.open();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowRight' && event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    event.stopPropagation();
    this.open(true);
  }

  protected onMouseEnter(): void {
    // Hovering a row is also what highlights it, so the parent's roving focus follows the pointer.
    this.elementRef.nativeElement.focus();
    this.open();
  }

  protected scheduleClose(event?: MouseEvent): void {
    if (this.isMovingInsideSubmenu(event)) {
      return;
    }

    this.cancelScheduledClose();
    this.closeTimeout = setTimeout(() => this.close(), CLOSE_DELAY);
  }

  private isMovingInsideSubmenu(event?: MouseEvent): boolean {
    const target = event?.relatedTarget as Node | null;
    if (!target) {
      return false;
    }

    return (
      this.elementRef.nativeElement.contains(target) || (this.overlayRef?.overlayElement.contains(target) ?? false)
    );
  }

  private cancelScheduledClose(): void {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = undefined;
    }
  }

  private resolveTemplate(): TemplateRef<unknown> | undefined {
    const menu = this.zSubMenu();
    return menu instanceof ZardDropdownMenuSubContentComponent ? menu.contentTemplate() : menu;
  }

  private resolveViewContainerRef(): ViewContainerRef {
    const menu = this.zSubMenu();
    return menu instanceof ZardDropdownMenuSubContentComponent ? menu.viewContainerRef : this.viewContainerRef;
  }

  private createOverlay(): void {
    if (this.overlayRef) {
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'end', originY: 'top', overlayX: 'start', overlayY: 'top', offsetY: -4 },
        { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetY: -4 },
        { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetY: 4 },
        { originX: 'start', originY: 'bottom', overlayX: 'end', overlayY: 'bottom', offsetY: 4 },
      ])
      .withFlexibleDimensions(false)
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });
  }

  /**
   * The popup lives in a sibling overlay pane, so it is outside this element's subtree: the
   * pointer and keyboard listeners that keep it open have to be bound to the pane itself.
   */
  private attachOverlayListeners(): void {
    const pane = this.overlayRef?.overlayElement;
    if (!pane) {
      return;
    }

    const onEnter = () => this.cancelScheduledClose();
    const onLeave = (event: Event) => this.scheduleClose(event as MouseEvent);
    const onKeydown = (event: Event) => this.onSubmenuKeydown(event as KeyboardEvent);

    pane.addEventListener('mouseenter', onEnter);
    pane.addEventListener('mouseleave', onLeave);
    pane.addEventListener('keydown', onKeydown);

    this.cleanups.push(
      () => pane.removeEventListener('mouseenter', onEnter),
      () => pane.removeEventListener('mouseleave', onLeave),
      () => pane.removeEventListener('keydown', onKeydown),
    );
  }

  private onSubmenuKeydown(event: KeyboardEvent): void {
    const items = this.submenuItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusItem(nextMenuIndex(items, this.focusedIndex, 1), items);
        return;
      case 'ArrowUp':
        event.preventDefault();
        this.focusItem(nextMenuIndex(items, this.focusedIndex, -1), items);
        return;
      case 'Home':
        event.preventDefault();
        this.focusItem(0, items);
        return;
      case 'End':
        event.preventDefault();
        this.focusItem(items.length - 1, items);
        return;
      case 'Enter':
      case ' ':
        event.preventDefault();
        items[this.focusedIndex]?.click();
        return;
      case 'ArrowLeft':
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        this.close(true);
        return;
      case 'Tab':
        this.dropdownService.close();
        return;
    }

    if (!isTypeaheadKey(event)) {
      return;
    }

    const match = findMenuItemByChar(items, event.key, this.focusedIndex);
    if (match === -1) {
      return;
    }

    event.preventDefault();
    this.focusItem(match, items);
  }

  private submenuItems(): HTMLElement[] {
    const pane = this.overlayRef?.overlayElement;
    return pane ? getMenuItems(pane) : [];
  }

  private focusItem(index: number, items = this.submenuItems()): void {
    if (index < 0 || index >= items.length) {
      return;
    }

    this.focusedIndex = index;
    highlightMenuItem(items, index);
  }

  private runCleanups(): void {
    this.cleanups.forEach(cleanup => cleanup());
    this.cleanups.length = 0;
  }
}
