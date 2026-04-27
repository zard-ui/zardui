

```angular-ts title="input-otp.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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

```



```angular-ts title="input-otp.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const inputOtpVariants = cva(mergeClasses('flex items-center has-[:disabled]:opacity-50'), {
  variants: {
    zSize: {
      sm: 'gap-1 text-xs',
      default: 'gap-2 text-sm',
      lg: 'gap-3 text-base',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const inputOtpGroupVariants = cva(
  mergeClasses(
    'flex items-center',
    '[&>z-input-otp-slot:first-child_input]:rounded-l-md [&>z-input-otp-slot:first-child_input]:border-l',
    '[&>z-input-otp-slot:last-child_input]:rounded-r-md',
  ),
);

export const inputOtpSlotVariants = cva(
  mergeClasses(
    'relative flex items-center justify-center',
    'border-y border-r border-input bg-transparent text-center',
    'shadow-xs transition-[color,box-shadow] outline-none',
    'focus:z-10 focus:border-ring focus:ring-ring/50 focus:ring-[3px]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-muted-foreground',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'data-[active]:border-ring data-[active]:ring-ring/50 data-[active]:ring-[3px] data-[active]:z-10',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-9 w-9 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const inputOtpSeparatorVariants = cva('flex items-center justify-center text-muted-foreground', {
  variants: {
    zSize: {
      sm: '[&_svg]:size-3',
      default: '[&_svg]:size-4',
      lg: '[&_svg]:size-5',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardInputOtpSize = NonNullable<VariantProps<typeof inputOtpVariants>['zSize']>;
export type ZardInputOtpVariants = VariantProps<typeof inputOtpVariants>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './input-otp-group.component';
export * from './input-otp-separator.component';
export * from './input-otp-signal.component';
export * from './input-otp-slot.component';
export * from './input-otp.component';
export * from './input-otp.tokens';
export * from './input-otp.variants';

```



```angular-ts title="input-otp-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { inputOtpGroupVariants } from './input-otp.variants';

@Component({
  selector: 'z-input-otp-group, [z-input-otp-group]',
  template: `
    <div [class]="classes()">
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-input-otp-group]': '""',
  },
})
export class ZardInputOtpGroupComponent {
  readonly class = input<ClassValue>('');

  readonly classes = computed(() => mergeClasses(inputOtpGroupVariants(), this.class()));
}

```



```angular-ts title="input-otp-separator.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardInputOtpComponent } from './input-otp.component';
import { inputOtpSeparatorVariants } from './input-otp.variants';

