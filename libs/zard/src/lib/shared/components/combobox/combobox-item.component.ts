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
