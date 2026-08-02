---
title: Input Otp
description: Accessible one-time password component with copy-paste functionality.
---

# Input Otp

Accessible one-time password component with copy-paste functionality.

## Installation

### CLI

```bash
npx zard-cli@latest add input-otp
```

### Manual

```angular-ts
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
  },
})
export class ZardInputOtpComponent implements ControlValueAccessor, AfterContentInit {
  readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  readonly zMaxLength = input<number | undefined>(undefined);
  readonly zPattern = input<string>('[0-9]');
  readonly class = input<ClassValue>('');
  readonly zReadonly = input(false, { transform: booleanAttribute });
  readonly zIntegerOnly = input(true, { transform: booleanAttribute });
  readonly zSize = input<ZardInputOtpSize>('default');

  zValueChange = output<string>();
  zComplete = output<string>();

  readonly slots = contentChildren<ZardInputOtpSlotApi>(ZARD_INPUT_OTP_SLOT, { descendants: true });

  readonly tokens = signal<string[]>([]);
  readonly disabled = signal<boolean>(false);
  readonly focusedIndex = signal<number>(-1);
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
    const regex = this.patternRegex();
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
        const isValidKey = this.patternRegex().test(event.key);

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
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const inputOtpVariants = cva('flex items-center has-disabled:opacity-50');

export const inputOtpGroupVariants = cva(
  'flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 [&>z-input-otp-slot:first-child_input]:rounded-l-lg [&>z-input-otp-slot:first-child_input]:border-l [&>z-input-otp-slot:last-child_input]:rounded-r-lg dark:has-aria-invalid:ring-destructive/40',
);

export const inputOtpSlotVariants = cva(
  'relative flex items-center justify-center border-y border-r border-input bg-transparent text-center transition-all outline-none focus:z-10 focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed aria-invalid:border-destructive data-active:z-10 data-active:border-ring data-active:ring-3 data-active:ring-ring/50 data-active:aria-invalid:border-destructive data-active:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-active:aria-invalid:ring-destructive/40',
  {
    variants: {
      zSize: {
        sm: 'size-7 text-xs',
        default: 'size-8 text-sm',
        lg: 'size-10 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const inputOtpSeparatorVariants = cva('flex items-center', {
  variants: {
    zSize: {
      sm: "[&_svg:not([class*='size-'])]:size-3",
      default: "[&_svg:not([class*='size-'])]:size-4",
      lg: "[&_svg:not([class*='size-'])]:size-5",
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardInputOtpSize = NonNullable<VariantProps<typeof inputOtpSlotVariants>['zSize']>;
export type ZardInputOtpVariants = VariantProps<typeof inputOtpVariants>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;
```

```angular-ts
export * from './input-otp.component';
export * from './input-otp-signal.component';
export * from './input-otp-slot.component';
export * from './input-otp-group.component';
export * from './input-otp-separator.component';
export * from './input-otp.imports';
export * from './input-otp.tokens';
export * from './input-otp.variants';
```

```angular-ts
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
    '[attr.data-slot]': '"input-otp-group"',
    '[attr.data-input-otp-group]': '""',
  },
})
export class ZardInputOtpGroupComponent {
  readonly class = input<ClassValue>('');

  readonly classes = computed(() => mergeClasses(inputOtpGroupVariants(), this.class()));
}
```

```angular-ts
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
    '[attr.data-slot]': '"input-otp-separator"',
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

```angular-ts
import { ChangeDetectionStrategy, Component, effect, forwardRef, model, untracked } from '@angular/core';
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
      const current = untracked(() => this.tokens().join(''));
      if (current !== next) {
        super.writeValue(next);
      }
    });
  }

  protected override emitValue(newValue: string): void {
    this.value.set(newValue);
  }
}
```

```angular-ts
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
import { isInputElement } from './input-otp.utils';
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
        <div class="animate-caret-blink bg-foreground h-4 w-px duration-1000"></div>
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
    '[attr.data-slot]': '"input-otp-slot"',
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
    mergeClasses(
      inputOtpSlotVariants({ zSize: this.inputOtp?.zSize() ?? 'default' }),
      // The blinking caret is rendered by this component, so the native one is hidden.
      'caret-transparent',
      this.class(),
    ),
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
```

```angular-ts
import { ZardInputOtpGroupComponent } from '@/shared/components/input-otp/input-otp-group.component';
import { ZardInputOtpSeparatorComponent } from '@/shared/components/input-otp/input-otp-separator.component';
import { ZardInputOtpSignalComponent } from '@/shared/components/input-otp/input-otp-signal.component';
import { ZardInputOtpSlotComponent } from '@/shared/components/input-otp/input-otp-slot.component';
import { ZardInputOtpComponent } from '@/shared/components/input-otp/input-otp.component';

