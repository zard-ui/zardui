import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOOLTIP_API: ApiSection[] = [
  {
    selector: '[zTooltip]',
    description: 'The directive that shows a tooltip popup when its host is hovered, focused, or clicked.',
    props: [
      {
        name: '[zTooltip]',
        description: 'The tooltip content: a string, or a template for richer content such as a `z-kbd`',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zPosition]',
        description: 'Side of the trigger the tooltip opens on (shadcn calls this input `side`)',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
      },
      {
        name: '[zPositionOffset]',
        description: 'Distance in pixels between the tooltip and the trigger',
        type: 'number',
        default: '4',
      },
      {
        name: '[zTrigger]',
        description: 'How the tooltip is triggered',
        type: "'hover' | 'click'",
        default: "'hover'",
      },
      {
        name: '[zShowDelay]',
        description: 'Delay in milliseconds before showing the tooltip',
        type: 'number',
        default: '150',
      },
      {
        name: '[zHideDelay]',
        description: 'Delay in milliseconds before hiding the tooltip',
        type: 'number',
        default: '100',
      },
      { name: '(zShow)', description: 'Emits when the tooltip is shown', type: 'EventEmitter<void>', default: '-' },
      { name: '(zHide)', description: 'Emits when the tooltip is hidden', type: 'EventEmitter<void>', default: '-' },
    ],
  },
  {
    selector: 'z-tooltip',
    description:
      'The tooltip content. Mounted automatically by `[zTooltip]` — never placed directly in a template. Exposes `role="tooltip"`, `data-side` and `data-state` while mounted.',
    props: [],
  },
];
