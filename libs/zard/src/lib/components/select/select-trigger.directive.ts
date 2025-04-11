import { ClassValue } from 'class-variance-authority/dist/types';
import { computed, Directive, input } from '@angular/core';
import { mergeClasses, transform } from '../../shared/utils/utils';
import { selectVariants, ZardSelectVariants } from './select.variants';

@Directive({
  selector: 'button[z-select-trigger]',
  exportAs: 'zSelectTrigger',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardSelectTriggerDirective {
  readonly zBorderless = input(false, { transform });
  readonly zSize = input<ZardSelectVariants['zSize']>('default');
  readonly zStatus = input<ZardSelectVariants['zStatus']>('default');
  readonly zFullWidth = input<ZardSelectVariants['zFullWidth']>(false);
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      selectVariants({
        zSize: this.zSize(),
        zStatus: this.zStatus(),
        zBorderless: this.zBorderless(),
        zFullWidth: this.zFullWidth(),
      }),
      this.class(),
    ),
  );
}
