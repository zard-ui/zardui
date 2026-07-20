---
title: Pagination
description: Pagination with page navigation, next and previous links.
---

# Pagination

Pagination with page navigation, next and previous links.

## Installation

### CLI

```bash
npx zard-cli@latest add pagination
```

### Manual

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideEllipsis } from '@ng-icons/lucide';
import type { ClassValue } from 'clsx';

import {
  ZardButtonComponent,
  type ZardButtonSizeVariants,
  type ZardButtonTypeVariants,
} from '@/shared/components/button';
import {
  paginationContentVariants,
  paginationEllipsisVariants,
  paginationNextVariants,
  paginationPreviousVariants,
  paginationVariants,
} from '@/shared/components/pagination/pagination.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

type PaginationItemSizeType = Exclude<ZardButtonSizeVariants, 'default' | 'xs' | 'sm' | 'lg'>;
type PaginationNavSizeType = Exclude<ZardButtonSizeVariants, 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'>;

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
  readonly zSize = input<ZardButtonSizeVariants>('icon');

  protected readonly zType = computed<ZardButtonTypeVariants>(() => (this.zActive() ? 'outline' : 'ghost'));
}

@Component({
  selector: 'z-pagination-previous',
  imports: [ZardPaginationButtonComponent, NgIcon],
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
      <ng-icon name="lucideChevronLeft" aria-hidden="true" />
      <span class="hidden sm:block" aria-hidden="true">Previous</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronLeft })],
  exportAs: 'zPaginationPrevious',
})
export class ZardPaginationPreviousComponent {
  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zSize = input<PaginationNavSizeType>('default');

  protected readonly classes = computed(() => mergeClasses(paginationPreviousVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-next',
  imports: [ZardPaginationButtonComponent, NgIcon],
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
      <ng-icon name="lucideChevronRight" aria-hidden="true" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronRight })],
  exportAs: 'zPaginationNext',
})
export class ZardPaginationNextComponent {
  readonly class = input<ClassValue>('');
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zSize = input<PaginationNavSizeType>('default');

  protected readonly classes = computed(() => mergeClasses(paginationNextVariants(), this.class()));
}

