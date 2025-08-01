import { computed, Directive, input } from '@angular/core';
import { ClassValue } from 'clsx';
import { mergeClasses } from '../../shared/utils/utils';
import { tableVariants } from './table.variants';

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
  protected readonly classes = computed(() => mergeClasses(tableVariants.table(), this.class()));
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
  protected readonly classes = computed(() => mergeClasses(tableVariants.thead(), this.class()));
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
  protected readonly classes = computed(() => mergeClasses(tableVariants.tbody(), this.class()));
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
  protected readonly classes = computed(() => mergeClasses(tableVariants.tr(), this.class()));
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
  protected readonly classes = computed(() => mergeClasses(tableVariants.th(), this.class()));
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
  protected readonly classes = computed(() => mergeClasses(tableVariants.td(), this.class()));
}

@Directive({
  selector: 'div[z-table-wrapper]',
  standalone: true,
  exportAs: 'zTableWrapper',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableWrapperDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.tWrapper(), this.class()));
}

@Directive({
  selector: 'div[z-table-pagination]',
  standalone: true,
  exportAs: 'zTablePagination',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTablePaginationDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.pagination(), this.class()));
}

@Directive({
  selector: 'div[z-table-filtering]',
  standalone: true,
  exportAs: 'zTableFiltering',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableFilteringDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.filtering(), this.class()));
}
