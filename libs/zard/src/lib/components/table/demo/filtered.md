**Filtered table**

This usage demonstrates how to integrate column-based filtering into your table component.

To enable filtering, set the `filtering` input to `true`.

When enabled, the table will display a global input to search data based on the columns explicitly marked as filterable: true.

When the user types into the search input, the table emits a `(stateChange)` event containing the updated TableState.search value. You should listen to this event and apply filtering on your API or data source accordingly.

---

## Usage example

```html
<z-table
  [columns]="columns"
  [dataSource]="dataSource()"
  [pagination]="true"
  [filtering]="true"
  (stateChange)="onStateChange($event)"
></z-table>

```
### Output (emitted by the table)

```ts
interface TableState {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  search?: string;        
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
     filtering?: {
      search?: string;
    },
  };
}
```

---

•Only columns marked with `filterable: true` will be used during filtering.<br>
•The search value is emitted as a `string` via `TableState.search`. Your backend should accept and handle this as a text-based filter query.<br>
•The names of the `filterable` columns are automatically included in the placeholder text of the search input, providing accessibility and clarity for the user.
