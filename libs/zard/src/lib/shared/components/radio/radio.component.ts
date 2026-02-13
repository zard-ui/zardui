import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  forwardRef,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { ZardIdDirective } from '@/shared/core';
import { mergeClasses } from '@/shared/utils/merge-classes';

import { radioLabelVariants, radioVariants } from './radio.variants';

type OnTouchedType = () => unknown;
type OnChangeType = (value: unknown) => void;

@Component({
  selector: 'z-radio, [z-radio]',
  imports: [ZardIdDirective],
  template: `
    <span
      class="relative flex items-center gap-2"
      [class]="disabled() ? 'cursor-not-allowed' : 'cursor-pointer'"
      (mousedown)="onRadioChange()"
      zardId="radio"
      #z="zardId"
    >
      <input
        #input
        type="radio"
        [value]="value()"
        [class]="classes()"
        [checked]="checked"
        [disabled]="disabled()"
        (blur)="onRadioBlur()"
        [name]="name()"
        [id]="zId() || z.id()"
      />
      <span
        class="bg-primary pointer-events-none absolute left-1 size-2 rounded-full opacity-0 peer-checked:opacity-100"
      ></span>
      <label [class]="labelClasses()" [for]="zId() || z.id()">
        <ng-content />
      </label>
    </span>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardRadioComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zRadio',
})
export class ZardRadioComponent implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  readonly radioChange = output<boolean>();
  readonly class = input<ClassValue>('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>('radio');
  readonly value = input<unknown>(null);
  readonly zId = input<string>('');

  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onChange: OnChangeType = () => {};
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  private onTouched: OnTouchedType = () => {};

  protected readonly classes = computed(() => mergeClasses(radioVariants(), this.class()));
  protected readonly labelClasses = computed(() => mergeClasses(radioLabelVariants()));

  checked = false;

  writeValue(val: unknown): void {
    this.checked = val === this.value();
    this.cdr.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // This is called by Angular forms when the disabled state changes
    // The input disabled() signal handles the state
    this.cdr.markForCheck();
  }

  onRadioBlur(): void {
    this.onTouched();
    this.cdr.markForCheck();
  }

  onRadioChange(): void {
    if (this.disabled()) {
      return;
    }

    this.checked = true;
    this.onChange(this.value());
    this.radioChange.emit(this.checked);
    this.cdr.markForCheck();
  }
}
