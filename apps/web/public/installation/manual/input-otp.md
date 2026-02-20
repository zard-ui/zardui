

```angular-ts title="input-otp.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  type AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChildren,
  type ElementRef,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardInputOtpSlotComponent } from './input-otp-slot.component';
import { inputOtpVariants } from './input-otp.variants';

type OnTouchedType = () => void;
type OnChangeType = (value: string) => void;

@Component({
  selector: 'z-input-otp, [z-input-otp]',
  template: `
    <div [class]="classes()" [attr.data-input-otp-container]="''">
      @if (!hasSlots()) {
        @for (i of getRange(); track i) {
          <input
            #otpInput
            type="text"
            [value]="tokens[i - 1] || ''"
            [attr.maxlength]="1"
            [attr.inputmode]="inputMode()"
            [attr.autocomplete]="'one-time-code'"
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

  zValueChange = output<string>();
  zComplete = output<string>();

  readonly slots = contentChildren(ZardInputOtpSlotComponent, { descendants: true });

  tokens: string[] = [];
  readonly disabled = signal<boolean>(false);
  readonly focusedIndex = signal<number>(-1);
  readonly classes = computed(() => mergeClasses(inputOtpVariants(), this.zClass()));
  readonly inputMode = computed(() => (this.zIntegerOnly() ? 'numeric' : 'text'));

  readonly hasSlots = signal(false);
  readonly effectiveMaxLength = computed(() => this.zMaxLength() ?? (this.hasSlots() ? this.slots().length : 6));

  private onTouched: OnTouchedType = () => {
    /* empty */
  };

  private onChange: OnChangeType = () => {
    /* empty */
  };

  private cd = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    if (this.slots().length > 0) {
      this.hasSlots.set(true);
    }
    this.cd.markForCheck();
  }

  slotClasses(index: number): string {
    const baseClasses = [
      'relative flex h-9 w-9 items-center justify-center',
      'border-y border-r border-input text-sm transition-all text-center',
      'bg-background',
      'focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'placeholder:text-muted-foreground',
    ];

    if (index === 0) {
      baseClasses.push('rounded-l-md border-l');
    }

    if (index === this.effectiveMaxLength() - 1) {
      baseClasses.push('rounded-r-md');
    }

    return mergeClasses(baseClasses);
  }

  getRange(): number[] {
    return Array.from({ length: this.effectiveMaxLength() }, (_, index) => index + 1);
  }

  writeValue(value: string): void {
    if (value) {
      const tokens: string[] = Array.isArray(value) ? value : String(value).split('');
      this.tokens = tokens.slice(0, this.effectiveMaxLength());
    } else {
      this.tokens = [];
    }
    this.cd.markForCheck();
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cd.markForCheck();
  }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const { value } = input;

    if (index === 0 && value.length > 1) {
      this.handlePaste(value);
      event.stopPropagation();
      return;
    }

    const regex = new RegExp(this.zPattern());

    if (value && !regex.test(value)) {
      input.value = this.tokens[index] || '';
      return;
    }

    this.tokens[index] = value;
    this.updateModel();

    const { inputType } = event as InputEvent;
    if (inputType === 'deleteContentBackward') {
      this.moveToPrev(event);
    } else if (inputType === 'insertText' || inputType === 'deleteContentForward') {
      this.moveToNext(event);
    }
  }

  updateModel(): void {
    const newValue = this.tokens.join('');
    this.onChange(newValue);
    this.zValueChange.emit(newValue);

    if (newValue.length === this.zMaxLength()) {
      this.zComplete.emit(newValue);
    }

    this.cd.markForCheck();
  }

  onInputFocus(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    input.select();
    this.focusedIndex.set(index);
  }

  onInputBlur(): void {
    this.focusedIndex.set(-1);
    this.onTouched();
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

    this.tokens = pastedCode.split('');
    this.updateModel();

    const nextIndex = Math.min(this.tokens.length, this.effectiveMaxLength() - 1);
    const inputsArray = this.inputs();
    if (inputsArray[nextIndex]) {
      setTimeout(() => {
        inputsArray[nextIndex].nativeElement.focus();
      }, 0);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const input = event.target as HTMLInputElement;

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

      case 'ArrowRight':
        this.moveToNext(event);
        event.preventDefault();
        break;

      default: {
        const hasSelection = input.selectionStart !== input.selectionEnd;
        const isAtMaxLength = this.tokens.join('').length >= this.effectiveMaxLength();
        const regex = new RegExp(this.zPattern());
        const isValidKey = regex.test(event.key);

        if (!isValidKey || (isAtMaxLength && event.key !== 'Delete' && !hasSelection)) {
          event.preventDefault();
        }
        break;
      }
    }
  }

  moveToNext(event: Event): void {
    const input = event.target as HTMLInputElement;
    const nextInput = this.findNextInput(input);
    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  }

  moveToPrev(event: Event): void {
    const input = event.target as HTMLInputElement;
    const prevInput = this.findPrevInput(input);
    if (prevInput) {
      prevInput.focus();
      prevInput.select();
    }
  }

  findNextInput(element: HTMLElement): HTMLInputElement | null {
    const nextElement = element.nextElementSibling;
    if (!nextElement) {
      const parent = element.parentElement;
      if (!parent) {
        return null;
      }
      return this.findNextInput(parent);
    }

    if (nextElement.nodeName === 'INPUT') {
      return nextElement as HTMLInputElement;
    }

    const inputInside = nextElement.querySelector('input');
    if (inputInside) {
      return inputInside;
    }

    return this.findNextInput(nextElement as HTMLElement);
  }

  findPrevInput(element: HTMLElement): HTMLInputElement | null {
    const prevElement = element.previousElementSibling;
    if (!prevElement) {
      const parent = element.parentElement;
      if (!parent) {
        return null;
      }
      return this.findPrevInput(parent);
    }

    if (prevElement.nodeName === 'INPUT') {
      return prevElement as HTMLInputElement;
    }

    const inputs = prevElement.querySelectorAll('input');
    if (inputs.length) {
      return inputs[inputs.length - 1] as HTMLInputElement;
    }

    return this.findPrevInput(prevElement as HTMLElement);
  }
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

