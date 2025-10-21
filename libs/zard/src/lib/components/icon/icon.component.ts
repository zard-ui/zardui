import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { LucideAngularModule, icons, LucideIconData } from 'lucide-angular';
import type { ClassValue } from 'clsx';

import { iconVariants, ZardIconVariants } from './icon.variants';
import { mergeClasses } from '../../shared/utils/utils';

export type IconName = keyof typeof icons;

export function transformIcon(value: string | null | undefined): IconName {
  if (typeof value === 'string' && value in icons) {
    return value as IconName;
  }

  throw new Error(`[zType] valor inválido: "${value}". É obrigatório e deve ser um ícone existente.`);
}

@Component({
  selector: 'z-icon, [z-icon]',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (iconData()) {
      <lucide-angular [img]="iconData()!" [strokeWidth]="zStrokeWidth()" [absoluteStrokeWidth]="zAbsoluteStrokeWidth()" [class]="classes()" />
    }
  `,
  host: {},
})
export class ZardIconComponent {
  readonly zType = input.required({ transform: transformIcon });
  readonly zSize = input<ZardIconVariants['zSize']>('default');
  readonly zStrokeWidth = input<number>(2);
  readonly zAbsoluteStrokeWidth = input<boolean>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(iconVariants({ zSize: this.zSize() }), this.class()));

  protected readonly iconData = computed((): LucideIconData | null => {
    const iconName = this.zType();
    return iconName ? icons[iconName] : null;
  });
}
