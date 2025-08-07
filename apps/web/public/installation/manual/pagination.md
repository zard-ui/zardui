### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">pagination.component.ts

```angular-ts showLineNumbers
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, output, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassValue } from 'clsx';

import { paginationBasicVariants, paginationButtonVariants, paginationContentVariants, paginationEllipsisVariants, paginationItemVariants, paginationLinkVariants, paginationNextVariants, paginationPreviousVariants, paginationVariants, ZardPaginationButtonVariants, ZardPaginationLinkVariants, } from './pagination.variants';
import { mergeClasses } from '../../shared/utils/utils';


@Component({
  selector: 'z-pagination-basic',
  exportAs: 'zPaginationBasic',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav aria-label="pagination-basic" role="navigation" data-slot="pagination-basic" [class]="classes()">
      <ng-content></ng-content>
    </nav>
  `,
})
export class ZardPaginationBasicComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationBasicVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-content',
  exportAs: 'zPaginationContent',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul data-slot="pagination-content" [class]="classes()">
      <ng-content></ng-content>
    </ul>
  `,
})
export class ZardPaginationContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationContentVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-item',
  exportAs: 'zPaginationItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <li data-slot="pagination-item" [class]="classes()">
      <ng-content></ng-content>
    </li>
  `,
})
export class ZardPaginationItemComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationItemVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-button',
  exportAs: 'zPaginationButton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <button
      data-slot="pagination-button"
      [attr.aria-disabled]="zDisabled() || null"
      [attr.data-disabled]="zDisabled() || null"
      [attr.aria-current]="zActive() ? 'page' : undefined"
      [attr.data-active]="zActive() || null"
      [class]="classes()"
      (click)="handleClick()"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ZardPaginationButtonComponent {
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zActive = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardPaginationButtonVariants['zSize']>('icon');

  readonly class = input<ClassValue>('');

  readonly zClick = output<void>();

  private readonly zType = computed<ZardPaginationButtonVariants['zType']>(() => (this.zActive() ? 'outline' : 'ghost'));

  protected readonly classes = computed(() => mergeClasses(paginationButtonVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()));

  handleClick() {
    if (this.zDisabled() || this.zActive()) return;
    this.zClick.emit();
  }
}

@Component({
  selector: 'z-pagination-link',
  exportAs: 'zPaginationLink',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink],
  template: `
    <a [attr.aria-current]="zActive() ? 'page' : undefined" data-slot="pagination-link" [attr.data-active]="zActive() || null" [routerLink]="zLink()" [class]="classes()">
      <ng-content></ng-content>
    </a>
  `,
})
export class ZardPaginationLinkComponent {
  readonly zLink = input<string>('/');
  readonly zActive = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardPaginationLinkVariants['zSize']>('icon');

  readonly class = input<ClassValue>('');

  private readonly zType = computed<ZardPaginationLinkVariants['zType']>(() => (this.zActive() ? 'outline' : 'ghost'));

  protected readonly classes = computed(() => mergeClasses(paginationLinkVariants({ zType: this.zType(), zSize: this.zSize() }), this.class()));
}

@Component({
  selector: 'z-pagination-previous',
  exportAs: 'zPaginationPrevious',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardPaginationLinkComponent],
  template: `
    <z-pagination-link aria-label="Go to previous page" [zLink]="zLink()" [zSize]="'md'" [class]="classes()">
      <div class="icon-chevron-left"></div>
      <span class="hidden sm:block">Previous</span>
    </z-pagination-link>
  `,
})
export class ZardPaginationPreviousComponent {
  readonly zLink = input<string>('/');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationPreviousVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-next',
  exportAs: 'zPaginationNext',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardPaginationLinkComponent],
  template: `
    <z-pagination-link [zLink]="zLink()" [zSize]="'md'" aria-label="Go to next page" [class]="classes()">
      <span class="hidden sm:block">Next</span>
      <div class="icon-chevron-right"></div>
    </z-pagination-link>
  `,
})
export class ZardPaginationNextComponent {
  readonly zLink = input<string>('/');

  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationNextVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-ellipsis',
  exportAs: 'zPaginationEllipsis',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span aria-hidden="true" role="presentation" data-slot="pagination-ellipsis" class="icon-ellipsis"></span>
    <span class="sr-only">More pages</span>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardPaginationEllipsisComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationEllipsisVariants(), this.class()));
}

