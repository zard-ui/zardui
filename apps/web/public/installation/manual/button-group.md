

```angular-ts title="button-group.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { type ClassValue } from 'clsx';

import {
  buttonGroupDividerVariants,
  buttonGroupTextVariants,
  buttonGroupVariants,
  type ZardButtonGroupVariants,
} from './button-group.variants';
import { ZardDividerComponent } from '../divider/divider.component';
import { type ZardDividerVariants } from '../divider/divider.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-button-group',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    '[class]': 'classes()',
    '[attr.aria-orientation]': 'zOrientation()',
  },
  exportAs: 'zButtonGroup',
})
export class ZardButtonGroupComponent {
  readonly zOrientation = input<Required<ZardButtonGroupVariants>['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonGroupVariants({
        zOrientation: this.zOrientation(),
      }),
      this.class(),
    ),
  );
}

@Component({
  selector: 'z-button-group-divider',
  imports: [ZardDividerComponent],
  template: `
    <z-divider [class]="classes()" zSpacing="none" aria-hidden="true" [zOrientation]="orientation()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
  },
  exportAs: 'zButtonGroupDivider',
})
export class ZardButtonGroupDividerComponent {
  readonly zOrientation = input<ZardDividerVariants['zOrientation']>(null);
  readonly class = input<ClassValue>('');

  private readonly parent = inject(ZardButtonGroupComponent, {
    optional: true,
    host: true,
  });

  protected readonly orientation = computed(() => {
    if (!this.parent || typeof this.zOrientation() === 'string') {
      return this.zOrientation();
    }

    return this.parent.zOrientation() === 'vertical' ? 'horizontal' : 'vertical';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonGroupDividerVariants({
        zOrientation: this.orientation(),
      }),
      this.class(),
    ),
  );
}

@Directive({
  selector: '[z-button-group-text]',
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zButtonGroupText',
})
export class ZardButtonGroupTextDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(buttonGroupTextVariants(), this.class()));
}

```



```angular-ts title="button-group.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonGroupVariants = cva(
  'flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative has-[>z-button-group]:gap-2',
  {
    variants: {
      zOrientation: {
        horizontal:
          '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>z-select:not(:first-child)>button]:rounded-l-none [&>z-select:not(:first-child)>button]:border-l-0 [&>*:not(:last-child)]:rounded-r-none [&>z-select:not(:last-child)>button]:rounded-r-none [&>input]:h-9 [&>input]:py-0',
        vertical:
          'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>z-select:not(:first-child)>button]:rounded-t-none [&>z-select:not(:first-child)>button]:border-t-0 [&>*:not(:last-child)]:rounded-b-none [&>z-select:not(:last-child)>button]:rounded-b-none',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);
export type ZardButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;

export const buttonGroupDividerVariants = cva(
  'bg-input relative self-stretch grow-0 shrink-0 pointer-events-none select-none',
  {
    variants: {
      zOrientation: {
        horizontal: 'w-auto',
        vertical: 'h-auto',
      },
    },
  },
);

export const buttonGroupTextVariants = cva(
  "bg-muted flex items-center gap-2 rounded-md border h-9 px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
);

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './button-group.component';
export * from './button-group.variants';

```

