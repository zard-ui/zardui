import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  linkedSignal,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { toggleVariants, type ZardToggleSizeVariants, type ZardToggleTypeVariants } from './toggle.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-toggle',
  template: `
    <button
      type="button"
      data-slot="toggle"
      [attr.aria-label]="zAriaLabel()"
      [attr.aria-pressed]="zValue()"
      [attr.data-state]="state()"
      [class]="classes()"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <ng-content />
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '(mouseenter)': 'handleHover()',
  },
  exportAs: 'zToggle',
})
export class ZardToggleComponent implements ControlValueAccessor {
  readonly zValue = model(false);
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zType = input<ZardToggleTypeVariants>('default');
  readonly zSize = input<ZardToggleSizeVariants>('default');
  readonly zAriaLabel = input.required<string>();
  readonly class = input<ClassValue>('');

  readonly zToggleClick = output<void>();
  readonly zToggleHover = output<void>();
  readonly zToggleChange = output<boolean>();

  protected readonly state = computed(() => (this.zValue() ? 'on' : 'off'));

  protected readonly disabled = linkedSignal(() => this.zDisabled());

  protected readonly classes = computed(() =>
    mergeClasses(toggleVariants({ zSize: this.zSize(), zType: this.zType() }), this.class()),
  );

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  handleHover() {
    this.zToggleHover.emit();
  }

  toggle() {
    if (this.disabled()) {
      return;
    }

    this.zValue.update(v => !v);

    this.zToggleClick.emit();
    this.zToggleChange.emit(this.zValue());
    this.onChangeFn(this.zValue());
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.zValue.set(val);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
