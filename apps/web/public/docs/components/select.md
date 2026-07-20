---
title: Select
description: Displays a list of options for the user to pick from—triggered by a button.
---

# Select

Displays a list of options for the user to pick from—triggered by a button.

## Installation

### CLI

```bash
npx zard-cli@latest add select
```

### Manual

```angular-ts
import {
  type ConnectedPosition,
  Overlay,
  OverlayModule,
  OverlayPositionBuilder,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  linkedSignal,
  model,
  numberAttribute,
  type OnDestroy,
  output,
  PLATFORM_ID,
  runInInjectionContext,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideChevronUp } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardSelectGroupComponent } from '@/shared/components/select/select-group.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import {
  selectContentVariants,
  selectScrollButtonVariants,
  selectTriggerVariants,
  selectVariants,
  selectViewportVariants,
  type ZardSelectAlignVariants,
  type ZardSelectPositionVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

type OnTouchedType = () => void;
type OnChangeType = (value: string | string[]) => void;

const COMPACT_MODE_WIDTH_THRESHOLD = 100;
let nextSelectId = 0;

@Component({
  selector: 'z-select, [z-select]',
  imports: [OverlayModule, ZardBadgeComponent, NgIcon],
  template: `
    <button
      type="button"
      role="combobox"
      data-slot="select-trigger"
      [class]="triggerClasses()"
      [disabled]="disabledState()"
      [attr.aria-controls]="isOpen() ? listboxId : null"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-invalid]="zInvalid() ? 'true' : null"
      [attr.aria-label]="triggerAriaLabel()"
      [attr.aria-disabled]="disabledState()"
      [attr.data-placeholder]="!hasValue() ? '' : null"
      (blur)="!isOpen() && isFocus.set(false)"
      (click)="toggle()"
      (focus)="onFocus()"
    >
      <span data-slot="select-value" [class]="valueClasses()">
        @for (label of selectedLabels(); track $index) {
          @if (zMultiple()) {
            <z-badge zType="secondary" class="max-w-full shrink">
              <span class="truncate">{{ label }}</span>
            </z-badge>
          } @else {
            <span class="truncate">{{ label }}</span>
          }
        } @empty {
          <span class="text-muted-foreground truncate">{{ zPlaceholder() }}</span>
        }
      </span>
      <ng-icon name="lucideChevronDown" class="text-muted-foreground size-4!" />
    </button>

    <ng-template #dropdownTemplate>
      <div
        data-slot="select-content"
        [id]="listboxId"
        [class]="contentClasses()"
        role="listbox"
        [attr.data-state]="'open'"
        [attr.data-side]="overlaySide()"
        [attr.data-position]="zPosition()"
        [attr.data-align-trigger]="zPosition() === 'item-aligned' ? 'true' : null"
        [attr.aria-multiselectable]="zMultiple() ? 'true' : null"
        [style.--z-select-trigger-height]="triggerHeightStyle()"
        [style.--z-select-trigger-width]="triggerWidthStyle()"
        (keydown.{arrowdown,arrowup,enter,space,escape,home,end,pageup,pagedown}.prevent)="onDropdownKeydown($event)"
        (wheel)="stopScrollOptions()"
        (touchmove)="stopScrollOptions()"
        tabindex="-1"
      >
        @if (showScrollUpButton()) {
          <div
            data-slot="select-scroll-up-button"
            [class]="scrollButtonClasses()"
            aria-hidden="true"
            style="flex-shrink: 0"
            (pointerdown)="startScrollOptions(-1)"
            (pointermove)="moveOverScrollButton(-1)"
            (pointerleave)="stopScrollOptions(-1)"
            (pointerup)="stopScrollOptions(-1)"
            (pointercancel)="stopScrollOptions(-1)"
          >
            <ng-icon name="lucideChevronUp" class="size-4!" />
          </div>
        }

        <div
          #optionsViewport
          [class]="viewportClasses()"
          data-slot="select-viewport"
          role="presentation"
          [attr.data-position]="zPosition()"
          (scroll)="updateScrollableState()"
        >
          <ng-content />
        </div>

        @if (showScrollDownButton()) {
          <div
            data-slot="select-scroll-down-button"
            [class]="scrollButtonClasses()"
            aria-hidden="true"
            style="flex-shrink: 0"
            (pointerdown)="startScrollOptions(1)"
            (pointermove)="moveOverScrollButton(1)"
            (pointerleave)="stopScrollOptions(1)"
            (pointerup)="stopScrollOptions(1)"
            (pointercancel)="stopScrollOptions(1)"
          >
            <ng-icon name="lucideChevronDown" class="size-4!" />
          </div>
        }
      </div>
    </ng-template>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSelectComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronDown, lucideChevronUp })],
  host: {
    'data-slot': 'select',
    tabindex: '-1',
    '[attr.data-active]': 'isFocus() ? "" : null',
    '[attr.data-disabled]': 'disabledState() ? "" : null',
    '[attr.data-invalid]': 'zInvalid() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'classes()',
    '(focus)': 'onHostFocus($event)',
    '(keydown.{enter,space,arrowdown,arrowup,escape}.prevent)': 'onTriggerKeydown($event)',
  },
  exportAs: 'zSelect',
})
export class ZardSelectComponent implements ControlValueAccessor, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<void>>('dropdownTemplate');
  readonly optionsViewport = viewChild<ElementRef<HTMLElement>>('optionsViewport');
  readonly selectGroups = contentChildren(ZardSelectGroupComponent, { descendants: true });
  readonly selectItems = contentChildren(ZardSelectItemComponent, { descendants: true });

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly zAlign = input<ZardSelectAlignVariants>('center');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zLabel = input<string>('');
  readonly zMaxLabelCount = input(1, { transform: numberAttribute });
  readonly zMultiple = input(false, { transform: booleanAttribute });
  readonly zPlaceholder = input<string>('Select an option...');
  readonly zPosition = input<ZardSelectPositionVariants>('item-aligned');
  readonly zValue = model<string | string[]>(this.zMultiple() ? [] : '');

  readonly zSelectionChange = output<string | string[]>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);
  protected readonly isFocus = signal(false);
  protected readonly isCompact = signal(false);
  protected readonly hasScrollableContent = signal(false);
  protected readonly canScrollUp = signal(false);
  protected readonly canScrollDown = signal(false);
  protected readonly overlaySide = signal<'top' | 'bottom' | 'left' | 'right'>('bottom');
  protected readonly triggerHeight = signal(0);
  protected readonly triggerWidth = signal(0);
  protected readonly disabledState = linkedSignal(() => this.zDisabled());
  protected readonly listboxId = `z-select-listbox-${nextSelectId++}`;
  private scrollTimer: number | null = null;
  private scrollDirection: -1 | 1 | null = null;

  constructor() {
    effect(() => {
      if (this.disabledState() && this.isOpen()) {
        this.close(false);
      }
    });

    effect(() => this.updateItems(this.selectItems()));
  }

  protected readonly hasValue = computed(() => {
    const value = this.zValue();
    return Array.isArray(value) ? value.length > 0 : value !== '';
  });

  protected readonly triggerHeightStyle = computed(() => `${this.triggerHeight()}px`);
  protected readonly triggerWidthStyle = computed(() => `${this.triggerWidth()}px`);
  protected readonly showScrollUpButton = computed(() => this.canScrollUp());
  protected readonly showScrollDownButton = computed(() => this.canScrollDown());

  protected onFocus(): void {
    if (this.isCompact()) {
      this.isFocus.set(!this.hasValue());
    }
  }

  protected onHostFocus(event: FocusEvent): void {
    if (event.target === this.elementRef.nativeElement) {
      this.focusButton();
      this.open();
    }
  }

  // Compute the label based on selected value
  readonly selectedLabels = computed<string[]>(() => {
    const selectedValue = this.zValue();
    if (this.zMultiple() && Array.isArray(selectedValue)) {
      return this.provideLabelsForMultiselectMode(selectedValue);
    }

    return this.provideLabelForSingleSelectMode(selectedValue as string);
  });

  protected readonly triggerAriaLabel = computed(() => this.selectedLabels().join(', ') || this.zPlaceholder());

  private onChange: OnChangeType = (_value: string | string[]) => {
    // ControlValueAccessor onChange callback
  };

  private onTouched: OnTouchedType = () => {
    // ControlValueAccessor onTouched callback
  };

  protected readonly classes = computed(() => mergeClasses(selectVariants(), this.class()));
  protected readonly contentClasses = computed(() =>
    mergeClasses(selectContentVariants({ zPosition: this.zPosition() })),
  );

  protected readonly viewportClasses = computed(() =>
    mergeClasses(selectViewportVariants({ zPosition: this.zPosition() })),
  );

  protected readonly scrollButtonClasses = computed(() => mergeClasses(selectScrollButtonVariants()));
  protected readonly valueClasses = computed(() =>
    mergeClasses(
      'flex min-w-0 flex-1 items-center gap-2',
      this.zMultiple() ? 'flex-wrap overflow-visible' : 'overflow-hidden',
    ),
  );

  protected readonly triggerClasses = computed(() =>
    mergeClasses(selectTriggerVariants({}), this.zMultiple() && 'h-auto min-h-8 py-1'),
  );

  ngOnDestroy() {
    this.stopScrollOptions();
    this.destroyOverlay();
  }

  onTriggerKeydown(event: Event) {
    if (this.disabledState()) {
      return;
    }

    const { key } = event as KeyboardEvent;
    switch (key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        if (!this.isOpen()) {
          this.open();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          this.close();
        }
        break;
    }
  }

  onDropdownKeydown(e: Event) {
    const { key } = e as KeyboardEvent;
    const items = this.getSelectItems();

    switch (key) {
      case 'ArrowDown':
        this.navigateItems(1, items);
        break;
      case 'ArrowUp':
        this.navigateItems(-1, items);
        break;
      case 'Enter':
      case ' ':
        this.selectFocusedItem(items);
        break;
      case 'Escape':
        this.close();
        this.focusButton();
        break;
      case 'Home':
        this.focusFirstItem(items);
        break;
      case 'End':
        this.focusLastItem(items);
        break;
      case 'PageDown':
        this.navigateItems(5, items);
        break;
      case 'PageUp':
        this.navigateItems(-5, items);
        break;
    }
  }

  toggle() {
    if (this.disabledState()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  selectItem(value: string, label: string) {
    if (this.disabledState()) {
      return;
    }

    if (value === undefined || value === null || value === '') {
      console.warn('Attempted to select item with invalid value:', { value, label });
      return;
    }

    this.zValue.update(selectedValues => {
      if (Array.isArray(selectedValues)) {
        return selectedValues.includes(value) ? selectedValues.filter(v => v !== value) : [...selectedValues, value];
      }

      return value;
    });
    const selectedValue = this.zValue();
    this.onChange(selectedValue);
    this.zSelectionChange.emit(selectedValue);

    if (this.zMultiple()) {
      // in multiple mode it can happen that button changes size because of selection badges,
      // which requires overlay position to update
      this.updateOverlayPosition();
    } else {
      this.close();

      setTimeout(() => {
        this.blurButton();
      }, 0);
    }
  }

  private updateItems(items: readonly ZardSelectItemComponent[]): void {
    const hostWidth = this.elementRef.nativeElement.offsetWidth || 0;
    const isCompact = hostWidth <= COMPACT_MODE_WIDTH_THRESHOLD;
    this.isCompact.set(isCompact);
    // Setup select host reference for each item
    for (const [index, item] of items.entries()) {
      item.setSelectHost({
        selectedValue: () => (this.zMultiple() ? (this.zValue() as string[]) : [this.zValue() as string]),
        selectItem: (value: string, label: string) => this.selectItem(value, label),
        navigateTo: () => this.navigateTo(item, index),
      });
      item.zMode.set(isCompact ? 'compact' : 'normal');
    }
  }

  private navigateTo(element: ZardSelectItemComponent, index: number): void {
    this.focusedIndex.set(index);
    this.updateItemFocus(this.getSelectItems(true), index);
  }

  private updateOverlayPosition(): void {
    setTimeout(() => {
      this.overlayRef?.updatePosition();
      this.updateScrollableState();
    }, 0);
  }

  protected scrollOptions(direction: -1 | 1): void {
    const viewport = this.optionsViewport()?.nativeElement;
    if (!viewport) {
      return;
    }

    const maxScroll = Math.max(viewport.scrollHeight - viewport.clientHeight, 0);
    const nextScrollTop = Math.min(Math.max(viewport.scrollTop + direction * this.getScrollStep(), 0), maxScroll);
    viewport.scrollTop = nextScrollTop;
    this.updateScrollableState();

    if ((direction === -1 && !this.canScrollUp()) || (direction === 1 && !this.canScrollDown())) {
      this.stopScrollOptions(direction);
    }
  }

  protected startScrollOptions(direction: -1 | 1): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.scrollTimer !== null) {
      if (this.scrollDirection === direction) {
        return;
      }

      this.stopScrollOptions();
    }

    this.scrollDirection = direction;
    this.scrollTimer = window.setInterval(() => this.scrollOptions(direction), 50);
  }

  protected moveOverScrollButton(direction: -1 | 1): void {
    this.clearItemFocus();
    this.startScrollOptions(direction);
  }

  protected stopScrollOptions(direction?: -1 | 1): void {
    if (direction !== undefined && this.scrollDirection !== direction) {
      return;
    }

    if (this.scrollTimer === null || !isPlatformBrowser(this.platformId)) {
      this.scrollDirection = null;
      return;
    }

    window.clearInterval(this.scrollTimer);
    this.scrollTimer = null;
    this.scrollDirection = null;
  }

  protected updateScrollableState(): void {
    const viewport = this.optionsViewport()?.nativeElement;
    const maxScroll = viewport ? viewport.scrollHeight - viewport.clientHeight : 0;
    const scrollTop = viewport?.scrollTop ?? 0;
    const hasScrollableContent = !!viewport && maxScroll > 1;
    const previousCanScrollUp = this.canScrollUp();
    const previousCanScrollDown = this.canScrollDown();
    const nextCanScrollUp = hasScrollableContent && scrollTop > 0;
    const nextCanScrollDown = hasScrollableContent && Math.ceil(scrollTop) < maxScroll;

    this.hasScrollableContent.set(hasScrollableContent);
    this.canScrollUp.set(nextCanScrollUp);
    this.canScrollDown.set(nextCanScrollDown);

    if ((nextCanScrollUp && !previousCanScrollUp) || (nextCanScrollDown && !previousCanScrollDown)) {
      this.scrollFocusedItemIntoView();
    }
  }

  private getScrollStep(): number {
    const items = this.getSelectItems();
    const focusedItem = this.focusedIndex() >= 0 ? items[this.focusedIndex()] : undefined;
    const selectedItem = items.find(item => item.getAttribute('value') === this.getPrimarySelectedValue());
    const itemHeight = (selectedItem ?? focusedItem ?? items[0])?.offsetHeight ?? 0;

    return itemHeight > 0 ? itemHeight : 32;
  }

  private provideLabelsForMultiselectMode(selectedValue: string[]): string[] {
    const labelsToShowCount = selectedValue.length - this.zMaxLabelCount();
    const labels = [];
    let index = 0;
    for (const value of selectedValue) {
      const matchingItem = this.getMatchingItem(value);
      if (matchingItem) {
        labels.push(matchingItem.label());
        index++;
      }
      if (labelsToShowCount && this.zMaxLabelCount() && index === this.zMaxLabelCount()) {
        labels.push(`${labelsToShowCount} more item${labelsToShowCount > 1 ? 's' : ''} selected`);
        break;
      }
    }
    return labels;
  }

  private provideLabelForSingleSelectMode(selectedValue: string): string[] {
    const manualLabel = this.zLabel();
    if (manualLabel) {
      return [manualLabel];
    }

    const matchingItem = this.getMatchingItem(selectedValue);
    if (matchingItem) {
      return [matchingItem.label()];
    }

    return selectedValue ? [selectedValue] : [];
  }

  private open() {
    if (this.isOpen() || this.disabledState()) {
      return;
    }

    // Create overlay if it doesn't exist
    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) {
      return;
    }

    const hostWidth = this.elementRef.nativeElement.offsetWidth || 0;
    const trigger = this.elementRef.nativeElement.querySelector('button');
    const triggerHeight = trigger?.offsetHeight ?? 0;
    this.triggerWidth.set(hostWidth);
    this.triggerHeight.set(triggerHeight);

    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.overlayRef.updatePositionStrategy(this.createPositionStrategy());
    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);

    this.overlayRef.attach(this.portal);
    this.overlayRef.updateSize(this.zPosition() === 'popper' ? { minWidth: hostWidth } : { width: hostWidth });
    this.isOpen.set(true);
    this.updateFocusWhenNormalMode();

    this.determinePortalWidthOnOpen(hostWidth);
  }

  private setFocusOnOpen(): void {
    this.focusDropdown();
    this.focusSelectedItem();
  }

  private close(shouldTouch = true) {
    this.stopScrollOptions();
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.hasScrollableContent.set(false);
    this.canScrollUp.set(false);
    this.canScrollDown.set(false);
    this.focusedIndex.set(-1);
    if (shouldTouch) {
      this.onTouched();
    }
    this.updateFocusWhenNormalMode();
  }

  private updateFocusWhenNormalMode(): void {
    if (this.hasValue()) {
      this.isFocus.set(false);
      return;
    }

    if (!this.isCompact()) {
      this.isFocus.set(!this.isOpen());
    }
  }

  private getMatchingItem(value: string): ZardSelectItemComponent | undefined {
    return this.selectItems()?.find(item => item.zValue() === value);
  }

  private determinePortalWidthOnOpen(portalWidth: number): void {
    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        if (!this.overlayRef || !this.overlayRef.hasAttached()) {
          return;
        }

        if (this.zPosition() === 'popper') {
          this.updateScrollableState();
          this.setFocusOnOpen();
          return;
        }

        this.alignSelectedItemToTrigger();

        const overlayPaneElement = this.overlayRef.overlayElement;
        const textElements = Array.from(
          overlayPaneElement.querySelectorAll<HTMLElement>(
            'z-select-item > [data-slot="select-item-text"], [z-select-item] > [data-slot="select-item-text"]',
          ),
        );
        let isOverflow = false;
        for (const textElement of textElements) {
          if (textElement.scrollWidth > textElement.clientWidth + 1) {
            isOverflow = true;
            break;
          }
        }

        if (!isOverflow) {
          this.updateScrollableState();
          this.setFocusOnOpen();
          return;
        }

        const selectItems = this.selectItems();
        let itemMaxWidth = 0;
        for (const item of selectItems) {
          itemMaxWidth = Math.max(itemMaxWidth, item.elementRef.nativeElement.scrollWidth);
        }

        const [selectItem] = selectItems;
        if (isOverflow && selectItem) {
          const elementStyles = getComputedStyle(selectItem.elementRef.nativeElement);
          const leftPadding = Number.parseFloat(elementStyles.getPropertyValue('padding-left')) || 0;
          const rightPadding = Number.parseFloat(elementStyles.getPropertyValue('padding-right')) || 0;
          itemMaxWidth += leftPadding + rightPadding;
        }

        itemMaxWidth = Math.max(itemMaxWidth, portalWidth);
        this.overlayRef.updateSize({ width: itemMaxWidth });
        this.alignSelectedItemToTrigger();

        this.updateScrollableState();
        this.setFocusOnOpen();
      });
    });
  }

  private alignSelectedItemToTrigger(): void {
    if (this.zPosition() !== 'item-aligned' || !this.overlayRef?.hasAttached()) {
      return;
    }

    const itemAlignedOffset = this.getItemAlignedOffset();
    if (!itemAlignedOffset) {
      return;
    }

    this.overlayRef.updatePositionStrategy(this.createPositionStrategy(itemAlignedOffset));
  }

  private getItemAlignedOffset(): { bottom: number; top: number } | null {
    const content = this.overlayRef?.overlayElement.querySelector<HTMLElement>('[data-slot="select-content"]');
    const selectedItem =
      this.getSelectItems(true).find(item => item.getAttribute('value') === this.getPrimarySelectedValue()) ??
      this.getSelectItems()[0];
    const trigger = (this.elementRef.nativeElement as HTMLElement).querySelector<HTMLElement>(
      '[data-slot="select-trigger"]',
    );

    if (!content || !selectedItem || !trigger) {
      return null;
    }

    const triggerHeight = trigger.offsetHeight || trigger.getBoundingClientRect().height || this.triggerHeight();
    const itemHeight = selectedItem.offsetHeight || selectedItem.getBoundingClientRect().height || triggerHeight;
    const contentHeight = content.offsetHeight || content.getBoundingClientRect().height;
    const selectedItemOffsetTop = selectedItem.offsetTop;
    const itemCenterOffset = (triggerHeight - itemHeight) / 2;
    const bottom = Math.round(-triggerHeight - selectedItemOffsetTop + itemCenterOffset);
    const top = Math.round(contentHeight - selectedItemOffsetTop + itemCenterOffset);

    return { bottom, top };
  }

  private createPositionStrategy(itemAlignedOffset?: { bottom: number; top: number }) {
    return this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(this.connectedPositions(itemAlignedOffset))
      .withPush(false);
  }

  private connectedPositions(itemAlignedOffset?: { bottom: number; top: number }): ConnectedPosition[] {
    const originX = this.zAlign();
    const overlayX = this.zAlign();
    const bottomOffsetY = itemAlignedOffset?.bottom ?? 4;
    const topOffsetY = itemAlignedOffset?.top ?? -4;

    return [
      {
        originX,
        originY: 'bottom',
        overlayX,
        overlayY: 'top',
        offsetY: bottomOffsetY,
      },
      {
        originX,
        originY: 'top',
        overlayX,
        overlayY: 'bottom',
        offsetY: topOffsetY,
      },
    ];
  }

  private createOverlay() {
    if (this.overlayRef) {
      return;
    } // Already created

    if (isPlatformBrowser(this.platformId)) {
      try {
        const positionStrategy = this.createPositionStrategy();

        this.overlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          maxHeight: 384, // max-h-96 equivalent
        });
        this.overlayRef
          .outsidePointerEvents()
          .pipe(
            filter(event => !this.elementRef.nativeElement.contains(event.target)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe(() => {
            this.isFocus.set(false);
            this.close();
          });
      } catch (error) {
        console.error('Error creating overlay:', error);
      }
    }
  }

  private destroyOverlay() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }

  private getSelectItems(ignoreFilter = false): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) {
      return [];
    }
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(dropdownElement.querySelectorAll<HTMLElement>('z-select-item, [z-select-item]')).filter(
      item => ignoreFilter || item.dataset['disabled'] === undefined,
    );
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) {
      return;
    }

    const currentIndex = this.focusedIndex();
    let nextIndex = currentIndex === -1 ? (direction > 0 ? 0 : items.length - 1) : currentIndex + direction;

    nextIndex %= items.length;
    if (nextIndex < 0) {
      nextIndex += items.length;
    }

    this.focusedIndex.set(nextIndex);
    this.updateItemFocus(items, nextIndex);
  }

  private selectFocusedItem(items: HTMLElement[]) {
    const currentIndex = this.focusedIndex();
    if (currentIndex >= 0 && currentIndex < items.length) {
      const item = items[currentIndex];
      const value = item.getAttribute('value');
      const label = item.textContent?.trim() ?? '';

      if (value === null || value === undefined) {
        console.warn('No value attribute found on selected item:', item);
        return;
      }

      this.selectItem(value, label);
    }
  }

  private focusFirstItem(items: HTMLElement[]) {
    if (items.length > 0) {
      this.focusedIndex.set(0);
      this.updateItemFocus(items, 0);
    }
  }

  private focusLastItem(items: HTMLElement[]) {
    if (items.length > 0) {
      const lastIndex = items.length - 1;
      this.focusedIndex.set(lastIndex);
      this.updateItemFocus(items, lastIndex);
    }
  }

  private updateItemFocus(items: HTMLElement[], focusedIndex: number) {
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('data-highlighted', '');
      } else {
        item.removeAttribute('data-highlighted');
      }
    }
    this.updateScrollableState();
  }

  private clearItemFocus(): void {
    this.focusedIndex.set(-1);
    for (const item of this.getSelectItems(true)) {
      item.removeAttribute('data-highlighted');
    }
    this.focusDropdown();
  }

  private scrollFocusedItemIntoView(): void {
    const focusedItem = this.getSelectItems(true).find(item => item === document.activeElement);
    focusedItem?.scrollIntoView?.({ block: 'nearest' });
  }

  private focusDropdown() {
    if (this.overlayRef?.hasAttached()) {
      const dropdownElement = this.overlayRef.overlayElement.querySelector(
        '[data-slot="select-content"]',
      ) as HTMLElement;
      if (dropdownElement) {
        dropdownElement.focus();
      }
    }
  }

  private focusButton() {
    const button = this.elementRef.nativeElement.querySelector('button');
    if (button) {
      button.focus();
    }
  }

  private blurButton() {
    const button = this.elementRef.nativeElement.querySelector('button');
    if (button) {
      button.blur();
    }
  }

  private focusSelectedItem() {
    const items = this.getSelectItems();
    if (items.length === 0) {
      return;
    }

    let selectedIndex = items.findIndex(item => item.getAttribute('value') === this.getPrimarySelectedValue());

    // If no item is selected, focus the first item
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }

    this.focusedIndex.set(selectedIndex);
    this.updateItemFocus(items, selectedIndex);
  }

  private getPrimarySelectedValue(): string {
    const selectedValue = this.zValue();
    if (Array.isArray(selectedValue)) {
      return selectedValue[0] ?? '';
    }

    return selectedValue;
  }

  // ControlValueAccessor implementation
  writeValue(value: string | string[] | null): void {
    if (this.zMultiple()) {
      this.zValue.set(Array.isArray(value) ? value : value ? [value] : []);
    } else {
      this.zValue.set(value ?? '');
    }
  }

  registerOnChange(fn: (value: string | string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
    if (isDisabled && this.isOpen()) {
      this.close(false);
    }
  }
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const selectVariants = cva(
  mergeClasses(
    'relative inline-block w-full rounded-lg group',
    '[&_button]:focus-visible:border [&_button]:focus-visible:border-ring [&_button]:focus-visible:ring-ring/50 [&_button]:focus-visible:ring-[3px]',
  ),
);

export const selectTriggerVariants = cva(
  mergeClasses(
    'flex h-8 px-3 py-2 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent',
    'text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed',
    'disabled:opacity-50 data-[placeholder]:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground',
    'dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    '*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
  ),
  {
    variants: {},
  },
);

export const selectContentVariants = cva(
  mergeClasses(
    'relative z-50 flex max-h-96 w-full min-w-[8rem] origin-(--z-select-content-transform-origin) flex-col overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    'data-[align-trigger=true]:animate-none!',
  ),
  {
    variants: {
      zPosition: {
        'item-aligned': '',
        popper:
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      },
    },
    defaultVariants: {
      zPosition: 'popper',
    },
  },
);

export const selectViewportVariants = cva('min-h-0 flex-1 box-border overflow-x-hidden overflow-y-auto p-1', {
  variants: {
    zPosition: {
      'item-aligned': '',
      popper: 'w-full min-w-(--z-select-trigger-width) scroll-my-1',
    },
  },
  defaultVariants: {
    zPosition: 'popper',
  },
});

export const selectScrollButtonVariants = cva(
  'z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*="size-"])]:size-4',
);

export const selectGroupVariants = cva('');

export const selectLabelVariants = cva('px-2 py-1.5 text-xs text-muted-foreground');

export const selectSeparatorVariants = cva('pointer-events-none -mx-1 block my-1 h-px bg-border');

export const selectItemVariants = cva(
  'relative flex w-full cursor-default items-center gap-2 rounded-md outline-hidden select-none',
  {
    variants: {
      zSize: {
        sm: 'py-1 text-xs',
        default: 'py-1 text-sm',
        lg: 'py-2 text-base',
      },
      zMode: {
        normal: 'pr-8 pl-2',
        compact: 'pr-8 pl-2',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zMode: 'normal',
    },
  },
);

export const selectItemStateVariants = cva(
  mergeClasses(
    'focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground',
    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground',
    '*:data-[slot=select-item-text]:flex *:data-[slot=select-item-text]:items-center *:data-[slot=select-item-text]:gap-2',
  ),
);

export const selectItemIconVariants = cva('absolute flex size-3.5 items-center justify-center', {
  variants: {
    // zSize variants are placeholders for compound variant matching
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
    zMode: {
      normal: 'right-2',
      compact: 'right-2',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zMode: 'normal',
  },
});

export type ZardSelectPositionVariants = NonNullable<VariantProps<typeof selectContentVariants>['zPosition']>;
export type ZardSelectItemModeVariants = NonNullable<VariantProps<typeof selectItemVariants>['zMode']>;
export type ZardSelectAlignVariants = 'start' | 'center' | 'end';
```

```angular-ts
export * from '@/shared/components/select/select.component';
export * from '@/shared/components/select/select-group.component';
export * from '@/shared/components/select/select-item.component';
export * from '@/shared/components/select/select.imports';
export * from '@/shared/components/select/select.variants';
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  selectGroupVariants,
  selectLabelVariants,
  selectSeparatorVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-select-group, [z-select-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'select-group',
    role: 'group',
    '[class]': 'classes()',
  },
  exportAs: 'zSelectGroup',
})
export class ZardSelectGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(selectGroupVariants(), this.class()));
}

