import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';
import { LucideAngularModule } from 'lucide-angular';

import { iconVariants, type ZardIconVariants } from './icon.variants';
import { ZARD_ICONS, type ZardIcon } from './icons';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-icon, [z-icon]',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <lucide-angular
      [img]="icon()"
      [strokeWidth]="zStrokeWidth()"
      [absoluteStrokeWidth]="zAbsoluteStrokeWidth()"
      [class]="classes()"
    />
  `,
  host: {},
})
export class ZardIconComponent {
  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconVariants['zSize']>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(iconVariants({ zSize: this.zSize() }), this.class()));

  protected readonly icon = computed(() => {
    const type = this.zType();
    if (typeof type === 'string') {
      return ZARD_ICONS[type as keyof typeof ZARD_ICONS];
    }

    return type;
  });
}
