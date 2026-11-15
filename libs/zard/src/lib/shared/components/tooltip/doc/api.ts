import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOOLTIP_API: ApiSection[] = [
  {
    selector: '[zTooltip]',
    description: 'Directive that shows a tooltip on hover, focus or click.',
    props: [
      { name: '[zTooltip]', description: 'Tooltip text or template', type: 'string | TemplateRef<void>', default: '-' },
      {
        name: '[zPosition]',
        description: 'Side of the trigger; `inline-*` flips in RTL',
        type: "'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'",
        default: "'top'",
      },
      { name: '[zPositionOffset]', description: 'Distance from the trigger in px', type: 'number', default: '4' },
      { name: '[zTrigger]', description: 'How the tooltip opens', type: "'hover' | 'click'", default: "'hover'" },
      { name: '[zShowDelay]', description: 'Show delay in ms', type: 'number', default: '150' },
      { name: '[zHideDelay]', description: 'Hide delay in ms', type: 'number', default: '100' },
      { name: '(zShow)', description: 'Emitted when the tooltip shows', type: 'EventEmitter<void>', default: '-' },
      { name: '(zHide)', description: 'Emitted when the tooltip hides', type: 'EventEmitter<void>', default: '-' },
    ],
  },
  {
    selector: 'z-tooltip',
    description: 'Tooltip content, mounted by `[zTooltip]`; not used directly.',
    props: [],
  },
];
