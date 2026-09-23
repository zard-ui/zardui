---
title: Combobox
description: Autocomplete input and command palette with a list of suggestions.
---

# Combobox

Autocomplete input and command palette with a list of suggestions.

## Installation

### CLI

```bash
npx zard-cli@latest add combobox
```

### Manual

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  forwardRef,
  inject,
  input,
  linkedSignal,
  model,
  numberAttribute,
  output,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import type { ZardButtonTypeVariants } from '@/shared/components/button';
import { comboboxValueVariants, comboboxVariants } from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';
import { noopFn } from '@/shared/utils/noop';

import {
  ZardComboboxContentComponent,
  ZardComboboxEmptyComponent,
  ZardComboboxListComponent,
} from './combobox-content.component';
import { ZardComboboxGroupComponent, ZardComboboxLabelComponent } from './combobox-group.component';
import { ZardComboboxInputComponent } from './combobox-input.component';
import { ZardComboboxItemComponent } from './combobox-item.component';
import {
  type ZardComboboxAlignVariants,
  type ZardComboboxAnchorKind,
  type ZardComboboxFilterVariants,
  type ZardComboboxGroup,
  type ZardComboboxItemRef,
  type ZardComboboxOption,
  ZardComboboxRoot,
  type ZardComboboxSideVariants,
} from './combobox.types';
import { type ZardComboboxWidthVariants } from './combobox.variants';

export type { ZardComboboxGroup, ZardComboboxOption } from './combobox.types';

type OnChangeType = (value: string | string[] | null) => void;
type OnTouchedType = () => void;

let nextComboboxId = 0;

