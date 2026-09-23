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
  ViewEncapsulation,
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
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': '"input-otp-slot"',
    class: 'relative',
  },
  exportAs: 'zInputOtpSlot',
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
