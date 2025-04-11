import { ClassValue } from 'class-variance-authority/dist/types';
import { computed, Directive, input } from '@angular/core';
import { mergeClasses, transform } from '../../../shared/utils/utils';
import { selectOptionVariants } from '../select.variants';

@Directive({
  selector: 'div[z-select-option]',
  exportAs: 'zSelectOption',
  standalone: true,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardSelectOptionDirective {
  readonly zSelected = input(false, { transform });
  readonly zDisabled = input(false, { transform });
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      selectOptionVariants({
        zSelected: this.zSelected(),
        zDisabled: this.zDisabled(),
      }),
      this.class(),
    ),
  );
}
