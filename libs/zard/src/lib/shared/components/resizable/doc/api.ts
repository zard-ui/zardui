import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const RESIZABLE_API: ApiSection[] = [
  {
    selector: 'z-resizable',
    description: 'Panel group that sizes its panels; event `sizes` are percentages in panel order.',
    props: [
      { name: '[zLayout]', description: 'Panel direction', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
      { name: '[zLazy]', description: 'Update panels only when the resize ends', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '(zResizeStart)',
        description: 'Emitted when a resize starts',
        type: 'EventEmitter<ZardResizeEvent>',
        default: '-',
      },
      {
        name: '(zResize)',
        description: 'Emitted on every resize step',
        type: 'EventEmitter<ZardResizeEvent>',
        default: '-',
      },
      {
        name: '(zResizeEnd)',
        description: 'Emitted when a resize ends, with the final sizes',
        type: 'EventEmitter<ZardResizeEvent>',
        default: '-',
      },
      {
        name: 'collapsePanel(index)',
        description: 'Toggles a `zCollapsible` panel between 0 and its default size',
        type: '(index: number) => void',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-resizable-panel',
    description:
      'A panel in the group; sizes are percentages (0-100) or `"px"` strings, and should add up to 100 per group.',
    props: [
      {
        name: '[zDefaultSize]',
        description: 'Initial size; omitted panels share the remaining space',
        type: 'number | string | undefined',
        default: 'undefined',
      },
      { name: '[zMin]', description: 'Minimum size', type: 'number | string', default: '0' },
      { name: '[zMax]', description: 'Maximum size', type: 'number | string', default: '100' },
      {
        name: '[zCollapsible]',
        description: 'Lets the handle collapse this panel to 0',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zResizable]',
        description: 'Lets the adjacent handles resize this panel',
        type: 'boolean',
        default: 'true',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-resizable-handle',
    description: 'Draggable, keyboard-operable divider between two panels.',
    props: [
      { name: '[zWithHandle]', description: 'Shows a grip indicator', type: 'boolean', default: 'false' },
      {
        name: '[zDisabled]',
        description: 'Disables dragging, keyboard resize and collapse',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zHandleIndex]',
        description: 'Handle position; required when the group has several handles',
        type: 'number',
        default: '0',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
