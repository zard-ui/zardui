

```angular-ts title="breadcrumb.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import type { ClassValue } from 'clsx';

import {
  breadcrumbEllipsisVariants,
  breadcrumbItemVariants,
  breadcrumbListVariants,
  breadcrumbVariants,
  ZardBreadcrumbAlignVariants,
  ZardBreadcrumbEllipsisColorVariants,
  ZardBreadcrumbSizeVariants,
  ZardBreadcrumbWrapVariants,
} from './breadcrumb.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'z-breadcrumb-ellipsis, [z-breadcrumb-ellipsis]',
  exportAs: 'zBreadcrumbEllipsis',
  imports: [ZardIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <z-icon zType="ellipsis" /> `,
  host: {
    '[class]': 'classes()',
    'aria-hidden': 'true',
    role: 'presentation',
  },
})
export class ZardBreadcrumbEllipsisComponent {
  readonly zColor = input<ZardBreadcrumbEllipsisColorVariants>('muted');

  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() =>
    mergeClasses(breadcrumbEllipsisVariants({ zColor: this.zColor() }), this.class()),
  );
}

@Component({
  selector: 'z-breadcrumb-item, [z-breadcrumb-item]',
  exportAs: 'zBreadcrumbItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardStringTemplateOutletDirective, ZardIconComponent, RouterLink],
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [
        'routerLink',
        'queryParams',
        'fragment',
        'queryParamsHandling',
        'state',
        'relativeTo',
        'preserveFragment',
        'skipLocationChange',
        'replaceUrl',
      ],
    },
  ],
  template: `
    <ng-template #itemContent><ng-content /></ng-template>

    <li [class]="classes()">
      @if (isEllipsis()) {
        <ng-container *zStringTemplateOutlet="itemContent" />
      } @else {
        <a
          class="flex items-center gap-1.5"
          [routerLink]="routerLink()"
          [queryParams]="queryParams()"
          [fragment]="fragment()"
        >
          <ng-container *zStringTemplateOutlet="itemContent" />
        </a>
      }
    </li>

    @if (!isLast()) {
      <li aria-hidden="true" role="presentation" [class]="separatorClasses()" (click)="$event.stopPropagation()">
        @if (isTemplate(separator())) {
          <ng-container *zStringTemplateOutlet="separator()" />
        } @else if (separator()) {
          {{ separator() }}
        } @else {
          <z-icon zType="chevron-right" />
        }
      </li>
    }
  `,
  host: {
    class: 'inline-flex items-center gap-1.5',
  },
})
export class ZardBreadcrumbItemComponent {
  private readonly breadcrumbComponent = inject(ZardBreadcrumbComponent);

  private readonly content = contentChild(ZardBreadcrumbEllipsisComponent);
  /*
    These three inputs are affecting the link so we need them for anchor link.
    They are not part of component API in any sense as that is done through
    host directive.
  */
  readonly routerLink = input<string[]>([]);
  readonly queryParams = input<Params | null | undefined>();
  readonly fragment = input<string | undefined>();

  readonly class = input<ClassValue>('');

  protected readonly separator = computed(() => this.breadcrumbComponent.zSeparator());
  protected readonly isLast = computed<boolean>(() => this === this.breadcrumbComponent.items().at(-1));
  protected readonly isEllipsis = computed<boolean>(() => this.content() !== undefined);

  protected readonly classes = computed(() => mergeClasses(breadcrumbItemVariants(), this.class()));
  protected readonly separatorClasses = computed(() => 'text-muted-foreground [&_svg]:size-3.5');

  protected isTemplate(value: string | TemplateRef<void>): value is TemplateRef<void> {
    return value instanceof TemplateRef;
  }
}

@Component({
  selector: 'z-breadcrumb, [z-breadcrumb]',
  exportAs: 'zBreadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav aria-label="breadcrumb" [class]="navClasses()">
      <ol [class]="listClasses()">
        <ng-content />
      </ol>
    </nav>
  `,
})
export class ZardBreadcrumbComponent {
  readonly zSize = input<ZardBreadcrumbSizeVariants>('md');
  readonly zAlign = input<ZardBreadcrumbAlignVariants>('start');
  readonly zWrap = input<ZardBreadcrumbWrapVariants>('wrap');
  readonly zSeparator = input<string | TemplateRef<void>>('');

  readonly class = input<ClassValue>('');

  readonly items = contentChildren(ZardBreadcrumbItemComponent);

  protected readonly navClasses = computed(() =>
    mergeClasses(breadcrumbVariants({ zSize: this.zSize() }), this.class()),
  );

  protected readonly listClasses = computed(() =>
    breadcrumbListVariants({ zAlign: this.zAlign(), zWrap: this.zWrap() }),
  );
}

```



```angular-ts title="breadcrumb.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('w-full', {
  variants: {
    zSize: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    zSize: 'md',
  },
});
export type ZardBreadcrumbSizeVariants = NonNullable<VariantProps<typeof breadcrumbVariants>['zSize']>;

export const breadcrumbListVariants = cva(
  'text-muted-foreground flex flex-wrap items-center gap-1.5 wrap-break-word sm:gap-2.5',
  {
    variants: {
      zAlign: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
      zWrap: {
        wrap: 'flex-wrap',
        nowrap: 'flex-nowrap',
      },
    },
    defaultVariants: {
      zAlign: 'start',
      zWrap: 'wrap',
    },
  },
);
export type ZardBreadcrumbAlignVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zAlign']>;
export type ZardBreadcrumbWrapVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zWrap']>;

export const breadcrumbItemVariants = cva(
  'inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:text-foreground last:text-foreground last:font-normal last:pointer-events-none',
);
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbEllipsisVariants = cva('flex', {
  variants: {
    zColor: {
      muted: 'text-muted-foreground',
      strong: 'text-foreground',
    },
  },
  defaultVariants: {
    zColor: 'muted',
  },
});
export type ZardBreadcrumbEllipsisColorVariants = NonNullable<
  VariantProps<typeof breadcrumbEllipsisVariants>['zColor']
>;

```



```angular-ts title="breadcrumb.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbEllipsisComponent,
  ZardBreadcrumbItemComponent,
} from './breadcrumb.component';

const components = [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}

```

