import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BUBBLE_API: ApiSection[] = [
  {
    selector: 'z-bubble',
    description: 'Bubble root; projected content gets the bubble surface.',
    props: [
      {
        name: '[zVariant]',
        description: 'Visual variant',
        type: 'default | secondary | muted | tinted | outline | ghost | destructive',
        default: 'default',
      },
      { name: '[zAlign]', description: 'Inline alignment', type: 'start | end', default: 'start' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-bubble-content',
    description: 'Bubble surface; also works as an attribute on a button or link.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-bubble-reactions',
    description: 'Overlapping reactions on a bubble.',
    props: [
      { name: '[zSide]', description: 'Bubble edge the reactions anchor to', type: 'top | bottom', default: 'bottom' },
      { name: '[zAlign]', description: 'Inline alignment', type: 'start | end', default: 'end' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-bubble-group',
    description: 'Groups consecutive bubbles from the same sender.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
];
