import { ZardDataTableColumnHeaderComponent } from '@/shared/components/data-table/data-table-column-header.component';
import { ZardDataTablePaginationComponent } from '@/shared/components/data-table/data-table-pagination.component';
import { ZardDataTableViewOptionsComponent } from '@/shared/components/data-table/data-table-view-options.component';
import { ZardDataTableComponent } from '@/shared/components/data-table/data-table.component';

export const ZardDataTableImports = [
  ZardDataTableComponent,
  ZardDataTableColumnHeaderComponent,
  ZardDataTablePaginationComponent,
  ZardDataTableViewOptionsComponent,
] as const;
