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
