**Ordered table**

This usage demonstrates how to integrate **ordering (sorting)** into your table component.

To enable ordering, set the `[zOrdering]` input to `true`.

When enabled, the table will allow sorting on columns marked as `sortable: true` and emit state changes via the `(stateChange)` event whenever the user changes the sort order or column.

You should listen to this event and fetch the corresponding sorted data from your API or data source based on the emitted state.

---

## Usage example

```html
<z-table
  [columns]="columns"
  [dataSource]="dataSource()"
  [pagination]="true"
  [zOrdering]="true"
  (stateChange)="onStateChange($event)"
></z-table>
```

### Output (emitted by the table)

```ts
interface TableState {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  field?: string;        
  direction?: 'asc' | 'desc';
  first?: boolean;
  last?: boolean;
}
```

### Intput (what the table expects to receive)

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
    },
     sorting?: {
      field: string;
      direction: 'asc' | 'desc';
    };
  };
}
```

