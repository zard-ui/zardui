**Pagination**

This usage demonstrates how to integrate **pagination** into your table component.

To enable pagination, set the `[pagination]` input to `true`.  

When enabled, the table will display pagination controls and emit state changes via the `(stateChange)` event whenever the user navigates pages.

You should listen to this event and fetch the corresponding page of data from your API or data source based on the emitted state.


```html
<z-table
  [columns]="columns"
  [dataSource]="dataSource()"
  [pagination]="true"
  (stateChange)="onStateChange($event)"
></z-table>
```

### Output (emitted by the table)

```ts
interface TableState {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
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
    };
  };
}
```

Note: You are free to transform `TableState` into any query shape your API expects —
just make sure to return a `ZardTableDataSource<T>` back to the table.