@Component({
  selector: 'z-input-otp-separator, [z-input-otp-separator]',
  template: `
    <div [class]="classes()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[attr.data-input-otp-separator]': '""',
  },
})
export class ZardInputOtpSeparatorComponent {
  private readonly inputOtp = inject(ZardInputOtpComponent, { optional: true });

  readonly class = input<ClassValue>('');

  readonly classes = computed(() =>
    mergeClasses(inputOtpSeparatorVariants({ zSize: this.inputOtp?.zSize() ?? 'default' }), this.class()),
  );
}

```



```angular-ts title="input-otp-signal.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, effect, forwardRef, model } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

import { ZardInputOtpComponent } from './input-otp.component';

@Component({
  selector: 'z-input-otp-signal, [z-input-otp-signal]',
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
      provide: ZardInputOtpComponent,
      useExisting: forwardRef(() => ZardInputOtpSignalComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
})
export class ZardInputOtpSignalComponent extends ZardInputOtpComponent implements FormValueControl<string> {
  readonly value = model<string>('');
  override readonly disabled = model<boolean>(false);

  constructor() {
    super();

    effect(() => {
      const next = this.value() ?? '';
      if (this.tokens().join('') !== next) {
        super.writeValue(next);
      }
    });
  }

  protected override emitValue(newValue: string): void {
    this.value.set(newValue);
  }
}

```



```angular-ts title="input-otp-slot.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardInputOtpComponent } from './input-otp.component';
import { ZARD_INPUT_OTP_SLOT } from './input-otp.tokens';
import { inputOtpSlotVariants } from './input-otp.variants';

@Component({
  selector: 'z-input-otp-slot, [z-input-otp-slot]',
  template: `
    <input
      #slotInput
      type="text"
      [value]="char()"
      [attr.maxlength]="1"
      [attr.inputmode]="inputOtp?.inputMode() || 'numeric'"
      [attr.autocomplete]="'one-time-code'"
      [attr.aria-label]="ariaLabel()"
      [disabled]="inputOtp?.disabled()"
      [readonly]="inputOtp?.zReadonly()"
      [class]="classes()"
      [attr.data-active]="isActive() ? '' : null"
      (input)="onInput($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur()"
      (paste)="onPaste($event)"
      (keydown)="onKeyDown($event)"
    />
    @if (hasFakeCaret() && !char()) {
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div class="animate-caret-blink bg-foreground h-4 w-px"></div>
      </div>
    }
  `,
  styles: `
    @keyframes caret-blink {
      0%,
      70%,
      100% {
        opacity: 1;
      }
      20%,
      50% {
        opacity: 0;
      }
    }

    .animate-caret-blink {
      animation: caret-blink 1s ease-out infinite;
    }
  `,
  providers: [
    {
      provide: ZARD_INPUT_OTP_SLOT,
      useExisting: forwardRef(() => ZardInputOtpSlotComponent),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '""',
    class: 'relative',
  },
})
export class ZardInputOtpSlotComponent {
  readonly slotInputRef = viewChild.required<ElementRef<HTMLInputElement>>('slotInput');

  inputOtp = inject(ZardInputOtpComponent, { optional: true });

  readonly zIndex = input.required<number>();
  readonly class = input<ClassValue>('');

  readonly char = signal<string>('');
  readonly isActive = signal<boolean>(false);
  readonly hasFakeCaret = signal<boolean>(false);

  readonly classes = computed(() =>
    mergeClasses(inputOtpSlotVariants({ zSize: this.inputOtp?.zSize() ?? 'default' }), this.class()),
  );

  readonly ariaLabel = computed(() => {
    const total = this.inputOtp?.effectiveMaxLength() ?? this.zIndex() + 1;
    return `One-time password digit ${this.zIndex() + 1} of ${total}`;
  });

  getInputElement(): HTMLInputElement {
    return this.slotInputRef().nativeElement;
  }

  focus(): void {
    const input = this.getInputElement();
    input.focus();
    input.select();
  }

  rejectInput(): void {
    const input = this.getInputElement();
    input.value = this.char();
  }

  onInput(event: Event): void {
    if (!isInputElement(event.target)) {
      return;
    }
    const { value } = event.target;

    if (this.zIndex() === 0 && value.length > 1) {
      this.inputOtp?.handlePaste(value);
      event.stopPropagation();
      return;
    }

    this.inputOtp?.onInput(event, this.zIndex());
  }

  onFocus(event: Event): void {
    if (isInputElement(event.target)) {
      event.target.select();
    }
    this.inputOtp?.onInputFocus(event, this.zIndex());
  }

  onBlur(): void {
    this.inputOtp?.onInputBlur();
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    if (this.inputOtp?.disabled() || this.inputOtp?.zReadonly()) {
      return;
    }

    const paste = event.clipboardData?.getData('text');
    if (paste?.length) {
      this.inputOtp?.onPaste(event);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    this.inputOtp?.onKeyDown(event);
  }

  updateState(char: string, isActive: boolean, hasFakeCaret: boolean): void {
    this.char.set(char);
    this.isActive.set(isActive);
    this.hasFakeCaret.set(hasFakeCaret);

    const input = this.getInputElement();
    if (input) {
      input.value = char;
    }
  }
}

function isInputElement(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement;
}

```



```angular-ts title="input-otp.tokens.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { InjectionToken, type Signal } from '@angular/core';

export interface ZardInputOtpSlotApi {
  readonly zIndex: Signal<number>;
  focus(): void;
  updateState(char: string, isActive: boolean, hasFakeCaret: boolean): void;
}

export const ZARD_INPUT_OTP_SLOT = new InjectionToken<ZardInputOtpSlotApi>('ZardInputOtpSlot');

```

