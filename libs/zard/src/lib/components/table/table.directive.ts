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
  selector: 'nav[z-table-pagination]',
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

@Directive({
  selector: 'details[z-details]',
  standalone: true,
  exportAs: 'zDetails',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDetailsDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.details(), this.class()));
}

@Directive({
  selector: 'summary[z-summary]',
  standalone: true,
  exportAs: 'zSummary',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardSummaryDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.summary(), this.class()));
}

@Directive({
  selector: 'ul[z-dropdown-ul]',
  standalone: true,
  exportAs: 'zDropdownUl',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownUlDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.dropdownUl(), this.class()));
}

@Directive({
  selector: 'li[z-dropdown-li]',
  standalone: true,
  exportAs: 'zDropdownLi',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownLiDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.dropdownLi(), this.class()));
}

@Directive({
  selector: 'label[z-dropdown-li-label]',
  standalone: true,
  exportAs: 'zDropDownLiLabel',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownLiLabelDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.dropdownLiLabel(), this.class()));
}

@Directive({
  selector: 'span[z-dropdown-check-icon-wrapper]',
  standalone: true,
  exportAs: 'zDropdownCheckIconWrapper',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownCheckIconWrapperDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.dropdownCheckIconWrapper(), this.class()));
}

@Directive({
  selector: 'input[z-dropdown-checkbox]',
  standalone: true,
  exportAs: 'zDropdownCheckbox',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardDropdownCheckboxDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.dropdownCheckbox(), this.class()));
}

@Directive({
  selector: 'div[z-toolbar]',
  standalone: true,
  exportAs: 'zToolbar',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardToolbarDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.toolbar(), this.class()));
}

@Directive({
  selector: 'div[z-toolbar-item]',
  standalone: true,
  exportAs: 'zToolbarItem',
  host: {
    '[class]': 'classes()',
  },
})
export class ZardToolbarItemDirective {
  readonly class = input<ClassValue>('');
  protected readonly classes = computed(() => mergeClasses(tableVariants.toolbarItem(), this.class()));
}
