import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const PAGINATION_API: ApiSection[] = [
  {
    selector: 'z-pagination',
    description:
      'Pagination component with previous, next, and numbered page navigation. Supports two-way binding via [(zPageIndex)] model signal.',
    props: [
      { name: '[zPageIndex]', description: 'Current page, two-way bindable', type: 'number', default: '1' },
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: '[zAriaLabel]',
        description: 'Use a unique, descriptive ARIA label for the element.',
        type: 'string',
        default: 'Pagination',
      },
      {
        name: '[zContent]',
        description: 'Custom pagination structure',
        type: 'TemplateRef<void> | undefined',
        default: 'undefined',
      },
      { name: '[zDisabled]', description: 'Disables pagination interaction', type: 'boolean', default: 'false' },
      { name: '[(zPageIndex)]', description: 'Current page index', type: 'number', default: '1' },
      {
        name: '[zSimple]',
        description: 'A simple pagination with only page numbers.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zSize]',
        description: 'Button size',
        type: "'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        default: "'icon'",
      },
      { name: '[zTotal]', description: 'Total number of pages', type: 'number', default: '1' },
    ],
  },
  {
    selector: 'ul[z-pagination-content]',
    description: 'Container (unordered list) for pagination content (buttons and ellipsis).',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
  {
    selector: 'li[z-pagination-item]',
    description: 'Wraps a pagination button or ellipsis as li element of container.',
    props: [],
  },
  {
    selector: 'button[z-pagination-button], a[z-pagination-button]',
    description: 'Pagination button with support for active and disabled states.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zActive]', description: 'Whether the button is currently active', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Whether the button is disabled', type: 'boolean', default: 'false' },
      {
        name: '[zSize]',
        description: 'Button size',
        type: "'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        default: "'icon'",
      },
    ],
  },
  {
    selector: 'z-pagination-previous',
    description: 'Button to navigate to the previous page.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Whether the button is disabled', type: 'boolean', default: 'false' },
      { name: '[zSize]', description: 'Button size', type: "'default' | 'xs' | 'sm' | 'lg'", default: "'default'" },
    ],
  },
  {
    selector: 'z-pagination-next',
    description: 'Button to navigate to the next page.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Whether the button is disabled', type: 'boolean', default: 'false' },
      { name: '[zSize]', description: 'Button size', type: "'default' | 'xs' | 'sm' | 'lg'", default: "'default'" },
    ],
  },
  {
    selector: 'z-pagination-ellipsis',
    description: 'Visual ellipsis ("...") for omitted pages.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
];
