

```angular-ts title="icon.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DOCUMENT,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { iconVariants, type ZardIconSizeVariants } from './icon.variants';
import { ZARD_ICONS, type ZardIcon } from '../../core/icons-registry';

/**
 * @deprecated Use `NgIcon` from `@ng-icons/core` directly with `provideIcons`.
 * @example
 * ```ts
 * import { NgIcon, provideIcons } from '@ng-icons/core';
 * import { zardChevronDownIcon } from '@/shared/core';
 *
 * @Component({
 *   imports: [NgIcon],
 *   template: `<ng-icon name="chevronDown" />`,
 *   viewProviders: [provideIcons({ chevronDown: zardChevronDownIcon })]
 * })
 * ```
 */
@Component({
  selector: 'z-icon, [z-icon]',
  imports: [NgIcon],
  template: `
    <ng-icon [svg]="icon()" [size]="size()" [strokeWidth]="zStrokeWidth()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardIconComponent {
  private readonly document = inject(DOCUMENT);

  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconSizeVariants>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(iconVariants({ zSize: this.zSize() }), this.class(), this.zStrokeWidth() === 0 ? 'stroke-none' : ''),
  );

  protected readonly icon = computed(() => ZARD_ICONS[this.zType()]);

  protected readonly size = computed(() => this.extractSizeFromClass());

  private extractSizeFromClass() {
    const classes = this.classes().split(' ');

    for (const cls of classes) {
      if (cls.startsWith('size-')) {
        return this.tailwindSizeToPx(cls.split('-')[1]);
      }
    }

    return '14';
  }

  private tailwindSizeToPx(size: string | number): string {
    const sizeNum = typeof size === 'number' ? size : parseFloat(size);
    const unit = this.getBaseFontSize() / 4;
    const px = sizeNum * unit;

    return `${px}`;
  }

  private getBaseFontSize(): number {
    if (!this.document.defaultView) {
      return 16;
    }
    const rootSize = this.document.defaultView.getComputedStyle(this.document.documentElement).fontSize;
    return parseFloat(rootSize) || 16;
  }
}

```



```angular-ts title="icon.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const iconVariants = cva('flex items-center justify-center', {
  variants: {
    zSize: {
      sm: 'size-3',
      default: 'size-3.5',
      lg: 'size-4',
      xl: 'size-5',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardIconSizeVariants = NonNullable<VariantProps<typeof iconVariants>['zSize']>;

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './icon.component';
export * from '../../core/icons-registry';
export * from './icon.variants';

```

