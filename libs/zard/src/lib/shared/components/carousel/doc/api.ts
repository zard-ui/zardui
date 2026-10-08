import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const CAROUSEL_API: ApiSection[] = [
  {
    selector: 'z-carousel',
    description:
      'A carousel component with slide controls and swipe gesture support. Add `#ref="zCarousel"` on the element to call its public methods.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOptions]',
        description:
          "Embla Carousel configuration options, including `align` ('start' | 'center' | 'end'), `loop`, and `direction` ('ltr' | 'rtl'). `axis` is derived from `zOrientation` and should not be set here",
        type: 'EmblaOptionsType',
        default: '{loop: false}',
      },
      {
        name: '[zPlugins]',
        description: 'Embla Carousel plugins, e.g. an autoplay plugin created with `ZardCarouselPluginsService`',
        type: 'EmblaPluginType[]',
        default: '[]',
      },
      {
        name: '[zOrientation]',
        description: 'Carousel orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      {
        name: '[zControls]',
        description: 'Navigation controls rendered inside the carousel',
        type: "'button' | 'dot' | 'none'",
        default: "'button'",
      },
      {
        name: '(zInited)',
        description:
          'Emits the Embla Carousel instance once initialized; read the current slide (`selectedScrollSnap()`) and total slide count (`scrollSnapList().length`) off it',
        type: 'EventEmitter<EmblaCarouselType>',
        default: '-',
      },
      {
        name: '(zSelected)',
        description: 'Emitted when the selected slide changes',
        type: 'EventEmitter<void>',
        default: '-',
      },
      {
        name: 'slidePrevious()',
        description: 'Public method that scrolls to the previous slide',
        type: '() => void',
        default: '-',
      },
      {
        name: 'slideNext()',
        description: 'Public method that scrolls to the next slide',
        type: '() => void',
        default: '-',
      },
      {
        name: 'goTo(index)',
        description: 'Public method that scrolls to the slide at the given index',
        type: '(index: number) => void',
        default: '-',
      },
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
