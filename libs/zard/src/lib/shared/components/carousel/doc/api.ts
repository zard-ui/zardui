import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CAROUSEL_API: ApiSection[] = [
  {
    selector: 'z-carousel',
    description: 'Slides with controls and swipe; use `#ref="zCarousel"` to call its methods.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOptions]',
        description: 'Embla options; `axis` comes from `zOrientation`',
        type: 'EmblaOptionsType',
        default: '{loop: false}',
      },
      { name: '[zPlugins]', description: 'Embla plugins, e.g. autoplay', type: 'EmblaPluginType[]', default: '[]' },
      {
        name: '[zOrientation]',
        description: 'Scroll axis',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: '[zControls]',
        description: 'Navigation controls',
        type: "'button' | 'dot' | 'none'",
        default: "'button'",
      },
      {
        name: '(zInited)',
        description: 'Emitted with the Embla instance once ready',
        type: 'EventEmitter<EmblaCarouselType>',
        default: '-',
      },
      { name: '(zSelected)', description: 'Emitted when the slide changes', type: 'EventEmitter<void>', default: '-' },
      { name: 'slidePrevious()', description: 'Goes to the previous slide', type: '() => void', default: '-' },
      { name: 'slideNext()', description: 'Goes to the next slide', type: '() => void', default: '-' },
      {
        name: 'goTo(index)',
        description: 'Goes to the slide at `index`',
        type: '(index: number) => void',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-carousel-content',
    description: 'Holds the carousel items.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-carousel-item',
    description: 'A single slide.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
