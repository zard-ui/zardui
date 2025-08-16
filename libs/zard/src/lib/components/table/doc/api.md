# API

## [z-table] <span class="api-type-label component">Component</span>

> `z-table` displays data in a structured table format with styling variants and semantic HTML.  
> Supports dynamic column selection, sorting, filtering, and pagination.

To customize the table, pass the following props to the component.

| Property       | Description           | Type               | Default |
| -------------- | ------------------- | ----------------- | ------- |
| `[columns]`    | Defines table columns | ColumnConfig[]    | `[]`    |
| `[dataSource]`               | Table data and optional metadata for pagination, sorting, filtering        | `ZardTableDataSource<T>`                                            | `{ data: [] }` |
| `[enableFiltering]`          | Shows global filter input for columns marked `filterable`                  | `boolean`                                                           | `false`   |
| `[enableColumnSelector]`     | Enables column visibility dropdown                                         | `boolean`                                                           | `false`   |
| `[enablePagination]`         | Shows pagination controls and emits page changes                           | `boolean`                                                           | `false`   |
| `[enableOrdering]`           | Allows sorting by columns marked `sortable`                                | `boolean`                                                           | `false`   |

---

### Outputs

| Event                | Description                                                                 | Type        |
| -------------------- | --------------------------------------------------------------------------- | ----------- |
| `(stateChange)`      | Emits the current table state on pagination, sorting, or filtering changes  | `TableState`|



### Interfaces

```ts
interface ZardTableDataSource<T> {
  data: T[];
  meta?: {
    pagination?: {
      totalItems: number;
      pageSize: number;
      pageIndex: number;
      first?: boolean;
      last?: boolean;
    };
    filtering?: { search?: string };
    sorting?: { field: string; direction: 'asc' | 'desc' };
  };
}

interface TableState {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  search?: string;
  field?: string;
  direction?: 'asc' | 'desc';
  first?: boolean;
  last?: boolean;
}

interface ColumnConfig {
  header: string;
  accessor: string;
  sortable?: boolean;
  filterable?: boolean;
}