@Component({
  selector: 'z-combobox, [z-combobox]',
  imports: [
    NgIcon,
    ZardComboboxContentComponent,
    ZardComboboxEmptyComponent,
    ZardComboboxGroupComponent,
    ZardComboboxInputComponent,
    ZardComboboxItemComponent,
    ZardComboboxLabelComponent,
    ZardComboboxListComponent,
  ],
  template: `
    <ng-content />

    @if (!projectedContent()) {
      <z-combobox-input />

      <z-combobox-content>
        <z-combobox-empty>{{ emptyText() }}</z-combobox-empty>

        <z-combobox-list>
          @for (group of groups(); track group.label ?? $index) {
            <z-combobox-group>
              @if (group.label) {
                <z-combobox-label>{{ group.label }}</z-combobox-label>
              }
              @for (option of group.options; track option.value) {
                <z-combobox-item [zValue]="option.value" [zLabel]="option.label" [zDisabled]="option.disabled ?? false">
                  @if (option.icon; as icon) {
                    <ng-icon [name]="icon" />
                  }
                  {{ option.label }}
                </z-combobox-item>
              }
            </z-combobox-group>
          } @empty {
            @for (option of options(); track option.value) {
              <z-combobox-item [zValue]="option.value" [zLabel]="option.label" [zDisabled]="option.disabled ?? false">
                @if (option.icon; as icon) {
                  <ng-icon [name]="icon" />
                }
                {{ option.label }}
              </z-combobox-item>
            }
          }
        </z-combobox-list>
      </z-combobox-content>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardComboboxComponent),
      multi: true,
    },
    {
      provide: ZardComboboxRoot,
      useExisting: forwardRef(() => ZardComboboxComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox',
    '[attr.data-auto-highlight]': 'zAutoHighlight() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '[attr.data-invalid]': 'zInvalid() ? "" : null',
    '[attr.data-multiple]': 'zMultiple() ? "" : null',
    '[attr.data-state]': 'open() ? "open" : "closed"',
    '[class]': 'classes()',
    '(keydown)': 'handleKeydown($event)',
  },
  exportAs: 'zCombobox',
})
export class ZardComboboxComponent implements ControlValueAccessor, ZardComboboxRoot {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<ClassValue>('');
  readonly zWidth = input<ZardComboboxWidthVariants>('default');
  readonly placeholder = input<string>('Select...');
  readonly searchPlaceholder = input<string>('Search...');
  readonly emptyText = input<string>('No results found.');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly searchable = input(true, { transform: booleanAttribute });
  readonly options = input<ZardComboboxOption[]>([]);
  readonly groups = input<ZardComboboxGroup[]>([]);
  readonly ariaLabel = input<string>('');
  readonly ariaDescribedBy = input<string>('');

  /**
   * Legacy value input kept for backwards compatibility. It is synchronised into `zValue`.
   * Prefer the two-way `[(zValue)]` binding.
   */
  readonly value = input<string | null>(null);

  /**
   * @deprecated The trigger is no longer a `z-button`, so this input has no visual effect.
   * It is kept only so existing templates keep compiling.
   */
  readonly buttonVariant = input<ZardButtonTypeVariants>('outline');

  readonly zValue = model<string | string[] | null>(null);
  readonly zOpen = model(false);
  readonly zMultiple = input(false, { transform: booleanAttribute });
  readonly zFilter = input<ZardComboboxFilterVariants>('contains');
  readonly zFilterFn = input<((label: string, query: string) => boolean) | null>(null);
  readonly zSide = input<ZardComboboxSideVariants>('bottom');
  readonly zAlign = input<ZardComboboxAlignVariants>('start');
  readonly zSideOffset = input(6, { transform: numberAttribute });
  readonly zAlignOffset = input(0, { transform: numberAttribute });
  readonly zAutoHighlight = input(false, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });

  readonly zComboSelected = output<ZardComboboxOption>();
  readonly zQueryChange = output<string>();

  readonly inputId = `z-combobox-input-${nextComboboxId}`;
  readonly listboxId = `z-combobox-listbox-${nextComboboxId++}`;

  protected readonly projectedContent = contentChild(ZardComboboxContentComponent);

  readonly disabled = linkedSignal(() => this.zDisabled());
  readonly open = this.zOpen.asReadonly();
  readonly query = signal('');

  private readonly items = signal<readonly ZardComboboxItemRef[]>([]);
  private readonly highlightedIndex = signal(-1);
  private readonly inputElement = signal<HTMLInputElement | null>(null);
  private readonly inputAnchor = signal<HTMLElement | null>(null);
  private readonly chipsAnchor = signal<HTMLElement | null>(null);
  private readonly triggerAnchor = signal<HTMLElement | null>(null);
  private ignoreFocusOpen = false;
  private legacyValueSynced = false;

  readonly hasChips = computed(() => this.chipsAnchor() !== null);
  readonly anchorElement = computed<HTMLElement | null>(
    () => this.chipsAnchor() ?? this.inputAnchor() ?? this.triggerAnchor() ?? this.elementRef.nativeElement,
  );

  readonly selectedValues = computed<readonly string[]>(() => {
    const value = this.zValue();
    if (value === null || value === undefined) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  });

  readonly hasValue = computed(() => this.selectedValues().length > 0);

  readonly visibleItems = computed<readonly ZardComboboxItemRef[]>(() =>
    this.items().filter(item => this.matchesQuery(item.label())),
  );

  readonly highlightedItem = computed<ZardComboboxItemRef | null>(() => {
    const index = this.highlightedIndex();
    return index < 0 ? null : (this.visibleItems()[index] ?? null);
  });

  readonly selectedLabel = computed(() =>
    this.selectedValues()
      .map(value => this.labelOf(value))
      .join(', '),
  );

  protected readonly classes = computed(() => mergeClasses(comboboxVariants({ zWidth: this.zWidth() }), this.class()));

  private onChange: OnChangeType = noopFn;
  private onTouched: OnTouchedType = noopFn;

  constructor() {
    effect(() => {
      const legacyValue = this.value();
      untracked(() => {
        if (!this.legacyValueSynced) {
          this.legacyValueSynced = true;
          if (legacyValue === null) {
            return;
          }
        }
        this.zValue.set(legacyValue);
      });
    });

    effect(() => {
      if (this.disabled() && this.open()) {
        untracked(() => this.closePanel());
      }
    });
  }

  matchesQuery(label: string): boolean {
    const rawQuery = this.query();
    const query = rawQuery.trim();

    if (!query || !this.searchable()) {
      return true;
    }

    const filterFn = this.zFilterFn();
    if (filterFn) {
      return filterFn(label, rawQuery);
    }

    const mode = this.zFilter();
    if (mode === 'none') {
      return true;
    }

    const haystack = label.toLowerCase();
    const needle = query.toLowerCase();

    return mode === 'startsWith' ? haystack.startsWith(needle) : haystack.includes(needle);
  }

  isSelected(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  labelOf(value: string): string {
    const option = this.findOption(value);
    if (option) {
      return option.label;
    }

    const item = this.items().find(candidate => candidate.zValue() === value);
    return item?.label() ?? value;
  }

  registerItem(item: ZardComboboxItemRef): void {
    this.items.update(items => [...items, item]);
  }

  unregisterItem(item: ZardComboboxItemRef): void {
    this.items.update(items => items.filter(candidate => candidate !== item));
  }

  registerInput(element: HTMLInputElement | null): void {
    if (!element && this.inputElement()) {
      return;
    }
    this.inputElement.set(element);
  }

  registerAnchor(element: HTMLElement, kind: ZardComboboxAnchorKind): void {
    if (kind === 'chips') {
      this.chipsAnchor.set(element);
      return;
    }

    if (kind === 'trigger') {
      this.triggerAnchor.set(element);
      return;
    }

    this.inputAnchor.set(element);
  }

  openPanel(): void {
    if (this.ignoreFocusOpen || this.disabled() || this.open()) {
      return;
    }

    this.query.set('');
    this.zOpen.set(true);
    this.highlightedIndex.set(this.visibleItems().findIndex(item => this.isSelected(item.zValue())));
  }

  closePanel(): void {
    if (!this.open()) {
      return;
    }

    // In popup mode the input lives inside the overlay and is destroyed with it,
    // so the focus goes back to the trigger that owns the popup.
    const restoreTriggerFocus = this.popupOwnsInput();

    this.zOpen.set(false);
    this.highlightedIndex.set(-1);
    this.query.set('');

    if (restoreTriggerFocus) {
      this.inputElement.set(null);
      this.triggerAnchor()?.focus();
    }
  }

  setQuery(query: string): void {
    this.query.set(query);

    if (this.zAutoHighlight()) {
      this.highlightEdge('first');
    } else {
      this.highlightedIndex.set(-1);
    }

    this.zQueryChange.emit(query);
  }

  highlightItem(item: ZardComboboxItemRef | null): void {
    if (!item) {
      this.highlightedIndex.set(-1);
      return;
    }

    this.highlightedIndex.set(this.visibleItems().indexOf(item));
    item.element.scrollIntoView?.({ block: 'nearest' });
  }

  selectItem(item: ZardComboboxItemRef): void {
    if (this.disabled() || item.zDisabled()) {
      return;
    }

    const value = item.zValue();

    if (this.zMultiple()) {
      const current = this.selectedValues();
      const isAdding = !current.includes(value);
      this.commit(isAdding ? [...current, value] : current.filter(candidate => candidate !== value));
      this.setQuery('');
      if (isAdding) {
        this.emitSelected(value, item);
      }
      this.highlightItem(item);
      this.focusInput();
      return;
    }

    const nextValue = this.isSelected(value) ? null : value;
    this.commit(nextValue);
    if (nextValue !== null) {
      this.emitSelected(value, item);
    }
    this.closePanel();
    this.focusInput();
  }

  clear(): void {
    if (this.disabled()) {
      return;
    }

    this.commit(this.zMultiple() ? [] : null);
    this.query.set('');
  }

  removeValue(value: string): void {
    if (this.disabled()) {
      return;
    }

    if (this.zMultiple()) {
      this.commit(this.selectedValues().filter(candidate => candidate !== value));
      return;
    }

    if (this.isSelected(value)) {
      this.commit(null);
    }
  }

  removeLastValue(): void {
    const values = this.selectedValues();
    const last = values.at(-1);
    if (last !== undefined) {
      this.removeValue(last);
    }
  }

  focusInput(): void {
    const element = this.inputElement();
    if (!element) {
      return;
    }

    this.ignoreFocusOpen = true;
    element.focus();
    this.ignoreFocusOpen = false;
  }

  /** True when the registered input is rendered inside the overlay instead of next to the root. */
  private popupOwnsInput(): boolean {
    const element = this.inputElement();
    return !!element && !!this.triggerAnchor() && !this.elementRef.nativeElement.contains(element);
  }

  markAsTouched(): void {
    this.onTouched();
  }

  /**
   * Public because the popup lives in the CDK overlay: keystrokes typed inside it never bubble up
   * to the root host, so `z-combobox-content` forwards them here.
   */
  handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    // A standalone trigger already toggles through its native click, which Enter and Space fire.
    if ((event.key === 'Enter' || event.key === ' ') && event.target === this.triggerAnchor()) {
      return;
    }

    if (this.open()) {
      this.onKeydownWhileOpen(event);
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.openPanel();
        this.highlightEdge('first');
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.openPanel();
        this.highlightEdge('last');
        break;
      case 'Enter':
        event.preventDefault();
        this.openPanel();
        break;
      case 'Escape':
        if (this.hasValue()) {
          event.preventDefault();
          this.clear();
        }
        break;
    }
  }

  private onKeydownWhileOpen(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveHighlight(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveHighlight(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.highlightEdge('first');
        break;
      case 'End':
        event.preventDefault();
        this.highlightEdge('last');
        break;
      case 'Enter': {
        event.preventDefault();
        const item = this.highlightedItem();
        if (item) {
          this.selectItem(item);
        }
        break;
      }
      case 'Escape':
        event.preventDefault();
        this.closePanel();
        this.focusInput();
        break;
      case 'Tab':
        this.closePanel();
        break;
    }
  }

  private moveHighlight(direction: 1 | -1): void {
    const items = this.selectableItems();
    if (items.length === 0) {
      return;
    }

    const current = this.highlightedItem();
    const currentIndex = current ? items.indexOf(current) : -1;
    let nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      nextIndex = items.length - 1;
    } else if (nextIndex >= items.length) {
      nextIndex = 0;
    }

    this.highlightItem(items[nextIndex]);
  }

  private highlightEdge(edge: 'first' | 'last'): void {
    const items = this.selectableItems();
    if (items.length === 0) {
      return;
    }

    this.highlightItem(edge === 'first' ? items[0] : items[items.length - 1]);
  }

  private selectableItems(): ZardComboboxItemRef[] {
    return this.visibleItems().filter(item => !item.zDisabled());
  }

  private commit(value: string | string[] | null): void {
    this.zValue.set(value);
    this.onChange(value);
  }

  private emitSelected(value: string, item: ZardComboboxItemRef): void {
    this.zComboSelected.emit(this.findOption(value) ?? { value, label: item.label(), disabled: item.zDisabled() });
  }

  private findOption(value: string): ZardComboboxOption | undefined {
    for (const group of this.groups()) {
      const found = group.options.find(option => option.value === value);
      if (found) {
        return found;
      }
    }

    return this.options().find(option => option.value === value);
  }

  writeValue(value: string | string[] | null): void {
    if (this.zMultiple()) {
      this.zValue.set(Array.isArray(value) ? value : value ? [value] : []);
      return;
    }

    this.zValue.set(Array.isArray(value) ? (value[0] ?? null) : (value ?? null));
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    if (isDisabled) {
      this.closePanel();
    }
  }
}

@Component({
  selector: 'z-combobox-value, [z-combobox-value]',
  template: '{{ text() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox-value',
    '[attr.data-placeholder]': 'root.hasValue() ? null : ""',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxValue',
})
export class ZardComboboxValueComponent {
  protected readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');
  readonly placeholder = input<string>('');

  protected readonly text = computed(() => this.root.selectedLabel() || this.placeholder() || this.root.placeholder());
  protected readonly classes = computed(() => mergeClasses(comboboxValueVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const comboboxVariants = cva('group/combobox relative block', {
  variants: {
    zWidth: {
      default: 'w-50',
      sm: 'w-37.5',
      md: 'w-62.5',
      lg: 'w-87.5',
      full: 'w-full',
    },
  },
  defaultVariants: {
    zWidth: 'default',
  },
});

export const comboboxValueVariants = cva('block truncate text-sm');

/**
 * `contents` keeps the host out of the layout, so the inner `z-input-group` behaves as a direct
 * child of whatever wraps the input — the root or, in popup mode, the content popup, whose
 * `*:data-[slot=input-group]:*` rules would otherwise never reach it.
 */
export const comboboxInputHostVariants = cva('contents');

export const comboboxInputGroupVariants = cva('w-auto');

export const comboboxTriggerVariants = cva("[&_svg:not([class*='size-'])]:size-4", {
  variants: {
    /** A standalone trigger lives outside a `z-input-group`, so the input-group-only rules do not apply. */
    zStandalone: {
      false: 'group-has-data-[slot=combobox-clear]/input-group:hidden aria-expanded:bg-transparent',
      true: '',
    },
  },
  defaultVariants: {
    zStandalone: false,
  },
});

export const comboboxClearVariants = cva('');

export const comboboxContentVariants = cva(
  mergeClasses(
    'group/combobox-content relative max-h-(--z-combobox-available-height) w-(--z-combobox-anchor-width)',
    'max-w-(--z-combobox-available-width) min-w-(--z-combobox-anchor-width)',
    'origin-(--z-combobox-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground',
    'shadow-md ring-1 ring-foreground/10 duration-100',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
    '*:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8',
    '*:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30',
    '*:data-[slot=input-group]:shadow-none',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
  ),
);

export const comboboxListVariants = cva(
  mergeClasses(
    'no-scrollbar block scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0',
    'max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--z-combobox-available-height)-(--spacing(9))))]',
  ),
);

export const comboboxItemVariants = cva(
  mergeClasses(
    'relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pe-8 ps-1.5 text-sm',
    'outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground',
    'not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      zVariant: {
        default: '',
        destructive: 'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const comboboxItemIndicatorVariants = cva(
  'pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center',
);

export const comboboxGroupVariants = cva('block');

export const comboboxLabelVariants = cva('block px-2 py-1.5 text-xs text-muted-foreground');

export const comboboxEmptyVariants = cva(
  mergeClasses(
    'hidden w-full justify-center py-2 text-center text-sm text-muted-foreground',
    'group-data-empty/combobox-content:flex',
  ),
);

export const comboboxSeparatorVariants = cva('-mx-1 my-1 block h-px bg-border');

export const comboboxChipsVariants = cva(
  mergeClasses(
    'flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding',
    'px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
    'has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20',
    'has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50',
    'dark:has-aria-invalid:ring-destructive/40',
  ),
);

export const comboboxChipVariants = cva(
  mergeClasses(
    'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs',
    'font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none',
    'has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0',
  ),
);

export const comboboxChipRemoveVariants = cva('-ms-1 opacity-50 hover:opacity-100');

export const comboboxChipsInputVariants = cva('min-w-16 flex-1 bg-transparent outline-none');

export type ZardComboboxWidthVariants = NonNullable<VariantProps<typeof comboboxVariants>['zWidth']>;
export type ZardComboboxItemVariants = NonNullable<VariantProps<typeof comboboxItemVariants>['zVariant']>;
export type ZardComboboxTriggerStandaloneVariants = NonNullable<
  VariantProps<typeof comboboxTriggerVariants>['zStandalone']
>;
```

```angular-ts
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button';
import {
  comboboxChipRemoveVariants,
  comboboxChipsInputVariants,
  comboboxChipsVariants,
  comboboxChipVariants,
} from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardComboboxRoot } from './combobox.types';

@Directive({
  selector: 'button[z-combobox-chip-remove]',
  host: {
    type: 'button',
    tabindex: '-1',
    // Bound instead of static so it wins over the `data-slot` of a co-located `z-button`.
    // The `has-data-[slot=combobox-chip-remove]:pr-0` rule on the chip depends on it.
    '[attr.data-slot]': '"combobox-chip-remove"',
    '[attr.aria-label]': '"Remove " + zValue()',
    '[class]': 'classes()',
    '(click)': 'remove($event)',
  },
  exportAs: 'zComboboxChipRemove',
})
export class ZardComboboxChipRemoveDirective {
  private readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');
  readonly zValue = input<string>('');

  protected readonly classes = computed(() => mergeClasses(comboboxChipRemoveVariants(), this.class()));

  protected remove(event: MouseEvent): void {
    event.stopPropagation();

    if (this.root.disabled()) {
      return;
    }

    this.root.removeValue(this.zValue());
  }
}

@Component({
  selector: 'z-combobox-chip, [z-combobox-chip]',
  imports: [NgIcon, ZardButtonComponent, ZardComboboxChipRemoveDirective],
  template: `
    <ng-content />
    @if (zShowRemove()) {
      <button type="button" z-button z-combobox-chip-remove zSize="icon-xs" zType="ghost" [zValue]="zValue()">
        <ng-icon name="lucideX" class="pointer-events-none" aria-hidden="true" />
      </button>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideX })],
  host: {
    'data-slot': 'combobox-chip',
    '[attr.data-value]': 'zValue()',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxChip',
})
export class ZardComboboxChipComponent {
  readonly class = input<ClassValue>('');
  readonly zValue = input.required<string>();
  readonly zShowRemove = input(true, { transform: booleanAttribute });

