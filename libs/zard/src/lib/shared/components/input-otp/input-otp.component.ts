import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  forwardRef,
  input,
  output,
  signal,
  type AfterContentInit,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { generateId, mergeClasses } from '@/shared/utils/merge-classes';

import { ZardInputOtpSlotComponent } from './input-otp-slot.component';
import { inputOtpVariants } from './input-otp.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Component({
  selector: 'z-input-otp, [z-input-otp]',
  standalone: true,
  template: `
    <div [class]="classes()" [attr.data-input-otp-container]="''">
      <ng-content />
      <input
        #hiddenInput
        type="text"
        [id]="zId() || uniqueId()"
        [value]="value()"
        [attr.maxlength]="zMaxLength()"
        [attr.pattern]="zPattern()"
        [disabled]="disabled()"
        [readonly]="readonly()"
        (input)="handleInput($event)"
        (blur)="onBlur()"
        (paste)="handlePaste($event)"
        (keydown)="handleKeyDown($event)"
        style="position: absolute; opacity: 0; pointer-events: none; width: 0; height: 0;"
      />
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZardInputOtpComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class ZardInputOtpComponent implements ControlValueAccessor, AfterContentInit {
  readonly zId = input<string>();
  readonly zMaxLength = input<number>(6);
  readonly zPattern = input<string | RegExp>('[0-9]*');
  readonly class = input<ClassValue>('');
  readonly readonly = input<boolean>(false);

  zValueChange = output<string>();
  zComplete = output<string>();

  readonly value = signal<string>('');
  readonly disabled = signal<boolean>(false);
  readonly focusedIndex = signal<number>(0);
  readonly uniqueId = signal<string>(generateId('input-otp'));

  readonly slots = contentChildren(ZardInputOtpSlotComponent);

  readonly classes = computed(() => mergeClasses(inputOtpVariants(), this.class()));

  private onTouched: OnTouchedType = () => {
    /* empty */
  };

  private onChange: OnChangeType = () => {
    /* empty */
  };

  ngAfterContentInit(): void {
    this.updateSlots();
  }

  writeValue(value: string): void {
    this.value.set(value || '');
    this.updateSlots();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  handleInput(event: Event): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    const pattern = this.zPattern();
    if (pattern) {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      newValue = newValue
        .split('')
        .filter(char => regex.test(char))
        .join('');
    }

    newValue = newValue.slice(0, this.zMaxLength());

    this.updateValue(newValue);
    input.value = newValue;
  }

  handlePaste(event: ClipboardEvent): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';

    let validText = pastedText;
    const pattern = this.zPattern();
    if (pattern) {
      const regex = typeof pattern === 'string' ? new RegExp(pattern, 'g') : pattern;
      validText = pastedText
        .split('')
        .filter(char => regex.test(char))
        .join('');
    }

    validText = validText.slice(0, this.zMaxLength());

    this.updateValue(validText);
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled() || this.readonly()) {
      return;
    }

    const currentValue = this.value();

    if (event.key === 'Backspace') {
      if (currentValue.length > 0) {
        this.updateValue(currentValue.slice(0, -1));
      }
    } else if (event.key === 'Delete') {
      this.updateValue('');
    } else if (event.key === 'ArrowLeft') {
      const newIndex = Math.max(0, this.focusedIndex() - 1);
      this.focusedIndex.set(newIndex);
    } else if (event.key === 'ArrowRight') {
      const newIndex = Math.min(this.zMaxLength() - 1, this.focusedIndex() + 1);
      this.focusedIndex.set(newIndex);
    }
  }

  onBlur(): void {
    this.onTouched();
  }

  onSlotClick(index: number): void {
    if (this.disabled() || this.readonly()) {
      return;
    }
    this.focusedIndex.set(index);
  }

  private updateValue(newValue: string): void {
    this.value.set(newValue);
    this.focusedIndex.set(Math.min(newValue.length, this.zMaxLength() - 1));
    this.updateSlots();
    this.onChange(newValue);
    this.zValueChange.emit(newValue);

    if (newValue.length === this.zMaxLength()) {
      this.zComplete.emit(newValue);
    }
  }

  private updateSlots(): void {
    const currentValue = this.value();
    const slotsArray = this.slots();

    slotsArray.forEach((slot, index) => {
      const char = currentValue[index] || '';
      const isActive = index === this.focusedIndex();
      const hasFakeCaret = isActive && index === currentValue.length;

      slot.updateState(char, isActive, hasFakeCaret);
    });
  }
}
