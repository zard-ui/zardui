import {
  type AfterContentInit,
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  type ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZARD_INPUT_OTP_SLOT, type ZardInputOtpSlotApi } from './input-otp.tokens';
import { inputOtpSlotVariants, inputOtpVariants, type ZardInputOtpSize } from './input-otp.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Component({
  selector: 'z-input-otp, [z-input-otp]',
  template: `
    <div [class]="classes()" [attr.data-input-otp-container]="''">
      @if (!hasSlots()) {
        @for (i of range(); track i) {
          <input
            #otpInput
            type="text"
            [value]="tokens()[i - 1] || ''"
            [attr.maxlength]="1"
            [attr.inputmode]="inputMode()"
            [attr.autocomplete]="'one-time-code'"
            [attr.aria-label]="ariaLabel(i)"
            [disabled]="disabled()"
            [readonly]="zReadonly()"
            [class]="slotClasses(i - 1)"
            (input)="onInput($event, i - 1)"
            (focus)="onInputFocus($event, i - 1)"
            (blur)="onInputBlur()"
            (paste)="onPaste($event)"
            (keydown)="onKeyDown($event)"
          />
        }
      }
      <ng-content />
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
  readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  readonly zMaxLength = input<number | undefined>(undefined);
  readonly zPattern = input<string>('[0-9]');
  readonly zClass = input<ClassValue>('');
  readonly zReadonly = input<boolean>(false);
  readonly zIntegerOnly = input<boolean>(true);
  readonly zSize = input<ZardInputOtpSize>('default');

  zValueChange = output<string>();
  zComplete = output<string>();

  readonly slots = contentChildren<ZardInputOtpSlotApi>(ZARD_INPUT_OTP_SLOT, { descendants: true });

  readonly tokens = signal<string[]>([]);
  readonly disabled = signal<boolean>(false);
  readonly focusedIndex = signal<number>(-1);
  readonly classes = computed(() => mergeClasses(inputOtpVariants({ zSize: this.zSize() }), this.zClass()));
  readonly inputMode = computed(() => (this.zIntegerOnly() ? 'numeric' : 'text'));

  readonly hasSlots = signal(false);
  readonly effectiveMaxLength = computed(() => this.zMaxLength() ?? (this.hasSlots() ? this.slots().length : 6));
  readonly range = computed(() => Array.from({ length: this.effectiveMaxLength() }, (_, index) => index + 1));

  private onTouched: OnTouchedType = () => {
    /* empty */
  };

  private onChange: OnChangeType = () => {
    /* empty */
  };

  private readonly injector = inject(Injector);

  ngAfterContentInit(): void {
    if (this.slots().length > 0) {
      this.hasSlots.set(true);
    }
    this.syncSlots();
  }

  ariaLabel(position: number): string {
    return `One-time password digit ${position} of ${this.effectiveMaxLength()}`;
  }

  slotClasses(index: number): string {
    const extras: string[] = [];

    if (index === 0) {
      extras.push('rounded-l-md border-l');
    }

    if (index === this.effectiveMaxLength() - 1) {
      extras.push('rounded-r-md');
    }

    return mergeClasses(inputOtpSlotVariants({ zSize: this.zSize() }), extras);
  }

  writeValue(value: string): void {
    if (value) {
      this.tokens.set(value.split('').slice(0, this.effectiveMaxLength()));
    } else {
      this.tokens.set([]);
    }
    this.syncSlots();
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

  onInput(event: Event, index: number): void {
    if (!isInputElement(event.target)) {
      return;
    }
    const input = event.target;
    const { value } = input;

    if (index === 0 && value.length > 1) {
      this.handlePaste(value);
      event.stopPropagation();
      return;
    }

    const regex = new RegExp(this.zPattern());

    if (value && !regex.test(value)) {
      input.value = this.tokens()[index] || '';
      return;
    }

    this.tokens.update(prev => {
      const next = prev.slice();
      next[index] = value;
      return next;
    });
    this.updateModel();

    const inputType = isInputEvent(event) ? event.inputType : '';
    if (inputType === 'deleteContentBackward') {
      this.moveToPrev(event);
    } else if (inputType === 'insertText' || inputType === 'deleteContentForward') {
      this.moveToNext(event);
    }
  }

  updateModel(): void {
    const newValue = this.tokens().join('');
    this.emitValue(newValue);
    this.zValueChange.emit(newValue);

    if (newValue.length === this.effectiveMaxLength()) {
      this.zComplete.emit(newValue);
    }

    this.syncSlots();
  }

  protected emitValue(newValue: string): void {
    this.onChange(newValue);
  }

  onInputFocus(event: Event, index: number): void {
    if (isInputElement(event.target)) {
      event.target.select();
    }
    this.focusedIndex.set(index);
    this.syncSlots();
  }

  onInputBlur(): void {
    this.focusedIndex.set(-1);
    this.onTouched();
    this.syncSlots();
  }

  onPaste(event: ClipboardEvent): void {
    if (this.disabled() || this.zReadonly()) {
      return;
    }

    const paste = event.clipboardData?.getData('text');
    if (paste && paste.length) {
      this.handlePaste(paste);
    }

    event.preventDefault();
  }

  handlePaste(paste: string): void {
    const regex = new RegExp(this.zPattern());
    const pastedCode = paste
      .substring(0, this.effectiveMaxLength())
      .split('')
      .filter(char => regex.test(char))
      .join('');

    this.tokens.set(pastedCode.split(''));
    this.updateModel();

    const nextIndex = Math.min(this.tokens().length, this.effectiveMaxLength() - 1);
    afterNextRender(
      () => {
        if (this.hasSlots()) {
          this.slots()[nextIndex]?.focus();
        } else {
          this.inputs()[nextIndex]?.nativeElement.focus();
        }
      },
      { injector: this.injector },
    );
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!isInputElement(event.target)) {
      return;
    }
    const input = event.target;

    switch (event.key) {
      case 'ArrowLeft':
        this.moveToPrev(event);
        event.preventDefault();
        break;

      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        break;

      case 'Backspace':
        if (input.value.length === 0) {
          this.moveToPrev(event);
          event.preventDefault();
        }
        break;

      case 'Delete':
        break;

      case 'ArrowRight':
        this.moveToNext(event);
        event.preventDefault();
        break;

      default: {
        if (event.key.length > 1) {
          return;
        }

        const hasSelection = input.selectionStart !== input.selectionEnd;
        const isAtMaxLength = this.tokens().join('').length >= this.effectiveMaxLength();
        const regex = new RegExp(this.zPattern());
        const isValidKey = regex.test(event.key);

        if (!isValidKey || (isAtMaxLength && !hasSelection)) {
          event.preventDefault();
        }
        break;
      }
    }
  }

  moveToNext(event: Event): void {
    if (!isInputElement(event.target)) {
      return;
    }
    const nextInput = this.findNextInput(event.target);
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  }

  moveToPrev(event: Event): void {
    if (!isInputElement(event.target)) {
      return;
    }
    const prevInput = this.findPrevInput(event.target);
    if (prevInput) {
      prevInput.focus();
      prevInput.select();
    }
  }

  findNextInput(element: HTMLElement): HTMLInputElement | null {
    if (element.hasAttribute('data-input-otp-container')) {
      return null;
    }

    const nextElement = element.nextElementSibling;
    if (!nextElement) {
      const parent = element.parentElement;
      if (!parent) {
        return null;
      }
      return this.findNextInput(parent);
    }

    if (nextElement instanceof HTMLInputElement) {
      return nextElement;
    }

    const inputInside = nextElement.querySelector('input');
    if (inputInside) {
      return inputInside;
    }

    return this.findNextInput(nextElement as HTMLElement);
  }

  findPrevInput(element: HTMLElement): HTMLInputElement | null {
    if (element.hasAttribute('data-input-otp-container')) {
      return null;
    }

    const prevElement = element.previousElementSibling;
    if (!prevElement) {
      const parent = element.parentElement;
      if (!parent) {
        return null;
      }
      return this.findPrevInput(parent);
    }

    if (prevElement instanceof HTMLInputElement) {
      return prevElement;
    }

    const inputs = prevElement.querySelectorAll('input');
    if (inputs.length) {
      return inputs[inputs.length - 1];
    }

    return this.findPrevInput(prevElement as HTMLElement);
  }

  protected syncSlots(): void {
    if (!this.hasSlots()) {
      return;
    }
    const slotsArray = this.slots();
    const focused = this.focusedIndex();
    const tokens = this.tokens();
    for (let i = 0; i < slotsArray.length; i++) {
      const char = tokens[i] || '';
      const isActive = i === focused;
      slotsArray[i].updateState(char, isActive, isActive && !char);
    }
  }
}

function isInputElement(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement;
}

function isInputEvent(event: Event): event is InputEvent {
  return event instanceof InputEvent;
}
