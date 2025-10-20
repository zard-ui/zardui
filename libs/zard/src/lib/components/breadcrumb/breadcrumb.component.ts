import { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, input, signal, TemplateRef, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
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
  imports: [ZardStringTemplateOutletDirective],
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
      <li aria-hidden="true" role="presentation" [class]="separatorClasses()">
        @if (isTemplate(separator())) {
          <ng-container *zStringTemplateOutlet="separator()"></ng-container>
        } @else if (separator()) {
          {{ separator() }}
        } @else {
          <div class="icon-chevron-right"></div>
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
