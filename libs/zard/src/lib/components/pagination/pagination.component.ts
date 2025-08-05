import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClassValue } from 'clsx';

import {
  paginationContentVariants,
  paginationEllipsisVariants,
  paginationItemVariants,
  paginationLinkVariants,
  paginationNextVariants,
  paginationPreviousVariants,
  paginationVariants,
  ZardPaginationLinkVariants,
} from './pagination.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-pagination',
  exportAs: 'zPagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <nav aria-label="pagination" role="navigation" data-slot="pagination" [class]="classes()">
      <ng-content></ng-content>
    </nav>
  `,
})
export class ZardPaginationComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(paginationVariants(), this.class()));
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
