import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MAP_STYLE_SELECT_API: ApiSection[] = [
  {
    selector: 'z-map-style-select',
    description:
      'Picks the basemap of every map on the page, live. It lists the presets of `ZardMapStyleService` grouped by provider, with a swatch per style, and asks for an API key inline when a key-based preset is picked. It has an effect wherever `provideZardMap()` is registered, and a map with its own `[styles]` ignores it.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zAriaLabel]', description: 'Accessible name of the picker', type: 'string', default: "'Map style'" },
      {
        name: '(zStyleChange)',
        description: 'Emits the preset in use after a pick, and for a key-based preset after its key was accepted',
        type: 'ZardMapPreset',
        default: '-',
      },
    ],
  },
];
