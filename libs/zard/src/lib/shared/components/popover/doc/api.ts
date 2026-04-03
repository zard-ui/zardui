import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const POPOVER_API: ApiSection[] = [
  {
    selector: '[zPopover]',
    description: 'The directive that creates a popover when applied to a trigger element.',
    props: [
      {
        name: 'zTrigger',
        description: 'How the popover is triggered',
        type: "'click' | 'hover' | null",
        default: "'click'",
      },
      {
        name: 'zContent',
        description: 'Required. Template to display in the popover',
        type: 'TemplateRef<unknown>',
        default: '-',
      },
      {
        name: 'zPlacement',
        description: 'Position relative to trigger',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'bottom'",
      },
      { name: 'zOrigin', description: 'Custom anchor element', type: 'ElementRef', default: '-' },
      { name: 'zVisible', description: 'Control visibility programmatically', type: 'boolean', default: 'false' },
      { name: 'zOverlayClickable', description: 'Close on outside click', type: 'boolean', default: 'true' },
      {
        name: 'zVisibleChange',
        description: 'Emits when visibility changes',
        type: 'EventEmitter<boolean>',
        default: '',
      },
    ],
  },
  {
    selector: 'z-popover',
    description: 'The wrapper component for popover content styling.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'string', default: "''" }],
  },
];
