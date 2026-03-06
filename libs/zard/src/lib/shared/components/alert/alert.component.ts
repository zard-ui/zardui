import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import type { ClassValue } from 'clsx';

import { ZardStringTemplateOutletDirective } from '@/shared/core/directives/string-template-outlet/string-template-outlet.directive';
import { zardCircleAlertIcon } from '@/shared/core/icons-registry';
import { mergeClasses } from '@/shared/utils/merge-classes';

import {
  alertDescriptionVariants,
  alertIconVariants,
  alertTitleVariants,
  alertVariants,
  type ZardAlertTypeVariants,
} from './alert.variants';

@Component({
  selector: 'z-alert, [z-alert]',
  imports: [NgIcon, ZardStringTemplateOutletDirective],
  template: `
    @if (shouldShowIcon()) {
      <span [class]="iconClasses()" data-slot="alert-icon">
        <ng-container *zStringTemplateOutlet="zIcon()">
          <ng-icon name="circle-alert" />
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
  viewProviders: [provideIcons({ circleAlert: zardCircleAlertIcon })],
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
  readonly zIcon = input<TemplateRef<void>>();
  readonly zType = input<ZardAlertTypeVariants>('default');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType() }), this.class()));

  protected readonly iconClasses = computed(() => alertIconVariants());

  protected readonly titleClasses = computed(() => alertTitleVariants());

  protected readonly descriptionClasses = computed(() => alertDescriptionVariants({ zType: this.zType() }));

  protected readonly shouldShowIcon = computed(() => this.zIcon() !== undefined || this.zType() === 'destructive');
}
