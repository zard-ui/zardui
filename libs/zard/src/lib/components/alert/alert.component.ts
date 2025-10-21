import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import type { ClassValue } from 'clsx';

import { mergeClasses } from '../../shared/utils/utils';
import { alertVariants, ZardAlertVariants } from './alert.variants';
import { ZardIconComponent } from '../icon/icon.component';
import { CircleCheck, CircleX, Info, LucideIconData, TriangleAlert } from 'lucide-angular';

@Component({
  selector: 'z-alert',
  standalone: true,
  imports: [ZardIconComponent],
  exportAs: 'zAlert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (iconName()) {
      <z-icon [zType]="iconName()!" />
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
  readonly zIcon = input<LucideIconData>();
  readonly zType = input<ZardAlertVariants['zType']>('default');
  readonly zAppearance = input<ZardAlertVariants['zAppearance']>('outline');

  protected readonly classes = computed(() => mergeClasses(alertVariants({ zType: this.zType(), zAppearance: this.zAppearance() }), this.class()));

  protected readonly iconsType: Record<NonNullable<ZardAlertVariants['zType']>, LucideIconData | ''> = {
    default: '',
    info: Info,
    success: CircleCheck,
    warning: TriangleAlert,
    error: CircleX,
  };

  protected readonly iconName = computed((): LucideIconData | null => {
    const customIcon = this.zIcon();
    if (customIcon) return customIcon;

    const typeIcon = this.iconsType[this.zType() ?? 'default'];
    return typeIcon || null;
  });
}
