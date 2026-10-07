import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };

export const TABLE_API: ApiSection[] = [
  {
    selector: 'table[z-table]',
    description:
      'The table root. Apply the `z-table` attribute to a native `<table>` — it styles nested cells and rows through descendant selectors, and picks up the full set of per-slot styles once you also apply the matching attribute to each native tag: `z-table-header`, `z-table-body`, `z-table-row`, `z-table-head`, `z-table-cell`, `z-table-caption`, `z-table-footer`.',
    props: [
      CLASS_PROP,
      {
        name: '[zType]',
        description: 'Visual style of the table',
        type: "'default' | 'striped' | 'bordered'",
        default: "'default'",
      },
      {
        name: '[zSize]',
        description: 'Row and cell padding density',
        type: "'default' | 'compact' | 'comfortable'",
        default: "'default'",
      },
    ],
  },
  {
    selector: 'thead[z-table-header]',
    description: 'The table header section. Apply the attribute to a native `<thead>`.',
    props: [CLASS_PROP],
  },
  {
    selector: 'tbody[z-table-body]',
    description:
      'The table body section. Apply the attribute to a native `<tbody>`; its last row renders without a bottom border.',
    props: [CLASS_PROP],
  },
  {
    selector: 'tr[z-table-row]',
    description:
      'A table row. Apply the attribute to a native `<tr>`; it highlights on hover and when `[data-state="selected"]` is set on the element.',
    props: [CLASS_PROP],
  },
  {
    selector: 'th[z-table-head]',
    description:
      'A header cell. Apply the attribute to a native `<th>`; set `scope="col"` (or `"row"`) on the element yourself so the table stays accessible.',
    props: [CLASS_PROP],
  },
  {
    selector: 'td[z-table-cell]',
    description: 'A data cell. Apply the attribute to a native `<td>`.',
    props: [CLASS_PROP],
  },
  {
    selector: 'caption[z-table-caption]',
    description:
      'The table caption, giving the table an accessible name for screen readers. Apply the attribute to a native `<caption>`.',
    props: [CLASS_PROP],
  },
  {
    selector: 'tfoot[z-table-footer]',
    description: 'The table footer section, typically a totals row. Apply the attribute to a native `<tfoot>`.',
    props: [CLASS_PROP],
  },
];
