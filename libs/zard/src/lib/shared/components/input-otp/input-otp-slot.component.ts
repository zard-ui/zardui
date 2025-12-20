import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { ZardInputOtpComponent } from './input-otp.component';
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
