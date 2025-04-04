import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { mergeClasses } from '../../shared/utils/utils';
import { ClassValue } from 'clsx';
import { breadcrumbVariants, breadcrumbItemsVariants } from './breadcrumb.variants';

@Component({
  selector: 'z-breadcrumb',
  exportAs: 'zBreadcrumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content></ng-content>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBreadcrumbComponent {
  readonly class = input<ClassValue>('');
  zSeparator = input<string>('/');

  protected readonly classes = computed(() => mergeClasses(this.class()));
}

@Component({
  selector: 'z-breadcrumb-separator',
  exportAs: 'zBreadcrumbSeparator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span>{{ zSeparator() }}</span>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBreadcrumbSeparatorComponent {
  readonly class = input<ClassValue>('');
  zSeparator = input<string>('/');

  protected readonly classes = computed(() => mergeClasses(this.class(), breadcrumbVariants()));
}

@Component({
  selector: 'z-breadcrumb-item',
  exportAs: 'zBreadcrumbItem',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardBreadcrumbSeparatorComponent],
  template: ` <ng-content></ng-content>
    <z-breadcrumb-separator [zSeparator]="this.zBreadCrumb.zSeparator()"></z-breadcrumb-separator>`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardBreadcrumbItemComponent {
  constructor(public zBreadCrumb: ZardBreadcrumbComponent) {}

  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(this.class(), breadcrumbItemsVariants()));
}
