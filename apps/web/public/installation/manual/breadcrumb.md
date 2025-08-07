### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">breadcrumb.component.ts

```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassValue } from 'clsx';

import {
  breadcrumbVariants,
  breadcrumbListVariants,
  breadcrumbSeparatorVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbEllipsisVariants,
  breadcrumbPageVariants,
  ZardBreadcrumbVariants,
  ZardBreadcrumbListVariants,
  ZardBreadcrumbItemVariants,
  ZardBreadcrumbLinkVariants,
  ZardBreadcrumbPageVariants,
  ZardBreadcrumbSeparatorVariants,
  ZardBreadcrumbEllipsisVariants,
} from './breadcrumb.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-breadcrumb',
  exportAs: 'zBreadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav aria-label="breadcrumb" [class]="classes()">
      <ng-content></ng-content>
    </nav>
  `,
})
export class ZardBreadcrumbComponent {
  readonly zSize = input<ZardBreadcrumbVariants['zSize']>('md');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbVariants({ zSize: this.zSize() }), this.class()));
}

@Component({
  selector: 'z-breadcrumb-list',
  exportAs: 'zBreadcrumbList',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ol [class]="classes()">
      <ng-content></ng-content>
    </ol>
  `,
})
export class ZardBreadcrumbListComponent {
  readonly zAlign = input<ZardBreadcrumbListVariants['zAlign']>('start');
  readonly zWrap = input<ZardBreadcrumbListVariants['zWrap']>('wrap');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbListVariants({ zAlign: this.zAlign(), zWrap: this.zWrap() }), this.class()));
}

@Component({
  selector: 'z-breadcrumb-item',
  exportAs: 'zBreadcrumbItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li [class]="classes()">
      <ng-content></ng-content>
    </li>
  `,
})
export class ZardBreadcrumbItemComponent {
  readonly zType = input<ZardBreadcrumbItemVariants['zType']>('default');
  readonly zShape = input<ZardBreadcrumbItemVariants['zShape']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbItemVariants({ zType: this.zType(), zShape: this.zShape() }), this.class()));
}

@Component({
  selector: 'z-breadcrumb-link',
  exportAs: 'zBreadcrumbLink',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
  template: `
    <a [class]="classes()" [routerLink]="zLink()">
      <ng-content></ng-content>
    </a>
  `,
})
export class ZardBreadcrumbLinkComponent {
  readonly zLink = input<string>('/');
  readonly zType = input<ZardBreadcrumbLinkVariants['zType']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbLinkVariants({ zType: this.zType() }), this.class()));
}

@Component({
  selector: 'z-breadcrumb-page',
  exportAs: 'zBreadcrumbPage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span aria-current="page" [class]="classes()">
      <ng-content></ng-content>
    </span>
  `,
})
export class ZardBreadcrumbPageComponent {
  readonly zType = input<ZardBreadcrumbPageVariants['zType']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbPageVariants({ zType: this.zType() }), this.class()));
}

@Component({
  selector: 'z-breadcrumb-separator',
  exportAs: 'zBreadcrumbSeparator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li aria-hidden="true" role="presentation" [class]="classes()">
      <ng-content>
        <div class="icon-chevron-right"></div>
      </ng-content>
    </li>
  `,
})
export class ZardBreadcrumbSeparatorComponent {
  readonly zSeparator = input<string | TemplateRef<void> | null>('/');
  readonly zType = input<ZardBreadcrumbSeparatorVariants['zType']>('default');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbSeparatorVariants({ zType: this.zType() }), this.class()));
}

@Component({
  selector: 'z-breadcrumb-ellipsis',
  exportAs: 'zBreadcrumbEllipsis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <span aria-hidden="true" role="presentation" class="icon-ellipsis"></span> `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBreadcrumbEllipsisComponent {
  readonly zColor = input<ZardBreadcrumbEllipsisVariants['zColor']>('muted');

  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(breadcrumbEllipsisVariants({ zColor: this.zColor() }), this.class()));
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">breadcrumb.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

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
export type ZardBreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;

export const breadcrumbListVariants = cva('text-muted-foreground flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5', {
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
});
export type ZardBreadcrumbListVariants = VariantProps<typeof breadcrumbListVariants>;

export const breadcrumbItemVariants = cva('flex items-center gap-1.5 transition-colors', {
  variants: {
    zType: {
      default: '',
      muted: 'text-muted-foreground',
      bold: 'font-semibold text-foreground',
      subtle: 'text-sm text-muted-foreground hover:text-foreground',
    },
    zShape: {
      default: '',
      square: 'px-1 py-0.5 rounded-none',
      rounded: 'px-2 py-0.5 rounded-md',
    },
  },
  defaultVariants: {
    zType: 'default',
    zShape: 'default',
  },
});
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbLinkVariants = cva('flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
  variants: {
    zType: {
      default: 'hover:text-foreground',
      underline: 'underline text-foreground hover:no-underline',
      subtle: 'text-muted-foreground hover:text-foreground',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});
export type ZardBreadcrumbLinkVariants = VariantProps<typeof breadcrumbLinkVariants>;

export const breadcrumbPageVariants = cva('flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
  variants: {
    zType: {
      default: 'text-foreground',
      underline: 'underline text-foreground hover:no-underline',
      subtle: 'text-muted-foreground hover:text-foreground',
      current: 'font-semibold text-foreground cursor-default ' + 'hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});
export type ZardBreadcrumbPageVariants = VariantProps<typeof breadcrumbPageVariants>;

export const breadcrumbSeparatorVariants = cva('select-none', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      strong: 'text-foreground',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});
export type ZardBreadcrumbSeparatorVariants = VariantProps<typeof breadcrumbSeparatorVariants>;

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
export type ZardBreadcrumbEllipsisVariants = VariantProps<typeof breadcrumbEllipsisVariants>;

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">breadcrumb.module.ts

```angular-ts showLineNumbers
import { NgModule } from '@angular/core';

import {
  ZardBreadcrumbComponent,
  ZardBreadcrumbEllipsisComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbListComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
} from './breadcrumb.component';

const components = [
  ZardBreadcrumbComponent,
  ZardBreadcrumbListComponent,
  ZardBreadcrumbItemComponent,
  ZardBreadcrumbLinkComponent,
  ZardBreadcrumbPageComponent,
  ZardBreadcrumbSeparatorComponent,
  ZardBreadcrumbEllipsisComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}

```

