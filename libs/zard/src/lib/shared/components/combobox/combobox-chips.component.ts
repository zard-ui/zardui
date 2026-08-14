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
