import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { mergeClasses } from '../../shared/utils/utils';
import { loaderVariants, ZardLoaderVariants } from './loader.variants';

@Component({
  selector: 'z-loader',
  exportAs: 'zLoader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="relative left-1/2 top-1/2 h-[inherit] w-[inherit]">
      @for (_ of bars; track $index) {
        <div
          class="absolute -left-[10%] -top-[3.9%] h-[8%] w-[24%] animate-spinner rounded-md bg-black dark:bg-white"
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
  host: {
    '[class]': 'classes()',
  },
})
export class ZardLoaderComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardLoaderVariants['zSize']>('default');

  protected readonly bars = Array.from({ length: 12 });
  protected readonly animationDelay = (index: number) => `-${1.3 - index * 0.1}s`;
  protected readonly transform = (index: number) => `rotate(${30 * index}deg) translate(146%)`;

  protected readonly classes = computed(() => mergeClasses(loaderVariants({ zSize: this.zSize() }), this.class()));
}
