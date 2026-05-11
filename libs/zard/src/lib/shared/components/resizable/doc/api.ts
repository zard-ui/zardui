import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const RESIZABLE_API: ApiSection[] = [
  {
    selector: 'z-resizable',
    description: 'The main container component that manages resizable panels.',
    props: [
      {
        name: 'zLayout',
        description: 'Layout direction of the panels',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: 'zLazy',
        description: 'If true, panels only update after resize ends',
        type: 'boolean',
        default: 'false',
      },
      { name: 'class', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
      {
        name: 'zResizeStart',
        description: 'Emitted when resize starts',
        type: 'output<ZardResizeEvent>',
        default: '-',
      },
      { name: 'zResize', description: 'Emitted during resize', type: 'output<ZardResizeEvent>', default: '-' },
      { name: 'zResizeEnd', description: 'Emitted when resize ends', type: 'output<ZardResizeEvent>', default: '-' },
    ],
  },
  {
    selector: 'z-resizable-panel',
    description: 'Individual panel component within a resizable container.',
    props: [
      {
        name: 'zDefaultSize',
        description: 'Initial size as percentage',
        type: 'number | string | undefined',
        default: 'undefined',
      },
      { name: 'zMin', description: 'Minimum size as percentage', type: 'number', default: '0' },
      { name: 'zMax', description: 'Maximum size as percentage', type: 'number', default: '100' },
      { name: 'zCollapsible', description: 'Whether panel can be collapsed', type: 'boolean', default: 'false' },
      { name: 'zResizable', description: 'Whether panel can be resized', type: 'boolean', default: 'true' },
      { name: 'class', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-resizable-handle',
    description: 'Draggable divider between panels.',
    props: [
      { name: 'zWithHandle', description: 'Shows visual grip handle', type: 'boolean', default: 'false' },
      { name: 'zDisabled', description: 'Disables resize functionality', type: 'boolean', default: 'false' },
      { name: 'zHandleIndex', description: 'Index of the handle (auto-managed)', type: 'number', default: '0' },
      { name: 'class', description: 'Additional CSS classes to apply', type: 'ClassValue', default: "''" },
    ],
  },
];
