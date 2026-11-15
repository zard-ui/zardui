# Data table snippets

Code fragments shown on the data-table docs page.
Each fenced block is exported as `DATA_TABLE_SNIPPET_<ID>` via the snippet generator.

```text id="project-structure" copyButton
src/app/payments
├── payments.ts        # the Payment type and the data
├── features.ts        # tableFeatures(): what the table can do
├── columns.ts         # the column definitions
└── payments-table.ts  # the component: injectTable() + <z-data-table>
```

```angular-ts id="column-header" copyButton
columnHelper.accessor('email', {
  header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } }),
}),
```

```angular-html id="pagination" copyButton
<z-data-table [zTable]="table" />
<z-data-table-pagination [zTable]="table" [zPageSizeOptions]="[10, 20, 50]" />
```

```angular-html id="view-options" copyButton
<div class="flex items-center py-4">
  <z-data-table-view-options [zTable]="table" />
</div>
```

```angular-ts id="column-meta" copyButton
const features = tableFeatures({
  // …
  columnMeta: {} as ZardDataTableColumnMeta,
});

columnHelper.accessor('amount', {
  header: 'Amount',
  meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
}),
```
