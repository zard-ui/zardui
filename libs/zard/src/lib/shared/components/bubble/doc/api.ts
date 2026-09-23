import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BUBBLE_API: ApiSection[] = [
  {
    selector: 'z-bubble',
    description:
      'The root bubble wrapper. Content projected straight into it gets the bubble surface, so a plain turn needs no sub-component.',
    props: [
      {
        name: '[zVariant]',
        description: 'The bubble visual treatment.',
        type: 'default | secondary | muted | tinted | outline | ghost | destructive',
        default: 'default',
      },
      {
        name: '[zAlign]',
        description: 'The inline alignment of the bubble.',
        type: 'start | end',
        default: 'start',
      },
      {
        name: '[class]',
        description: 'Additional classes to apply to the root element.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-bubble-content',
    description:
      'The bubble content wrapper. Project it to style the surface, or use it as an attribute on a button or anchor to render the content as an interactive element.',
    props: [
      {
        name: '[class]',
        description: 'Additional classes to apply to the content element.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-bubble-reactions',
    description: 'Displays overlapped reactions for a bubble.',
    props: [
      {
        name: '[zSide]',
        description: 'The side of the bubble to anchor the reactions.',
        type: 'top | bottom',
        default: 'bottom',
      },
      {
        name: '[zAlign]',
        description: 'The inline alignment of the reactions.',
        type: 'start | end',
        default: 'end',
      },
      {
        name: '[class]',
        description: 'Additional classes to apply to the reaction row.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-bubble-group',
    description: 'Groups consecutive bubbles from the same sender.',
    props: [
      {
        name: '[class]',
        description: 'Additional classes to apply to the group root.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
];
