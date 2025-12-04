

```angular-ts title="pagination.component.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  paginationContentVariants,
  paginationEllipsisVariants,
  paginationNextVariants,
  paginationPreviousVariants,
  paginationVariants,
} from './pagination.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardButtonComponent } from '../button/button.component';
import { type ZardButtonSizeVariants, type ZardButtonTypeVariants } from '../button/button.variants';
import { ZardIconComponent } from '../icon/icon.component';

@Component({
  selector: 'ul[z-pagination-content]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'pagination-content',
    '[class]': 'classes()',
  },
  exportAs: 'zPaginationContent',
})
export class ZardPaginationContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationContentVariants(), this.class()));
}

@Component({
  selector: 'li[z-pagination-item]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'pagination-item',
  },
  exportAs: 'zPaginationItem',
})
export class ZardPaginationItemComponent {}
// Structural wrapper component for pagination items (<li>). No inputs required.

@Component({
  selector: 'button[z-pagination-button], a[z-pagination-button]',
  imports: [ZardButtonComponent],
  template: `
    <z-button
      [attr.data-active]="zActive() || null"
      [class]="class()"
      [zDisabled]="zDisabled()"
      [zSize]="zSize()"
      [zType]="zType()"
    >
      <ng-content />
    </z-button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'pagination-button',
  },
  exportAs: 'zPaginationButton',
})
export class ZardPaginationButtonComponent {
  readonly class = input<ClassValue>('');
  readonly zActive = input(false, { transform: booleanAttribute });
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardButtonSizeVariants>('default');

  protected readonly zType = computed<ZardButtonTypeVariants>(() => (this.zActive() ? 'outline' : 'ghost'));
}

@Component({
  selector: 'z-pagination-previous',
  imports: [ZardPaginationButtonComponent, ZardIconComponent],
  template: `
    <button
      type="button"
      z-pagination-button
      [attr.disabled]="zDisabled() ? '' : null"
      [class]="classes()"
      [zSize]="zSize()"
      [zDisabled]="zDisabled()"
    >
      <span class="sr-only">To previous page</span>
      <z-icon zType="chevron-left" aria-hidden="true" />
      <span class="hidden sm:block" aria-hidden="true">Previous</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zPaginationPrevious',
})
export class ZardPaginationPreviousComponent {
  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardButtonSizeVariants>('default');

  protected readonly classes = computed(() => mergeClasses(paginationPreviousVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-next',
  imports: [ZardPaginationButtonComponent, ZardIconComponent],
  template: `
    <button
      type="button"
      z-pagination-button
      [attr.disabled]="zDisabled() ? '' : null"
      [class]="classes()"
      [zDisabled]="zDisabled()"
      [zSize]="zSize()"
    >
      <span class="sr-only">To next page</span>
      <span class="hidden sm:block" aria-hidden="true">Next</span>
      <z-icon zType="chevron-right" aria-hidden="true" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'zPaginationNext',
})
export class ZardPaginationNextComponent {
  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zSize = input<ZardButtonSizeVariants>('default');

