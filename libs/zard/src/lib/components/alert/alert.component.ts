import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'class-variance-authority/dist/types';

import { mergeClasses } from '../../shared/utils/utils';
import { alertVariants, ZardAlertVariants } from './alert.variants';

@Component({
  selector: 'z-alert',
  standalone: true,
  exportAs: 'zAlert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (iconName()) {
      <i [class]="iconName()"></i>
    }

    <div class="flex flex-col gap-1 w-full">
      <h5 class="font-medium leading-none tracking-tight mt-1">{{ zTitle() }}</h5>
      <span class="text-sm leading-[1.625]">{{ zDescription() }}</span>
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
  readonly zTitle = input.required<string>();
  readonly zDescription = input.required<string>();
  readonly zIcon = input<string>();
  readonly zType = input<ZardAlertVariants['zType']>('default');
  readonly zAppearance = input<ZardAlertVariants['zAppearance']>('outline');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType(), zAppearance: this.zAppearance() }), this.class()));

  protected readonly iconsType: Record<NonNullable<ZardAlertVariants['zType']>, string> = {
    default: '',
    info: 'icon-info',
    success: 'icon-circle-check',
    warning: 'icon-triangle-alert',
    error: 'icon-circle-x',
  };

  protected readonly iconName = computed(() => {
    return this.zIcon() ?? this.iconsType[this.zType() ?? 'default'];
  });
}
