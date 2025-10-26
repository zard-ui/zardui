

```angular-ts title="breadcrumb.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, input, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { ZardIconComponent } from '../icon/icon.component';
import {
  breadcrumbEllipsisVariants,
  breadcrumbItemVariants,
  breadcrumbListVariants,
  breadcrumbVariants,
  ZardBreadcrumbEllipsisVariants,
  ZardBreadcrumbVariants,
} from './breadcrumb.variants';

@Component({
  selector: 'z-breadcrumb-item',
  exportAs: 'zBreadcrumbItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardStringTemplateOutletDirective, ZardIconComponent],
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: ['routerLink', 'queryParams', 'fragment', 'queryParamsHandling', 'state', 'relativeTo', 'preserveFragment', 'skipLocationChange', 'replaceUrl'],
    },
  ],
  template: `
    <li [class]="classes()">
      <ng-content></ng-content>
    </li>

    @if (!isLast()) {
      <li aria-hidden="true" role="presentation" [class]="separatorClasses()" (click)="$event.stopPropagation()">
        @if (isTemplate(separator())) {
          <ng-container *zStringTemplateOutlet="separator()"></ng-container>
        } @else if (separator()) {
          {{ separator() }}
        } @else {
          <z-icon zType="chevron-right"></z-icon>
        }
      </li>
    }
  `,
  host: {
    class: 'inline-flex items-center gap-1.5',
  },
})
export class ZardBreadcrumbItemComponent {
  readonly class = input<ClassValue>('');

  protected separator = signal<string | TemplateRef<void> | null>(null);
  protected isLast = signal<boolean>(false);

  protected readonly classes = computed(() => mergeClasses(breadcrumbItemVariants(), this.class()));
  protected readonly separatorClasses = computed(() => 'text-muted-foreground [&_svg]:size-3.5');

  setSeparator(separator: string | TemplateRef<void> | null): void {
    this.separator.set(separator);
  }

  setIsLast(isLast: boolean): void {
    this.isLast.set(isLast);
  }

  protected isTemplate(value: string | TemplateRef<void> | null | undefined): value is TemplateRef<void> {
    return value instanceof TemplateRef;
  }
}

@Component({
  selector: 'z-breadcrumb',
  exportAs: 'zBreadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav aria-label="breadcrumb" [class]="navClasses()">
      <ol [class]="listClasses()">
        <ng-content></ng-content>
      </ol>
    </nav>
  `,
})
export class ZardBreadcrumbComponent {
  readonly zSize = input<ZardBreadcrumbVariants['zSize']>('md');
  readonly zAlign = input<ZardBreadcrumbVariants['zAlign']>('start');
  readonly zWrap = input<ZardBreadcrumbVariants['zWrap']>('wrap');
  readonly zSeparator = input<string | TemplateRef<void> | null>(null);

  readonly class = input<ClassValue>('');

  protected readonly items = contentChildren(ZardBreadcrumbItemComponent);

  protected readonly navClasses = computed(() => mergeClasses(breadcrumbVariants({ zSize: this.zSize() }), this.class()));
  protected readonly listClasses = computed(() => breadcrumbListVariants({ zAlign: this.zAlign(), zWrap: this.zWrap() }));

  constructor() {
    effect(() => {
      const itemsList = this.items();
      const separator = this.zSeparator();

      itemsList.forEach((item, index) => {
        item.setSeparator(separator);
        item.setIsLast(index === itemsList.length - 1);
      });
    });
  }
}

@Component({
  selector: 'z-breadcrumb-ellipsis',
  exportAs: 'zBreadcrumbEllipsis',
  standalone: true,
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
  readonly zColor = input<ZardBreadcrumbEllipsisVariants['zColor']>('muted');

  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(breadcrumbEllipsisVariants({ zColor: this.zColor() }), this.class()));
}

```



```angular-ts title="breadcrumb.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('w-full', {
  variants: {
    zSize: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
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
    zSize: 'md',
    zAlign: 'start',
    zWrap: 'wrap',
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

export const breadcrumbItemVariants = cva(
  'inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:text-foreground last:text-foreground last:font-normal last:pointer-events-none',
);
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

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



```angular-ts title="breadcrumb.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import { ZardBreadcrumbComponent, ZardBreadcrumbEllipsisComponent, ZardBreadcrumbItemComponent } from './breadcrumb.component';

const components = [ZardBreadcrumbComponent, ZardBreadcrumbItemComponent, ZardBreadcrumbEllipsisComponent];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardBreadcrumbModule {}

```

