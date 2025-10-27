import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import { contentVariants } from './layout.variants';
import { mergeClasses } from '../../shared/utils/utils';

@Component({
  selector: 'z-content',
  exportAs: 'zContent',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <main>
      <ng-content></ng-content>
    </main>
  `,
  host: {
    '[class]': 'classes()',
  },
})
export class ContentComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(contentVariants(), this.class()));
}
