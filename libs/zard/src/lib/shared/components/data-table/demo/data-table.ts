import { DATA_TABLE_DEMO_BASIC } from '@generated/components/data-table/demo/basic';
import { DATA_TABLE_DEMO_CELL_FORMATTING } from '@generated/components/data-table/demo/cell-formatting';
import { DATA_TABLE_DEMO_EXPANDABLE } from '@generated/components/data-table/demo/expandable';
import { DATA_TABLE_DEMO_FACETED_FILTERS } from '@generated/components/data-table/demo/faceted-filters';
import { DATA_TABLE_DEMO_FEATURES } from '@generated/components/data-table/demo/features';
import { DATA_TABLE_DEMO_FILTERING } from '@generated/components/data-table/demo/filtering';
import { DATA_TABLE_DEMO_PAGINATION } from '@generated/components/data-table/demo/pagination';
import { DATA_TABLE_DEMO_PAYMENTS } from '@generated/components/data-table/demo/payments';
import { DATA_TABLE_DEMO_PINNING_RESIZING } from '@generated/components/data-table/demo/pinning-resizing';
import { DATA_TABLE_DEMO_PREVIEW } from '@generated/components/data-table/demo/preview';
import { DATA_TABLE_DEMO_ROW_ACTIONS } from '@generated/components/data-table/demo/row-actions';
import { DATA_TABLE_DEMO_ROW_SELECTION } from '@generated/components/data-table/demo/row-selection';
import { DATA_TABLE_DEMO_RTL } from '@generated/components/data-table/demo/rtl';
import { DATA_TABLE_DEMO_SERVER_SIDE } from '@generated/components/data-table/demo/server-side';
import { DATA_TABLE_DEMO_SORTING } from '@generated/components/data-table/demo/sorting';
import { DATA_TABLE_DEMO_VISIBILITY } from '@generated/components/data-table/demo/visibility';
import {
  DATA_TABLE_SNIPPET_COLUMN_HEADER,
  DATA_TABLE_SNIPPET_COLUMN_META,
  DATA_TABLE_SNIPPET_PAGINATION,
  DATA_TABLE_SNIPPET_PROJECT_STRUCTURE,
  DATA_TABLE_SNIPPET_VIEW_OPTIONS,
} from '@generated/components/data-table/snippets';
import { DATA_TABLE_CLI_ADD } from '@generated/installation/cli/add-data-table';
import { DATA_TABLE_MANUAL_CODE } from '@generated/installation/manual/data-table';
import { DATA_TABLE_MANUAL_INSTALL_DEPS } from '@generated/installation/manual/install-deps-data-table';
import { DATA_TABLE_USAGE_CODE, DATA_TABLE_USAGE_IMPORT } from '@generated/usage/data-table';

import { ZardDemoDataTableBasicComponent } from '@/shared/components/data-table/demo/basic';
import { ZardDemoDataTableCellFormattingComponent } from '@/shared/components/data-table/demo/cell-formatting';
import { ZardDemoDataTableExpandableComponent } from '@/shared/components/data-table/demo/expandable';
import { ZardDemoDataTableFacetedFiltersComponent } from '@/shared/components/data-table/demo/faceted-filters';
import { ZardDemoDataTableFilteringComponent } from '@/shared/components/data-table/demo/filtering';
import { ZardDemoDataTablePaginationComponent } from '@/shared/components/data-table/demo/pagination';
import { ZardDemoDataTablePinningResizingComponent } from '@/shared/components/data-table/demo/pinning-resizing';
import { ZardDemoDataTablePreviewComponent } from '@/shared/components/data-table/demo/preview';
import { ZardDemoDataTableRowActionsComponent } from '@/shared/components/data-table/demo/row-actions';
import { ZardDemoDataTableRowSelectionComponent } from '@/shared/components/data-table/demo/row-selection';
import { ZardDemoDataTableRtlComponent } from '@/shared/components/data-table/demo/rtl';
import { ZardDemoDataTableServerSideComponent } from '@/shared/components/data-table/demo/server-side';
import { ZardDemoDataTableSortingComponent } from '@/shared/components/data-table/demo/sorting';
import { ZardDemoDataTableVisibilityComponent } from '@/shared/components/data-table/demo/visibility';
import { DATA_TABLE_API } from '@/shared/components/data-table/doc/api';

