import {
  type AfterContentInit,
  afterNextRender,
  booleanAttribute,
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
  ViewEncapsulation,
  viewChildren,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZARD_INPUT_OTP_SLOT, type ZardInputOtpSlotApi } from './input-otp.tokens';
import { isInputElement, isInputEvent } from './input-otp.utils';
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
            [attr.aria-invalid]="zInvalid() ? 'true' : null"
            [attr.data-active]="allSelected() ? '' : null"
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
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': '"input-otp"',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(copy)': 'onCopy($event)',
    '(cut)': 'onCut($event)',
    '(mousedown)': 'clearSelectAll()',
  },
  exportAs: 'zInputOtp',
})
export class ZardInputOtpComponent implements ControlValueAccessor, AfterContentInit {
  readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  readonly zMaxLength = input<number | undefined>(undefined);
  readonly zPattern = input<string>('[0-9]');
  readonly class = input<ClassValue>('');
  readonly zReadonly = input(false, { transform: booleanAttribute });
  readonly zIntegerOnly = input(true, { transform: booleanAttribute });
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardInputOtpSize>('default');

  zValueChange = output<string>();
  zComplete = output<string>();

  readonly slots = contentChildren<ZardInputOtpSlotApi>(ZARD_INPUT_OTP_SLOT, { descendants: true });

  readonly tokens = signal<string[]>([]);
  readonly disabled = signal<boolean>(false);
  readonly focusedIndex = signal<number>(-1);
  /** Set by Ctrl/Cmd+A: every slot reads as selected so a copy takes the whole value. */
  readonly allSelected = signal<boolean>(false);
  readonly classes = computed(() => mergeClasses(inputOtpVariants(), this.class()));
  readonly inputMode = computed(() => (this.zIntegerOnly() ? 'numeric' : 'text'));
  readonly patternRegex = computed(() => new RegExp(this.zPattern()));

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
      const maxLength = this.effectiveMaxLength();
      const currentTokens = this.tokens();
      if (currentTokens.length > maxLength) {
        this.tokens.set(currentTokens.slice(0, maxLength));
      }
    }
    this.syncSlots();
  }

  ariaLabel(position: number): string {
    return `One-time password digit ${position} of ${this.effectiveMaxLength()}`;
  }

  slotClasses(index: number): string {
    const extras: string[] = [];

    if (index === 0) {
      extras.push('rounded-l-lg border-l');
    }

    if (index === this.effectiveMaxLength() - 1) {
      extras.push('rounded-r-lg');
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
    this.allSelected.set(false);
    const input = event.target;
    const { value } = input;

    if (index === 0 && value.length > 1) {
      this.handlePaste(value);
      event.stopPropagation();
      return;
    }

    const regex = this.patternRegex();

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
    this.allSelected.set(false);
    this.focusedIndex.set(index);
    this.syncSlots();
  }

  onInputBlur(): void {
    this.allSelected.set(false);
    this.focusedIndex.set(-1);
    this.onTouched();
    this.syncSlots();
  }

  selectAll(): void {
    this.allSelected.set(true);
    this.syncSlots();
  }

  clearSelectAll(): void {
    if (this.allSelected()) {
      this.allSelected.set(false);
      this.syncSlots();
    }
  }

  onCopy(event: ClipboardEvent): void {
    if (!this.allSelected()) {
      return;
    }

    event.preventDefault();
    event.clipboardData?.setData('text/plain', this.tokens().join(''));
  }

  onCut(event: ClipboardEvent): void {
    this.onCopy(event);

    if (event.defaultPrevented && !this.disabled() && !this.zReadonly()) {
      this.clearValue();
    }
  }

  /** Empties every slot and moves focus back to the first one. */
  clearValue(): void {
    this.allSelected.set(false);
    this.tokens.set([]);
    this.updateModel();
    this.focusSlotAt(0);
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
    const regex = this.patternRegex();
    const pastedCode = paste
      .substring(0, this.effectiveMaxLength())
      .split('')
      .filter(char => regex.test(char))
      .join('');

    this.tokens.set(pastedCode.split(''));
    this.updateModel();

    this.focusSlotAt(this.tokens().length);
  }

  /** Focuses the slot at `index`, clamped to the available range, once the view has settled. */
  private focusSlotAt(index: number): void {
    const target = Math.max(0, Math.min(index, this.effectiveMaxLength() - 1));

    afterNextRender(
      () => {
        if (this.hasSlots()) {
          this.slots()[target]?.focus();
        } else {
          this.inputs()[target]?.nativeElement.focus();
        }
      },
      { injector: this.injector },
    );
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      this.onShortcut(event);
      return;
    }

    if (!isInputElement(event.target)) {
      return;
    }
    const input = event.target;

    // With every slot selected, the next keystroke acts on the whole value.
    if (this.allSelected()) {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        if (!this.zReadonly()) {
          this.clearValue();
        }
        return;
      }

      if (event.key.length === 1) {
        event.preventDefault();
        this.allSelected.set(false);
        if (!this.zReadonly() && this.patternRegex().test(event.key)) {
          this.tokens.set([event.key]);
          this.updateModel();
          this.focusSlotAt(1);
        } else {
          this.syncSlots();
        }
        return;
      }

      this.allSelected.set(false);
      this.syncSlots();
    }

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

        if (!this.patternRegex().test(event.key)) {
          event.preventDefault();
          break;
        }

        // A slot holds a single character, so typing over a filled one replaces it.
        if (input.value && input.selectionStart === input.selectionEnd) {
          input.select();
        }
        break;
      }
    }
  }

  /** Handles the modifier shortcuts the component owns; everything else falls through to the browser. */
  private onShortcut(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && key === 'a') {
      event.preventDefault();
      this.selectAll();
      return;
    }

    // Keep the selection alive for copy/cut, drop it for anything else.
    if (key !== 'c' && key !== 'x') {
      this.clearSelectAll();
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
    const all = this.allSelected();
    for (let i = 0; i < slotsArray.length; i++) {
      const char = tokens[i] || '';
      const isActive = all || i === focused;
      slotsArray[i].updateState(char, isActive, !all && isActive && !char);
    }
  }
}
