

```angular-ts title="select.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
import { selectContentVariants, selectTriggerVariants, selectVariants, type ZardSelectTriggerVariants } from './select.variants';
import { isElementContentTruncated, mergeClasses, transform } from '../../shared/utils/utils';
import { ZardBadgeComponent } from '../badge/badge.component';
import { ZardIconComponent } from '../icon/icon.component';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Component({
  selector: 'z-select, [z-select]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OverlayModule, ZardBadgeComponent, ZardIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'classes()',
    '(document:click)': 'onDocumentClick($event)',
  },
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
      <span class="flex items-center gap-2 overflow-hidden">
        @let labels = selectedLabels();
        @for (label of labels; track index; let index = $index) {
          <ng-container *ngTemplateOutlet="labelsTemplate; context: { $implicit: label }"> </ng-container>
        } @empty {
          <span class="text-muted-foreground truncate">{{ zPlaceholder() }}</span>
        }
      </span>
      <z-icon zType="chevron-down" zSize="lg" class="opacity-50" />
    </button>

    <ng-template #labelsTemplate let-label>
      @if (zMultiple()) {
        <z-badge>
          <span class="truncate">{{ label }}</span>
        </z-badge>
      } @else {
        <span class="truncate">{{ label }}</span>
      }
    </ng-template>

    <ng-template #dropdownTemplate>
      <div [class]="contentClasses()" role="listbox" [attr.data-state]="'open'" (keydown)="onDropdownKeydown($event)" tabindex="-1">
        <div class="p-1">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>
  `,
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
    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
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
    this.close();

    // Return focus to the button after selection
    setTimeout(() => {
      this.focusButton();
    }, 0);
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
    if (!this.overlayRef) return;

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
    this.overlayRef?.updateSize({ width: itemMaxWidth });
    this.overlayRef?.updatePosition();
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
    return Array.from(dropdownElement.querySelectorAll<HTMLElement>('z-select-item, [z-select-item]')).filter(item => item.dataset['disabled'] === undefined);
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

```



```angular-ts title="select.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva('relative inline-block w-full');

export const selectTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      zSize: {
        sm: 'h-8 text-xs',
        default: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);
export const selectContentVariants = cva('z-9999 min-w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95');
export const selectItemVariants = cva(
  'relative flex min-w-full cursor-pointer text-nowrap items-center gap-2 rounded-sm mb-0.5 py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent data-disabled:hover:text-current [&_svg:not([class*="text-"])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
);

export type ZardSelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;
export type ZardSelectContentVariants = VariantProps<typeof selectContentVariants>;
export type ZardSelectItemVariants = VariantProps<typeof selectItemVariants>;

```



```angular-ts title="select-item.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, input, linkedSignal, signal } from '@angular/core';

import { selectItemVariants } from './select.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { ZardIconComponent } from '../icon/icon.component';

// Interface to avoid circular dependency
interface SelectHost {
  selectedValue(): string[];
  selectItem(value: string, label: string): void;
}

@Component({
  selector: 'z-select-item, [z-select-item]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardIconComponent],
  host: {
    '[class]': 'classes()',
    '[attr.value]': 'zValue()',
    role: 'option',
    tabindex: '-1',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
    '[attr.aria-selected]': 'isSelected()',
    '(click)': 'onClick()',
  },
  template: `
    @if (isSelected()) {
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        <z-icon zType="check" />
      </span>
    }
    <span class="truncate">
      <ng-content></ng-content>
    </span>
  `,
})
export class ZardSelectItemComponent {
  readonly zValue = input.required<string>();
  readonly zDisabled = input(false, { transform });
  readonly class = input<string>('');

  private readonly select = signal<SelectHost | null>(null);
  readonly elementRef = inject(ElementRef);
  readonly label = linkedSignal<string>(() => {
    const element = this.elementRef?.nativeElement;
    return (element?.textContent ?? element?.innerText)?.trim() ?? '';
  });

  protected readonly classes = computed(() => mergeClasses(selectItemVariants(), this.class()));
  protected readonly isSelected = computed(() => this.select()?.selectedValue().includes(this.zValue()));

  setSelectHost(selectHost: SelectHost) {
    this.select.set(selectHost);
  }

  onClick() {
    if (this.zDisabled()) return;
    this.select()?.selectItem(this.zValue(), this.label());
  }
}

```

