import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TABS_API: ApiSection[] = [
  {
    selector: 'z-tab-group',
    description: 'Layered panels shown one at a time.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zVariant]', description: 'Visual variant', type: "'default' | 'line'", default: "'default'" },
      {
        name: '[zOrientation]',
        description: 'Layout direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      { name: '[zDisabled]', description: 'Disables the whole group', type: 'boolean', default: 'false' },
      {
        name: '(zTabChange)',
        description: 'Emitted when a tab is selected',
        type: 'EventEmitter<{ index: number; label: string; tab: ZardTabComponent }>',
        default: '-',
      },
      {
        name: '(zDeselect)',
        description: 'Emitted when the current tab is deselected',
        type: 'EventEmitter<{ index: number; label: string; tab: ZardTabComponent }>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-tab',
    description: 'A tab; its projected content is the panel.',
    props: [
      { name: '[label]', description: 'Tab label', type: 'string', default: '-' },
      { name: '[zIcon]', description: 'Icon before the label', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables this tab', type: 'boolean', default: 'false' },
    ],
  },
];
