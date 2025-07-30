import { Overlay, OverlayModule, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { selectContentVariants, selectTriggerVariants, ZardSelectTriggerVariants } from './select.variants';

@Component({
  selector: 'z-select, [z-select]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, OverlayModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardSelectComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    class: 'relative inline-block',
  },
  template: `
    <!-- Select Trigger -->
    <button
      type="button"
      [class]="triggerClasses()"
      [disabled]="disabled()"
      (click)="toggle()"
      (keydown)="onTriggerKeydown($event)"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.data-state]="isOpen() ? 'open' : 'closed'"
      [attr.data-placeholder]="!selectedValue() ? '' : null"
    >
      <span class="flex items-center gap-2">
        <span *ngIf="selectedValue(); else placeholderTemplate">{{ selectedLabel() }}</span>
        <ng-template #placeholderTemplate>
          <span class="text-muted-foreground">{{ placeholder() }}</span>
        </ng-template>
      </span>
      <svg
        class="h-4 w-4 opacity-50 transition-transform"
        [class.rotate-180]="isOpen()"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Template for overlay content -->
    <ng-template #dropdownTemplate>
      <div [class]="contentClasses()" role="listbox" [attr.data-state]="'open'" (keydown)="onDropdownKeydown($event)" tabindex="-1">
        <div class="p-1">
          <ng-content></ng-content>
        </div>
      </div>
    </ng-template>
  `,
})
export class ZardSelectComponent implements ControlValueAccessor, OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private overlay = inject(Overlay);
  private overlayPositionBuilder = inject(OverlayPositionBuilder);
  private viewContainerRef = inject(ViewContainerRef);

  @ViewChild('dropdownTemplate', { static: true }) dropdownTemplate!: TemplateRef<any>;

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly size = input<ZardSelectTriggerVariants['size']>('default');
  readonly disabled = input<boolean>(false);
  readonly placeholder = input<string>('Select an option...');
  readonly class = input<string>('');

  readonly selectionChange = output<string>();

  readonly isOpen = signal(false);
  readonly selectedValue = signal<string>('');
  readonly selectedLabel = signal<string>('');
  readonly focusedIndex = signal<number>(-1);

  private onChange = (_value: string) => {
    // ControlValueAccessor onChange callback
  };
  private onTouched = () => {
    // ControlValueAccessor onTouched callback
  };

  protected readonly triggerClasses = computed(() =>
    mergeClasses(
      selectTriggerVariants({
        size: this.size(),
      }),
      this.class(),
    ),
  );

  protected readonly contentClasses = computed(() => mergeClasses(selectContentVariants()));

  ngOnInit() {
    // Delay overlay creation to ensure element is rendered
    setTimeout(() => {
      this.createOverlay();
    });
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  @HostListener('document:click', ['$event'])
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
    if (this.disabled()) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.isOpen() ? this.close() : this.open();
  }

  open() {
    if (this.isOpen()) return;

    // Create overlay if it doesn't exist
    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.overlayRef) return;

    this.portal = new TemplatePortal(this.dropdownTemplate, this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.isOpen.set(true);

    // Focus dropdown after opening and position on selected item
    setTimeout(() => {
      this.focusDropdown();
      this.focusSelectedItem();
    }, 0);
  }

  close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.onTouched();
  }

  selectItem(value: string, label: string) {
    this.selectedValue.set(value);
    this.selectedLabel.set(label);
    this.onChange(value);
    this.selectionChange.emit(value);
    this.close();

    // Return focus to the button after selection
    setTimeout(() => {
      this.focusButton();
    }, 0);
  }

  private createOverlay() {
    if (this.overlayRef) return; // Already created

    try {
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetY: 4,
          },
          {
            originX: 'start',
            originY: 'top',
            overlayX: 'start',
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
        minWidth: elementWidth,
        maxHeight: 384, // max-h-96 equivalent
      });
    } catch (error) {
      console.error('Error creating overlay:', error);
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
    return Array.from(dropdownElement.querySelectorAll('z-select-item, [z-select-item]')).filter((item: Element) => !item.hasAttribute('data-disabled')) as HTMLElement[];
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
      const value = item.getAttribute('value') || '';
      const label = item.textContent?.trim() || '';
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
    items.forEach((item, index) => {
      if (index === focusedIndex) {
        item.focus();
        item.setAttribute('aria-selected', 'true');
      } else {
        item.removeAttribute('aria-selected');
      }
    });
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
    const selectedValue = this.selectedValue();
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
  writeValue(value: string | null): void {
    const stringValue = value || '';
    this.selectedValue.set(stringValue);
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
