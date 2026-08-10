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
