import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TABLE_API: ApiSection[] = [
  {
    selector: '[z-table]',
    description:
      'A directive that accepts all properties supported by a native table. It automatically styles all nested table elements without requiring additional directives.',
    props: [
      { name: 'zType', description: 'Table type', type: "'default' | 'striped' | 'bordered'", default: "'default'" },
      { name: 'zSize', description: 'Table size', type: "'default' | 'compact' | 'comfortable'", default: "'default'" },
    ],
  },
  {
    selector: '[z-table-header]',
    description: 'Applies styles to table header sections.',
    props: [],
  },
  {
    selector: '[z-table-body]',
    description: 'Applies styles to table body sections.',
    props: [],
  },
  {
    selector: '[z-table-row]',
    description: 'Applies styles to table rows.',
    props: [],
  },
  {
    selector: '[z-table-head]',
    description: 'Applies styles to table header cells.',
    props: [],
  },
  {
    selector: '[z-table-cell]',
    description: 'Applies styles to table data cells.',
    props: [],
  },
  {
    selector: '[z-table-caption]',
    description: 'Applies styles to table captions.',
    props: [],
  },
];
