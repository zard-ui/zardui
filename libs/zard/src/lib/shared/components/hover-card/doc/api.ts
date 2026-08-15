import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

/** Public API reference displayed on the Hover Card documentation page. */
export const HOVER_CARD_API: ApiSection[] = [
  {
    selector: '[zHoverCard]',
    description: 'The directive that opens rich content when its trigger is hovered or focused.',
    props: [
      {
        name: 'zHoverCard',
        description: 'Required. Template rendered inside the hover card',
        type: 'TemplateRef<void>',
        default: '-',
      },
      {
        name: 'zPlacement',
        description: 'Preferred position relative to the trigger',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'bottom'",
      },
      {
        name: 'zOpenDelay',
        description: 'Delay in milliseconds before opening',
        type: 'number',
        default: '700',
      },
      {
        name: 'zCloseDelay',
        description: 'Delay in milliseconds before closing',
        type: 'number',
        default: '300',
      },
      {
        name: 'zVisible',
        description: 'Controls visibility programmatically',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zVisibleChange',
        description: 'Emits when visibility changes',
        type: 'output<boolean>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-hover-card',
    description: 'The wrapper component that styles hover card content.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
