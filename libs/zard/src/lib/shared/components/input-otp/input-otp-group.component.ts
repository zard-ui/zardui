import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

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
  encapsulation: ViewEncapsulation.None,
  host: {
    '[attr.data-slot]': '"input-otp-group"',
    '[attr.data-input-otp-group]': '""',
  },
  exportAs: 'zInputOtpGroup',
})
export class ZardInputOtpGroupComponent {
  readonly class = input<ClassValue>('');

  readonly classes = computed(() => mergeClasses(inputOtpGroupVariants(), this.class()));
}
