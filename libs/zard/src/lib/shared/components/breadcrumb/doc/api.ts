import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BREADCRUMB_API: ApiSection[] = [
  {
    selector: 'z-breadcrumb',
    description: 'Displays the path to the current resource using a hierarchy of links.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zSize]', description: 'Breadcrumb size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: '[zAlign]', description: 'Horizontal alignment', type: "'start' | 'center' | 'end'", default: "'start'" },
      { name: '[zWrap]', description: 'Wrapping behavior', type: "'wrap' | 'nowrap'", default: "'wrap'" },
      {
        name: '[zSeparator]',
        description: 'Separator between breadcrumb items',
        type: 'string | TemplateRef',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-breadcrumb-item',
    description: 'An individual breadcrumb item. Supports all RouterLink inputs through host directives.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: 'routerLink',
        description: 'All RouterLink inputs are supported through host directives',
        type: 'string | any[]',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-breadcrumb-ellipsis',
    description: 'An ellipsis element for truncating long breadcrumb trails.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zColor]', description: 'Ellipsis color', type: "'muted' | 'strong'", default: "'muted'" },
    ],
  },
];
