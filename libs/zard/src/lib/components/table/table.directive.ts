import { computed, Directive, effect, ElementRef, input, OnDestroy, Renderer2 } from '@angular/core';
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
export class ZardTableDirective implements OnDestroy {
  readonly zType = input<'default' | 'striped' | 'bordered'>('default');
  readonly zSize = input<'default' | 'compact' | 'comfortable'>('default');
  readonly userClass = input<ClassValue>('');

  readonly classes = computed(() => mergeClasses(tableVariants.table({ zSize: this.zSize() }), this.userClass()));

  private mo: MutationObserver;

  constructor(
    private host: ElementRef<HTMLTableElement>,
    private renderer: Renderer2,
  ) {
    const nativeEl = this.host.nativeElement;

    effect(() => {
      this.applyClassesToChildren();
    });

    this.mo = new MutationObserver(() => this.applyClassesToChildren());
    this.mo.observe(nativeEl, { childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    this.mo.disconnect();
  }

  private applyClassesToChildren() {
    const host = this.host.nativeElement;

    const addClasses = (el: HTMLElement, classValue?: string) => {
      if (!classValue) return;
      classValue
        .split(' ')
        .filter(Boolean)
        .forEach(c => this.renderer.addClass(el, c));
    };

    host.querySelectorAll('thead').forEach(el => addClasses(el as HTMLElement, tableVariants.thead({ zType: this.zType() })));

    host.querySelectorAll('tr').forEach(el => addClasses(el as HTMLElement, tableVariants.tr({ zType: this.zType() })));

    host.querySelectorAll('th').forEach(el => addClasses(el as HTMLElement, tableVariants.th({ zSize: this.zSize() })));

    host.querySelectorAll('td').forEach(el => addClasses(el as HTMLElement, tableVariants.td({ zSize: this.zSize() })));
  }
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
  readonly zType = input<'default' | 'striped' | 'bordered'>('default');

  protected readonly classes = computed(() => mergeClasses(tableVariants.tWrapper({ zType: this.zType() }), this.class()));
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
