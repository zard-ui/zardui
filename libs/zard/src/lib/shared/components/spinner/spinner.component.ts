import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { spinnerVariants, type ZardSpinnerVariants } from './spinner.variants';

@Component({
  selector: 'z-spinner',
  template: `
    <div class="relative top-1/2 left-1/2 h-[inherit] w-[inherit]">
      @for (_ of bars; track $index) {
        <div
          class="animate-spinner absolute -top-[3.9%] -left-[10%] h-[8%] w-[24%] rounded-md bg-black dark:bg-white"
          [style]="{
            animationDelay: animationDelay($index),
            transform: transform($index),
          }"
        ></div>
      }
    </div>
  `,
  styles: `
    @layer utilities {
      @keyframes spinner {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0.15;
        }
      }

      .animate-spinner {
        animation: spinner 1.2s linear infinite;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zSpinner',
})
export class ZardSpinnerComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardSpinnerVariants['zSize']>('default');

  protected readonly bars = Array.from({ length: 12 });
  protected readonly animationDelay = (index: number) => `-${1.3 - index * 0.1}s`;
  protected readonly transform = (index: number) => `rotate(${30 * index}deg) translate(146%)`;

  protected readonly classes = computed(() => mergeClasses(spinnerVariants({ zSize: this.zSize() }), this.class()));
}
