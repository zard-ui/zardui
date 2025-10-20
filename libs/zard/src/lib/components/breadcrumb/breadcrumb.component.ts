import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { mergeClasses } from '../../shared/utils/utils';
import {
  breadcrumbEllipsisVariants,
  breadcrumbItemVariants,
  breadcrumbListVariants,
  breadcrumbSeparatorVariants,
  breadcrumbVariants,
  ZardBreadcrumbEllipsisVariants,
  ZardBreadcrumbSeparatorVariants,
  ZardBreadcrumbVariants,
} from './breadcrumb.variants';

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

  readonly class = input<ClassValue>('');

  protected readonly navClasses = computed(() => mergeClasses(breadcrumbVariants({ zSize: this.zSize() }), this.class()));
  protected readonly listClasses = computed(() => breadcrumbListVariants({ zAlign: this.zAlign(), zWrap: this.zWrap() }));
}

@Component({
  selector: 'z-breadcrumb-item',
  exportAs: 'zBreadcrumbItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: ['routerLink', 'queryParams', 'fragment', 'queryParamsHandling', 'state', 'relativeTo', 'preserveFragment', 'skipLocationChange', 'replaceUrl'],
    },
  ],
  host: {
    '[class]': 'classes()',
  },
  template: `<ng-content></ng-content>`,
})
export class ZardBreadcrumbItemComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(breadcrumbItemVariants(), this.class()));
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
