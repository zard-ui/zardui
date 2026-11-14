import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings2 } from '@ng-icons/lucide';
import type { AngularTable, RowData, TableFeatures } from '@tanstack/angular-table';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { toDataTableInstance } from '@/shared/components/data-table/data-table.component';
import { dataTableViewOptionsVariants } from '@/shared/components/data-table/data-table.variants';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** A "View" dropdown that toggles the visibility of the hideable data columns. */
@Component({
  selector: 'z-data-table-view-options',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    <button type="button" z-button zType="outline" zSize="sm" [class]="classes()" z-dropdown [zDropdownMenu]="menu">
      <ng-icon name="lucideSettings2" aria-hidden="true" />
      {{ zLabel() }}
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end" class="w-40">
      <z-dropdown-menu-label>Toggle columns</z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      @for (column of columns(); track column.id) {
        <z-dropdown-menu-checkbox-item
          class="capitalize"
          [zChecked]="column.getIsVisible()"
          (zCheckedChange)="column.toggleVisibility($event)"
        >
          {{ column.id }}
        </z-dropdown-menu-checkbox-item>
      }
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideSettings2 })],
  host: {
    'data-slot': 'data-table-view-options',
    class: 'contents',
  },
  exportAs: 'zDataTableViewOptions',
})
export class ZardDataTableViewOptionsComponent<TFeatures extends TableFeatures, TData extends RowData> {
  readonly zTable = input.required<AngularTable<TFeatures, TData>>();
  readonly zLabel = input<string>('View');
  readonly class = input<ClassValue>('');

  protected readonly table = computed(() => toDataTableInstance(this.zTable()));

  protected readonly classes = computed(() => mergeClasses(dataTableViewOptionsVariants(), this.class()));

  protected readonly columns = computed(() =>
    this.table()
      .getAllColumns()
      .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
  );
}
