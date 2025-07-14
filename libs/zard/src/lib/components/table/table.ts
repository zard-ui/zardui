export interface ZardTableDataSource<T> {
  data: T[];
  meta?: TableMeta;
}

export interface TableMeta {
  pagination?: TablePagination;
}

export interface TablePagination {
  totalItems: number;
  pageSize: number;
  pageIndex: number;
  first?: boolean;
  last?: boolean;
}

export interface TableState {
  pageSize: number;
  pageIndex: number;
  totalItems: number;
  first?: boolean;
  last?: boolean;
}
