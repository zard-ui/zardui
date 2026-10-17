import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MAP_STYLE_SELECT_API: ApiSection[] = [
  {
    selector: 'z-map-style-select',
    description:
      'Picks the basemap of every map on the page, live. A button shows the style in use with a mini-map swatch and opens a popover that lists the presets of `ZardMapStyleService` by provider, each with a swatch of its own. A key-based preset asks for its API key inline, under the list. It has an effect wherever `provideZardMap()` is registered, and a map with its own `[styles]` ignores it.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAriaLabel]',
        description: 'Accessible name of the picker, also its caption and the title of the popover',
        type: 'string',
        default: "'Map style'",
      },
      {
        name: '[zAlign]',
        description: 'Which edge of the button the popover lines up with',
        type: "'start' | 'center' | 'end'",
        default: "'end'",
      },
      {
        name: '(zStyleChange)',
        description: 'Emits the preset in use after a pick, and for a key-based preset after its key was accepted',
        type: 'ZardMapPreset',
        default: '-',
      },
    ],
  },
];