export const ZardInputOtpImports = [
  ZardInputOtpComponent,
  ZardInputOtpSignalComponent,
  ZardInputOtpGroupComponent,
  ZardInputOtpSlotComponent,
  ZardInputOtpSeparatorComponent,
] as const;
```

```angular-ts
import { InjectionToken, type Signal } from '@angular/core';

export interface ZardInputOtpSlotApi {
  readonly zIndex: Signal<number>;
  focus(): void;
  updateState(char: string, isActive: boolean, hasFakeCaret: boolean): void;
}

export const ZARD_INPUT_OTP_SLOT = new InjectionToken<ZardInputOtpSlotApi>('ZardInputOtpSlot');
```

```angular-ts
export function isInputElement(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement;
}

export function isInputEvent(event: Event): event is InputEvent {
  return event instanceof InputEvent;
}
```

## Usage

```angular-ts
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
```

```angular-html
<z-input-otp [zMaxLength]="6">
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="0" />
    <z-input-otp-slot [zIndex]="1" />
    <z-input-otp-slot [zIndex]="2" />
  </z-input-otp-group>
  <z-input-otp-separator />
  <z-input-otp-group>
    <z-input-otp-slot [zIndex]="3" />
    <z-input-otp-slot [zIndex]="4" />
    <z-input-otp-slot [zIndex]="5" />
  </z-input-otp-group>
</z-input-otp>
```

## Examples

### Default

Six slots split into two groups by a separator.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-default',
  imports: [...ZardInputOtpImports],
  template: `
    <z-input-otp [zMaxLength]="6">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="3" />
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpDefaultComponent {}
```

### Separator

Use `InputOtpSeparator` between every `InputOtpGroup` to split the slots into smaller blocks.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-separator',
  imports: [...ZardInputOtpImports],
  template: `
    <z-input-otp [zMaxLength]="6">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="4" />
        <z-input-otp-slot [zIndex]="5" />
      </z-input-otp-group>
    </z-input-otp>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpSeparatorComponent {}
```

### Controlled

Bind the value with `ngModel` and listen to `(zComplete)` to react as soon as every slot is filled.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-controlled',
  imports: [...ZardInputOtpImports, FormsModule],
  template: `
    <div class="space-y-2">
      <z-input-otp [zMaxLength]="6" [(ngModel)]="value" (zComplete)="completed = $event">
        <z-input-otp-group>
          <z-input-otp-slot [zIndex]="0" />
          <z-input-otp-slot [zIndex]="1" />
          <z-input-otp-slot [zIndex]="2" />
          <z-input-otp-slot [zIndex]="3" />
          <z-input-otp-slot [zIndex]="4" />
          <z-input-otp-slot [zIndex]="5" />
        </z-input-otp-group>
      </z-input-otp>
      <div class="text-center text-sm">
        @if (value === '') {
          <span class="text-muted-foreground">Enter your one-time password.</span>
        } @else if (value === completed) {
          <span>Completed: {{ completed }}</span>
        } @else {
          <span>You entered: {{ value }}</span>
        }
      </div>
    </div>
  `,
})
export class ZardDemoInputOtpControlledComponent {
  value = '';
  completed = '';
}
```

### Pattern

Use `zPattern` to restrict the accepted characters. Set `[zIntegerOnly]="false"` when letters are allowed.

```angular-ts
import { Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

export const REGEXP_ONLY_DIGITS = '[0-9]';
export const REGEXP_ONLY_CHARS = '[a-zA-Z]';
export const REGEXP_ONLY_DIGITS_AND_CHARS = '[a-zA-Z0-9]';

@Component({
  selector: 'z-demo-input-otp-pattern',
  imports: [...ZardInputOtpImports],
  template: `
    <div class="space-y-4">
      <div>
        <p class="text-muted-foreground mb-2 text-sm">Only digits</p>
        <z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp>
      </div>

      <div>
        <p class="text-muted-foreground mb-2 text-sm">Letters and numbers</p>
        <z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS_AND_CHARS" [zIntegerOnly]="false">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp>
      </div>
    </div>
  `,
})
export class ZardDemoInputOtpPatternComponent {
  REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
  REGEXP_ONLY_DIGITS_AND_CHARS = REGEXP_ONLY_DIGITS_AND_CHARS;
}
```

### Form

Use `formControlName` to bind the OTP to a reactive form.

