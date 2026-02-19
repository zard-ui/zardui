

```angular-ts title="input-otp.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
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
  standalone: true,
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
            [readonly]="readonly()"
            [class]="slotClasses(i - 1)"
            (input)="onInput($event, i - 1)"
            (focus)="onInputFocus($event, i - 1)"
            (blur)="onInputBlur()"
            (paste)="onPaste($event)"
            (keydown)="onKeyDown($event)"
          />
        }
      } @else {
        <ng-content />
      }
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
export class ZardInputOtpComponent implements ControlValueAccessor {
  readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  readonly zMaxLength = input<number>(6);
  readonly pattern = input<string>('[0-9]');
  readonly class = input<ClassValue>('');
  readonly readonly = input<boolean>(false);
  readonly integerOnly = input<boolean>(true);

  valueChange = output<string>();
  complete = output<string>();

  readonly slots = contentChildren(ZardInputOtpSlotComponent);

  tokens: string[] = [];
  readonly disabled = signal<boolean>(false);
  readonly focusedIndex = signal<number>(-1);
  readonly classes = computed(() => mergeClasses(inputOtpVariants(), this.class()));

  readonly inputMode = computed(() => (this.integerOnly() ? 'numeric' : 'text'));
  readonly hasSlots = computed(() => this.slots().length > 0);

  private onTouched: OnTouchedType = () => {};
  private onChange: OnChangeType = () => {};
  private cd: ChangeDetectorRef;

  constructor() {
    this.cd = inject(ChangeDetectorRef);
  }

  slotClasses(index: number): string {
    const baseClasses = [
      'relative flex h-10 w-10 items-center justify-center',
      'border-y border-r border-input text-sm transition-all text-center',
      'bg-background',
      'focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'placeholder:text-muted-foreground',
    ];

    if (index === 0) {
      baseClasses.push('rounded-l-md border-l');
    }

    if (index === this.zMaxLength() - 1) {
      baseClasses.push('rounded-r-md');
    }

    return mergeClasses(baseClasses);
  }

  getRange(): number[] {
    return Array.from({ length: this.zMaxLength() }, (_, index) => index + 1);
  }

  writeValue(value: string): void {
    if (value) {
      const tokens: string[] = Array.isArray(value) ? value : String(value).split('');
      this.tokens = tokens.slice(0, this.zMaxLength());
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

    const pattern = this.pattern();
    const regex = new RegExp(pattern);

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
    this.valueChange.emit(newValue);

    if (newValue.length === this.zMaxLength()) {
      this.complete.emit(newValue);
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
    if (this.disabled() || this.readonly()) {
      return;
    }

    const paste = event.clipboardData?.getData('text');
    if (paste && paste.length) {
      this.handlePaste(paste);
    }

    event.preventDefault();
  }

  handlePaste(paste: string): void {
    let pastedCode = paste.substring(0, this.zMaxLength());

    const pattern = this.pattern();
    const regex = new RegExp(pattern);
    pastedCode = pastedCode
      .split('')
      .filter(char => regex.test(char))
      .join('');

    this.tokens = pastedCode.split('');
    this.updateModel();

    const nextIndex = Math.min(this.tokens.length, this.zMaxLength() - 1);
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
        const isAtMaxLength = this.tokens.join('').length >= this.zMaxLength();
        const pattern = this.pattern();
        const regex = new RegExp(pattern);
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
      return null;
    }

    return nextElement.nodeName === 'INPUT'
      ? (nextElement as HTMLInputElement)
      : this.findNextInput(nextElement as HTMLElement);
  }

  findPrevInput(element: HTMLElement): HTMLInputElement | null {
    const prevElement = element.previousElementSibling;
    if (!prevElement) {
      return null;
    }

    return prevElement.nodeName === 'INPUT'
      ? (prevElement as HTMLInputElement)
      : this.findPrevInput(prevElement as HTMLElement);
  }
}

```



```angular-ts title="input-otp.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const inputOtpVariants = cva('flex items-center has-[:disabled]:opacity-50', {
  variants: {
    variant: {
      default: 'gap-2',
      compact: 'gap-1',
      spacious: 'gap-4',
    },
    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export const inputOtpSlotVariants = cva(
  [
    'relative flex items-center justify-center',
    'border-y border-r border-input transition-all text-center',
    'bg-background',
    'focus:z-10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-muted-foreground',
    'first:rounded-l-md first:border-l last:rounded-r-md',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'border-input',
        outline: 'border-2 border-primary/20 focus:border-primary',
        ghost: 'border-transparent bg-muted/50 focus:bg-background focus:border-input',
        compact: 'border-transparent bg-muted/50 focus:bg-background focus:border-input',
        spacious: 'border-transparent bg-muted/50 focus:bg-background focus:border-input',
      },
      size: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
      status: {
        error: 'border-destructive focus:ring-destructive',
        warning: 'border-yellow-500 focus:ring-yellow-500',
        success: 'border-green-500 focus:ring-green-500',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const inputOtpGroupVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: 'gap-0',
      separated: 'gap-1',
      spaced: 'gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const inputOtpSeparatorVariants = cva('flex items-center justify-center text-muted-foreground', {
  variants: {
    size: {
      sm: 'w-3 h-3',
      default: 'w-4 h-4',
      lg: 'w-5 h-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export type ZardInputOtpVariants = VariantProps<typeof inputOtpVariants>;
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
  standalone: true,
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
  standalone: true,
  template: `
    <div [class]="classes()" role="separator">
      <svg width="8" height="16" viewBox="0 0 8 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 0C0.5 0 0.5 16 0.5 16" stroke="currentColor" stroke-linecap="round" />
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
  ElementRef,
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
  standalone: true,
  template: `
    <input
      #slotInput
      type="text"
      [value]="char()"
      [attr.maxlength]="1"
      [attr.inputmode]="inputOtp?.inputMode() || 'numeric'"
      [attr.autocomplete]="'one-time-code'"
      [disabled]="inputOtp?.disabled()"
      [readonly]="inputOtp?.readonly()"
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

  readonly index = input.required<number>();
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

    if (this.index() === 0 && value.length > 1) {
      this.inputOtp?.handlePaste(value);
      event.stopPropagation();
      return;
    }

    this.inputOtp?.onInput(event, this.index());
  }

  onFocus(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.select();
    this.inputOtp?.onInputFocus(event, this.index());
  }

  onBlur(): void {
    this.inputOtp?.onInputBlur();
  }

  onPaste(event: ClipboardEvent): void {
    if (this.inputOtp?.disabled() || this.inputOtp?.readonly()) {
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

