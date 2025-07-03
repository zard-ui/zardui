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
