import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const AVATAR_API: ApiSection[] = [
  {
    selector: 'z-avatar',
    description: 'User image with a fallback.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zAlt]', description: 'Image alt text', type: 'string', default: "''" },
      { name: '[zFallback]', description: 'Text shown while loading or on error', type: 'string', default: "''" },
      { name: '[zPriority]', description: 'Loads the image with high priority', type: 'boolean', default: 'false' },
      { name: '[zSize]', description: 'Avatar size', type: "'sm' | 'default' | 'lg'", default: "'default'" },
      { name: '[zSrc]', description: 'Image source URL', type: 'string | SafeUrl', default: "''" },
      { name: '[zShowBadge]', description: 'Shows a badge', type: 'boolean', default: 'false' },
      { name: '[zBadgeClass]', description: 'CSS classes for the badge', type: 'ClassValue', default: "''" },
      { name: '[zBadgeIcon]', description: 'Badge icon', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'z-avatar-group',
    description: 'Stacks several avatars.',
    props: [
      {
        name: '[zOrientation]',
        description: 'Layout direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'z-avatar-group-count',
    description: 'A "+N" chip for hidden members.',
    props: [
      { name: '[zCount]', description: 'Number of hidden members', type: 'number', default: '0' },
      {
        name: '[zSize]',
        description: 'Chip size; match the avatars',
        type: "'sm' | 'default' | 'lg'",
        default: "'default'",
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
    ],
  },
];
