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
