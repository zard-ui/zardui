import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const AVATAR_API: ApiSection[] = [
  {
    selector: 'z-avatar',
    description: 'An image element with a fallback for representing the user.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'string', default: "''" },
      { name: '[zAlt]', description: 'Image alt text for accessibility', type: 'string', default: "''" },
      {
        name: '[zFallback]',
        description: 'Fallback text displayed while loading or on error',
        type: 'string',
        default: "''",
      },
      { name: '[zPriority]', description: 'Should image load with high priority', type: 'boolean', default: 'false' },
      { name: '[zShape]', description: 'Avatar shape', type: "'circle' | 'rounded' | 'square'", default: "'circle'" },
      {
        name: '[zSize]',
        description: 'Avatar size variant',
        type: "'sm' | 'default' | 'md' | 'lg' | 'xl'",
        default: "'default'",
      },
      { name: '[zSrc]', description: 'Image source URL', type: 'string | SafeUrl', default: "''" },
      {
        name: '[zStatus]',
        description: 'Status indicator badge',
        type: "'online' | 'offline' | 'doNotDisturb' | 'away'",
        default: '-',
      },
    ],
  },
  {
    selector: 'z-avatar-group',
    description: 'A group container for displaying multiple avatars.',
    props: [
      {
        name: '[zOrientation]',
        description: 'Layout direction of avatars',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
      { name: '[class]', description: 'Additional CSS classes', type: 'string', default: "''" },
    ],
  },
];
