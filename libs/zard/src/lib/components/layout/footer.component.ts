import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { footerVariants } from './layout.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-footer',
  exportAs: 'zFooter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <footer [class]="classes()" [style.height.px]="zHeight()">
      <ng-content></ng-content>
    </footer>
  `,
})
export class FooterComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(footerVariants(), this.class()));
}
