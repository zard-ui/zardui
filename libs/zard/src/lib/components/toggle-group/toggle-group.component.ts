import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { mergeClasses } from '../../shared/utils/utils';
import { toggleGroupVariants, toggleGroupItemVariants, ZardToggleGroupVariants } from './toggle-group.variants';

export interface ToggleGroupValue {
  label?: string;
  value: string;
  checked: boolean;
  content?: string;
}

type OnTouchedType = () => void;
type OnChangeType = (value: ToggleGroupValue[]) => void;

@Component({
  selector: 'z-toggle-group',
  exportAs: 'zToggleGroup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div [class]="classes()" role="group">
      @for (item of currentValue(); track item.value) {
        <button
          type="button"
          [attr.aria-pressed]="item.checked"
          [attr.data-state]="item.checked ? 'on' : 'off'"
          [class]="getItemClasses(item.checked)"
          [disabled]="disabled()"
          (click)="toggleItem(item)"
          (mouseenter)="onHover.emit()"
          [innerHTML]="item.content || item.label || item.value"
        ></button>
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
})
export class ZardToggleGroupComponent implements ControlValueAccessor {
  readonly zValue = input<ToggleGroupValue[]>([]);
  readonly zDefault = input<ToggleGroupValue[]>([]);
  readonly zSize = input<ZardToggleGroupVariants['zSize']>('md');
  readonly class = input<ClassValue>('');

  readonly onClick = output<ToggleGroupValue[]>();
  readonly onHover = output<void>();
  readonly onChange = output<ToggleGroupValue[]>();

  private internalValue = signal<ToggleGroupValue[]>([]);
  protected disabled = signal<boolean>(false);

  protected readonly classes = computed(() => mergeClasses(toggleGroupVariants({ zSize: this.zSize() }), this.class()));

  protected readonly currentValue = computed(() => (this.internalValue().length > 0 ? this.internalValue() : this.zValue()));

  protected getItemClasses(checked: boolean): string {
    return mergeClasses(toggleGroupItemVariants({ zSize: this.zSize() }), checked ? 'bg-accent text-accent-foreground' : 'bg-transparent');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  constructor() {
    // Initialize with zDefault if zValue is empty
    this.internalValue.set(this.zValue().length > 0 ? this.zValue() : this.zDefault());
  }

  toggleItem(item: ToggleGroupValue) {
    if (this.disabled()) return;

    const currentValue = this.currentValue();
    const updatedValue = currentValue.map(valueItem => (valueItem.value === item.value ? { ...valueItem, checked: !valueItem.checked } : valueItem));

    this.internalValue.set(updatedValue);

    this.onClick.emit(updatedValue);
    this.onChange.emit(updatedValue);
    this.onChangeFn(updatedValue);
    this.onTouched();
  }

  writeValue(value: ToggleGroupValue[]): void {
    if (value) {
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
    this.disabled.set(isDisabled);
  }
}
