import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const PAGINATION_API: ApiSection[] = [
  {
    selector: 'z-pagination',
    description:
      'Renders as a `role="group"` element (not a `<nav>` landmark) with an `[zAriaLabel]`-driven accessible name. Given `[zTotal]` and `[(zPageIndex)]`, it renders and manages the full previous/numbers/next navigation itself and calls `goToPage()` internally on click; pass `[zContent]` to replace that markup with your own composition (e.g. to wire real `routerLink`/`href` page links), in which case `[zTotal]`/`[zPageIndex]`/`[zSimple]`/`[zSize]`/`[zDisabled]` are ignored by the root and it is up to the projected content to use them.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: '[zAriaLabel]',
        description: 'Accessible name for the pagination element, rendered as its aria-label.',
        type: 'string',
        default: "'Pagination'",
      },
      {
        name: '[zContent]',
        description: 'Custom pagination structure, replacing the built-in previous/numbers/next markup.',
        type: 'TemplateRef<void> | undefined',
        default: 'undefined',
      },
      { name: '[zDisabled]', description: 'Disables pagination interaction', type: 'boolean', default: 'false' },
      { name: '[zPageIndex]', description: 'Current page, two-way bindable', type: 'number', default: '1' },
      { name: '[(zPageIndex)]', description: 'Current page index', type: 'number', default: '1' },
      {
        name: '[zSimple]',
        description: 'A simple pagination with only page numbers.',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zSize]',
        description: 'Size of the numbered page buttons.',
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
    selector: 'button[z-pagination-button]',
    description:
      "A single page button, styled via an internal z-button. Also usable as `a[z-pagination-button]` — render it on an anchor and stack Angular's `RouterLink` (this directive does not reimplement router inputs of its own) to make page links drive real navigation, as the `routing` example does.",
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zActive]', description: 'Whether the button is currently active', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Whether the button is disabled', type: 'boolean', default: 'false' },
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
    description:
      'Button to navigate to the previous page. Its "Previous" text and "To previous page" screen-reader label are fixed, not exposed as an input — for a translated or custom label, build the previous button yourself with a `[zContent]` template instead.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Whether the button is disabled', type: 'boolean', default: 'false' },
      { name: '[zSize]', description: 'Button size', type: "'default' | 'xs' | 'sm' | 'lg'", default: "'default'" },
    ],
  },
  {
    selector: 'z-pagination-next',
    description:
      'Button to navigate to the next page. Its "Next" text and "To next page" screen-reader label are fixed, not exposed as an input — for a translated or custom label, build the next button yourself with a `[zContent]` template instead.',
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
