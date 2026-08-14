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
        description:
          'Side of the trigger the popover opens on. `inline-start` and `inline-end` follow the text direction',
        type: "'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'",
        default: "'bottom'",
      },
      {
        name: 'zAlign',
        description: 'Alignment of the popover along the side of the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
      },
      {
        name: 'zSideOffset',
        description: 'Distance in pixels between the popover and the trigger',
        type: 'number',
        default: '4',
      },
      {
        name: 'zAlignOffset',
        description: 'Offset in pixels along the alignment axis',
        type: 'number',
        default: '0',
      },
      { name: 'zOrigin', description: 'Custom anchor element', type: 'ElementRef', default: '-' },
      { name: 'zVisible', description: 'Control visibility programmatically', type: 'boolean', default: 'false' },
      { name: 'zOverlayClickable', description: 'Close on outside click', type: 'boolean', default: 'true' },
      {
        name: 'zVisibleChange',
        description: 'Emits when visibility changes. Fires immediately, before the exit animation ends',
        type: 'EventEmitter<boolean>',
        default: '',
      },
    ],
  },
  {
    selector: 'z-popover',
    description:
      'The popover content. Exposes `data-side`, `data-align` and `data-open`/`data-closed` while it is mounted.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-popover-header',
    description: 'Groups the title and the description at the top of the popover.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-popover-title',
    description: 'The popover title. Wired to the content through `aria-labelledby`.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-popover-description',
    description: 'The popover description. Wired to the content through `aria-describedby`.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
