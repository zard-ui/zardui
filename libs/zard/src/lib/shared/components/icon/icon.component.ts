import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';
import { LucideAngularModule } from 'lucide-angular';

import { mergeClasses } from '@/shared/utils/merge-classes';

import { iconVariants, type ZardIconSizeVariants } from './icon.variants';
import { ZARD_ICONS, type ZardIcon } from './icons';

@Component({
  selector: 'z-icon, [z-icon]',
  imports: [LucideAngularModule],
  template: `
    <lucide-angular
      [img]="icon()"
      [strokeWidth]="zStrokeWidth()"
      [absoluteStrokeWidth]="zAbsoluteStrokeWidth()"
      [class]="classes()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardIconComponent {
  readonly zType = input.required<ZardIcon>();
  readonly zSize = input<ZardIconSizeVariants>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(iconVariants({ zSize: this.zSize() }), this.class(), this.zStrokeWidth() === 0 ? 'stroke-none' : ''),
  );

  protected readonly icon = computed(() => {
    const type = this.zType();
    if (typeof type === 'string') {
      return ZARD_ICONS[type];
    }

    return type;
  });
}
