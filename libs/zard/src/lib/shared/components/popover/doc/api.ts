import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const POPOVER_API: ApiSection[] = [
  {
    selector: '[zPopover]',
    description: 'Directive that opens a popover from its host element.',
    props: [
      {
        name: '[zTrigger]',
        description: 'How the popover opens',
        type: "'click' | 'hover' | null",
        default: "'click'",
      },
      { name: '[zContent]', description: 'Popover template (required)', type: 'TemplateRef<unknown>', default: '-' },
      {
        name: '[zPlacement]',
        description: 'Side of the trigger; `inline-*` follows text direction',
        type: "'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'",
        default: "'bottom'",
      },
      {
        name: '[zAlign]',
        description: 'Alignment along the trigger side',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
      },
      { name: '[zSideOffset]', description: 'Distance from the trigger in px', type: 'number', default: '4' },
      { name: '[zAlignOffset]', description: 'Offset along the alignment axis in px', type: 'number', default: '0' },
      { name: '[zOrigin]', description: 'Custom anchor element', type: 'ElementRef', default: '-' },
      { name: '[zVisible]', description: 'Controls visibility programmatically', type: 'boolean', default: 'false' },
      { name: '[zOverlayClickable]', description: 'Closes on outside click', type: 'boolean', default: 'true' },
      {
        name: '(zVisibleChange)',
        description: 'Emitted when visibility changes, before the exit animation',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-popover',
    description: 'The popover content.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-popover-header',
    description: 'Groups the title and description.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-popover-title',
    description: 'Popover title, wired via `aria-labelledby`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-popover-description',
    description: 'Popover description, wired via `aria-describedby`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