  protected readonly classes = computed(() => mergeClasses(comboboxChipVariants(), this.class()));
}

@Component({
  selector: 'input[z-combobox-chips-input]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    type: 'text',
    role: 'combobox',
    autocomplete: 'off',
    'aria-autocomplete': 'list',
    'data-slot': 'combobox-chip-input',
    '[attr.aria-activedescendant]': 'root.highlightedItem()?.id ?? null',
    '[attr.aria-controls]': 'root.listboxId',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-invalid]': 'root.zInvalid() ? "true" : null',
    '[attr.aria-label]': 'root.ariaLabel() || null',
    '[class]': 'classes()',
    '[disabled]': 'root.disabled()',
    '[value]': 'root.query()',
    '(blur)': 'onBlur()',
    '(focus)': 'onFocus()',
    '(input)': 'onInput($event)',
    '(keydown.backspace)': 'onBackspace()',
  },
  exportAs: 'zComboboxChipsInput',
})
export class ZardComboboxChipsInputComponent {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly elementRef = inject(ElementRef<HTMLInputElement>);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxChipsInputVariants(), this.class()));

  constructor() {
    this.root.registerInput(this.elementRef.nativeElement);
  }

  protected onInput(event: Event): void {
    if (this.root.disabled()) {
      return;
    }

    this.root.openPanel();
    this.root.setQuery((event.target as HTMLInputElement).value);
  }

  protected onFocus(): void {
    if (this.root.disabled()) {
      return;
    }
    this.root.openPanel();
  }

  protected onBlur(): void {
    this.root.markAsTouched();
  }

  protected onBackspace(): void {
    if (this.root.disabled() || this.elementRef.nativeElement.value !== '') {
      return;
    }

    this.root.removeLastValue();
  }
}

@Component({
  selector: 'z-combobox-chips, [z-combobox-chips]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox-chips',
    '[attr.data-disabled]': 'root.disabled() ? "" : null',
    '[class]': 'classes()',
    '(click)': 'focusInput($event)',
  },
  exportAs: 'zComboboxChips',
})
export class ZardComboboxChipsComponent {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxChipsVariants(), this.class()));

  constructor() {
    this.root.registerAnchor(this.elementRef.nativeElement, 'chips');
  }

  protected focusInput(event: MouseEvent): void {
    if ((event.target as HTMLElement).closest('button, input')) {
      return;
    }

    this.root.focusInput();
  }
}
```

```angular-ts
import {
  type ConnectedPosition,
  type FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  numberAttribute,
  type OnDestroy,
  PLATFORM_ID,
  signal,
  type TemplateRef,
  viewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import type { ClassValue } from 'clsx';
import { filter } from 'rxjs';

import {
  comboboxContentVariants,
  comboboxEmptyVariants,
  comboboxListVariants,
  comboboxSeparatorVariants,
} from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { type ZardComboboxAlignVariants, ZardComboboxRoot, type ZardComboboxSideVariants } from './combobox.types';

@Component({
  selector: 'z-combobox-list, [z-combobox-list]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'listbox',
    'data-slot': 'combobox-list',
    '[attr.aria-multiselectable]': 'root.zMultiple() ? "true" : null',
    '[attr.data-empty]': 'isEmpty() ? "" : null',
    '[class]': 'classes()',
    '[id]': 'root.listboxId',
  },
  exportAs: 'zComboboxList',
})
export class ZardComboboxListComponent {
  protected readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');