  protected readonly classes = computed(() => mergeClasses(paginationNextVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-ellipsis',
  imports: [ZardIconComponent],
  template: `
    <z-icon zType="ellipsis" aria-hidden="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'classes()',
    'aria-hidden': 'true',
  },
  exportAs: 'zPaginationEllipsis',
})
export class ZardPaginationEllipsisComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationEllipsisVariants(), this.class()));
}

@Component({
  selector: 'z-pagination',
  imports: [
    ZardPaginationContentComponent,
    ZardPaginationItemComponent,
    ZardPaginationButtonComponent,
    ZardPaginationPreviousComponent,
    ZardPaginationNextComponent,
    NgTemplateOutlet,
  ],
  template: `
    @if (zContent()) {
      <ng-container *ngTemplateOutlet="zContent()" />
    } @else {
      <ul z-pagination-content>
        <li z-pagination-item>
          @let pagePrevious = Math.max(1, zPageIndex() - 1);
          <z-pagination-previous
            [zSize]="zSize()"
            [zDisabled]="zDisabled() || zPageIndex() === 1"
            (click)="goToPage(pagePrevious)"
          />
        </li>

        @for (page of pages(); track page) {
          <li z-pagination-item>
            <button
              z-pagination-button
              type="button"
              class="focus-visible:rounded-md"
              [attr.aria-current]="page === zPageIndex() ? 'page' : null"
              [attr.aria-disabled]="zDisabled() || null"
              [zActive]="page === zPageIndex()"
              [zDisabled]="zDisabled()"
              [zSize]="zSize()"
              (click)="goToPage(page)"
            >
              <span class="sr-only">{{ pages().length === page ? 'To last page, page' : 'To page' }}</span>
              {{ page }}
            </button>
          </li>
        }

        <li z-pagination-item>
          @let pageNext = Math.min(zPageIndex() + 1, zTotal());
          <z-pagination-next
            [zSize]="zSize()"
            [zDisabled]="zDisabled() || zPageIndex() === zTotal()"
            (click)="goToPage(pageNext)"
          />
        </li>
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    '[attr.aria-label]': 'zAriaLabel()',
    'data-slot': 'pagination',
    '[class]': 'classes()',
  },
  exportAs: 'zPagination',
})
export class ZardPaginationComponent {
  readonly zPageIndex = model<number>(1);
  readonly zTotal = input<number>(1);
  readonly zSize = input<ZardButtonSizeVariants>('default');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zContent = input<TemplateRef<void> | undefined>();
  readonly zAriaLabel = input('Pagination');

  readonly class = input<ClassValue>('');

  readonly zPageIndexChange = output<number>();
  readonly Math = Math;

  protected readonly classes = computed(() => mergeClasses(paginationVariants(), this.class()));
  readonly pages = computed<number[]>(() => Array.from({ length: Math.max(0, this.zTotal()) }, (_, i) => i + 1));

  goToPage(page: number): void {
    if (!this.zDisabled() && page !== this.zPageIndex()) {
      this.zPageIndex.set(page);
      this.zPageIndexChange.emit(page);
    }
  }
}

```



```angular-ts title="pagination.variants.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { cva, type VariantProps } from 'class-variance-authority';

export const paginationContentVariants = cva('flex flex-row items-center gap-1');
export type ZardPaginationContentVariants = VariantProps<typeof paginationContentVariants>;

export const paginationPreviousVariants = cva('gap-1 px-2.5 sm:pl-2.5');
export type ZardPaginationPreviousVariants = VariantProps<typeof paginationPreviousVariants>;

export const paginationNextVariants = cva('gap-1 px-2.5 sm:pr-2.5');
export type ZardPaginationNextVariants = VariantProps<typeof paginationNextVariants>;

export const paginationEllipsisVariants = cva('flex size-9 items-center justify-center');
export type ZardPaginationEllipsisVariants = VariantProps<typeof paginationEllipsisVariants>;

export const paginationVariants = cva('mx-auto flex w-full justify-center');
export type ZardPaginationVariants = VariantProps<typeof paginationVariants>;

```



```angular-ts title="pagination.module.ts" expandable="true" expandableTitle="Expand" copyButton showLineNumbers
import { NgModule } from '@angular/core';

import {
  ZardPaginationButtonComponent,
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationItemComponent,
  ZardPaginationNextComponent,
  ZardPaginationPreviousComponent,
} from './pagination.component';

const components = [
  ZardPaginationContentComponent,
  ZardPaginationItemComponent,
  ZardPaginationButtonComponent,
  ZardPaginationPreviousComponent,
  ZardPaginationNextComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationComponent,
];

@NgModule({
  imports: components,
  exports: components,
})
export class ZardPaginationModule {}

```

