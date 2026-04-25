import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TABS_API: ApiSection[] = [
  {
    selector: 'z-tab-group',
    description: 'A set of layered sections of content — known as tab panels — displayed one at a time.',
    props: [
      {
        name: '[zVariant]',
        description: 'Visual variant of the tab navigation',
        type: "'default' | 'line'",
        default: "'default'",
      },
      {
        name: '[zOrientation]',
        description: 'Layout direction of the tab group',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: '[zDisabled]',
        description: 'Whether the entire tab group is disabled',
        type: 'boolean',
        default: 'false',
      },
      { name: '(zTabChange)', description: 'Emits when a new tab is selected', type: '$event', default: '-' },
      { name: '(zDeselect)', description: 'Emits when the current tab is deselected', type: '$event', default: '-' },
    ],
  },
  {
    selector: 'z-tab',
    description: 'An individual tab. Label is shown in the navigation; projected content becomes the tab panel.',
    props: [
      { name: 'label', description: 'Label displayed in the tab button', type: 'string', default: '-' },
      {
        name: '[zIcon]',
        description: 'Optional ng-icons name shown before the label',
        type: 'string',
        default: '-',
      },
      {
        name: '[zDisabled]',
        description: 'Whether this individual tab is disabled',
        type: 'boolean',
        default: 'false',
      },
    ],
  },
];