  protected readonly isEmpty = computed(() => this.root.visibleItems().length === 0);
  protected readonly classes = computed(() => mergeClasses(comboboxListVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-empty, [z-combobox-empty]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox-empty',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxEmpty',
})
export class ZardComboboxEmptyComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxEmptyVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-separator, [z-combobox-separator]',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'separator',
    'aria-orientation': 'horizontal',
    'data-slot': 'combobox-separator',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxSeparator',
})
export class ZardComboboxSeparatorComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxSeparatorVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-content',
  template: `
    <ng-template #popupTemplate>
      <div class="isolate z-50">
        <div
          role="presentation"
          data-slot="combobox-content"
          [attr.data-align]="alignValue()"
          [attr.data-chips]="isChips() ? 'true' : null"
          [attr.data-empty]="isEmpty() ? '' : null"
          [attr.data-side]="resolvedSide()"
          [attr.data-state]="root.open() ? 'open' : 'closed'"
          [class]="popupClasses()"
          [style.--z-combobox-anchor-width]="anchorWidth()"
          [style.--z-combobox-available-height]="availableHeight()"
          [style.--z-combobox-available-width]="availableWidth()"
          [style.--z-combobox-transform-origin]="transformOrigin()"
          (keydown)="root.handleKeydown($event)"
          (mousedown)="onMousedown($event)"
        >
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
    'data-slot': 'combobox-content-anchor',
  },
  exportAs: 'zComboboxContent',
})
export class ZardComboboxContentComponent implements OnDestroy {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly destroyRef = inject(DestroyRef);
  private readonly overlay = inject(Overlay);
  private readonly overlayPositionBuilder = inject(OverlayPositionBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly viewContainerRef = inject(ViewContainerRef);

  readonly class = input<ClassValue>('');
  readonly zAnchor = input<ElementRef<HTMLElement> | HTMLElement | null>(null);
  readonly zSide = input<ZardComboboxSideVariants | null>(null);
  readonly zAlign = input<ZardComboboxAlignVariants | null>(null);
  readonly zSideOffset = input<number | null, number | string | null | undefined>(null, {
    transform: nullableNumberAttribute,
  });

  readonly zAlignOffset = input<number | null, number | string | null | undefined>(null, {
    transform: nullableNumberAttribute,
  });

  private readonly popupTemplate = viewChild.required<TemplateRef<void>>('popupTemplate');

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal;
  private positionStrategy?: FlexibleConnectedPositionStrategy;

  protected readonly resolvedSide = signal<ZardComboboxSideVariants>('bottom');
  protected readonly anchorWidth = signal('0px');
  protected readonly availableWidth = signal('0px');
  protected readonly availableHeight = signal('0px');

  protected readonly sideValue = computed(() => this.zSide() ?? this.root.zSide());
  protected readonly alignValue = computed(() => this.zAlign() ?? this.root.zAlign());
  protected readonly sideOffsetValue = computed(() => this.zSideOffset() ?? this.root.zSideOffset());
  protected readonly alignOffsetValue = computed(() => this.zAlignOffset() ?? this.root.zAlignOffset());

  protected readonly isEmpty = computed(() => this.root.visibleItems().length === 0);
  protected readonly isChips = computed(() => this.zAnchor() !== null || this.root.hasChips());

  protected readonly transformOrigin = computed(() => {
    const block = this.resolvedSide() === 'bottom' ? 'top' : 'bottom';
    const align = this.alignValue();
    const inline = align === 'center' ? 'center' : align === 'start' ? 'left' : 'right';
    return `${block} ${inline}`;
  });

  protected readonly popupClasses = computed(() => mergeClasses(comboboxContentVariants(), this.class()));

  constructor() {
    effect(() => {
      if (this.root.open()) {
        this.attach();
      } else {
        this.detach();
      }
    });
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
    this.overlayRef = undefined;
  }

  private anchor(): HTMLElement | null {
    const own = this.zAnchor();
    if (own) {
      return own instanceof ElementRef ? own.nativeElement : own;
    }
    return this.root.anchorElement();
  }

  private attach(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const anchor = this.anchor();
    if (!anchor) {
      return;
    }

    this.resolvedSide.set(this.sideValue());
    this.createOverlay(anchor);

    if (!this.overlayRef || this.overlayRef.hasAttached()) {
      return;
    }

    this.positionStrategy?.setOrigin(anchor).withPositions(this.connectedPositions());
    this.updateMeasurements();

    this.portal ??= new TemplatePortal(this.popupTemplate(), this.viewContainerRef);
    this.overlayRef.attach(this.portal);
    this.updateMeasurements();
  }

  private detach(): void {
    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
  }

  private createOverlay(anchor: HTMLElement): void {
    if (this.overlayRef) {
      return;
    }

    this.positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(anchor)
      .withPositions(this.connectedPositions())
      .withFlexibleDimensions(false)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy: this.positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    this.positionStrategy.positionChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(change => {
      this.resolvedSide.set(change.connectionPair.originY === 'top' ? 'top' : 'bottom');
      this.updateMeasurements();
    });

    this.overlayRef
      .outsidePointerEvents()
      .pipe(
        filter(event => !this.isInsideCombobox(event.target)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.root.closePanel());
  }

  private isInsideCombobox(target: EventTarget | null): boolean {
    if (!(target instanceof Node)) {
      return false;
    }

    const anchor = this.anchor();
    return !!anchor?.contains(target);
  }

  private connectedPositions(): ConnectedPosition[] {
    const align = this.alignValue();
    const x = align === 'center' ? 'center' : align === 'end' ? 'end' : 'start';
    const sideOffset = this.sideOffsetValue();
    const alignOffset = this.alignOffsetValue();

    const below: ConnectedPosition = {
      originX: x,
      originY: 'bottom',
      overlayX: x,
      overlayY: 'top',
      offsetX: alignOffset,
      offsetY: sideOffset,
    };
    const above: ConnectedPosition = {
      originX: x,
      originY: 'top',
      overlayX: x,
      overlayY: 'bottom',
      offsetX: alignOffset,
      offsetY: -sideOffset,
    };

    return this.sideValue() === 'top' ? [above, below] : [below, above];
  }

  private updateMeasurements(): void {
    const anchor = this.anchor();
    if (!anchor || !isPlatformBrowser(this.platformId)) {
      return;
    }

    const rect = anchor.getBoundingClientRect();
    const offset = this.sideOffsetValue();
    const viewportHeight = window.innerHeight || 0;
    const viewportWidth = window.innerWidth || 0;
    const align = this.alignValue();

    const height = this.resolvedSide() === 'bottom' ? viewportHeight - rect.bottom - offset : rect.top - offset;
    const width = align === 'start' ? viewportWidth - rect.left : align === 'end' ? rect.right : viewportWidth;

    this.anchorWidth.set(`${Math.round(anchor.offsetWidth || rect.width)}px`);
    this.availableHeight.set(`${Math.max(Math.round(height), 0)}px`);
    this.availableWidth.set(`${Math.max(Math.round(width), 0)}px`);
  }

  /** Prevents the popup from stealing the focus away from the combobox input. */
  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

function nullableNumberAttribute(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return numberAttribute(value);
}
```

```angular-ts
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  input,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { comboboxGroupVariants, comboboxLabelVariants } from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardComboboxItemComponent } from './combobox-item.component';

let nextComboboxLabelId = 0;

@Component({
  selector: 'z-combobox-label, [z-combobox-label]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'combobox-label',
    '[class]': 'classes()',
    '[id]': 'id',
  },
  exportAs: 'zComboboxLabel',
})
export class ZardComboboxLabelComponent {
  readonly class = input<ClassValue>('');

  readonly id = `z-combobox-label-${nextComboboxLabelId++}`;

  protected readonly classes = computed(() => mergeClasses(comboboxLabelVariants(), this.class()));
}

@Component({
  selector: 'z-combobox-group, [z-combobox-group]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'combobox-group',
    '[attr.aria-labelledby]': 'label()?.id ?? null',
    '[attr.hidden]': 'isHidden() ? "" : null',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxGroup',
})
export class ZardComboboxGroupComponent {
  readonly class = input<ClassValue>('');

  protected readonly label = contentChild(ZardComboboxLabelComponent, { descendants: true });
  protected readonly items = contentChildren(ZardComboboxItemComponent, { descendants: true });

  protected readonly isHidden = computed(() => {
    const items = this.items();
    return items.length > 0 && items.every(item => item.isHidden());
  });

  protected readonly classes = computed(() => mergeClasses(comboboxGroupVariants(), this.class()));
}
```

