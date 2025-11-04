import { ChangeDetectionStrategy, Component, computed, Directive, inject, input, ViewEncapsulation } from '@angular/core';

import { type ClassValue } from 'clsx';

import { buttonGroupDividerVariants, buttonGroupTextVariants, buttonGroupVariants, type ZardButtonGroupVariants } from './button-group.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardDividerComponent } from '../divider/divider.component';
import { type ZardDividerVariants } from '../divider/divider.variants';

@Component({
  selector: 'z-button-group',
  exportAs: 'zButtonGroup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    '[class]': 'classes()',
    '[attr.aria-orientation]': 'zOrientation()',
  },
  template: `<ng-content />`,
})
export class ZardButtonGroupComponent {
  readonly zOrientation = input<Required<ZardButtonGroupVariants>['zOrientation']>('horizontal');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonGroupVariants({
        zOrientation: this.zOrientation(),
      }),
      this.class(),
    ),
  );
}

@Component({
  selector: 'z-button-group-divider',
  exportAs: 'zButtonGroupDivider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardDividerComponent],
  host: {
    class: 'contents',
  },
  template: `<z-divider [class]="classes()" zSpacing="none" [zOrientation]="orientation()" />`,
})
export class ZardButtonGroupDividerComponent {
  readonly zOrientation = input<ZardDividerVariants['zOrientation']>(null);
  readonly class = input<ClassValue>('');

  private readonly parent = inject(ZardButtonGroupComponent, {
    optional: true,
    host: true,
  });

  protected readonly orientation = computed(() => {
    if (!this.parent || typeof this.zOrientation() === 'string') {
      return this.zOrientation();
    }

    return this.parent.zOrientation() === 'vertical' ? 'horizontal' : 'vertical';
  });

  protected readonly classes = computed(() =>
    mergeClasses(
      buttonGroupDividerVariants({
        zOrientation: this.orientation(),
      }),
      this.class(),
    ),
  );
}

@Directive({
  selector: '[z-button-group-text]',
  exportAs: 'zButtonGroupText',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardButtonGroupTextDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(buttonGroupTextVariants(), this.class()));
}