export const DATA_TABLE = {
  componentName: 'data-table',
  componentType: 'data-table',
  api: DATA_TABLE_API,
  description: 'Powerful table and datagrids built using TanStack Table.',
  intro: [
    'Every data table or datagrid is different: how it sorts, filters and paginates, and where its data comes from. Instead of one component with an option for each of those, this guide shows how to build your own with [TanStack Table](https://tanstack.com/table/latest/docs/framework/angular/angular-table) and [Table](/docs/components/table).',
    'TanStack Table is headless: it holds the state and the logic, and you write the markup. `z-data-table` is the markup — it renders a TanStack table with `z-table` — and `z-data-table-column-header`, `z-data-table-pagination` and `z-data-table-view-options` are the parts most tables share. Each of them reads only the features your table declares.',
  ],
  installData: {
    cliAdd: DATA_TABLE_CLI_ADD,
    manualCode: DATA_TABLE_MANUAL_CODE,
    manualDeps: DATA_TABLE_MANUAL_INSTALL_DEPS,
  },
  usage: { importBlock: DATA_TABLE_USAGE_IMPORT, codeBlock: DATA_TABLE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoDataTablePreviewComponent,
    codeData: DATA_TABLE_DEMO_PREVIEW,
  },
  examples: [],
  sections: [
    {
      id: 'prerequisites',
      title: 'Prerequisites',
      description: 'We are going to build a table to show recent payments. Here is what our data looks like:',
      examples: [{ name: 'prerequisites', codeData: DATA_TABLE_DEMO_PAYMENTS }],
    },
    {
      id: 'project-structure',
      title: 'Project Structure',
      description:
        'Start with one file per concern. The examples below keep each step in a single file so you can read it top to bottom.',
      examples: [{ name: 'project-structure', codeData: DATA_TABLE_SNIPPET_PROJECT_STRUCTURE }],
    },
    {
      id: 'table-features',
      title: 'Set up Table Features',
      description:
        'TanStack Table v9 is feature-based: you opt into the behavior you want with `tableFeatures()`. Declare the features once, outside any component, and pass them to every `injectTable` call. The core row model is always included; the optional ones (`createSortedRowModel()`, `createFilteredRowModel()`, …) are registered here too. The `columnMeta` slot types the column `meta` that `z-data-table` reads.',
      examples: [{ name: 'table-features', codeData: DATA_TABLE_DEMO_FEATURES }],
    },
    {
      id: 'basic-table',
      title: 'Basic Table',
      description:
        'Define the columns with `createColumnHelper`, create the table with `injectTable` in a field initializer, and hand it to `z-data-table`. Keep the features and the columns outside the initializer: only the data should change there.',
      examples: [{ name: 'basic-table', component: ZardDemoDataTableBasicComponent, codeData: DATA_TABLE_DEMO_BASIC }],
    },
    {
      id: 'cell-formatting',
      title: 'Cell Formatting',
      description:
        'A `cell` function formats the value. To align the column, set `meta.headerClass` and `meta.cellClass`: `z-data-table` adds them to the column’s `th` and `td`.',
      examples: [
        {
          name: 'cell-formatting',
          component: ZardDemoDataTableCellFormattingComponent,
          codeData: DATA_TABLE_DEMO_CELL_FORMATTING,
          codeAfter: { title: 'Column meta', codeData: DATA_TABLE_SNIPPET_COLUMN_META },
        },
      ],
    },
    {
      id: 'row-actions',
      title: 'Row Actions',
      description:
        'A cell can render a component. Return `flexRenderComponent(...)` from `cell`, and read the row inside the component with `injectTableCellContext()` — `row.original` is that row’s data, so an action such as a delete call can use its `id`.',
      examples: [
        { name: 'row-actions', component: ZardDemoDataTableRowActionsComponent, codeData: DATA_TABLE_DEMO_ROW_ACTIONS },
      ],
    },
    {
      id: 'pagination',
      title: 'Pagination',
      description:
        'Pagination is already on: the features include `rowPaginationFeature` and `createPaginatedRowModel()`, so the table splits the rows into pages of 10. Add the controls with `table.previousPage()` and `table.nextPage()`.',
      examples: [
        { name: 'pagination', component: ZardDemoDataTablePaginationComponent, codeData: DATA_TABLE_DEMO_PAGINATION },
      ],
    },
    {
      id: 'sorting',
      title: 'Sorting',
      description:
        'Sorting is on too, through `rowSortingFeature`. Make a header sortable by rendering a component that reads its column with `injectTableHeaderContext()` and calls `column.toggleSorting()`.',
      examples: [{ name: 'sorting', component: ZardDemoDataTableSortingComponent, codeData: DATA_TABLE_DEMO_SORTING }],
    },
    {
      id: 'filtering',
      title: 'Filtering',
      description:
        'With `columnFilteringFeature` in the features, filter a column with `column.setFilterValue()`. Here an input filters the emails.',
      examples: [
        { name: 'filtering', component: ZardDemoDataTableFilteringComponent, codeData: DATA_TABLE_DEMO_FILTERING },
      ],
    },
    {
      id: 'visibility',
      title: 'Visibility',
      description:
        'Columns can be hidden with `column.toggleVisibility()`. This adds a dropdown menu that toggles the columns; `enableHiding: false` keeps a column out of it.',
      examples: [
        { name: 'visibility', component: ZardDemoDataTableVisibilityComponent, codeData: DATA_TABLE_DEMO_VISIBILITY },
      ],
    },
    {
      id: 'row-selection',
      title: 'Row Selection',
      description:
        'Add a `select` column with a checkbox in the header that selects the whole page, and one in each row. `table.getFilteredSelectedRowModel()` gives the selected rows, which `z-data-table` also marks with `data-state="selected"`.',
      examples: [
        {
          name: 'row-selection',
          component: ZardDemoDataTableRowSelectionComponent,
          codeData: DATA_TABLE_DEMO_ROW_SELECTION,
        },
      ],
    },
    {
      id: 'reusable-components',
      title: 'Reusable Components',
      description: [
        'The parts most data tables need come with the component. The [Faceted Filters](#faceted-filters) example below uses all three, with the features object shared the same way as in [Set up Table Features](#set-up-table-features).',
        '- **`z-data-table-column-header`** makes a header sortable and hideable, and pinnable when the table has `columnPinningFeature`. It reads its column from DI, so render it from the column definition.',
        '- **`z-data-table-pagination`** adds the selection count, a rows-per-page select, the page indicator and first, previous, next and last buttons.',
        '- **`z-data-table-view-options`** is a "View" dropdown that toggles the hideable columns.',
      ].join('\n'),
      examples: [
        { name: 'column-header', codeData: DATA_TABLE_SNIPPET_COLUMN_HEADER },
        { name: 'pagination-component', codeData: DATA_TABLE_SNIPPET_PAGINATION },
        { name: 'view-options', codeData: DATA_TABLE_SNIPPET_VIEW_OPTIONS },
      ],
    },
    {
      id: 'expandable-rows',
      title: 'Expandable Rows',
      description:
        'With `rowExpandingFeature`, pass an `ng-template` to `[zExpandedRow]`: it renders in a full-width row under each expanded row, with the row as `let-row`. `getRowCanExpand` decides which rows can open.',
      examples: [
        {
          name: 'expandable-rows',
          component: ZardDemoDataTableExpandableComponent,
          codeData: DATA_TABLE_DEMO_EXPANDABLE,
        },
      ],
    },
    {
      id: 'faceted-filters',
      title: 'Faceted Filters',
      description:
        'A toolbar in the style of a task list. Each filter is a popover of checkable options; the counts next to them come from `columnFacetingFeature` with `createFacetedUniqueValues()`, so they follow the other filters.',
      examples: [
        {
          name: 'faceted-filters',
          component: ZardDemoDataTableFacetedFiltersComponent,
          codeData: DATA_TABLE_DEMO_FACETED_FILTERS,
        },
      ],
    },
    {
      id: 'server-side',
      title: 'Server-side Data',
      description:
        'When the server pages, sorts and filters, set `manualPagination`, `manualSorting` and `manualFiltering`, keep that state in signals, and pass `rowCount`. An Angular `resource()` refetches when the state changes and cancels the request in flight; `[zLoading]` dims the rows meanwhile.',
      examples: [
        { name: 'server-side', component: ZardDemoDataTableServerSideComponent, codeData: DATA_TABLE_DEMO_SERVER_SIDE },
      ],
    },
    {
      id: 'pinning-resizing',
      title: 'Pinning and Resizing',
      description:
        'With `columnPinningFeature`, pinned columns stay put while the rest scrolls; pin them in `initialState` or from the column header menu. With `columnSizingFeature` and `columnResizingFeature`, drag a header’s edge to resize it, or double-click it to reset. Pinning uses `start` and `end`, so it follows the reading direction.',
      examples: [
        {
          name: 'pinning-resizing',
          component: ZardDemoDataTablePinningResizingComponent,
          codeData: DATA_TABLE_DEMO_PINNING_RESIZING,
        },
      ],
    },
    {
      id: 'rtl',
      title: 'RTL',
      description: 'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).',
      examples: [
        {
          name: 'rtl',
          type: 'rtl' as const,
          component: ZardDemoDataTableRtlComponent,
          codeData: DATA_TABLE_DEMO_RTL,
        },
      ],
    },
  ],
};