```angular-ts
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideX } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  comboboxClearVariants,
  comboboxInputGroupVariants,
  comboboxInputHostVariants,
  comboboxTriggerVariants,
} from '@/shared/components/combobox/combobox.variants';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import {
  ZardInputGroupAddonComponent,
  ZardInputGroupButtonDirective,
  ZardInputGroupComponent,
} from '@/shared/components/input-group';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardComboboxContentComponent } from './combobox-content.component';
import { ZardComboboxRoot } from './combobox.types';

@Directive({
  selector: 'button[z-combobox-trigger]',
  host: {
    type: 'button',
    'aria-haspopup': 'listbox',
    // Bound instead of static so it wins over the `data-slot` of a co-located `z-input-group-button`.
    '[attr.data-slot]': '"combobox-trigger"',
    '[attr.aria-controls]': 'root.listboxId',
    '[attr.aria-expanded]': 'root.open()',
    '[attr.aria-label]': 'root.ariaLabel() || "Toggle options"',
    '[attr.tabindex]': 'standalone ? "0" : "-1"',
    '[class]': 'classes()',
    '(click)': 'toggle()',
    '(mousedown)': 'onMousedown($event)',
  },
  exportAs: 'zComboboxTrigger',
})
export class ZardComboboxTriggerDirective {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly inputGroup = inject(ZardInputGroupComponent, { optional: true });

  readonly class = input<ClassValue>('');

  /** A trigger rendered outside a `z-input-group` opens the popup on its own and anchors it. */
  protected readonly standalone = this.inputGroup === null;

  protected readonly classes = computed(() =>
    mergeClasses(comboboxTriggerVariants({ zStandalone: this.standalone }), this.class()),
  );

  constructor() {
    if (this.standalone) {
      this.root.registerAnchor(this.elementRef.nativeElement, 'trigger');
    }
  }

  protected toggle(): void {
    if (this.root.disabled()) {
      return;
    }

    if (this.root.open()) {
      this.root.closePanel();
    } else {
      this.root.openPanel();
    }

    this.root.focusInput();
  }

  /** Keeps the caret inside the combobox input when the trigger is clicked. */
  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

@Directive({
  selector: 'button[z-combobox-clear]',
  host: {
    type: 'button',
    tabindex: '-1',
    // Bound instead of static so it wins over the `data-slot` of a co-located `z-input-group-button`.
    // The `group-has-data-[slot=combobox-clear]/input-group:hidden` rule on the trigger depends on it.
    '[attr.data-slot]': '"combobox-clear"',
    '[attr.aria-label]': '"Clear selection"',
    '[class]': 'classes()',
    '(click)': 'clear()',
    '(mousedown)': 'onMousedown($event)',
  },
  exportAs: 'zComboboxClear',
})
export class ZardComboboxClearDirective {
  protected readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(comboboxClearVariants(), this.class()));

  protected clear(): void {
    if (this.root.disabled()) {
      return;
    }

    this.root.clear();
    this.root.focusInput();
  }

  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}

@Component({
  selector: 'z-combobox-input',
  imports: [
    NgIcon,
    ZardComboboxClearDirective,
    ZardComboboxTriggerDirective,
    ZardInputComponent,
    ZardInputGroupAddonComponent,
    ZardInputGroupButtonDirective,
    ZardInputGroupComponent,
  ],
  template: `
    <z-input-group [class]="inputGroupClasses()">
      <input
        z-input
        type="text"
        role="combobox"
        autocomplete="off"
        aria-autocomplete="list"
        [attr.aria-activedescendant]="root.highlightedItem()?.id ?? null"
        [attr.aria-controls]="root.listboxId"
        [attr.aria-describedby]="root.ariaDescribedBy() || null"
        [attr.aria-expanded]="root.open()"
        [attr.aria-invalid]="root.zInvalid() ? 'true' : null"
        [attr.aria-label]="root.ariaLabel() || null"
        [disabled]="disabled()"
        [id]="root.inputId"
        [placeholder]="placeholderText()"
        [readOnly]="!root.searchable()"
        [value]="displayText()"
        (blur)="onBlur()"
        (focus)="onFocus()"
        (input)="onInput($event)"
      />

      <z-input-group-addon zAlign="inline-end">
        @if (zShowTrigger()) {
          <button
            type="button"
            z-input-group-button
            z-combobox-trigger
            zSize="icon-xs"
            zVariant="ghost"
            [disabled]="disabled()"
          >
            <ng-icon name="lucideChevronDown" class="text-muted-foreground pointer-events-none size-4" />
          </button>
        }
        @if (showClear()) {
          <button
            type="button"
            z-input-group-button
            z-combobox-clear
            zSize="icon-xs"
            zVariant="ghost"
            [disabled]="disabled()"
          >
            <ng-icon name="lucideX" class="pointer-events-none" />
          </button>
        }
      </z-input-group-addon>

      <ng-content />
    </z-input-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronDown, lucideX })],
  host: {
    'data-slot': 'combobox-input',
    '[class]': 'classes()',
  },
  exportAs: 'zComboboxInput',
})
export class ZardComboboxInputComponent {
  protected readonly root = inject(ZardComboboxRoot);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);

  /** Resolved when the input is projected inside the popup (`z-combobox-content`), i.e. popup mode. */
  private readonly content = inject(ZardComboboxContentComponent, { optional: true });

  readonly class = input<ClassValue>('');
  readonly placeholder = input<string>('');
  readonly zShowTrigger = input(true, { transform: booleanAttribute });
  readonly zShowClear = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });

  protected readonly disabled = computed(() => this.zDisabled() || this.root.disabled());
  protected readonly showClear = computed(() => this.zShowClear() && this.root.hasValue());

  protected readonly displayText = computed(() =>
    this.root.open() || this.root.zMultiple() ? this.root.query() : this.root.selectedLabel(),
  );

  protected readonly placeholderText = computed(() => {
    const own = this.placeholder();
    if (own) {
      return own;
    }
    return this.root.open() && this.root.searchable() ? this.root.searchPlaceholder() : this.root.placeholder();
  });

  protected readonly classes = computed(() => mergeClasses(comboboxInputHostVariants(), this.class()));
  protected readonly inputGroupClasses = computed(() => mergeClasses(comboboxInputGroupVariants()));

  constructor() {
    effect(() => {
      const open = this.root.open();

      // In popup mode this component is rendered inside the CDK overlay, and a view child never
      // resolves for that view — so the DOM is read straight from the host, once it is rendered.
      afterNextRender(() => this.syncWithRoot(open), { injector: this.injector });
    });
  }

  private syncWithRoot(open: boolean): void {
    const host: HTMLElement = this.elementRef.nativeElement;
    const group = host.querySelector<HTMLElement>('[data-slot="input-group"]');
    const element = host.querySelector<HTMLInputElement>('input');

    // A popup that is closed keeps its input out of the document, and a detached input must not be
    // registered as the active one.
    if (!element?.isConnected) {
      return;
    }

    // Inside the popup the input group must not become the anchor, otherwise the popup would
    // anchor itself to its own content instead of the standalone trigger.
    if (group && !this.content) {
      this.root.registerAnchor(group, 'input');
    }

    this.root.registerInput(element);

    if (this.content && open) {
      element.focus();
    }
  }

  protected onInput(event: Event): void {
    if (this.disabled()) {
      return;
    }

    this.root.openPanel();
    this.root.setQuery((event.target as HTMLInputElement).value);
  }

  protected onFocus(): void {
    if (this.disabled()) {
      return;
    }
    this.root.openPanel();
  }

  protected onBlur(): void {
    this.root.markAsTouched();
  }
}
```

```angular-ts
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  comboboxItemIndicatorVariants,
  comboboxItemVariants,
  type ZardComboboxItemVariants,
} from '@/shared/components/combobox/combobox.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { type ZardComboboxItemRef, ZardComboboxRoot } from './combobox.types';

let nextComboboxItemId = 0;

