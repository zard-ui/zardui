import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';

import { type ClassValue } from 'clsx';

import {
  buttonGroupDividerVariants,
  buttonGroupTextVariants,
  buttonGroupVariants,
  type ZardButtonGroupVariants,
} from './button-group.variants';
import { ZardDividerComponent } from '../divider/divider.component';
import { type ZardDividerVariants } from '../divider/divider.variants';

import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-button-group',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'group',
    '[class]': 'classes()',
    '[attr.aria-orientation]': 'zOrientation()',
  },
  exportAs: 'zButtonGroup',
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
  imports: [ZardDividerComponent],
  template: `
    <z-divider [class]="classes()" zSpacing="none" aria-hidden="true" [zOrientation]="orientation()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'contents',
  },
  exportAs: 'zButtonGroupDivider',
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
  host: {
    '[class]': 'classes()',
  },
  exportAs: 'zButtonGroupText',
})
export class ZardButtonGroupTextDirective {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(buttonGroupTextVariants(), this.class()));
}
