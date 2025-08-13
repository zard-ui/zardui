export interface ZardTableDataSource<T> {
  data: T[];
  meta?: TableMeta;
}

export interface TableMeta {
  pagination?: TablePagination;
  sorting?: TableSorting;
  filtering?: TableFiltering;
}

export interface TablePagination {
  totalItems: number;
  pageSize: number;
  pageIndex: number;
  first?: boolean;
  last?: boolean;
}

export interface TableSorting {
  field?: string;
  direction?: 'asc' | 'desc';
}

export interface TableFiltering {
  search?: string;
}

export interface TableState {
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  first?: boolean;
  last?: boolean;

  field?: string;
  direction?: 'asc' | 'desc';

  search?: string;

  visibleColumns?: Record<string, boolean>;
}
