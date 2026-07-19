import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BUTTON_API: ApiSection[] = [
  {
    selector: 'z-button',
    description: 'Displays a button or a component that looks like a button.',
    props: [
      { name: 'zDisabled', description: 'Button disabled state', type: 'boolean', default: 'false' },
      { name: 'zLoading', description: 'Button loading state', type: 'boolean', default: 'false' },
      { name: 'zShape', description: 'Button shape', type: "'default' | 'circle' | 'square'", default: "'default'" },
      {
        name: 'zSize',
        description: 'Button size',
        type: "'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        default: "'default'",
      },
      {
        name: 'zType',
        description: 'Button type',
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        default: "'default'",
      },
    ],
  },
];
