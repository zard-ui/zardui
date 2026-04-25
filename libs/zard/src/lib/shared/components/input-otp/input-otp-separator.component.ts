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
