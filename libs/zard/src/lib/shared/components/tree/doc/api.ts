import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TREE_API: ApiSection[] = [
  {
    selector: 'z-tree',
    description: 'The root container for a hierarchical tree view.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zData]', description: 'Tree data source', type: 'TreeNode<T>[]', default: '[]' },
      { name: '[zSelectable]', description: 'Enable node selection on click', type: 'boolean', default: 'false' },
      {
        name: '[zCheckable]',
        description: 'Enable checkbox selection with propagation',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zExpandAll]', description: 'Expand all nodes initially', type: 'boolean', default: 'false' },
      {
        name: '[zVirtualScroll]',
        description: 'Enable virtual scrolling for large trees',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zVirtualItemSize]',
        description: 'Virtual scroll item height in pixels',
        type: 'number',
        default: '32',
      },
      { name: '(zNodeClick)', description: 'Node clicked', type: 'TreeNode<T>', default: '-' },
      { name: '(zNodeExpand)', description: 'Node expanded', type: 'TreeNode<T>', default: '-' },
      { name: '(zNodeCollapse)', description: 'Node collapsed', type: 'TreeNode<T>', default: '-' },
      { name: '(zSelectionChange)', description: 'Selection changed', type: 'TreeNode<T>[]', default: '-' },
      { name: '(zCheckChange)', description: 'Checked nodes changed', type: 'TreeNode<T>[]', default: '-' },
    ],
  },
];
