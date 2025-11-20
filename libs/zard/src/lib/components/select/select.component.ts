import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  ElementRef,
  forwardRef,
  inject,
  input,
  model,
  type OnDestroy,
  output,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardSelectItemComponent } from './select-item.component';
import {
  selectContentVariants,
  selectTriggerVariants,
  selectVariants,
  type ZardSelectTriggerVariants,
} from './select.variants';
import { isElementContentTruncated, mergeClasses, transform } from '../../shared/utils/utils';
import { ZardBadgeComponent } from '../badge/badge.component';
import { ZardIconComponent } from '../icon/icon.component';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Component({
  selector: 'z-select, [z-select]',
  imports: [CommonModule, OverlayModule, ZardBadgeComponent, ZardIconComponent],
  template: `
    <button
      type="button"
      [class]="triggerClasses()"
      [disabled]="zDisabled()"
      (click)="toggle()"
      (keydown)="onTriggerKeydown($event)"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.data-state]="isOpen() ? 'open' : 'closed'"
      [attr.data-placeholder]="!zValue() ? '' : null"
    >
      <span class="flex flex-1 flex-wrap items-center gap-2">
        @let labels = selectedLabels();
        @for (label of labels; track index; let index = $index) {
          <ng-container *ngTemplateOutlet="labelsTemplate; context: { $implicit: label }" />
        } @empty {
          <span class="text-muted-foreground truncate">{{ zPlaceholder() }}</span>
        }
      </span>
      <z-icon zType="chevron-down" zSize="lg" class="opacity-50" />
    </button>

    <ng-template #labelsTemplate let-label>
      @if (zMultiple()) {
        <z-badge zType="secondary">
          <span class="truncate">{{ label }}</span>
        </z-badge>
      } @else {
        <span class="truncate">{{ label }}</span>
      }
    </ng-template>

    <ng-template #dropdownTemplate>
      <div
        [class]="contentClasses()"
        role="listbox"
        [attr.data-state]="'open'"
        (keydown)="onDropdownKeydown($event)"
        tabindex="-1"
      >
        <div class="p-1">
          <ng-content />
        </div>
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
  host: {
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'classes()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class ZardSelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  private readonly elementRef = inject(ElementRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<void>>('dropdownTemplate');
  protected readonly selectItems = contentChildren(ZardSelectItemComponent);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform });
  readonly zLabel = input<string>('');
  readonly zMaxLabelCount = input<number>(1);
  readonly zMultiple = input<boolean>(false);
  readonly zPlaceholder = input<string>('Select an option...');
  readonly zSize = input<ZardSelectTriggerVariants['zSize']>('default');
  readonly zValue = model<string | string[]>(this.zMultiple() ? [] : '');

  readonly zSelectionChange = output<string | string[]>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);

  // Compute the label based on selected value
  readonly selectedLabels = computed<string[]>(() => {
    const selectedValue = this.zValue();
    if (this.zMultiple() && Array.isArray(selectedValue)) {
      return this.provideLabelsForMultiselectMode(selectedValue);
    }

    return this.provideLabelForSingleSelectMode(selectedValue as string);
  });

  private onChange: OnChangeType = (_value: string) => {
    // ControlValueAccessor onChange callback
  };

  private onTouched: OnTouchedType = () => {
    // ControlValueAccessor onTouched callback
  };

  protected readonly classes = computed(() => mergeClasses(selectVariants(), this.class()));
  protected readonly contentClasses = computed(() => mergeClasses(selectContentVariants()));
  protected readonly triggerClasses = computed(() =>
    mergeClasses(
      selectTriggerVariants({
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );

  ngAfterContentInit() {
    // Setup select host reference for each item
    for (const item of this.selectItems()) {
      item.setSelectHost({
        selectedValue: () => (this.zMultiple() ? (this.zValue() as string[]) : [this.zValue() as string]),
        selectItem: (value: string, label: string) => this.selectItem(value, label),
      });
    }
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onDocumentClick(event: Event) {
    const target = event.target as Node;
    const clickedInside = this.elementRef.nativeElement.contains(target);
    const clickedInOverlay = this.overlayRef?.overlayElement?.contains(target);

    if (!clickedInside && !clickedInOverlay) {
      this.close();
    }
  }

  onTriggerKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
        }
        break;
    }
  }

  onDropdownKeydown(event: KeyboardEvent) {
    const items = this.getSelectItems();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateItems(1, items);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateItems(-1, items);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectFocusedItem(items);
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.focusButton();
        break;
      case 'Home':
        event.preventDefault();
        this.focusFirstItem(items);
        break;
      case 'End':
        event.preventDefault();
        this.focusLastItem(items);
        break;
    }
  }

  toggle() {
    if (this.zDisabled()) return;

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  selectItem(value: string, label: string) {
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
    this.onChange(value);
    this.zSelectionChange.emit(this.zValue());

    if (!this.zMultiple()) {
      this.close();

      // Return focus to the button after selection
      setTimeout(() => {
        this.focusButton();
      }, 0);
    }
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
    if (manualLabel) return [manualLabel];

    const matchingItem = this.getMatchingItem(selectedValue);
    if (matchingItem) {
      return [matchingItem.label()];
    }

    return selectedValue ? [selectedValue] : [];
  }

  private open() {
    if (this.isOpen()) return;

    // Create overlay if it doesn't exist
    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) return;

    const hostWidth = this.elementRef.nativeElement.offsetWidth || 0;

    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);

    this.overlayRef.attach(this.portal);
    this.overlayRef.updateSize({ width: hostWidth });
    this.isOpen.set(true);

    this.determinePortalWidth(hostWidth);

    // Focus dropdown after opening and position on selected item
    setTimeout(() => {
      this.focusDropdown();
      this.focusSelectedItem();
    }, 0);
  }

  private close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.onTouched();
  }

  private getMatchingItem(value: string): ZardSelectItemComponent | undefined {
    return this.selectItems()?.find(item => item.zValue() === value);
  }

  private determinePortalWidth(portalWidth: number): void {
    if (!this.overlayRef || !this.overlayRef.hasAttached()) return;

    const selectItems = this.selectItems();
    let itemMaxWidth = 0;
    for (const item of selectItems) {
      itemMaxWidth = Math.max(itemMaxWidth, item.elementRef.nativeElement.scrollWidth);
    }

    const textContentElement = this.elementRef.nativeElement.querySelector('button > span > span') as HTMLElement;
    const isOverflow = isElementContentTruncated(textContentElement);

    if (isOverflow && selectItems.length) {
      const elementStyles = getComputedStyle(selectItems[0].elementRef.nativeElement);
      const leftPadding = Number.parseFloat(elementStyles.getPropertyValue('padding-left')) || 0;
      const rightPadding = Number.parseFloat(elementStyles.getPropertyValue('padding-right')) || 0;
      itemMaxWidth += leftPadding + rightPadding;
    }

    itemMaxWidth = Math.max(itemMaxWidth, portalWidth);
    this.overlayRef.updateSize({ width: itemMaxWidth });
    this.overlayRef.updatePosition();
  }

  private createOverlay() {
    if (this.overlayRef) return; // Already created

    if (isPlatformBrowser(this.platformId)) {
      try {
        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(this.elementRef)
          .withPositions([
            {
              originX: 'center',
              originY: 'bottom',
              overlayX: 'center',
              overlayY: 'top',
              offsetY: 4,
            },
            {
              originX: 'center',
              originY: 'top',
              overlayX: 'center',
              overlayY: 'bottom',
              offsetY: -4,
            },
          ])
          .withPush(false);

        const elementWidth = this.elementRef.nativeElement.offsetWidth || 200;

        this.overlayRef = this.overlay.create({
          positionStrategy,
          hasBackdrop: false,
          scrollStrategy: this.overlay.scrollStrategies.reposition(),
          width: elementWidth,
          maxHeight: 384, // max-h-96 equivalent
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

  private getSelectItems(): HTMLElement[] {
    if (!this.overlayRef?.hasAttached()) return [];
    const dropdownElement = this.overlayRef.overlayElement;
    return Array.from(dropdownElement.querySelectorAll<HTMLElement>('z-select-item, [z-select-item]')).filter(
      item => item.dataset['disabled'] === undefined,
    );
  }

  private navigateItems(direction: number, items: HTMLElement[]) {
    if (items.length === 0) return;

    const currentIndex = this.focusedIndex();
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = items.length - 1;
    } else if (nextIndex >= items.length) {
      nextIndex = 0;
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
        item.setAttribute('aria-selected', 'true');
      } else {
        item.removeAttribute('aria-selected');
      }
    }
  }

  private focusDropdown() {
    if (this.overlayRef?.hasAttached()) {
      const dropdownElement = this.overlayRef.overlayElement.querySelector('[role="listbox"]') as HTMLElement;
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

  private focusSelectedItem() {
    const items = this.getSelectItems();
    if (items.length === 0) return;

    // Find the index of the currently selected item
    const selectedValue = this.zValue();
    let selectedIndex = -1;

    if (selectedValue) {
      selectedIndex = items.findIndex(item => item.getAttribute('value') === selectedValue);
    }

    // If no item is selected, focus the first item
    if (selectedIndex === -1) {
      selectedIndex = 0;
    }

    this.focusedIndex.set(selectedIndex);
    this.updateItemFocus(items, selectedIndex);
  }

  // ControlValueAccessor implementation
  writeValue(value: string | string[] | null): void {
    if (this.zMultiple() && Array.isArray(value)) {
      this.zValue.set(value);
    } else {
      this.zValue.set(value ?? '');
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // The disabled state is handled by the disabled input
  }
}
