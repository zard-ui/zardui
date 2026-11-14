import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };
const TABLE_PROP = {
  name: '[zTable]',
  description: 'The table instance returned by `injectTable`',
  type: 'AngularTable<TFeatures, TData>',
  default: '—',
};

export const DATA_TABLE_API: ApiSection[] = [
  {
    selector: 'z-data-table',
    description:
      'Renders the header groups and the current row model of a TanStack table with `z-table`, through `FlexRender`. It follows the features the table declares: selected rows get `data-state="selected"`, `columnSizingFeature` sets the column widths and adds resize handles with `columnResizingFeature`, and `columnPinningFeature` makes pinned columns sticky (pinning more than one column per side needs `columnSizingFeature`, which knows their widths). Column `meta.headerClass` and `meta.cellClass` (`ZardDataTableColumnMeta`) go on the column’s `th` and `td`.',
    props: [
      TABLE_PROP,
      {
        name: '[zExpandedRow]',
        description:
          'Template rendered in a full-width row under each expanded row (`rowExpandingFeature`); the row is `let-row`',
        type: 'TemplateRef<ZardDataTableExpandedRowContext>',
        default: '—',
      },
      {
        name: '[zLoading]',
        description: 'Dims the rows and sets `aria-busy` while data loads',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zLoadingText]',
        description: 'Text shown instead of `zEmptyText` while loading with no rows',
        type: 'string',
        default: "'Loading...'",
      },
      {
        name: '[zEmptyText]',
        description: 'Text shown when there are no rows',
        type: 'string',
        default: "'No results.'",
      },
      {
        name: '[zTableClass]',
        description: 'Classes for the inner `table[z-table]`',
        type: 'ClassValue',
        default: "''",
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-data-table-column-header',
    description:
      'A header menu with Asc and Desc (`rowSortingFeature`), Pin to start, Pin to end and Unpin (`columnPinningFeature`), and Hide (`columnVisibilityFeature`) — each shows when the table has its feature. Render it from a column definition with `flexRenderComponent`; it reads the header from DI, so it takes no table input.',
    props: [{ name: '[zTitle]', description: 'The column title', type: 'string', default: '—' }, CLASS_PROP],
  },
  {
    selector: 'z-data-table-pagination',
    description:
      'Selection count, rows-per-page select, page indicator and first/previous/next/last buttons. Needs the row pagination feature; the selection count shows when row selection is on.',
    props: [
      TABLE_PROP,
      {
        name: '[zPageSizeOptions]',
        description: 'Choices of the rows-per-page select',
        type: 'number[]',
        default: '[10, 20, 25, 30, 40, 50]',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-data-table-view-options',
    description: 'A "View" dropdown that toggles the hideable accessor columns. Needs the column visibility feature.',
    props: [
      TABLE_PROP,
      { name: '[zLabel]', description: 'Trigger label', type: 'string', default: "'View'" },
      CLASS_PROP,
    ],
  },
];
