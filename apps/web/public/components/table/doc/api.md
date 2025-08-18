# API

## [z-table] <span class="api-type-label component">Component</span>

> `z-table` displays data in a structured table format with styling variants and semantic HTML.  
> Supports dynamic column selection, sorting, filtering, and pagination.

## Usage

### Basic Table

```html
<table z-table>
  <thead z-thead>
    <tr z-tr>
      <th z-th>Name</th>
      <th z-th>Age</th>
    </tr>
  </thead>
  <tbody>
    <tr z-tr>
      <td z-td>Douglas</td>
      <td z-td>19</td>
    </tr>
    <tr z-tr>
      <td z-td>Lucas</td>
      <td z-td>25</td>
    </tr>
    <tr z-tr>
      <td z-td>Claudia</td>
      <td z-td>22</td>
    </tr>
  </tbody>
</table>
```

### With Data Binding

```html
<z-table
  [columns]="columns"
  [dataSource]="dataSource()"
  [enableFiltering]="true"
  [enableColumnSelector]="true"
  [enablePagination]="true"
  [enableOrdering]="true"
  (stateChange)="onStateChange($event)"
  zSize="compact"
  zType="bordered"
></z-table>
```

To customize the table, pass the following props to the component.

| Property                 | Description                                                         | Type                                | Default        |
| ------------------------ | ------------------------------------------------------------------- | ----------------------------------- | -------------- |
| `zType`                  | Table type                                                          | `default \| striped \| bordered`    | `default`      |
| `zSize`                  | Table size                                                          | `default \| compact \| comfortable` | `default`      |
| `[columns]`              | Defines table columns                                               | `ColumnConfig[]`                    | `[]`           |
| `[dataSource]`           | Table data and optional metadata for pagination, sorting, filtering | `ZardTableDataSource<T>`            | `{ data: [] }` |
| `[enableFiltering]`      | Shows global filter input for columns marked `filterable`           | `boolean`                           | `false`        |
| `[enableColumnSelector]` | Enables column visibility dropdown                                  | `boolean`                           | `false`        |
| `[enablePagination]`     | Shows pagination controls and emits page changes                    | `boolean`                           | `false`        |
| `[enableOrdering]`       | Allows sorting by columns marked `sortable`                         | `boolean`                           | `false`        |

---

### Outputs

| Event           | Description                                                                | Type         |
| --------------- | -------------------------------------------------------------------------- | ------------ |
| `(stateChange)` | Emits the current table state on pagination, sorting, or filtering changes | `TableState` |

---

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
```