export type ZardInputOtpSizeVariants = NonNullable<VariantProps<typeof inputOtpVariants>['zSize']>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './input-otp-group.component';
export * from './input-otp-separator.component';
export * from './input-otp-slot.component';
export * from './input-otp.component';
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
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { inputOtpSeparatorVariants } from './input-otp.variants';

@Component({
  selector: 'z-input-otp-separator, [z-input-otp-separator]',
  template: `
    <div [class]="classes()" role="separator">
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
    '[attr.data-input-otp-separator]': '""',
  },
})
export class ZardInputOtpSeparatorComponent {
  readonly class = input<ClassValue>('');

  readonly classes = computed(() => mergeClasses(inputOtpSeparatorVariants(), this.class()));
}

```



```angular-ts title="input-otp-slot.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  type ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardInputOtpComponent } from './input-otp.component';
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

  readonly classes = computed(() => mergeClasses(inputOtpSlotVariants(), this.class()));

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
    const input = event.target as HTMLInputElement;
    const { value } = input;

    if (this.zIndex() === 0 && value.length > 1) {
      this.inputOtp?.handlePaste(value);
      event.stopPropagation();
      return;
    }

    this.inputOtp?.onInput(event, this.zIndex());
  }

  onFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.select();
    this.inputOtp?.onInputFocus(event, this.zIndex());
  }

  onBlur(): void {
    this.inputOtp?.onInputBlur();
  }

  onPaste(event: ClipboardEvent): void {
    if (this.inputOtp?.disabled() || this.inputOtp?.zReadonly()) {
      return;
    }

    const paste = event.clipboardData?.getData('text');
    if (paste?.length) {
      this.inputOtp?.onPaste(event);
    }

    event.preventDefault();
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

```

