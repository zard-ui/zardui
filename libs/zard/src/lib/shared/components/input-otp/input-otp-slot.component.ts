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
