import { ChangeDetectionStrategy, Component, computed, input, TemplateRef, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  alertDescriptionVariants,
  alertIconVariants,
  alertTitleVariants,
  alertVariants,
  type ZardAlertVariants,
} from './alert.variants';
import { mergeClasses } from '../../shared/utils/utils';
import { ZardStringTemplateOutletDirective } from '../core/directives/string-template-outlet/string-template-outlet.directive';
import { ZardIconComponent } from '../icon/icon.component';
import type { ZardIcon } from '../icon/icons';

@Component({
  selector: 'z-alert, [z-alert]',
  imports: [ZardIconComponent, ZardStringTemplateOutletDirective],
  standalone: true,
  template: `
    @if (zIcon() || iconName()) {
      <span [class]="iconClasses()" data-slot="alert-icon">
        <ng-container *zStringTemplateOutlet="zIcon()">
          <z-icon [zType]="iconName()!" />
        </ng-container>
      </span>
    }

    <div class="flex-1">
      @if (zTitle()) {
        <div [class]="titleClasses()" data-slot="alert-title">
          <ng-container *zStringTemplateOutlet="zTitle()">{{ zTitle() }}</ng-container>
        </div>
      }

      @if (zDescription()) {
        <div [class]="descriptionClasses()" data-slot="alert-description">
          <ng-container *zStringTemplateOutlet="zDescription()">{{ zDescription() }}</ng-container>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    role: 'alert',
    '[class]': 'classes()',
    '[attr.data-slot]': '"alert"',
  },
  exportAs: 'zAlert',
})
export class ZardAlertComponent {
  readonly class = input<ClassValue>('');
  readonly zTitle = input<string | TemplateRef<void>>('');
  readonly zDescription = input<string | TemplateRef<void>>('');
  readonly zIcon = input<ZardIcon | TemplateRef<void>>();
  readonly zType = input<ZardAlertVariants['zType']>('default');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType() }), this.class()));

  protected readonly iconClasses = computed(() => alertIconVariants());

  protected readonly titleClasses = computed(() => alertTitleVariants());

  protected readonly descriptionClasses = computed(() => alertDescriptionVariants({ zType: this.zType() }));

  protected readonly iconName = computed((): ZardIcon | null => {
    const customIcon = this.zIcon();
    if (customIcon && !(customIcon instanceof TemplateRef)) {
      return customIcon;
    }

    if (this.zType() === 'destructive') return 'circle-alert';

    return null;
  });
}
