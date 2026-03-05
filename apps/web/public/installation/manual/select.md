

```angular-ts title="select.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { Overlay, OverlayModule, OverlayPositionBuilder, type OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  type AfterContentInit,
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  model,
  type OnDestroy,
  output,
  PLATFORM_ID,
  runInInjectionContext,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardIconComponent } from '@/shared/components/icon';
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import {
  selectContentVariants,
  selectTriggerVariants,
  selectVariants,
  type ZardSelectSizeVariants,
} from '@/shared/components/select/select.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

const COMPACT_MODE_WIDTH_THRESHOLD = 100;

@Component({
  selector: 'z-select, [z-select]',
  imports: [OverlayModule, ZardBadgeComponent, ZardIconComponent],
  template: `
    <button
      type="button"
      role="combobox"
      aria-controls="dropdown"
      [class]="triggerClasses()"
      [disabled]="zDisabled()"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.data-placeholder]="!zValue() ? '' : null"
      (blur)="!isOpen() && isFocus.set(false)"
      (click)="toggle()"
      (focus)="onFocus()"
    >
      <span class="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        @for (label of selectedLabels(); track label) {
          @if (zMultiple()) {
            <z-badge zType="secondary">
              <span class="truncate">{{ label }}</span>
            </z-badge>
          } @else {
            <span class="truncate">{{ label }}</span>
          }
        } @empty {
          <span class="text-muted-foreground truncate">{{ zPlaceholder() }}</span>
        }
      </span>
      <z-icon zType="chevron-down" zSize="lg" class="opacity-50" />
    </button>

    <ng-template #dropdownTemplate>
      <div
        id="dropdown"
        [class]="contentClasses()"
        role="listbox"
        [attr.data-state]="'open'"
        (keydown.{arrowdown,arrowup,enter,space,escape,home,end}.prevent)="onDropdownKeydown($event)"
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
    '[attr.data-active]': 'isFocus() ? "" : null',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-state]': 'isOpen() ? "open" : "closed"',
    '[class]': 'classes()',
    '(keydown.{enter,space,arrowdown,arrowup,escape}.prevent)': 'onTriggerKeydown($event)',
  },
})
export class ZardSelectComponent implements ControlValueAccessor, AfterContentInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly platformId = inject(PLATFORM_ID);

  readonly dropdownTemplate = viewChild.required<TemplateRef<void>>('dropdownTemplate');
  readonly selectItems = contentChildren(ZardSelectItemComponent);

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;

  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zLabel = input<string>('');
  readonly zMaxLabelCount = input<number>(1);
  readonly zMultiple = input<boolean>(false);
  readonly zPlaceholder = input<string>('Select an option...');
  readonly zSize = input<ZardSelectSizeVariants>('default');
  readonly zValue = model<string | string[]>(this.zMultiple() ? [] : '');

  readonly zSelectionChange = output<string | string[]>();

  readonly isOpen = signal(false);
  readonly focusedIndex = signal<number>(-1);
  protected readonly isFocus = signal(false);
  protected readonly isCompact = signal(false);

  protected onFocus(): void {
    if (this.isCompact()) {
      this.isFocus.set(true);
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
    ),
  );

  ngAfterContentInit() {
    const hostWidth = this.elementRef.nativeElement.offsetWidth || 0;
    // Setup select host reference for each item
    let i = 0;
    for (const item of this.selectItems()) {
      item.setSelectHost({
        selectedValue: () => (this.zMultiple() ? (this.zValue() as string[]) : [this.zValue() as string]),
        selectItem: (value: string, label: string) => this.selectItem(value, label),
        navigateTo: () => this.navigateTo(item, i),
      });
      item.zSize.set(this.zSize());
      i++;

      if (hostWidth <= COMPACT_MODE_WIDTH_THRESHOLD) {
        this.isCompact.set(true);
        item.zMode.set('compact');
      }
    }
  }

  ngOnDestroy() {
    this.destroyOverlay();
  }

  onTriggerKeydown(event: Event) {
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
    }
  }

  toggle() {
    if (this.zDisabled()) {
      return;
    }

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

    if (this.zMultiple()) {
      // in multiple mode it can happen that button changes size because of selection badges,
      // which requires overlay position to update
      this.updateOverlayPosition();
    } else {
      this.close();

      // Return focus to the button after selection
      setTimeout(() => {
        this.focusButton();
      }, 0);
    }
  }

  private navigateTo(element: ZardSelectItemComponent, index: number): void {
    this.focusedIndex.set(index);
    this.updateItemFocus(this.getSelectItems(true), index);
  }

  private updateOverlayPosition(): void {
    setTimeout(() => {
      this.overlayRef?.updatePosition();
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
    if (this.isOpen()) {
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

    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    this.portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);

    this.overlayRef.attach(this.portal);
    this.overlayRef.updateSize({ width: hostWidth });
    this.isOpen.set(true);
    this.updateFocusWhenNormalMode();

    this.determinePortalWidthOnOpen(hostWidth);
  }

  private setFocusOnOpen(): void {
    this.focusDropdown();
    this.focusSelectedItem();
  }

  private close() {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.onTouched();
    this.updateFocusWhenNormalMode();
  }

  private updateFocusWhenNormalMode(): void {
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

        const overlayPaneElement = this.overlayRef.overlayElement;
        const textElements = Array.from(
          overlayPaneElement.querySelectorAll<HTMLElement>(
            'z-select-item > span.truncate, [z-select-item] > span.truncate',
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
        this.overlayRef.updatePosition();

        this.setFocusOnOpen();
      });
    });
  }

  private createOverlay() {
    if (this.overlayRef) {
      return;
    } // Already created

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
        item.setAttribute('data-selected', 'true');
      } else {
        item.removeAttribute('aria-selected');
        item.removeAttribute('data-selected');
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
    if (items.length === 0) {
      return;
    }

    // Find the index of the currently selected item
    let selectedValue;
    if (Array.isArray(this.zValue()) && this.zValue().length) {
      [selectedValue] = this.zValue();
    } else {
      selectedValue = this.zValue();
    }

    let selectedIndex = items.findIndex(item => item.getAttribute('value') === selectedValue);

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

import { mergeClasses } from '@/shared/utils/merge-classes';

export const selectVariants = cva(
  mergeClasses(
    'relative inline-block w-full rounded-md group data-active:border data-active:border-ring data-active:ring-ring/50 data-active:ring-[3px]',
    '[&_button]:focus-visible:border [&_button]:focus-visible:border-ring [&_button]:focus-visible:ring-ring/50 [&_button]:focus-visible:ring-[3px]',
  ),
);

export const selectTriggerVariants = cva(
  mergeClasses(
    'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent',
    'shadow-xs transition-[color,box-shadow] outline-none cursor-pointer disabled:cursor-not-allowed',
    'disabled:opacity-50 data-placeholder:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground',
    'dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ),
  {
    variants: {
      zSize: {
        sm: 'min-h-8 py-1 text-xs px-2',
        default: 'min-h-9 py-1.5 px-3 text-sm',
        lg: 'min-h-10 py-2 text-base px-4',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);
export const selectContentVariants = cva(
  'z-9999 min-w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
);
export const selectItemVariants = cva(
  'relative flex min-w-full cursor-pointer text-nowrap items-center gap-2 rounded-sm mb-0.5 outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent data-disabled:hover:text-current [&_svg:not([class*="text-"])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      zSize: {
        sm: 'min-h-8 py-1 text-xs',
        default: 'min-h-9 py-1.5 text-sm',
        lg: 'min-h-10 py-2 text-base',
      },
      zMode: {
        normal: 'pr-8 pl-2',
        compact: 'pl-6.5 pr-2',
      },
    },
    compoundVariants: [
      {
        zMode: 'compact',
        zSize: 'sm',
        class: 'pl-5 pr-2',
      },
    ],
  },
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
      compact: 'left-2',
    },
  },
  compoundVariants: [
    {
      zMode: 'compact',
      zSize: 'sm',
      class: 'left-1',
    },
  ],
});