@Component({
 selector: 'z-pagination',
  exportAs: 'zPagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ ZardPaginationBasicComponent,
    ZardPaginationContentComponent,
    ZardPaginationItemComponent,
    ZardPaginationButtonComponent
  ],
  template: `
    <z-pagination-basic>
      <z-pagination-content>
        <z-pagination-item>
          <z-pagination-button
            aria-label="Go to previous page"
            [zSize]="zSize()"
            [zDisabled]="zPageIndex() === 1"
            (zClick)="goToPage(zPageIndex() - 1)"
          >
            <div class="icon-chevron-left"></div>
          </z-pagination-button>
        </z-pagination-item>
        @for(page of visiblePages(); track page) {
          <z-pagination-item>
          <z-pagination-button
            [zSize]="zSize()"
            [zActive]="page === zPageIndex()"
            (zClick)="goToPage(page)"
          >
            {{ page }}
          </z-pagination-button>
        </z-pagination-item>
        }
        <z-pagination-item>
          <z-pagination-button
            aria-label="Go to next page"
            [zSize]="zSize()"
            [zDisabled]="zPageIndex() === zTotal()"
            (zClick)="goToPage(zPageIndex() + 1)"
          >
            <div class="icon-chevron-right"></div>
          </z-pagination-button>
        </z-pagination-item>
      </z-pagination-content>
    </z-pagination-basic>
  `,
   host: {
    '[class]': 'classes()',
   },
})
export class ZardPaginationComponent {
  readonly zPageIndex = input<number>(1);
  readonly zTotal = input<number>(1);
  readonly zSize = input<ZardPaginationButtonVariants['zSize']>('icon');

  readonly class = input<ClassValue>('');

  readonly zPageChange = output<number>();

  protected readonly classes = computed(() => mergeClasses(paginationVariants(), this.class()));

  readonly visiblePages = computed<number[]>(() => {
    const length = Math.max(0, this.zTotal());
    return Array.from({ length }, (_, i) => 1 + i);
  });

  goToPage(page: number): void {
    const current = this.zPageIndex();
    const total = this.zTotal();

    if (page !== current && page >= 1 && page <= total) {
      this.zPageChange.emit(page);
    }
  }
}

```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">pagination.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';


export const paginationBasicVariants = cva('mx-auto flex w-full justify-center');
export type ZardPaginationBasicVariants = VariantProps<typeof paginationBasicVariants>;

export const paginationContentVariants = cva('flex flex-row items-center gap-1');
export type ZardPaginationContentVariants = VariantProps<typeof paginationContentVariants>;

export const paginationItemVariants = cva('');
export type ZardPaginationItemVariants = VariantProps<typeof paginationItemVariants>;

export const paginationButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&>div[class^=icon-]]:pointer-events-none [&>div[class^=icon-]]:shrink-0 [&>div[class^=icon-]:not([class*="text-"])]:!text-base focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      zType: {
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      zSize: {
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>div[class^=icon-]]:px-2.5',
        md: 'h-9 px-4 py-2 has-[>div[class^=icon-]]:px-3',
        lg: 'h-10 rounded-md px-6 has-[>div[class^=icon-]]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      zType: 'ghost',
      zSize: 'md',
    },
  },
);
export type ZardPaginationButtonVariants = VariantProps<typeof paginationButtonVariants>;

export const paginationLinkVariants = cva(
  'inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&>div[class^=icon-]]:pointer-events-none [&>div[class^=icon-]]:shrink-0 [&>div[class^=icon-]:not([class*="text-"])]:!text-base focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      zType: {
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      zSize: {
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>div[class^=icon-]]:px-2.5',
        md: 'h-9 px-4 py-2 has-[>div[class^=icon-]]:px-3',
        lg: 'h-10 rounded-md px-6 has-[>div[class^=icon-]]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      zType: 'ghost',
      zSize: 'md',
    },
  },
);
export type ZardPaginationLinkVariants = VariantProps<typeof paginationLinkVariants>;

export const paginationPreviousVariants = cva('gap-1 px-2.5 sm:pl-2.5');
export type ZardPaginationPreviousVariants = VariantProps<typeof paginationPreviousVariants>;

export const paginationNextVariants = cva('gap-1 px-2.5 sm:pr-2.5');
export type ZardPaginationNextVariants = VariantProps<typeof paginationNextVariants>;

export const paginationEllipsisVariants = cva('flex size-9 items-center justify-center');
export type ZardPaginationEllipsisVariants = VariantProps<typeof paginationEllipsisVariants>;

export const paginationVariants = cva('mx-auto flex w-full justify-center');
export type ZardPaginationVariants = VariantProps<typeof paginationVariants>;


```
