import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { mergeClasses } from '../../shared/utils/utils';
import { alertDescriptionVariants, alertIconVariants, alertTitleVariants, alertVariants, ZardAlertIconVariants, ZardAlertVariants } from './alert.variants';

@Component({
  selector: 'z-alert-icon',
  exportAs: 'zAlertIcon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAlertIconComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<ZardAlertIconVariants['zSize']>('sm');
  protected readonly classes = computed(() => mergeClasses(alertIconVariants({ zSize: this.zSize() }), this.class()));
}

@Component({
  selector: 'z-alert-title',
  standalone: true,
  exportAs: 'zAlertTitle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAlertTitleComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(alertTitleVariants(), this.class()));
}

@Component({
  selector: 'z-alert-description',
  standalone: true,
  exportAs: 'zAlertDescription',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardAlertDescriptionComponent {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(alertDescriptionVariants(), this.class()));
}

@Component({
  selector: 'z-alert',
  standalone: true,
  exportAs: 'zAlert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ZardAlertIconComponent],
  template: `
    @if (zType() === 'default') {
      <ng-content select="z-alert-icon" />
    } @else {
      <z-alert-icon [class]="iconType()" zSize="sm" />
    }

    <div class="flex flex-col gap-1">
      <ng-content select="z-alert-title" />
      <ng-content select="z-alert-description" />
    </div>
  `,
  host: {
    '[class]': 'classes()',
    '[attr.data-type]': 'zType()',
    '[attr.data-appearance]': 'zAppearance()',
  },
})
export class ZardAlertComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<ZardAlertVariants['zType']>('default');
  readonly zAppearance = input<ZardAlertVariants['zAppearance']>('outline');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType(), zAppearance: this.zAppearance() }), this.class()));

  protected readonly icons: Record<NonNullable<ZardAlertVariants['zType']>, string> = {
    default: '',
    info: 'info',
    success: 'circle-check',
    warning: 'triangle-alert',
    error: 'circle-x',
  };

  protected readonly iconType = computed(() => {
    return `icon-${this.icons[this.zType() ?? 'default']}`;
  });
}
