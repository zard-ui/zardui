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
  type ZardSelectSizeVariants,
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
      [attr.data-size]="zSize()"
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
      <ng-icon name="lucideChevronDown" class="size-4! opacity-50" />
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
  readonly zPosition = input<ZardSelectPositionVariants>('popper');
  readonly zSize = input<ZardSelectSizeVariants>('default');
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
    mergeClasses(
      selectTriggerVariants({
        zSize: this.zSize(),
      }),
      this.zMultiple() && this.multiselectTriggerClasses(),
    ),
  );

  private multiselectTriggerClasses(): string {
    switch (this.zSize()) {
      case 'sm':
        return 'h-auto min-h-8 py-1';
      case 'lg':
        return 'h-auto min-h-10 py-2';
      default:
        return 'h-auto min-h-9 py-1.5';
    }
  }

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
      item.zSize.set(this.zSize());
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