@Component({
  selector: 'z-pagination-ellipsis',
  imports: [NgIcon],
  template: `
    <ng-icon name="lucideEllipsis" aria-hidden="true" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideEllipsis })],
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
        @if (!zSimple()) {
          <li z-pagination-item>
            @let pagePrevious = Math.max(1, clampedIndex() - 1);
            <z-pagination-previous
              [zSize]="navSize()"
              [zDisabled]="zDisabled() || clampedIndex() === 1"
              (click)="goToPage(pagePrevious)"
            />
          </li>
        }

        @for (page of pages(); track page) {
          <li z-pagination-item>
            <button
              z-pagination-button
              type="button"
              class="focus-visible:rounded-md"
              [attr.aria-current]="page === clampedIndex() ? 'page' : null"
              [attr.aria-disabled]="zDisabled() || null"
              [zActive]="page === clampedIndex()"
              [zDisabled]="zDisabled()"
              [zSize]="zSize()"
              (click)="goToPage(page)"
            >
              <span class="sr-only">{{ pages().length === page ? 'To last page, page' : 'To page' }}</span>
              {{ page }}
            </button>
          </li>
        }

        @if (!zSimple()) {
          <li z-pagination-item>
            @let pageNext = Math.min(clampedIndex() + 1, zTotal());
            <z-pagination-next
              [zSize]="navSize()"
              [zDisabled]="zDisabled() || clampedIndex() === zTotal()"
              (click)="goToPage(pageNext)"
            />
          </li>
        }
      </ul>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    'data-slot': 'pagination',
    '[attr.aria-label]': 'zAriaLabel()',
    '[class]': 'classes()',
  },
  exportAs: 'zPagination',
})
export class ZardPaginationComponent {
  readonly zAriaLabel = input('Pagination');
  readonly zContent = input<TemplateRef<void> | undefined>();
  readonly zDisabled = input(false, { transform: booleanAttribute });
  readonly zPageIndex = model<number>(1);
  readonly zSimple = input(false, { transform: booleanAttribute });
  readonly zSize = input<PaginationItemSizeType>('icon');
  readonly zTotal = input<number>(1);

  readonly class = input<ClassValue>('');

  readonly Math = Math;

  protected readonly classes = computed(() => mergeClasses(paginationVariants(), this.class()));
  readonly pages = computed<number[]>(() => Array.from({ length: Math.max(0, this.zTotal()) }, (_, i) => i + 1));
  readonly navSize = computed(() => {
    const size = this.zSize();
    switch (size) {
      case 'icon-xs':
        return 'xs';
      case 'icon-sm':
        return 'sm';
      case 'icon-lg':
        return 'lg';
      default:
        return 'default';
    }
  });

  readonly clampedIndex = computed(() => {
    const total = Math.max(1, this.zTotal());
    return Math.min(Math.max(1, this.zPageIndex()), total);
  });

  goToPage(page: number): void {
    const max = Math.max(1, this.zTotal());
    if (!this.zDisabled() && page >= 1 && page <= max && page !== this.zPageIndex()) {
      this.zPageIndex.set(page);
    }
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const paginationContentVariants = cva('flex items-center gap-0.5');

export const paginationPreviousVariants = cva('pl-1.5!');

export const paginationNextVariants = cva('pr-1.5!');

export const paginationEllipsisVariants = cva(
  'flex size-8 items-center justify-center [&_svg:not([class*="size-"])]:size-4',
);

export const paginationVariants = cva('mx-auto flex w-full justify-center');
```

```angular-ts
export * from '@/shared/components/pagination/pagination.component';
export * from '@/shared/components/pagination/pagination.imports';
export * from '@/shared/components/pagination/pagination.variants';
```

```angular-ts
import {
  ZardPaginationButtonComponent,
  ZardPaginationComponent,
  ZardPaginationContentComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationItemComponent,
  ZardPaginationNextComponent,
  ZardPaginationPreviousComponent,
} from '@/shared/components/pagination/pagination.component';

export const ZardPaginationImports = [
  ZardPaginationContentComponent,
  ZardPaginationItemComponent,
  ZardPaginationButtonComponent,
  ZardPaginationPreviousComponent,
  ZardPaginationNextComponent,
  ZardPaginationEllipsisComponent,
  ZardPaginationComponent,
] as const;
```

## Usage

```angular-ts
import { ZardPaginationImports } from '@/shared/components/pagination/pagination.imports';
```

```angular-html
<z-pagination [zTotal]="100" [zPageSize]="10"></z-pagination>
```

## Examples

### Simple

A simple pagination with only page numbers.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardPaginationImports } from '../pagination.imports';

@Component({
  selector: 'z-demo-pagination-simple',
  imports: [ZardPaginationImports],
  template: `
    <z-pagination [zTotal]="5" [(zPageIndex)]="currentPage" zSimple />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPaginationSimpleComponent {
  protected currentPage = 2;
}
```

### Icons Only

Use just the previous and next buttons without page numbers. This is useful for data tables with a rows per page selector.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { ZardSelectImports } from '@/shared/components/select';

@Component({
  selector: 'z-demo-pagination-iconsonly',
  imports: [ZardPaginationImports, ZardFieldImports, ZardSelectImports],
  template: `
    <div class="flex w-full justify-around">
      <div class="flex w-fit gap-4">
        <div z-field class="flex-row items-center">
          <label z-field-label for="select-rows-per-page" class="min-w-max">Rows Per Page</label>
          <z-select id="select-rows-per-page" zSize="sm" [(zValue)]="perPage" class="min-w-20">
            <z-select-item zValue="10">10</z-select-item>
            <z-select-item zValue="25">25</z-select-item>
            <z-select-item zValue="50">50</z-select-item>
            <z-select-item zValue="100">100</z-select-item>
          </z-select>
        </div>
        <z-pagination [zTotal]="totalPages()" [(zPageIndex)]="currentPage" [zContent]="content" />
      </div>
    </div>

    <ng-template #content>
      <ul z-pagination-content>
        <li z-pagination-item>
          <z-pagination-previous (click)="goToPrevious()" [zDisabled]="currentPage() === 1" />
        </li>

        <li z-pagination-item>
          <z-pagination-next (click)="goToNext()" [zDisabled]="currentPage() === totalPages()" />
        </li>
      </ul>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPaginationIconsOnlyComponent {
  private totalItems = 350;

  readonly currentPage = signal(1);
  readonly perPage = signal('25');
  readonly totalPages = computed(() => Math.ceil(this.totalItems / parseInt(this.perPage())));

  goToPrevious() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToNext() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
}
```

## API Reference

### z-pagination

Pagination component with previous, next, and numbered page navigation. Supports two-way binding via [(zPageIndex)] model signal.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zAriaLabel]` | Use a unique, descriptive ARIA label for the element. | `string` | `Pagination` |
| `[zContent]` | Custom pagination structure | `TemplateRef<void> \| undefined` | `undefined` |
| `[zDisabled]` | Disables pagination interaction | `boolean` | `false` |
| `[(zPageIndex)]` | Current page index | `number` | `1` |
| `[zSimple]` | A simple pagination with only page numbers. | `boolean` | `false` |
| `[zSize]` | Button size | `'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'icon'` |
| `[zTotal]` | Total number of pages | `number` | `1` |

### ul[z-pagination-content]

Container (unordered list) for pagination content (buttons and ellipsis).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |

### li[z-pagination-item]

Wraps a pagination button or ellipsis as li element of container.

### button[z-pagination-button], a[z-pagination-button]

Pagination button with support for active and disabled states.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zActive]` | Whether the button is currently active | `boolean` | `false` |
| `[zDisabled]` | Whether the button is disabled | `boolean` | `false` |
| `[zSize]` | Button size | `'icon' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'icon'` |

### z-pagination-previous

Button to navigate to the previous page.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zDisabled]` | Whether the button is disabled | `boolean` | `false` |
| `[zSize]` | Button size | `'default' \| 'xs' \| 'sm' \| 'lg'` | `'default'` |

### z-pagination-next

Button to navigate to the next page.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |
| `[zDisabled]` | Whether the button is disabled | `boolean` | `false` |
| `[zSize]` | Button size | `'default' \| 'xs' \| 'sm' \| 'lg'` | `'default'` |

### z-pagination-ellipsis

Visual ellipsis ("...") for omitted pages.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `string` | `''` |

---

[Open in browser](https://zardui.com/docs/components/pagination)
