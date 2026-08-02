import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CAROUSEL_API: ApiSection[] = [
  {
    selector: 'z-carousel',
    description: 'A carousel component with slide controls and swipe gesture support.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOptions]',
        description: 'Embla Carousel configuration options',
        type: 'EmblaOptionsType',
        default: '{loop: false}',
      },
      { name: '[zPlugins]', description: 'Embla Carousel plugins', type: 'EmblaPluginType[]', default: '[]' },
      {
        name: '[zOrientation]',
        description: 'Carousel orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: '[zControls]',
        description: 'Navigation type buttons',
        type: "'button' | 'dot' | 'none'",
        default: "'button'",
      },
      {
        name: '(zInited)',
        description: 'Emits Embla API when carousel is initialized',
        type: 'EmblaCarouselType',
        default: '-',
      },
      { name: '(zSelected)', description: 'Emitted when a slide is selected', type: 'void', default: '-' },
    ],
  },
  {
    selector: 'z-carousel-content',
    description: 'The content container for the carousel.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-carousel-item',
    description: 'An individual carousel item.',
    props: [{ name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
