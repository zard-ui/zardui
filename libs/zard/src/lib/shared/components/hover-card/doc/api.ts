import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

/** Public API reference displayed on the Hover Card documentation page. */
export const HOVER_CARD_API: ApiSection[] = [
  {
    selector: '[zHoverCard]',
    description: 'Directive that opens rich content on hover or focus.',
    props: [
      { name: '[zContent]', description: 'Hover card template (required)', type: 'TemplateRef<void>', default: '-' },
      {
        name: '[zPlacement]',
        description: 'Side of the trigger; `inline-*` flips in RTL',
        type: "'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'",
        default: "'bottom'",
      },
      { name: '[zOpenDelay]', description: 'Open delay in ms', type: 'number', default: '700' },
      { name: '[zCloseDelay]', description: 'Close delay in ms', type: 'number', default: '300' },
      { name: '[zVisible]', description: 'Controls visibility programmatically', type: 'boolean', default: 'false' },
      {
        name: '(zVisibleChange)',
        description: 'Emitted when visibility changes',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-hover-card',
    description: 'The hover card content.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
