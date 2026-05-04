import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  output,
  signal,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NgIcon, type IconName } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import {
  toggleVariants,
  type ZardToggleSizeVariants,
  type ZardToggleTypeVariants,
} from '@/shared/components/toggle/toggle.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { toggleGroupItemVariants, toggleGroupVariants } from './toggle-group.variants';

export interface ZardToggleGroupItem {
  value: string;
  label?: string;
  icon?: IconName;
  template?: TemplateRef<void>;
  disabled?: boolean;
  ariaLabel?: string;
}

type OnTouchedType = () => void;
type OnChangeType = (value: string | string[]) => void;

@Component({
  selector: 'z-toggle-group',
  imports: [NgIcon, NgTemplateOutlet],
  template: `
    <div
      role="group"
      data-slot="toggle-group"
      [class]="classes()"
      [attr.data-variant]="zType()"
      [attr.data-size]="zSize()"
      [attr.data-orientation]="zOrientation()"
      [attr.data-horizontal]="zOrientation() === 'horizontal' || null"
      [attr.data-vertical]="zOrientation() === 'vertical' || null"
      [attr.data-spacing]="zSpacing()"
      [style.--gap]="zSpacing()"
    >
      @for (item of zItems(); track item.value) {
        <button
          type="button"
          data-slot="toggle-group-item"
          [attr.data-variant]="zType()"
          [attr.data-size]="zSize()"
          [attr.data-spacing]="zSpacing()"
          [attr.aria-pressed]="isItemPressed(item.value)"
          [attr.data-state]="isItemPressed(item.value) ? 'on' : 'off'"
          [attr.aria-label]="item.ariaLabel"
          [class]="itemClasses()"
          [disabled]="disabledState() || item.disabled"
          (click)="toggleItem(item)"
        >
          @if (item.template) {
            <ng-container [ngTemplateOutlet]="item.template" />
          } @else {
            @if (item.icon) {
              <ng-icon [name]="item.icon" class="size-4!" />
            }
            @if (item.label) {
              <span>{{ item.label }}</span>
            } @else if (!item.icon) {
              <span>{{ item.value }}</span>
            }
          }
        </button>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleGroupComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zToggleGroup',
})
export class ZardToggleGroupComponent implements ControlValueAccessor {
  readonly class = input<ClassValue>('');
  readonly zDefaultValue = input<string | string[]>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zMode = input<'single' | 'multiple'>('multiple');
  readonly zItemClass = input<ClassValue>('');
  readonly zItems = input<ZardToggleGroupItem[]>([]);
  readonly zOrientation = input<'horizontal' | 'vertical'>('horizontal');
  readonly zSize = input<ZardToggleSizeVariants>('default');
  readonly zSpacing = input(0);
  readonly zType = input<ZardToggleTypeVariants>('default');
  readonly zValue = input<string | string[]>();

  readonly valueChange = output<string | string[]>();

  protected readonly disabledState = linkedSignal(() => this.zDisabled());
  private readonly internalValue = signal<string | string[] | undefined>(undefined);

  protected readonly classes = computed(() => mergeClasses(toggleGroupVariants(), this.class()));

  protected readonly itemClasses = computed(() =>
    mergeClasses(
      toggleGroupItemVariants(),
      toggleVariants({
        zType: this.zType(),
        zSize: this.zSize(),
      }),
      this.zItemClass(),
    ),
  );

  protected readonly currentValue = computed(() => {
    const internal = this.internalValue();
    const input = this.zValue();
    const defaultVal = this.zDefaultValue();

    if (internal !== undefined) {
      return internal;
    }
    if (input !== undefined) {
      return input;
    }
    if (defaultVal !== undefined) {
      return defaultVal;
    }

    return this.zMode() === 'single' ? '' : [];
  });

  protected isItemPressed(itemValue: string): boolean {
    const current = this.currentValue();
    if (this.zMode() === 'single') {
      return current === itemValue;
    }
    return Array.isArray(current) && current.includes(itemValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  toggleItem(item: ZardToggleGroupItem) {
    if (this.disabledState() || item.disabled) {
      return;
    }

    const currentValue = this.currentValue();
    let newValue: string | string[];

    if (this.zMode() === 'single') {
      newValue = currentValue === item.value ? '' : item.value;
    } else {
      const currentArray = Array.isArray(currentValue) ? currentValue : [];
      if (currentArray.includes(item.value)) {
        newValue = currentArray.filter(v => v !== item.value);
      } else {
        newValue = [...currentArray, item.value];
      }
    }

    this.internalValue.set(newValue);
    this.valueChange.emit(newValue);
    this.onChangeFn(newValue);
    this.onTouched();
  }

  writeValue(value: string | string[]): void {
    if (value !== undefined) {
      this.internalValue.set(value);
    }
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledState.set(isDisabled);
  }
}
