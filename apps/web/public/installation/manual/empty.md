

```angular-ts title="empty.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective, mergeClasses } from '@ngzard/ui/core';
import { ZardIconComponent } from '@ngzard/ui/icon';
import { type ZardIcon } from '@ngzard/ui/icon';

import {
  emptyActionsVariants,
  emptyDescriptionVariants,
  emptyHeaderVariants,
  emptyIconVariants,
  emptyImageVariants,
  emptyTitleVariants,
  emptyVariants,
} from './empty.variants';

@Component({
  selector: 'z-empty',
  imports: [ZardIconComponent, ZardStringTemplateOutletDirective],
  standalone: true,
  template: `
    @let image = zImage();
    @let icon = zIcon();
    @let title = zTitle();
    @let description = zDescription();
    @let actions = zActions();

    <div [class]="headerClasses()">
      @if (image) {
        <div [class]="imageClasses()">
          <ng-container *zStringTemplateOutlet="image">
            <img [src]="image" alt="Empty" class="mx-auto" />
          </ng-container>
        </div>
      } @else if (icon) {
        <div [class]="iconClasses()" data-testid="icon">
          <z-icon [zType]="icon" zSize="xl" />
        </div>
      }

      @if (title) {
        <div [class]="titleClasses()">
          <ng-container *zStringTemplateOutlet="title">{{ title }}</ng-container>
        </div>
      }

      @if (description) {
        <div [class]="descriptionClasses()">
          <ng-container *zStringTemplateOutlet="description">{{ description }}</ng-container>
        </div>
      }
    </div>

    @if (actions.length) {
      <div [class]="actionsClasses()">
        @for (action of actions; track $index) {
          <ng-container *zStringTemplateOutlet="action" />
        }
      </div>
    }

    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zEmpty',
})
export class ZardEmptyComponent {
  readonly zActions = input<TemplateRef<void>[]>([]);
  readonly zIcon = input<ZardIcon>();
  readonly zImage = input<string | TemplateRef<void>>();
  readonly zTitle = input<string | TemplateRef<void>>();
  readonly zDescription = input<string | TemplateRef<void>>();
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(emptyVariants(), this.class()));
  protected readonly headerClasses = computed(() => emptyHeaderVariants());
  protected readonly imageClasses = computed(() => emptyImageVariants());
  protected readonly iconClasses = computed(() => emptyIconVariants());
  protected readonly titleClasses = computed(() => emptyTitleVariants());
  protected readonly descriptionClasses = computed(() => emptyDescriptionVariants());
  protected readonly actionsClasses = computed(() => emptyActionsVariants());
}

```



```angular-ts title="empty.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva } from 'class-variance-authority';

export const emptyVariants = cva(
  'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12',
  {
    variants: {},
  },
);

export const emptyHeaderVariants = cva('flex max-w-sm flex-col items-center gap-2 text-center', {
  variants: {},
});

export const emptyImageVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {},
  },
);

export const emptyIconVariants = cva(
  `bg-muted text-foreground mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6`,
  {
    variants: {},
  },
);

export const emptyTitleVariants = cva('text-lg font-medium tracking-tight', {
  variants: {},
});

export const emptyDescriptionVariants = cva(
  'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
  {
    variants: {},
  },
);

export const emptyActionsVariants = cva(
  'flex w-full max-w-sm min-w-0 items-center justify-center gap-2 text-sm text-balance',
  {
    variants: {},
  },
);

```



```angular-ts title="index.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
export * from './empty.component';
export * from './empty.variants';

```

