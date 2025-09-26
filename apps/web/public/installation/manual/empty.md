

```angular-ts title="empty.component.ts" copyButton showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';
import { NgStyle } from '@angular/common';

import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { emptyVariants, ZardEmptyVariants } from './empty.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-empty',
  exportAs: 'zEmpty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardStringTemplateOutletDirective, NgStyle],
  host: {
    '[class]': 'classes()',
  },
  template: `
    @if (zImage()) {
      @if (isTemplate(zImage())) {
        <div [ngStyle]="zImageStyle()">
          <ng-container *zStringTemplateOutlet="zImage()"></ng-container>
        </div>
      } @else {
        <img [src]="zImage()" alt="Empty" [ngStyle]="zImageStyle()" />
      }
    } @else {
      <!-- Default Illustration -->
      <div [ngStyle]="zImageStyle()">
        <svg viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse class="fill-gray-100 dark:fill-gray-800 dark:fill-opacity-10" cx="32" cy="33" rx="32" ry="7" />
            <g class="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-700" fill-rule="nonzero">
              <path class="fill-transparent" d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
              <path
                class="fill-gray-50 dark:fill-gray-800"
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
              />
            </g>
          </g>
        </svg>
      </div>
    }
    @if (zDescription()) {
      <div class="mt-2">
        @if (isTemplate(zDescription())) {
          <ng-container *zStringTemplateOutlet="zDescription()"></ng-container>
        } @else {
          <p>{{ zDescription() }}</p>
        }
      </div>
    }
  `,
})
export class ZardEmptyComponent {
  readonly zImage = input<string | TemplateRef<unknown>>();
  readonly zImageStyle = input<Record<string, string>>({});
  readonly zDescription = input<string | TemplateRef<unknown>>('No data');
  readonly zSize = input<ZardEmptyVariants['zSize']>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(emptyVariants({ zSize: this.zSize() }), this.class()));

  isTemplate(value: string | TemplateRef<unknown> | undefined): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }
}

```



```angular-ts title="empty.variants.ts" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const emptyVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    zSize: {
      default: 'text-sm [&_img]:w-40 [&_svg]:w-16 [&_svg]:h-10',
      small: 'text-xs [&_img]:w-28 [&_svg]:w-12 [&_svg]:h-8',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardEmptyVariants = VariantProps<typeof emptyVariants>;

```

