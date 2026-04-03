import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TABS_API: ApiSection[] = [
  {
    selector: '[z-tab]',
    description:
      'A component that allows you to create a tabbed interface with customizable navigation and active indicator positions.',
    props: [
      {
        name: '[zPosition]',
        description: 'Position of the tab navigation',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
      },
      {
        name: '[zActivePosition]',
        description: 'Position of the active indicator',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'bottom'",
      },
      {
        name: '[zShowArrow]',
        description: 'Whether to show scroll arrows when content overflows',
        type: 'true | false',
        default: 'true',
      },
      {
        name: '[zScrollAmount]',
        description: 'Pixel amount to scroll when arrow buttons are clicked',
        type: 'number',
        default: '100',
      },
      {
        name: '[zAlignTabs]',
        description: 'Alignment of tabs within the navigation',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      { name: '(zTabChange)', description: 'Emits when a new tab is selected', type: '$event', default: '-' },
      { name: '(zDeselect)', description: 'Emits when the current tab is deselected', type: '$event', default: '-' },
    ],
  },
];
