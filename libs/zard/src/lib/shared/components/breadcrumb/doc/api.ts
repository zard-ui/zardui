import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BREADCRUMB_API: ApiSection[] = [
  {
    selector: 'z-breadcrumb',
    description:
      'Displays the path to the current resource using a hierarchy of links. Separators render automatically unless explicit separators are projected.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: '[zLabel]',
        description: 'Accessible label for the breadcrumb navigation',
        type: 'string',
        default: "'breadcrumb'",
      },
      { name: '[zSize]', description: 'Breadcrumb size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: '[zAlign]', description: 'Horizontal alignment', type: "'start' | 'center' | 'end'", default: "'start'" },
      { name: '[zWrap]', description: 'Wrapping behavior', type: "'wrap' | 'nowrap'", default: "'wrap'" },
      {
        name: '[zSeparator]',
        description: 'Custom separator for auto-rendered item separators',
        type: 'string | TemplateRef<void>',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-breadcrumb-item, [z-breadcrumb-item]',
    description:
      'An individual breadcrumb item. When no composed primitive is projected, it renders a link for non-current items and a page for the current item.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: 'routerLink',
        description: 'Router-compatible inputs are forwarded to the generated breadcrumb link',
        type: 'string | any[]',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-breadcrumb-link, [z-breadcrumb-link]',
    description:
      'A clickable breadcrumb link. Supports Router-compatible inputs and plain href links; prefer native anchors or buttons when composing interactive controls.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: 'routerLink',
        description: 'Router-compatible inputs used to build the link URL and navigate on click',
        type: 'string | any[]',
        default: '-',
      },
      { name: 'href', description: 'Plain link URL when routerLink is not provided', type: 'string', default: '-' },
    ],
  },
  {
    selector: 'z-breadcrumb-page, [z-breadcrumb-page]',
    description: 'The current page in the breadcrumb trail. Renders non-clickable content with aria-current="page".',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
  {
    selector: 'z-breadcrumb-separator, [z-breadcrumb-separator]',
    description:
      'A decorative separator between breadcrumb items. Project custom content to override the default chevron.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
  {
    selector: 'z-breadcrumb-ellipsis, [z-breadcrumb-ellipsis]',
    description: 'An ellipsis element for truncating long breadcrumb trails.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zColor]', description: 'Ellipsis color', type: "'muted' | 'strong'", default: "'muted'" },
      {
        name: '[zLabel]',
        description: 'Screen-reader label for the collapsed breadcrumb control',
        type: 'string',
        default: "'More breadcrumbs'",
      },
    ],
  },
];