export type ZardSelectSizeVariants = NonNullable<VariantProps<typeof selectTriggerVariants>['zSize']>;
export type ZardSelectItemModeVariants = NonNullable<VariantProps<typeof selectItemVariants>['zMode']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from '@/shared/components/select/select.component';
export * from '@/shared/components/select/select-item.component';
export * from '@/shared/components/select/select.imports';
export * from '@/shared/components/select/select.variants';

```



```angular-ts title="select-item.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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
} from '@angular/core';

import { ZardIconComponent } from '@/shared/components/icon';
import {
  selectItemIconVariants,
  selectItemVariants,
  type ZardSelectItemModeVariants,
  type ZardSelectSizeVariants,
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
  imports: [ZardIconComponent],
  template: `
    @if (isSelected()) {
      <span [class]="iconClasses()">
        <z-icon zType="check" [zStrokeWidth]="strokeWidth()" aria-hidden="true" data-testid="check-icon" />
      </span>
    }
    <span class="truncate">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    tabindex: '-1',
    '[class]': 'classes()',
    '[attr.value]': 'zValue()',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-selected]': 'isSelected() ? "" : null',
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
  readonly class = input<string>('');

  private readonly select = signal<SelectHost | null>(null);
  noopFn = noopFn;

  readonly label = linkedSignal<string>(() => {
    const element = this.elementRef.nativeElement;
    return (element.textContent ?? element.innerText)?.trim() ?? '';
  });

  readonly zMode = signal<ZardSelectItemModeVariants>('normal');
  readonly zSize = signal<ZardSelectSizeVariants>('default');

  protected readonly classes = computed(() =>
    mergeClasses(selectItemVariants({ zMode: this.zMode(), zSize: this.zSize() }), this.class()),
  );

  protected readonly iconClasses = computed(() =>
    mergeClasses(selectItemIconVariants({ zMode: this.zMode(), zSize: this.zSize() })),
  );

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



```angular-ts title="select.imports.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ZardSelectItemComponent } from '@/shared/components/select/select-item.component';
import { ZardSelectComponent } from '@/shared/components/select/select.component';

export const ZardSelectImports = [ZardSelectComponent, ZardSelectItemComponent] as const;

```

