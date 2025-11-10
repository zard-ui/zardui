import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { ClassValue } from 'clsx';
import { mergeClasses } from '../../../shared/utils/utils';
import { tableVariants } from '../table.variants';
import { Z_TABLE_SIZE, Z_TABLE_TYPE } from './table.component';

@Component({
  selector: 'div[z-table-wrapper]',
  exportAs: 'zTableWrapper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableWrapperComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<'default' | 'striped' | 'bordered'>();

  private readonly parentType = inject(Z_TABLE_TYPE, { optional: true });

  protected readonly classes = computed(() => {
    const type = this.zType() ?? this.parentType?.() ?? 'default';
    return mergeClasses(tableVariants.tWrapper({ zType: type }), this.class());
  });
}

@Component({
  selector: 'thead[z-table-header]',
  exportAs: 'zTableHeader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableHeaderComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<'default' | 'striped' | 'bordered'>();

  private readonly parentType = inject(Z_TABLE_TYPE, { optional: true });

  protected readonly classes = computed(() => {
    const type = this.zType() ?? this.parentType?.() ?? 'default';
    return mergeClasses(tableVariants.tHead({ zType: type }), this.class());
  });
}

@Component({
  selector: 'tbody[z-table-body]',
  exportAs: 'zTableBody',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableBodyComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<'default' | 'striped' | 'bordered'>();

  private readonly parentType = inject(Z_TABLE_TYPE, { optional: true });

  protected readonly classes = computed(() => {
    const type = this.zType() ?? this.parentType?.() ?? 'default';
    return mergeClasses(tableVariants.tBody({ zType: type }), this.class());
  });
}

@Component({
  selector: 'tr[z-table-row]',
  exportAs: 'zTableRow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableRowComponent {
  readonly class = input<ClassValue>('');
  readonly zType = input<'default' | 'striped' | 'bordered'>();

  private readonly parentType = inject(Z_TABLE_TYPE, { optional: true });

  protected readonly classes = computed(() => {
    const type = this.zType() ?? this.parentType?.() ?? 'default';
    return mergeClasses(tableVariants.tr({ zType: type }), this.class());
  });
}

@Component({
  selector: 'th[z-table-head]',
  exportAs: 'zTableHead',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableHeadComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<'default' | 'compact' | 'comfortable'>();

  private readonly parentSize = inject(Z_TABLE_SIZE, { optional: true });

  protected readonly classes = computed(() => {
    const type = this.zSize() ?? this.parentSize?.() ?? 'default';
    return mergeClasses(tableVariants.th({ zSize: type }), this.class());
  });
}

@Component({
  selector: 'td[z-table-cell]',
  exportAs: 'zTableCell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableCellComponent {
  readonly class = input<ClassValue>('');
  readonly zSize = input<'default' | 'compact' | 'comfortable'>();

  private readonly parentSize = inject(Z_TABLE_SIZE, { optional: true });

  protected readonly classes = computed(() => {
    const type = this.zSize() ?? this.parentSize?.() ?? 'default';
    return mergeClasses(tableVariants.td({ zSize: type }), this.class());
  });
}

@Component({
  selector: 'caption[z-table-caption]',
  exportAs: 'zTableCaption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableCaptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableVariants.tableCaptionVariants(), this.class()));
}