```angular-ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-form',
  imports: [...ZardInputOtpImports, ...ZardFieldImports, ZardButtonComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="w-2/3 space-y-6">
      <div z-field>
        <label z-field-label for="pin">One-Time Password</label>
        <z-input-otp id="pin" [zMaxLength]="6" formControlName="pin">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp>
        <p z-field-description>Please enter the one-time password sent to your phone.</p>
        @if (form.controls.pin.touched && form.controls.pin.hasError('required')) {
          <z-field-error>Your one-time password is required.</z-field-error>
        }
        @if (form.controls.pin.touched && form.controls.pin.hasError('minlength')) {
          <z-field-error>Your one-time password must be 6 characters.</z-field-error>
        }
      </div>

      <button z-button type="submit" [disabled]="form.invalid">Submit</button>

      @if (submitted) {
        <p class="text-muted-foreground text-sm">Submitted: {{ submitted }}</p>
      }
    </form>
  `,
})
export class ZardDemoInputOtpFormComponent {
  submitted = '';

  form = new FormGroup({
    pin: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.submitted = this.form.value.pin ?? '';
    }
  }
}
```

### Signal

Use `InputOtpSignal` with `[formField]` to bind the OTP to a signal form from `@angular/forms/signals`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormField, form, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-signal',
  imports: [...ZardInputOtpImports, ...ZardFieldImports, ZardButtonComponent, FormField],
  template: `
    <form (submit)="onSubmit($event)" class="w-2/3 space-y-4">
      <div z-field>
        <label z-field-label for="otp-signal">One-Time Password</label>
        <z-input-otp-signal id="otp-signal" [formField]="otpForm.pin">
          <z-input-otp-group>
            <z-input-otp-slot [zIndex]="0" />
            <z-input-otp-slot [zIndex]="1" />
            <z-input-otp-slot [zIndex]="2" />
            <z-input-otp-slot [zIndex]="3" />
            <z-input-otp-slot [zIndex]="4" />
            <z-input-otp-slot [zIndex]="5" />
          </z-input-otp-group>
        </z-input-otp-signal>
        <p z-field-description>Current value: {{ otpForm().value().pin }}</p>
      </div>

      <button z-button type="submit" [disabled]="otpForm().invalid()">Verify</button>

      @if (submitted()) {
        <p class="text-muted-foreground text-sm">Submitted: {{ submitted() }}</p>
      }
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputOtpSignalComponent {
  private readonly otpModel = signal({ pin: '' });

  protected readonly submitted = signal('');

  protected readonly otpForm = form(this.otpModel, otp => {
    required(otp.pin);
    minLength(otp.pin, 6);
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    await submit(this.otpForm, async f => {
      this.submitted.set(f().value().pin);
    });
  }
}
```

## API Reference

### z-input-otp, [z-input-otp]

Container for a one-time password input. Renders its own slots when none are projected and integrates with Angular forms through ControlValueAccessor.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zMaxLength]` | Maximum number of characters. Falls back to the projected slot count, or 6 when there are none | `number` | `undefined` |
| `[zPattern]` | Per-character regex pattern used to validate typed and pasted input | `string` | `'[0-9]'` |
| `[zReadonly]` | Makes every slot readonly | `boolean` | `false` |
| `[zIntegerOnly]` | Sets inputmode to numeric and restricts keyboard input to digits | `boolean` | `true` |
| `[zSize]` | Size variant; cascades to projected slots and separators | `'sm' \| 'default' \| 'lg'` | `'default'` |
| `(zValueChange)` | Emitted whenever the value changes | `string` | `-` |
| `(zComplete)` | Emitted when every slot is filled | `string` | `-` |

### z-input-otp-signal, [z-input-otp-signal]

Drop-in alternative to z-input-otp that implements the signal forms FormValueControl<string> contract. Use it when binding through [formField] from '@angular/forms/signals'. Inherits every input and output from z-input-otp.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[(value)]` | Current value; two-way bound by [formField] | `string` | `''` |
| `[(disabled)]` | Disabled state; two-way bound by [formField] and mirrors the field's disabled state | `boolean` | `false` |

### z-input-otp-slot, [z-input-otp-slot]

Individual character slot. Displays the character, the active state, and the blinking fake caret while focused.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zIndex]` | Zero-based position of the slot | `number` | `required` |

### z-input-otp-group, [z-input-otp-group]

Groups slots together so they render as a single connected block.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-input-otp-separator, [z-input-otp-separator]

Visual separator rendered between slot groups. Marked aria-hidden.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/input-otp)
