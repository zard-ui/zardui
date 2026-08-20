import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { footerVariants } from '@/shared/components/layout/layout.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'z-footer',
  template: `
    <footer [class]="classes()" [style.height.px]="zHeight()">
      <ng-content />
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'footer',
  },
  exportAs: 'zFooter',
})
export class ZardFooterComponent {
  readonly class = input<ClassValue>('');
  readonly zHeight = input<number>(64);

  protected readonly classes = computed(() => mergeClasses(footerVariants(), this.class()));
}
