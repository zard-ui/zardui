import type { ClassValue } from 'clsx';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import { headerVariants } from './layout.variants';

@Component({
  selector: 'z-header',
  exportAs: 'zHeader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <header [class]="classes()" [style.height.px]="zHeight()">
      <ng-content></ng-content>
    </header>
  `,
})
export class HeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(headerVariants(), this.class()));
}
