

```angular-ts title="input-otp.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

// Main OTP container variants
export const inputOtpVariants = cva('flex items-center gap-2 has-[:disabled]:opacity-50', {
  variants: {},
  defaultVariants: {},
});

// OTP slot variants
export const inputOtpSlotVariants = cva(
  [
    'relative flex h-10 w-10 items-center justify-center',
    'border-y border-r border-input text-sm transition-all',
    'first:rounded-l-md first:border-l last:rounded-r-md',
    'focus-within:z-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
);

// OTP group variants
export const inputOtpGroupVariants = cva('flex items-center', {
  variants: {},
  defaultVariants: {},
});

// OTP separator variants
export const inputOtpSeparatorVariants = cva('flex w-4 items-center justify-center text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export type ZardInputOtpVariants = VariantProps<typeof inputOtpVariants>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;

```



```angular-ts title="input-opt.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
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

import { generateId, mergeClasses } from '../../utils/merge-classes';
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

```



```angular-ts title="input-otp-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '../../utils/merge-classes';
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

import { mergeClasses } from '../../utils/merge-classes';
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
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '../../utils/merge-classes';
import { ZardInputOtpComponent } from './input-opt.component';
import { inputOtpSlotVariants } from './input-otp.variants';

@Component({
  selector: 'z-input-otp-slot, [z-input-otp-slot]',
  standalone: true,
  template: `
    <div
      [class]="classes()"
      [attr.data-active]="isActive() ? '' : null"
      (click)="onClick()"
      (keydown.enter)="onClick()"
      (keydown.space)="onClick()"
      tabindex="0"
      role="button"
    >
      @if (char()) {
        <div>{{ char() }}</div>
      } @else if (hasFakeCaret()) {
        <div class="pointer-events-none flex h-full w-full items-center justify-center">
          <div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-slot]': '""',
  },
})
export class ZardInputOtpSlotComponent {
  private inputOtp = inject(ZardInputOtpComponent, { optional: true });

  readonly zIndex = input.required<number>();
  readonly class = input<ClassValue>('');

  readonly char = signal<string>('');
  readonly isActive = signal<boolean>(false);
  readonly hasFakeCaret = signal<boolean>(false);

  readonly classes = computed(() => mergeClasses(inputOtpSlotVariants(), this.class()));

  onClick(): void {
    this.inputOtp?.onSlotClick(this.zIndex());
  }

  updateState(char: string, isActive: boolean, hasFakeCaret: boolean): void {
    this.char.set(char);
    this.isActive.set(isActive);
    this.hasFakeCaret.set(hasFakeCaret);
  }
}

```

