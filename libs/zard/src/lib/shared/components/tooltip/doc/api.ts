import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOOLTIP_API: ApiSection[] = [
  {
    selector: '[z-tooltip]',
    description: 'A directive that shows a tooltip popup on hover or click.',
    props: [
      { name: 'zTooltip', description: 'The text content of tooltip', type: 'string', default: '-' },
      {
        name: 'zPosition',
        description: 'The position of the tooltip',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
      },
      { name: 'zTrigger', description: 'The tooltip trigger mode', type: "'hover' | 'click'", default: "'hover'" },
      {
        name: 'zShowDelay',
        description: 'Delay showing the tooltip after trigger in milliseconds',
        type: 'number',
        default: '150',
      },
      {
        name: 'zHideDelay',
        description: 'Delay hiding the tooltip after trigger in milliseconds',
        type: 'number',
        default: '100',
      },
      { name: '(zShow)', description: 'Emitted when the tooltip is shown', type: 'output<void>', default: '-' },
      { name: '(zHide)', description: 'Emitted when the tooltip is hidden', type: 'output<void>', default: '-' },
    ],
  },
];
