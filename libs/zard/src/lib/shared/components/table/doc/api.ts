import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };

export const TABLE_API: ApiSection[] = [
  {
    selector: 'table[z-table]',
    description: 'Table root on a native `<table>`.',
    props: [
      CLASS_PROP,
      {
        name: '[zType]',
        description: 'Visual style',
        type: "'default' | 'striped' | 'bordered'",
        default: "'default'",
      },
      {
        name: '[zSize]',
        description: 'Cell padding density',
        type: "'default' | 'compact' | 'comfortable'",
        default: "'default'",
      },
    ],
  },
  {
    selector: 'thead[z-table-header]',
    description: 'Table header section.',
    props: [CLASS_PROP],
  },
  {
    selector: 'tbody[z-table-body]',
    description: 'Table body section.',
    props: [CLASS_PROP],
  },
  {
    selector: 'tr[z-table-row]',
    description: 'Table row; highlights on hover and with `data-state="selected"`.',
    props: [CLASS_PROP],
  },
  {
    selector: 'th[z-table-head]',
    description: 'Header cell; set `scope` yourself.',
    props: [CLASS_PROP],
  },
  {
    selector: 'td[z-table-cell]',
    description: 'Data cell.',
    props: [CLASS_PROP],
  },
  {
    selector: 'caption[z-table-caption]',
    description: 'Table caption, its accessible name.',
    props: [CLASS_PROP],
  },
  {
    selector: 'tfoot[z-table-footer]',
    description: 'Table footer section.',
    props: [CLASS_PROP],
  },
];