@Component({
  selector: 'z-combobox-item, [z-combobox-item]',
  imports: [NgIcon],
  template: `
    <ng-content />
    @if (selected()) {
      <span [class]="indicatorClasses()">
        <ng-icon name="lucideCheck" class="pointer-events-none" aria-hidden="true" />
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideCheck })],
  host: {
    role: 'option',
    'data-slot': 'combobox-item',
    '[attr.aria-disabled]': 'zDisabled() ? "true" : null',
    '[attr.aria-selected]': 'selected()',
    '[attr.data-disabled]': 'zDisabled() ? "" : null',
    '[attr.data-highlighted]': 'highlighted() ? "" : null',
    '[attr.data-selected]': 'selected() ? "" : null',
    '[attr.data-value]': 'zValue()',
    '[attr.data-variant]': 'zVariant()',
    '[attr.hidden]': 'isHidden() ? "" : null',
    '[class]': 'classes()',
    '[id]': 'id',
    '(click)': 'onClick()',
    '(mousedown)': 'onMousedown($event)',
    '(mouseenter)': 'onMouseEnter()',
  },
  exportAs: 'zComboboxItem',
})
export class ZardComboboxItemComponent implements ZardComboboxItemRef {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly root = inject(ZardComboboxRoot);

  readonly class = input<ClassValue>('');
  readonly zValue = input.required<string>();
  readonly zLabel = input<string>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zVariant = input<ZardComboboxItemVariants>('default');

  readonly id = `${this.root.listboxId}-item-${nextComboboxItemId++}`;
  readonly element: HTMLElement = this.elementRef.nativeElement;

  private readonly projectedLabel = signal('');

  readonly label = computed(() => this.zLabel() || this.projectedLabel() || this.zValue());
  readonly selected = computed(() => this.root.isSelected(this.zValue()));
  readonly highlighted = computed(() => this.root.highlightedItem() === (this as ZardComboboxItemRef));
  readonly isHidden = computed(() => !this.root.matchesQuery(this.label()));

  protected readonly classes = computed(() =>
    mergeClasses(comboboxItemVariants({ zVariant: this.zVariant() }), this.isHidden() && 'hidden', this.class()),
  );

  protected readonly indicatorClasses = computed(() => mergeClasses(comboboxItemIndicatorVariants()));

  constructor() {
    this.root.registerItem(this);
    inject(DestroyRef).onDestroy(() => this.root.unregisterItem(this));

    afterNextRender(() => {
      const text = (this.element.textContent ?? '').trim();
      if (text) {
        this.projectedLabel.set(text);
      }
    });
  }

  protected onClick(): void {
    if (this.zDisabled()) {
      return;
    }
    this.root.selectItem(this);
  }

  protected onMouseEnter(): void {
    if (this.zDisabled()) {
      return;
    }
    this.root.highlightItem(this);
  }

  /** Keeps the focus inside the combobox input while clicking an option. */
  protected onMousedown(event: MouseEvent): void {
    event.preventDefault();
  }
}
```

```angular-ts
export {
  ZardComboboxChipComponent,
  ZardComboboxChipRemoveDirective,
  ZardComboboxChipsComponent,
  ZardComboboxChipsInputComponent,
} from './combobox-chips.component';
export {
  ZardComboboxContentComponent,
  ZardComboboxEmptyComponent,
  ZardComboboxListComponent,
  ZardComboboxSeparatorComponent,
} from './combobox-content.component';
export { ZardComboboxGroupComponent, ZardComboboxLabelComponent } from './combobox-group.component';
export {
  ZardComboboxClearDirective,
  ZardComboboxInputComponent,
  ZardComboboxTriggerDirective,
} from './combobox-input.component';
export { ZardComboboxItemComponent } from './combobox-item.component';
export { ZardComboboxComponent, ZardComboboxValueComponent } from './combobox.component';

import {
  ZardComboboxChipComponent,
  ZardComboboxChipRemoveDirective,
  ZardComboboxChipsComponent,
  ZardComboboxChipsInputComponent,
} from './combobox-chips.component';
import {
  ZardComboboxContentComponent,
  ZardComboboxEmptyComponent,
  ZardComboboxListComponent,
  ZardComboboxSeparatorComponent,
} from './combobox-content.component';
import { ZardComboboxGroupComponent, ZardComboboxLabelComponent } from './combobox-group.component';
import {
  ZardComboboxClearDirective,
  ZardComboboxInputComponent,
  ZardComboboxTriggerDirective,
} from './combobox-input.component';
import { ZardComboboxItemComponent } from './combobox-item.component';
import { ZardComboboxComponent, ZardComboboxValueComponent } from './combobox.component';

export const ZardComboboxImports = [
  ZardComboboxComponent,
  ZardComboboxValueComponent,
  ZardComboboxInputComponent,
  ZardComboboxTriggerDirective,
  ZardComboboxClearDirective,
  ZardComboboxContentComponent,
  ZardComboboxListComponent,
  ZardComboboxEmptyComponent,
  ZardComboboxSeparatorComponent,
  ZardComboboxItemComponent,
  ZardComboboxGroupComponent,
  ZardComboboxLabelComponent,
  ZardComboboxChipsComponent,
  ZardComboboxChipComponent,
  ZardComboboxChipRemoveDirective,
  ZardComboboxChipsInputComponent,
] as const;
```

```angular-ts
import type { Signal } from '@angular/core';

import type { IconName } from '@ng-icons/core';

export interface ZardComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: IconName;
}

export interface ZardComboboxGroup {
  label?: string;
  options: ZardComboboxOption[];
}

export type ZardComboboxFilterVariants = 'contains' | 'startsWith' | 'none';
export type ZardComboboxSideVariants = 'top' | 'bottom';
export type ZardComboboxAlignVariants = 'start' | 'center' | 'end';
export type ZardComboboxAnchorKind = 'input' | 'chips' | 'trigger';

/**
 * Minimal contract every `z-combobox-item` exposes to the root component.
 * Declared as an interface so the root never has to import the item component.
 */
export interface ZardComboboxItemRef {
  readonly id: string;
  readonly element: HTMLElement;
  readonly zValue: Signal<string>;
  readonly zDisabled: Signal<boolean>;
  readonly label: Signal<string>;
}

/**
 * DI token shared by every combobox part. `ZardComboboxComponent` provides itself
 * through it, which lets the child components talk to the root without importing
 * `combobox.component.ts` (that would create a circular module dependency, since
 * the root imports the children to render the shorthand mode).
 */
export abstract class ZardComboboxRoot {
  abstract readonly inputId: string;
  abstract readonly listboxId: string;

  abstract readonly ariaDescribedBy: Signal<string>;
  abstract readonly ariaLabel: Signal<string>;
  abstract readonly emptyText: Signal<string>;
  abstract readonly placeholder: Signal<string>;
  abstract readonly searchPlaceholder: Signal<string>;
  abstract readonly searchable: Signal<boolean>;
  abstract readonly zAlign: Signal<ZardComboboxAlignVariants>;
  abstract readonly zAlignOffset: Signal<number>;
  abstract readonly zAutoHighlight: Signal<boolean>;
  abstract readonly zInvalid: Signal<boolean>;
  abstract readonly zMultiple: Signal<boolean>;
  abstract readonly zSide: Signal<ZardComboboxSideVariants>;
  abstract readonly zSideOffset: Signal<number>;

  abstract readonly anchorElement: Signal<HTMLElement | null>;
  abstract readonly disabled: Signal<boolean>;
  abstract readonly hasChips: Signal<boolean>;
  abstract readonly hasValue: Signal<boolean>;
  abstract readonly highlightedItem: Signal<ZardComboboxItemRef | null>;
  abstract readonly open: Signal<boolean>;
  abstract readonly query: Signal<string>;
  abstract readonly selectedLabel: Signal<string>;
  abstract readonly selectedValues: Signal<readonly string[]>;
  abstract readonly visibleItems: Signal<readonly ZardComboboxItemRef[]>;

  abstract clear(): void;
  abstract closePanel(): void;
  abstract focusInput(): void;
  abstract handleKeydown(event: KeyboardEvent): void;
  abstract highlightItem(item: ZardComboboxItemRef | null): void;
  abstract isSelected(value: string): boolean;
  abstract labelOf(value: string): string;
  abstract markAsTouched(): void;
  abstract matchesQuery(label: string): boolean;
  abstract openPanel(): void;
  abstract registerAnchor(element: HTMLElement, kind: ZardComboboxAnchorKind): void;
  abstract registerInput(element: HTMLInputElement | null): void;
  abstract registerItem(item: ZardComboboxItemRef): void;
  abstract removeLastValue(): void;
  abstract removeValue(value: string): void;
  abstract selectItem(item: ZardComboboxItemRef): void;
  abstract setQuery(query: string): void;
  abstract unregisterItem(item: ZardComboboxItemRef): void;
}
```

```angular-ts
export * from './combobox-chips.component';
export * from './combobox-content.component';
export * from './combobox-group.component';
export * from './combobox-input.component';
export * from './combobox-item.component';
export * from './combobox.component';
export * from './combobox.imports';
export * from './combobox.types';
export * from './combobox.variants';
```

## Usage

```angular-ts
import { ZardComboboxImports } from '@/shared/components/combobox/combobox.imports';
```

```angular-html
<z-combobox [(zValue)]="value">
  <z-combobox-input placeholder="Search framework..." />

  <z-combobox-content>
    <z-combobox-empty>No framework found.</z-combobox-empty>

    <z-combobox-list>
      @for (framework of frameworks; track framework.value) {
        <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
      }
    </z-combobox-list>
  </z-combobox-content>
</z-combobox>
```

## Examples

### Default

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-default',
  imports: [ZardComboboxImports],
  template: `
    <z-combobox [(zValue)]="value">
      <z-combobox-input placeholder="Select a framework" />

      <z-combobox-content>
        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (framework of frameworks; track framework.value) {
            <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
export class ZardDemoComboboxDefaultComponent {
  readonly value = signal<string | string[] | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
```

### Multiple

```angular-ts
import { Component, computed, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-multiple',
  imports: [ZardComboboxImports],
  template: `
    <z-combobox zMultiple zAutoHighlight zWidth="full" [(zValue)]="value">
      <z-combobox-chips class="w-full max-w-xs">
        @for (selected of selectedValues(); track selected) {
          <z-combobox-chip [zValue]="selected">{{ labelOf(selected) }}</z-combobox-chip>
        }

        <input z-combobox-chips-input placeholder="Add framework" />
      </z-combobox-chips>

      <z-combobox-content>
        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (framework of frameworks; track framework.value) {
            <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
export class ZardDemoComboboxMultipleComponent {
  readonly value = signal<string | string[] | null>(['angular']);

  readonly selectedValues = computed(() => {
    const value = this.value();
    return Array.isArray(value) ? value : value ? [value] : [];
  });

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  labelOf(value: string): string {
    return this.frameworks.find(framework => framework.value === value)?.label ?? value;
  }
}
```

### Clear

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-clear',
  imports: [ZardComboboxImports],
  template: `
    <z-combobox [(zValue)]="value">
      <z-combobox-input zShowClear placeholder="Select a framework" />

      <z-combobox-content>
        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (framework of frameworks; track framework.value) {
            <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
export class ZardDemoComboboxClearComponent {
  readonly value = signal<string | string[] | null>('angular');

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
```

### Grouped

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-grouped',
  imports: [ZardComboboxImports],
  template: `
    <z-combobox zWidth="md" [(zValue)]="value">
      <z-combobox-input placeholder="Select a timezone" />

      <z-combobox-content>
        <z-combobox-empty>No timezones found.</z-combobox-empty>

        <z-combobox-list>
          @for (group of timezones; track group.label; let last = $last) {
            <z-combobox-group>
              <z-combobox-label>{{ group.label }}</z-combobox-label>

              @for (zone of group.options; track zone) {
                <z-combobox-item [zValue]="zone">{{ zone }}</z-combobox-item>
              }

              @if (!last) {
                <z-combobox-separator />
              }
            </z-combobox-group>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxGroupedComponent {
  readonly value = signal<string | string[] | null>(null);

  readonly timezones = [
    {
      label: 'Americas',
      options: [
        '(GMT-5) New York',
        '(GMT-8) Los Angeles',
        '(GMT-6) Chicago',
        '(GMT-5) Toronto',
        '(GMT-8) Vancouver',
        '(GMT-3) São Paulo',
      ],
    },
    {
      label: 'Europe',
      options: [
        '(GMT+0) London',
        '(GMT+1) Paris',
        '(GMT+1) Berlin',
        '(GMT+1) Rome',
        '(GMT+1) Madrid',
        '(GMT+1) Amsterdam',
      ],
    },
    {
      label: 'Asia/Pacific',
      options: [
        '(GMT+9) Tokyo',
        '(GMT+8) Shanghai',
        '(GMT+8) Singapore',
        '(GMT+4) Dubai',
        '(GMT+11) Sydney',
        '(GMT+9) Seoul',
      ],
    },
  ];
}
```

### Custom Items

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardItemImports } from '../../item/item.imports';
import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-custom-items',
  imports: [ZardComboboxImports, ZardItemImports],
  template: `
    <z-combobox zWidth="md" [(zValue)]="value">
      <z-combobox-input placeholder="Search countries..." />

      <z-combobox-content>
        <z-combobox-empty>No countries found.</z-combobox-empty>

        <z-combobox-list>
          @for (country of countries; track country.code) {
            <z-combobox-item [zValue]="country.value" [zLabel]="country.label">
              <div z-item zSize="xs" class="p-0">
                <div z-item-content>
                  <div z-item-title class="whitespace-nowrap">{{ country.label }}</div>
                  <p z-item-description>{{ country.continent }} ({{ country.code }})</p>
                </div>
              </div>
            </z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxCustomItemsComponent {
  readonly value = signal<string | string[] | null>(null);

  readonly countries = [
    { code: 'ar', value: 'argentina', label: 'Argentina', continent: 'South America' },
    { code: 'au', value: 'australia', label: 'Australia', continent: 'Oceania' },
    { code: 'br', value: 'brazil', label: 'Brazil', continent: 'South America' },
    { code: 'ca', value: 'canada', label: 'Canada', continent: 'North America' },
    { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
    { code: 'co', value: 'colombia', label: 'Colombia', continent: 'South America' },
    { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
    { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
    { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
    { code: 'it', value: 'italy', label: 'Italy', continent: 'Europe' },
    { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
    { code: 'ke', value: 'kenya', label: 'Kenya', continent: 'Africa' },
    { code: 'mx', value: 'mexico', label: 'Mexico', continent: 'North America' },
    { code: 'nz', value: 'new-zealand', label: 'New Zealand', continent: 'Oceania' },
    { code: 'ng', value: 'nigeria', label: 'Nigeria', continent: 'Africa' },
    { code: 'za', value: 'south-africa', label: 'South Africa', continent: 'Africa' },
    { code: 'kr', value: 'south-korea', label: 'South Korea', continent: 'Asia' },
    { code: 'gb', value: 'united-kingdom', label: 'United Kingdom', continent: 'Europe' },
    { code: 'us', value: 'united-states', label: 'United States', continent: 'North America' },
  ];
}
```

### Invalid

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardFieldImports } from '../../field/field.imports';
import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-invalid',
  imports: [ZardComboboxImports, ZardFieldImports],
  template: `
    <div z-field class="w-full min-w-48" data-invalid="true">
      <label z-field-label for="combobox-invalid">Framework</label>

      <z-combobox id="combobox-invalid" zInvalid [(zValue)]="value">
        <z-combobox-input placeholder="Select a framework" />

        <z-combobox-content>
          <z-combobox-empty>No items found.</z-combobox-empty>

          <z-combobox-list>
            @for (framework of frameworks; track framework.value) {
              <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
            }
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>

      <z-field-error>Please select a framework.</z-field-error>
    </div>
  `,
})
export class ZardDemoComboboxInvalidComponent {
  readonly value = signal<string | string[] | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
```

### Disabled

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-disabled',
  imports: [ZardComboboxImports],
  template: `
    <div class="flex flex-wrap gap-4">
      <z-combobox zDisabled>
        <z-combobox-input placeholder="Select a framework" />

        <z-combobox-content>
          <z-combobox-empty>No items found.</z-combobox-empty>

          <z-combobox-list>
            @for (framework of frameworks; track framework.value) {
              <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
            }
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>

      <z-combobox [(zValue)]="value">
        <z-combobox-input placeholder="Select a framework" />

        <z-combobox-content>
          <z-combobox-empty>No items found.</z-combobox-empty>

          <z-combobox-list>
            @for (framework of frameworksWithDisabled; track framework.value) {
              <z-combobox-item [zValue]="framework.value" [zDisabled]="framework.disabled ?? false">
                {{ framework.label }}
              </z-combobox-item>
            }
          </z-combobox-list>
        </z-combobox-content>
      </z-combobox>
    </div>
  `,
})
export class ZardDemoComboboxDisabledComponent {
  readonly value = signal<string | string[] | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
  ];

  frameworksWithDisabled: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React', disabled: true },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte', disabled: true },
    { value: 'ember', label: 'Ember.js' },
  ];
}
```

### Auto Highlight

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardComboboxImports } from '../combobox.imports';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-auto-highlight',
  imports: [ZardComboboxImports],
  template: `
    <z-combobox zAutoHighlight [(zValue)]="value">
      <z-combobox-input placeholder="Select a framework" />

      <z-combobox-content>
        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (framework of frameworks; track framework.value) {
            <z-combobox-item [zValue]="framework.value">{{ framework.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
})
export class ZardDemoComboboxAutoHighlightComponent {
  readonly value = signal<string | string[] | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
```

### Popup

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-popup',
  imports: [ZardButtonComponent, ZardComboboxImports],
  template: `
    <z-combobox zWidth="full" class="w-fit" [(zValue)]="value">
      <button type="button" z-button z-combobox-trigger zType="outline" class="w-64 justify-between font-normal">
        <z-combobox-value placeholder="Select country" />
      </button>

      <z-combobox-content>
        <z-combobox-input [zShowTrigger]="false" placeholder="Search" />

        <z-combobox-empty>No items found.</z-combobox-empty>

        <z-combobox-list>
          @for (country of countries; track country.code) {
            <z-combobox-item [zValue]="country.value" [zLabel]="country.label">{{ country.label }}</z-combobox-item>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoComboboxPopupComponent {
  readonly value = signal<string | string[] | null>(null);

  readonly countries = [
    { code: 'ar', value: 'argentina', label: 'Argentina', continent: 'South America' },
    { code: 'au', value: 'australia', label: 'Australia', continent: 'Oceania' },
    { code: 'br', value: 'brazil', label: 'Brazil', continent: 'South America' },
    { code: 'ca', value: 'canada', label: 'Canada', continent: 'North America' },
    { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
    { code: 'co', value: 'colombia', label: 'Colombia', continent: 'South America' },
    { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
    { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
    { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
    { code: 'it', value: 'italy', label: 'Italy', continent: 'Europe' },
    { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
    { code: 'ke', value: 'kenya', label: 'Kenya', continent: 'Africa' },
    { code: 'mx', value: 'mexico', label: 'Mexico', continent: 'North America' },
    { code: 'nz', value: 'new-zealand', label: 'New Zealand', continent: 'Oceania' },
    { code: 'ng', value: 'nigeria', label: 'Nigeria', continent: 'Africa' },
    { code: 'za', value: 'south-africa', label: 'South Africa', continent: 'Africa' },
    { code: 'kr', value: 'south-korea', label: 'South Korea', continent: 'Asia' },
    { code: 'gb', value: 'united-kingdom', label: 'United Kingdom', continent: 'Europe' },
    { code: 'us', value: 'united-states', label: 'United States', continent: 'North America' },
  ];
}
```

### Input Group

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe } from '@ng-icons/lucide';

import { ZardInputGroupAddonComponent } from '../../input-group/input-group.component';
import { ZardComboboxImports } from '../combobox.imports';

@Component({
  selector: 'z-demo-combobox-input-group',
  imports: [NgIcon, ZardComboboxImports, ZardInputGroupAddonComponent],
  template: `
    <z-combobox zWidth="md" [(zValue)]="value">
      <z-combobox-input placeholder="Select a timezone">
        <z-input-group-addon>
          <ng-icon name="lucideGlobe" />
        </z-input-group-addon>
      </z-combobox-input>

      <z-combobox-content>
        <z-combobox-empty>No timezones found.</z-combobox-empty>

        <z-combobox-list>
          @for (group of timezones; track group.label) {
            <z-combobox-group>
              <z-combobox-label>{{ group.label }}</z-combobox-label>

              @for (zone of group.options; track zone) {
                <z-combobox-item [zValue]="zone">{{ zone }}</z-combobox-item>
              }
            </z-combobox-group>
          }
        </z-combobox-list>
      </z-combobox-content>
    </z-combobox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideGlobe })],
})
export class ZardDemoComboboxInputGroupComponent {
  readonly value = signal<string | string[] | null>(null);

  readonly timezones = [
    {
      label: 'Americas',
      options: [
        '(GMT-5) New York',
        '(GMT-8) Los Angeles',
        '(GMT-6) Chicago',
        '(GMT-5) Toronto',
        '(GMT-8) Vancouver',
        '(GMT-3) São Paulo',
      ],
    },
    {
      label: 'Europe',
      options: [
        '(GMT+0) London',
        '(GMT+1) Paris',
        '(GMT+1) Berlin',
        '(GMT+1) Rome',
        '(GMT+1) Madrid',
        '(GMT+1) Amsterdam',
      ],
    },
    {
      label: 'Asia/Pacific',
      options: [
        '(GMT+9) Tokyo',
        '(GMT+8) Shanghai',
        '(GMT+8) Singapore',
        '(GMT+4) Dubai',
        '(GMT+11) Sydney',
        '(GMT+9) Seoul',
      ],
    },
  ];
}
```

### Shorthand

```angular-ts
import { Component, signal } from '@angular/core';

import { ZardComboboxComponent } from '../combobox.component';
import type { ZardComboboxOption } from '../combobox.types';

@Component({
  selector: 'z-demo-combobox-shorthand',
  imports: [ZardComboboxComponent],
  template: `
    <div class="flex flex-col gap-2">
      <z-combobox
        [options]="frameworks"
        placeholder="Select framework..."
        searchPlaceholder="Search framework..."
        emptyText="No framework found."
        (zComboSelected)="selected.set($event)"
      />

      <p class="text-muted-foreground text-sm">Selected: {{ selected()?.label ?? 'none' }}</p>
    </div>
  `,
})
export class ZardDemoComboboxShorthandComponent {
  readonly selected = signal<ZardComboboxOption | null>(null);

  frameworks: ZardComboboxOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'ember', label: 'Ember.js' },
    { value: 'nextjs', label: 'Next.js' },
  ];
}
```

## API Reference

### z-combobox

Root of the combobox. Owns the value, the query, the open state and the keyboard navigation.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zValue]` | Selected value. `string` in single mode, `string[]` when `zMultiple` is set. Two-way bindable | `model<string \| string[] \| null>` | `null` |
| `[zOpen]` | Open state of the popup. Two-way bindable | `model<boolean>` | `false` |
| `[zMultiple]` | Enables multiple selection with chips | `boolean` | `false` |
| `[zFilter]` | Built-in filter strategy applied to the item labels | `'contains' \| 'startsWith' \| 'none'` | `'contains'` |
| `[zFilterFn]` | Custom filter predicate. Takes precedence over `zFilter` | `((label: string, query: string) => boolean) \| null` | `null` |
| `[zSide]` | Preferred side of the popup | `'top' \| 'bottom'` | `'bottom'` |
| `[zAlign]` | Alignment of the popup against the anchor | `'start' \| 'center' \| 'end'` | `'start'` |
| `[zSideOffset]` | Distance in px between anchor and popup | `number` | `6` |
| `[zAlignOffset]` | Offset in px along the alignment axis | `number` | `0` |
| `[zAutoHighlight]` | Highlights the first selectable item while typing, so `Enter` selects it without navigating first | `boolean` | `false` |
| `[zInvalid]` | Marks the combobox as invalid. Adds `data-invalid` to the host and `aria-invalid` to the input and the chips input | `boolean` | `false` |
| `[zWidth]` | Width of the combobox | `'default' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'default'` |
| `[zDisabled]` | Whether the combobox is disabled | `boolean` | `false` |
| `[searchable]` | Whether the input filters the list while typing. When false the input is read-only | `boolean` | `true` |
| `[placeholder]` | Placeholder shown when the popup is closed | `string` | `'Select...'` |
| `[searchPlaceholder]` | Placeholder shown while the popup is open | `string` | `'Search...'` |
| `[emptyText]` | Empty state text rendered by the shorthand mode | `string` | `'No results found.'` |
| `[options]` | Shorthand mode only — flat list of options rendered by the root | `ZardComboboxOption[]` | `[]` |
| `[groups]` | Shorthand mode only — grouped options rendered by the root | `ZardComboboxGroup[]` | `[]` |
| `[ariaLabel]` | ARIA label forwarded to the input | `string` | `''` |
| `[ariaDescribedBy]` | ARIA described-by forwarded to the input | `string` | `''` |
| `[value]` | @deprecated Legacy value input, synchronised into `zValue`. Use `[(zValue)]` | `string \| null` | `null` |
| `[buttonVariant]` | @deprecated The trigger is no longer a button, this input has no visual effect | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'outline'` |
| `(zValueChange)` | Emitted whenever the selection changes | `output<string \| string[] \| null>` | `-` |
| `(zOpenChange)` | Emitted when the popup opens or closes | `output<boolean>` | `-` |
| `(zQueryChange)` | Emitted when the search query changes | `output<string>` | `-` |
| `(zComboSelected)` | Emitted with the option that has just been selected | `output<ZardComboboxOption>` | `-` |

### z-combobox-input

Input group that hosts the editable combobox input, the trigger and the clear button.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[placeholder]` | Overrides the placeholder inherited from the root | `string` | `''` |
| `[zShowTrigger]` | Renders the chevron trigger button | `boolean` | `true` |
| `[zShowClear]` | Renders the clear button whenever there is a value | `boolean` | `false` |
| `[zDisabled]` | Forces the input to be disabled. Inherits from the root when false | `boolean` | `false` |

### button[z-combobox-trigger]

Toggles the popup. Inside a `z-input-group` it stays out of the tab order (`tabindex="-1"`) and hides itself when a clear button is visible. Applied to a standalone `button[z-button]` (popup mode, with the `z-combobox-input` moved inside the `z-combobox-content`) it becomes the popup anchor and receives `tabindex="0"`, and the focus returns to it when the popup closes.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### button[z-combobox-clear]

Clears the current selection and the query.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-content

Popup rendered through the CDK overlay and positioned against the anchor.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zAnchor]` | Element the popup is anchored to. Defaults to the input group (or the chips container) | `ElementRef<HTMLElement> \| HTMLElement \| null` | `null` |
| `[zSide]` | Overrides the root `zSide` | `'top' \| 'bottom' \| null` | `null` |
| `[zAlign]` | Overrides the root `zAlign` | `'start' \| 'center' \| 'end' \| null` | `null` |
| `[zSideOffset]` | Overrides the root `zSideOffset` | `number \| null` | `null` |
| `[zAlignOffset]` | Overrides the root `zAlignOffset` | `number \| null` | `null` |

### z-combobox-list

Scrollable listbox holding the items.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-item

Selectable option. Hidden automatically when it does not match the query.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zValue]` | Value of the option (required) | `string` | `-` |
| `[zLabel]` | Label used for filtering. Falls back to the projected text content | `string` | `''` |
| `[zDisabled]` | Whether the option can be selected | `boolean` | `false` |
| `[zVariant]` | Visual variant of the option | `'default' \| 'destructive'` | `'default'` |

### z-combobox-group

Groups related items. Hides itself when every child item is filtered out.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-label

Heading of a group.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-empty

Empty state, visible only when no item matches the query.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-separator

Horizontal rule between groups.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-chips

Container used in multiple mode. Becomes the popup anchor and focuses the chips input on click.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-chip

Single selected value rendered as a removable chip.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zValue]` | Value represented by the chip (required) | `string` | `-` |
| `[zShowRemove]` | Renders the remove button | `boolean` | `true` |

### button[z-combobox-chip-remove]

Removes a value from the selection.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[zValue]` | Value to remove | `string` | `''` |

### input[z-combobox-chips-input]

Editable input rendered inside the chips container. Backspace on an empty field removes the last chip.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |

### z-combobox-value

Renders the label of the current selection, typically inside a standalone trigger. Exposes `data-placeholder` while there is no selection, so the placeholder text can be styled.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Additional CSS classes | `ClassValue` | `''` |
| `[placeholder]` | Text rendered when there is no selection. Falls back to the root `placeholder` | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/combobox)