@Component({
  selector: 'z-select-label, [z-select-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'select-label',
    '[class]': 'classes()',
  },
  exportAs: 'zSelectLabel',
})
export class ZardSelectLabelComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(selectLabelVariants(), this.class()));
}

@Component({
  selector: 'z-select-separator, [z-select-separator]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'select-separator',
    role: 'separator',
    '[class]': 'classes()',
  },
  exportAs: 'zSelectSeparator',
})
export class ZardSelectSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(selectSeparatorVariants(), this.class()));
}
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  selectItemIconVariants,
  selectItemStateVariants,
  selectItemVariants,
  type ZardSelectItemModeVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses, noopFn } from '@/shared/utils/merge-classes';

// Interface to avoid circular dependency
interface SelectHost {
  selectedValue(): string[];
  selectItem(value: string, label: string): void;
  navigateTo(): void;
}

@Component({
  selector: 'z-select-item, [z-select-item]',
  imports: [NgIcon],
  template: `
    <span data-slot="select-item-indicator" [class]="iconClasses()">
      @if (isSelected()) {
        <ng-icon
          name="lucideCheck"
          class="size-4! text-current"
          [strokeWidth]="strokeWidth()"
          aria-hidden="true"
          data-testid="check-icon"
        />
      }
    </span>
    <span data-slot="select-item-text" class="truncate">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck })],
  host: {
    role: 'option',
    tabindex: '-1',
    'data-slot': 'select-item',
    '[class]': 'classes()',
    '[attr.value]': 'zValue()',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-disabled]': 'zDisabled()',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
    '(mouseenter)': 'onMouseEnter()',
    '(keydown.{tab}.prevent)': 'noopFn',
  },
})
export class ZardSelectItemComponent {
  readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly zValue = input.required<string>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  private readonly select = signal<SelectHost | null>(null);
  noopFn = noopFn;

  readonly label = linkedSignal<string>(() => {
    const element = this.elementRef.nativeElement;
    return (element.textContent ?? element.innerText)?.trim() ?? '';
  });

  readonly zMode = signal<ZardSelectItemModeVariants>('normal');

  protected readonly classes = computed(() =>
    mergeClasses(selectItemVariants({ zMode: this.zMode() }), selectItemStateVariants(), this.class()),
  );

  protected readonly iconClasses = computed(() => mergeClasses(selectItemIconVariants({ zMode: this.zMode() })));

  protected readonly strokeWidth = computed(() => (this.zMode() === 'compact' ? 3 : 2));

  protected readonly isSelected = computed(() => this.select()?.selectedValue().includes(this.zValue()) ?? false);

  setSelectHost(selectHost: SelectHost) {
    this.select.set(selectHost);
  }

  onMouseEnter() {
    if (this.zDisabled()) {
      return;
    }
    this.select()?.navigateTo();
  }

  onClick() {
    if (this.zDisabled()) {
      return;
    }
    this.select()?.selectItem(this.zValue(), this.label());
  }
}
```

```angular-ts
import {
  ZardSelectGroupComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
} from '@/shared/components/select/select-group.component';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardSelectComponent } from '@/shared/components/select/select.component';

export const ZardSelectImports = [
  ZardSelectComponent,
  ZardSelectGroupComponent,
  ZardSelectItemComponent,
  ZardSelectLabelComponent,
  ZardSelectSeparatorComponent,
] as const;
```

## Usage

```angular-ts
import { ZardSelectImports } from '@/shared/components/select/select.imports';
```

```angular-html
<z-select zPlaceholder="Select a fruit">
  <z-select-item zValue="apple">Apple</z-select-item>
  <z-select-item zValue="banana">Banana</z-select-item>
  <z-select-item zValue="blueberry">Blueberry</z-select-item>
</z-select>
```

## Composition

```text
z-select
├── z-select-label
├── z-select-item
├── z-select-group
│   ├── z-select-label
│   ├── z-select-item
│   └── z-select-item
├── z-select-separator
└── z-select-group
    ├── z-select-label
    ├── z-select-item
    └── z-select-item
```

## Examples

### Align Item

Use the position prop on SelectContent to control alignment. When position="item-aligned" (default), the popup positions so the selected item appears over the trigger. When position="popper", the popup aligns to the trigger edge.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports, type ZardSelectPositionVariants } from '@/shared/components/select';
import { ZardSwitchComponent } from '@/shared/components/switch';

@Component({
  selector: 'z-demo-select-align-item',
  imports: [ZardSelectImports, ZardSwitchComponent, ...ZardFieldImports],
  template: `
    <div z-field-group class="w-full min-w-xs">
      <div z-field zOrientation="horizontal">
        <div z-field-content>
          <label z-field-label for="align-item">Align Item</label>
          <p z-field-description>Toggle to align the item with the trigger.</p>
        </div>
        <z-switch id="align-item" [(zChecked)]="alignItem" />
      </div>

      <div z-field>
        <z-select [zPosition]="position()" [(zValue)]="selectedFruit">
          <z-select-group>
            <z-select-item zValue="apple">Apple</z-select-item>
            <z-select-item zValue="banana">Banana</z-select-item>
            <z-select-item zValue="blueberry">Blueberry</z-select-item>
            <z-select-item zValue="grapes">Grapes</z-select-item>
            <z-select-item zValue="pineapple">Pineapple</z-select-item>
          </z-select-group>
        </z-select>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectAlignItemComponent {
  readonly alignItem = signal(true);
  readonly selectedFruit = signal('banana');

  protected readonly position = computed<ZardSelectPositionVariants>(() =>
    this.alignItem() ? 'item-aligned' : 'popper',
  );
}
```

### Groups

Use SelectGroup, SelectLabel, and SelectSeparator to organize items.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-groups',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-48" zPlaceholder="Select a fruit" [(zValue)]="selectedFood">
      <z-select-group>
        <z-select-label>Fruits</z-select-label>
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Vegetables</z-select-label>
        <z-select-item zValue="aubergine">Aubergine</z-select-item>
        <z-select-item zValue="broccoli">Broccoli</z-select-item>
        <z-select-item zValue="carrot">Carrot</z-select-item>
        <z-select-item zValue="courgette">Courgette</z-select-item>
      </z-select-group>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectGroupsComponent {
  readonly selectedFood = signal('');
}
```

### Scrollable

A select with many items that scrolls.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-scrollable',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-64" zPlaceholder="Select a timezone" zPosition="popper" [(zValue)]="selectedTimezone">
      <z-select-group>
        <z-select-label>North America</z-select-label>
        <z-select-item zValue="est">Eastern Standard Time (EST)</z-select-item>
        <z-select-item zValue="cst">Central Standard Time (CST)</z-select-item>
        <z-select-item zValue="mst">Mountain Standard Time (MST)</z-select-item>
        <z-select-item zValue="pst">Pacific Standard Time (PST)</z-select-item>
        <z-select-item zValue="akst">Alaska Standard Time (AKST)</z-select-item>
        <z-select-item zValue="hst">Hawaii Standard Time (HST)</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Europe & Africa</z-select-label>
        <z-select-item zValue="gmt">Greenwich Mean Time (GMT)</z-select-item>
        <z-select-item zValue="cet">Central European Time (CET)</z-select-item>
        <z-select-item zValue="eet">Eastern European Time (EET)</z-select-item>
        <z-select-item zValue="west">Western European Summer Time (WEST)</z-select-item>
        <z-select-item zValue="cat">Central Africa Time (CAT)</z-select-item>
        <z-select-item zValue="eat">East Africa Time (EAT)</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Asia</z-select-label>
        <z-select-item zValue="msk">Moscow Time (MSK)</z-select-item>
        <z-select-item zValue="ist">India Standard Time (IST)</z-select-item>
        <z-select-item zValue="cst_china">China Standard Time (CST)</z-select-item>
        <z-select-item zValue="jst">Japan Standard Time (JST)</z-select-item>
        <z-select-item zValue="kst">Korea Standard Time (KST)</z-select-item>
        <z-select-item zValue="ist_indonesia">Indonesia Central Standard Time (WITA)</z-select-item>
      </z-select-group>
      <z-select-separator />
      <z-select-group>
        <z-select-label>Australia & Pacific</z-select-label>
        <z-select-item zValue="awst">Australian Western Standard Time (AWST)</z-select-item>
        <z-select-item zValue="acst">Australian Central Standard Time (ACST)</z-select-item>
        <z-select-item zValue="aest">Australian Eastern Standard Time (AEST)</z-select-item>
        <z-select-item zValue="nzst">New Zealand Standard Time (NZST)</z-select-item>
        <z-select-item zValue="fjt">Fiji Time (FJT)</z-select-item>
      </z-select-group>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectScrollableComponent {
  readonly selectedTimezone = signal('');
}
```

### Disabled

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-disabled',
  imports: [ZardSelectImports],
  template: `
    <z-select class="w-full min-w-48" zPlaceholder="Select a fruit" [(zValue)]="selectedFruit" zDisabled>
      <z-select-item zValue="apple">Apple</z-select-item>
      <z-select-item zValue="banana">Banana</z-select-item>
      <z-select-item zValue="blueberry">Blueberry</z-select-item>
      <z-select-item zValue="grapes">Grapes</z-select-item>
      <z-select-item zValue="pineapple">Pineapple</z-select-item>
    </z-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectDisabledComponent {
  readonly selectedFruit = signal('');
}
```

### Invalid

Add the data-invalid attribute to the Field component and the aria-invalid attribute to the SelectTrigger component to show an error state.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-select-invalid',
  imports: [...ZardFieldImports, ZardSelectImports],
  template: `
    <div z-field class="w-full min-w-48" data-invalid="true">
      <label z-field-label for="select-invalid">Fruit</label>
      <z-select id="select-invalid" zPlaceholder="Select a fruit" zInvalid [(zValue)]="selectedFruit">
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple">Pineapple</z-select-item>
      </z-select>
      <z-field-error>Please select a fruit.</z-field-error>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSelectInvalidComponent {
  readonly selectedFruit = signal('');
}
```

### Multi Select

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardSelectImports } from '@/shared/components/select/select.imports';

@Component({
  selector: 'z-demo-multi-select-basic',
  imports: [ZardSelectImports],
  template: `
    <div class="flex h-100 w-75 flex-col gap-4">
      <p class="text-muted-foreground text-sm">Selected fruits: {{ selectedValues().join(', ') }}</p>
      <z-select
        zPlaceholder="Select multiple fruits"
        [zMultiple]="true"
        [zMaxLabelCount]="3"
        [(zValue)]="selectedValues"
      >
        <z-select-item zValue="apple">Apple</z-select-item>
        <z-select-item zValue="banana">Banana</z-select-item>
        <z-select-item zValue="blueberry">Blueberry</z-select-item>
        <z-select-item zValue="grapes">Grapes</z-select-item>
        <z-select-item zValue="pineapple">Pineapple</z-select-item>
        <z-select-item zValue="strawberry">Strawberry</z-select-item>
        <z-select-item zValue="watermelon">Watermelon</z-select-item>
        <z-select-item zValue="kiwi">Kiwi</z-select-item>
        <z-select-item zValue="mango">Mango</z-select-item>
      </z-select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoMultiSelectBasicComponent {
  readonly selectedValues = signal<string[]>([]);
}
```

## API Reference

### z-select

A customizable select component that supports single and multiple value selection.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zAlign]` | Overlay alignment relative to the trigger | `'start' \| 'center' \| 'end'` | `'center'` |
| `[zDisabled]` | Disables the select | `boolean` | `false` |
| `[zInvalid]` | Applies invalid ARIA state and destructive styling | `boolean` | `false` |
| `[zLabel]` | Optional label for the select | `string` | `''` |
| `[zMaxLabelCount]` | Limits visible labels in multiselect mode | `number` | `1` |
| `[zMultiple]` | Multiselect mode | `boolean` | `false` |
| `[zPlaceholder]` | Placeholder text | `string` | `'Select an option...'` |
| `[zPosition]` | Overlay positioning mode | `'item-aligned' \| 'popper'` | `'popper'` |
| `[zSize]` | Trigger and item size | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `[(zValue)]` | Selected value | `string \| string[]` | `'' \| []` |
| `(zSelectionChange)` | Emitted when the selected value changes | `string \| string[]` | `-` |

### z-select-item

Represents an individual item inside a z-select component.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zValue]` | The value associated with this item | `string` | `''` |
| `[zDisabled]` | Disables selection for this item | `boolean` | `false` |

### z-select-group

Groups related select items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-select-label

Displays a non-selectable label inside a select group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-select-separator

Displays a separator between select groups.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/select)
