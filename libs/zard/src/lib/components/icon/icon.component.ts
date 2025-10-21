import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';
import type { ClassValue } from 'clsx';

import { iconVariants, ZardIconVariants } from './icon.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-icon, [z-icon]',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <lucide-angular [img]="zType()" [strokeWidth]="zStrokeWidth()" [absoluteStrokeWidth]="zAbsoluteStrokeWidth()" [class]="classes()" /> `,
  host: {},
})
export class ZardIconComponent {
  readonly zType = input.required<LucideIconData>();
  readonly zSize = input<ZardIconVariants['zSize']>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(iconVariants({ zSize: this.zSize() }), this.class()));
}
