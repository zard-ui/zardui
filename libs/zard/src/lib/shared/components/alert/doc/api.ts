import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ALERT_API: ApiSection[] = [
  {
    selector: 'z-alert',
    description: 'Displays a callout for user attention.',
    props: [
      { name: '[zTitle]', description: 'Alert title', type: 'string | TemplateRef<void>', default: '-' },
      { name: '[zDescription]', description: 'Alert description', type: 'string | TemplateRef<void>', default: '-' },
      {
        name: '[zIcon]',
        description: 'Alert icon. If not specified, default icon will be lucideCircleAlert',
        type: 'TemplateRef<void> | string',
        default: '-',
      },
      { name: '[zType]', description: 'Alert variant', type: "'default' | 'destructive'", default: "'default'" },
    ],
  },
];
