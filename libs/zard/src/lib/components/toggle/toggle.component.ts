import { ChangeDetectionStrategy, Component, forwardRef, HostListener, ViewEncapsulation, signal, computed, input, output, linkedSignal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ClassValue } from 'clsx';

import { toggleVariants, ZardToggleVariants } from './toggle.variants';
import { mergeClasses, transform } from '../../shared/utils/utils';

type OnTouchedType = () => void;
type OnChangeType = (value: boolean) => void;

@Component({
  selector: 'z-toggle',
  exportAs: 'zToggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      type="button"
      [attr.aria-label]="zAriaLabel()"
      [attr.aria-pressed]="value()"
      [attr.data-state]="value() ? 'on' : 'off'"
      [class]="classes()"
      [disabled]="disabled()"
      (click)="toggle()"
    >
      <ng-content></ng-content>
    </button>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardToggleComponent),
      multi: true,
    },
  ],
})
export class ZardToggleComponent implements ControlValueAccessor {
  readonly zValue = input<boolean | undefined>();
  readonly zDefault = input<boolean>(false);
  readonly zDisabled = input(false, { alias: 'disabled', transform });
  readonly zType = input<ZardToggleVariants['zType']>('default');
  readonly zSize = input<ZardToggleVariants['zSize']>('md');
  readonly zAriaLabel = input<string>('', { alias: 'aria-label' });
  readonly class = input<ClassValue>('');

  readonly onClick = output<void>();
  readonly onHover = output<void>();
  readonly onChange = output<boolean>();

  private isUsingNgModel = signal(false);

  protected readonly value = linkedSignal(() => this.zValue() || this.zDefault());

  protected readonly disabled = linkedSignal(() => this.zDisabled());

  protected readonly classes = computed(() => mergeClasses(toggleVariants({ zSize: this.zSize(), zType: this.zType() }), this.class()));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  @HostListener('mouseenter')
  handleHover() {
    this.onHover.emit();
  }

  toggle() {
    if (this.disabled()) return;

    const next = !this.value();

    if (this.zValue() === undefined) {
      this.value.set(next);
    }

    this.onClick.emit();
    this.onChange.emit(next);
    this.onChangeFn(next);
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.value.set(val ?? this.zDefault());
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    this.isUsingNgModel.set(true);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
