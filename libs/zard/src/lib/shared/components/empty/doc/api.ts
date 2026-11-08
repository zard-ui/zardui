import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const EMPTY_API: ApiSection[] = [
  {
    selector: 'z-empty',
    description: 'Placeholder for when there is no data.',
    props: [
      {
        name: '[zIcon]',
        description: 'Icon in the media slot; ignored when `zImage` is set',
        type: 'ZardIcon',
        default: '-',
      },
      {
        name: '[zImage]',
        description: 'Image URL or template; overrides `zIcon`',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zDescription]',
        description: 'Description text or template',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[zTitle]', description: 'Title text or template', type: 'string | TemplateRef<void>', default: '-' },
      { name: '[zActions]', description: 'Action templates', type: 'TemplateRef<void>[]', default: '[]' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
