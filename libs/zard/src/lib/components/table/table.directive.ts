import { computed, Directive, input } from '@angular/core';
import { ClassValue } from 'clsx';
import { mergeClasses } from '../../shared/utils/utils';
import { tableVariants, tbodyVariants, tdVariants, theadVariants, thVariants, trVariants } from './table.variants';

@Directive({
  selector: 'table[z-table]',
  standalone: true,
  exportAs: 'zTable',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants(), this.class()));
}

@Directive({
  selector: 'thead[z-thead]',
  standalone: true,
  exportAs: 'zThead',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTheadDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(theadVariants(), this.class()));
}

@Directive({
  selector: 'tbody[z-tbody]',
  standalone: true,
  exportAs: 'zTbody',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTbodyDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tbodyVariants(), this.class()));
}

@Directive({
  selector: 'tr[z-tr]',
  standalone: true,
  exportAs: 'zTr',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTrDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(trVariants(), this.class()));
}

@Directive({
  selector: 'th[z-th]',
  standalone: true,
  exportAs: 'zTh',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardThDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(thVariants(), this.class()));
}

@Directive({
  selector: 'td[z-td]',
  standalone: true,
  exportAs: 'zTd',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTdDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tdVariants(), this.class()));
}
