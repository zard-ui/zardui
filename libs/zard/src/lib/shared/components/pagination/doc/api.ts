import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const PAGINATION_API: ApiSection[] = [
  {
    selector: 'z-pagination',
    description: 'Full pagination from `[zTotal]` and `[(zPageIndex)]`, or custom markup via `[zContent]`.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zAriaLabel]', description: 'Accessible name', type: 'string', default: "'Pagination'" },
      {
        name: '[zContent]',
        description: 'Custom markup; the root then ignores its other inputs',
        type: 'TemplateRef<void> | undefined',
        default: 'undefined',
      },
      { name: '[zDisabled]', description: 'Disables pagination interaction', type: 'boolean', default: 'false' },
      { name: '[zNextText]', description: 'Label of the next button', type: 'string', default: "'Next'" },
      { name: '[zPreviousText]', description: 'Label of the previous button', type: 'string', default: "'Previous'" },
      { name: '[zPageIndex]', description: 'Current page', type: 'number', default: '1' },
      { name: '[(zPageIndex)]', description: 'Current page index', type: 'number', default: '1' },
      { name: '[zSimple]', description: 'Shows only page numbers', type: 'boolean', default: 'false' },
      {
        name: '[zSize]',
        description: 'Size of the page buttons',
        type: "'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        default: "'icon'",
      },
      { name: '[zTotal]', description: 'Total number of pages', type: 'number', default: '1' },
    ],
  },
  {
    selector: 'ul[z-pagination-content]',
    description: 'List that holds the pagination items.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
  {
    selector: 'li[z-pagination-item]',
    description: 'List item wrapping a button or ellipsis.',
    props: [],
  },
  {
    selector: 'button[z-pagination-button]',
    description: 'A page button; also works as `a[z-pagination-button]` with `routerLink`.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zActive]', description: 'Marks the current page', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disables the button', type: 'boolean', default: 'false' },
      {
        name: '[zSize]',
        description: 'Button size',
        type: "'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
        default: "'icon'",
      },
    ],
  },
  {
    selector: 'z-pagination-previous',
    description: 'Previous-page button; the chevron flips in RTL.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables the button', type: 'boolean', default: 'false' },
      { name: '[zSize]', description: 'Button size', type: "'default' | 'xs' | 'sm' | 'lg'", default: "'default'" },
      { name: '[zText]', description: 'Visible label', type: 'string', default: "'Previous'" },
    ],
  },
  {
    selector: 'z-pagination-next',
    description: 'Next-page button; the chevron flips in RTL.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables the button', type: 'boolean', default: 'false' },
      { name: '[zSize]', description: 'Button size', type: "'default' | 'xs' | 'sm' | 'lg'", default: "'default'" },
      { name: '[zText]', description: 'Visible label', type: 'string', default: "'Next'" },
    ],
  },
  {
    selector: 'z-pagination-ellipsis',
    description: 'Ellipsis for omitted pages.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" }],
  },
];
