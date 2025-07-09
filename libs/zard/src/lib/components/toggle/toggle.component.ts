import { ChangeDetectionStrategy, Component, forwardRef, HostListener, ViewEncapsulation, signal, computed, input, output, effect } from '@angular/core';
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

  private internalValue = signal(false);
  private internalDisabled = signal(false);
  private isUsingNgModel = signal(false);

  protected readonly value = computed(() => {
    const external = this.zValue();
    return external !== undefined ? external : this.internalValue();
  });

  protected readonly disabled = computed(() => this.zDisabled() || this.internalDisabled());

  protected readonly classes = computed(() => mergeClasses(toggleVariants({ zSize: this.zSize(), zType: this.zType() }), this.class()));

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched: OnTouchedType = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChangeFn: OnChangeType = () => {};

  constructor() {
    effect(() => {
      if (this.zValue() === undefined && !this.isUsingNgModel()) {
        this.internalValue.set(this.zDefault());
      }
    });
  }

  @HostListener('mouseenter')
  handleHover() {
    this.onHover.emit();
  }

  toggle() {
    if (this.disabled()) return;

    const next = !this.value();

    if (this.zValue() === undefined) {
      this.internalValue.set(next);
    }

    this.onClick.emit();
    this.onChange.emit(next);
    this.onChangeFn(next);
    this.onTouched();
  }

  writeValue(val: boolean): void {
    this.internalValue.set(val ?? this.zDefault());
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
    this.isUsingNgModel.set(true);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.internalDisabled.set(isDisabled);
  }
}
