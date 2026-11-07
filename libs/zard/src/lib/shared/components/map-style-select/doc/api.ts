import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MAP_STYLE_SELECT_API: ApiSection[] = [
  {
    selector: 'z-map-style-select',
    description: 'Picks the basemap of every map on the page; maps with their own `[styles]` ignore it.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAriaLabel]',
        description: 'Accessible name, caption and popover title',
        type: 'string',
        default: "'Map style'",
      },
      {
        name: '[zAlign]',
        description: 'Button edge the popover aligns to',
        type: "'start' | 'center' | 'end'",
        default: "'end'",
      },
      {
        name: '(zStyleChange)',
        description: 'Emits the picked preset once applied',
        type: 'ZardMapPreset',
        default: '-',
      },
    ],
  },
];
