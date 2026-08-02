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
  booleanAttribute,
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
      [attr.aria-invalid]="invalid() ? 'true' : null"
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
  readonly zInvalid = input(false, { transform: booleanAttribute });
  readonly class = input<ClassValue>('');

  /** A slot is invalid when marked directly or when the whole input is. */
  readonly invalid = computed(() => this.zInvalid() || (this.inputOtp?.zInvalid() ?? false));

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
/** Ready-made `zPattern` values, mirroring the ones shipped by the `input-otp` library. */
export const REGEXP_ONLY_DIGITS = '[0-9]';
export const REGEXP_ONLY_CHARS = '[a-zA-Z]';
export const REGEXP_ONLY_DIGITS_AND_CHARS = '[a-zA-Z0-9]';

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

### Pattern

Use `zPattern` to restrict the characters a slot accepts.

```angular-ts
import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@/shared/components/input-otp/input-otp.utils';

<z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS_AND_CHARS" [zIntegerOnly]="false">
  ...
</z-input-otp>
```

```angular-ts
import { Component } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS } from '@/shared/components/input-otp/input-otp.utils';

@Component({
  selector: 'z-demo-input-otp-pattern',
  imports: [ZardInputOtpImports, ZardFieldImports],
  template: `
    <div z-field class="w-fit">
      <label z-field-label for="digits-only">Digits Only</label>
      <z-input-otp id="digits-only" [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS">
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
  `,
})
export class ZardDemoInputOtpPatternComponent {
  readonly REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
}
```

### Separator

Use `InputOtpSeparator` between groups to split the slots into smaller blocks.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-separator',
  imports: [ZardInputOtpImports],
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

Bind the value with `ngModel` to read and write it from the parent component.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-controlled',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <div class="space-y-2">
      <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
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
          Enter your one-time password.
        } @else {
          You entered: {{ value }}
        }
      </div>
    </div>
  `,
})
export class ZardDemoInputOtpControlledComponent {
  value = '';
}
```

### Disabled

Use the `disabled` binding to disable every slot at once.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-disabled',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <z-input-otp id="disabled" [zMaxLength]="6" [(ngModel)]="value" [disabled]="true">
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
})
export class ZardDemoInputOtpDisabledComponent {
  value = '123456';
}
```

### Invalid

Use `zInvalid` on a slot — or on the whole `InputOtp` — to mark the value as invalid.

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

@Component({
  selector: 'z-demo-input-otp-invalid',
  imports: [ZardInputOtpImports, FormsModule],
  template: `
    <z-input-otp [zMaxLength]="6" [(ngModel)]="value">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" zInvalid />
        <z-input-otp-slot [zIndex]="1" zInvalid />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="2" zInvalid />
        <z-input-otp-slot [zIndex]="3" zInvalid />
      </z-input-otp-group>
      <z-input-otp-separator />
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="4" zInvalid />
        <z-input-otp-slot [zIndex]="5" zInvalid />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ZardDemoInputOtpInvalidComponent {
  value = '000000';
}
```

### Four digits

Use `zMaxLength` to change how many slots the input holds.

```angular-ts
import { Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS } from '@/shared/components/input-otp/input-otp.utils';

@Component({
  selector: 'z-demo-input-otp-four-digits',
  imports: [ZardInputOtpImports],
  template: `
    <z-input-otp [zMaxLength]="4" [zPattern]="REGEXP_ONLY_DIGITS">
      <z-input-otp-group>
        <z-input-otp-slot [zIndex]="0" />
        <z-input-otp-slot [zIndex]="1" />
        <z-input-otp-slot [zIndex]="2" />
        <z-input-otp-slot [zIndex]="3" />
      </z-input-otp-group>
    </z-input-otp>
  `,
})
export class ZardDemoInputOtpFourDigitsComponent {
  readonly REGEXP_ONLY_DIGITS = REGEXP_ONLY_DIGITS;
}
```

### Alphanumeric

Pair `REGEXP_ONLY_DIGITS_AND_CHARS` with `[zIntegerOnly]="false"` to accept letters too.

```angular-ts
import { Component } from '@angular/core';

import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from '@/shared/components/input-otp/input-otp.utils';

@Component({
  selector: 'z-demo-input-otp-alphanumeric',
  imports: [ZardInputOtpImports],
  template: `
    <z-input-otp [zMaxLength]="6" [zPattern]="REGEXP_ONLY_DIGITS_AND_CHARS" [zIntegerOnly]="false">
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
})
export class ZardDemoInputOtpAlphanumericComponent {
  readonly REGEXP_ONLY_DIGITS_AND_CHARS = REGEXP_ONLY_DIGITS_AND_CHARS;
}
```

### Form

Use `formControlName` to bind the OTP to a reactive form.

```angular-ts
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRefreshCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputOtpImports } from '@/shared/components/input-otp/input-otp.imports';

const SLOT_CLASSES =
  '[&_[data-slot=input-otp-slot]>input]:h-12 [&_[data-slot=input-otp-slot]>input]:w-11 [&_[data-slot=input-otp-slot]>input]:text-xl';

@Component({
  selector: 'z-demo-input-otp-form',
  imports: [ZardInputOtpImports, ZardFieldImports, ZardCardImports, ZardButtonComponent, ReactiveFormsModule, NgIcon],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <z-card class="mx-auto max-w-md">
        <div z-card-header>
          <z-card-title zTitle="Verify your login" />
          <z-card-description [zDescription]="description" />
          <ng-template #description>
            Enter the verification code we sent to your email address:
            <span class="font-medium">m&#64;example.com</span>
          </ng-template>
        </div>

        <div z-card-content>
          <div z-field>
            <div class="flex items-center justify-between">
              <label z-field-label for="otp-verification">Verification code</label>
              <button z-button type="button" zType="outline" zSize="xs">
                <ng-icon name="lucideRefreshCw" />
                Resend Code
              </button>
            </div>
            <z-input-otp id="otp-verification" [zMaxLength]="6" formControlName="code">
              <z-input-otp-group [class]="slotClasses">
                <z-input-otp-slot [zIndex]="0" />
                <z-input-otp-slot [zIndex]="1" />
                <z-input-otp-slot [zIndex]="2" />
              </z-input-otp-group>
              <z-input-otp-separator class="mx-2" />
              <z-input-otp-group [class]="slotClasses">
                <z-input-otp-slot [zIndex]="3" />
                <z-input-otp-slot [zIndex]="4" />
                <z-input-otp-slot [zIndex]="5" />
              </z-input-otp-group>
            </z-input-otp>
            <p z-field-description>
              <a href="#">I no longer have access to this email address.</a>
            </p>
          </div>
        </div>

        <div z-card-footer>
          <div z-field>
            <button z-button type="submit" class="w-full" [disabled]="form.invalid">Verify</button>
            <div class="text-muted-foreground text-sm">
              Having trouble signing in?
              <a href="#" class="hover:text-primary underline underline-offset-4 transition-colors">Contact support</a>
            </div>
          </div>
        </div>
      </z-card>
    </form>
  `,
  viewProviders: [provideIcons({ lucideRefreshCw })],
})
export class ZardDemoInputOtpFormComponent {
  readonly slotClasses = SLOT_CLASSES;

  readonly form = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Verification code:', this.form.value.code);
    }
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
| `[zInvalid]` | Marks every slot as invalid; cascades to projected slots | `boolean` | `false` |
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
| `[zInvalid]` | Marks this slot as invalid; also inherited from the parent InputOtp | `boolean` | `false` |

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
