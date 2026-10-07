import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };

/**
 * Router-compatible inputs shared by `z-breadcrumb-item` and `z-breadcrumb-link`. Both selectors
 * forward these straight to Angular's `Router` when `routerLink` is set, mirroring the `RouterLink`
 * directive's own input surface so neither selector needs it imported.
 */
const QUERY_PARAMS_PROP = {
  name: '[queryParams]',
  description: 'Query params merged into the generated URL when routerLink is set',
  type: 'Params',
  default: '-',
};
const FRAGMENT_PROP = {
  name: '[fragment]',
  description: 'URL fragment appended to the generated URL when routerLink is set',
  type: 'string',
  default: '-',
};
const QUERY_PARAMS_HANDLING_PROP = {
  name: '[queryParamsHandling]',
  description: 'How the current query params are merged with queryParams',
  type: "'merge' | 'preserve' | ''",
  default: '-',
};
const STATE_PROP = {
  name: '[state]',
  description: 'Navigation state passed to the Router when routerLink is set',
  type: 'unknown',
  default: '-',
};
const INFO_PROP = {
  name: '[info]',
  description: 'Arbitrary navigation info passed to the Router when routerLink is set',
  type: 'unknown',
  default: '-',
};
const RELATIVE_TO_PROP = {
  name: '[relativeTo]',
  description: 'Route the routerLink commands are resolved against; defaults to the current activated route',
  type: 'ActivatedRoute',
  default: '-',
};
const PRESERVE_FRAGMENT_PROP = {
  name: '[preserveFragment]',
  description: 'Keeps the current URL fragment when navigating via routerLink',
  type: 'boolean',
  default: 'false',
};
const SKIP_LOCATION_CHANGE_PROP = {
  name: '[skipLocationChange]',
  description: 'Navigates via routerLink without pushing a new browser history entry',
  type: 'boolean',
  default: 'false',
};
const REPLACE_URL_PROP = {
  name: '[replaceUrl]',
  description: 'Replaces the current browser history entry instead of pushing a new one',
  type: 'boolean',
  default: 'false',
};

export const BREADCRUMB_API: ApiSection[] = [
  {
    selector: 'z-breadcrumb',
    description:
      'Displays the path to the current resource using a hierarchy of links. Renders a labelled `<nav>` wrapping an ordered list; separators render automatically unless explicit separators are projected.',
    props: [
      CLASS_PROP,
      {
        name: '[zLabel]',
        description: 'Accessible label for the breadcrumb navigation',
        type: 'string',
        default: "'breadcrumb'",
      },
      { name: '[zSize]', description: 'Breadcrumb text size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      {
        name: '[zAlign]',
        description: 'Horizontal alignment of the item list',
        type: "'start' | 'center' | 'end'",
        default: "'start'",
      },
      {
        name: '[zWrap]',
        description: 'Whether the item list wraps onto multiple lines',
        type: "'wrap' | 'nowrap'",
        default: "'wrap'",
      },
      {
        name: '[zSeparator]',
        description: 'Custom separator content rendered between auto-generated separators',
        type: 'string | TemplateRef<void>',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-breadcrumb-item, [z-breadcrumb-item]',
    description:
      'An individual breadcrumb item, rendered with `role="listitem"`. When no `z-breadcrumb-link`, `z-breadcrumb-page`, or `z-breadcrumb-ellipsis` is projected, it renders a generated link for every item except the last and a page for the last one; the router-compatible inputs below configure that generated link.',
    props: [
      CLASS_PROP,
      {
        name: '[routerLink]',
        description: 'Router-compatible command array, string, or UrlTree for the generated link',
        type: 'string | any[] | UrlTree',
        default: '[]',
      },
      QUERY_PARAMS_PROP,
      FRAGMENT_PROP,
      QUERY_PARAMS_HANDLING_PROP,
      STATE_PROP,
      INFO_PROP,
      RELATIVE_TO_PROP,
      PRESERVE_FRAGMENT_PROP,
      SKIP_LOCATION_CHANGE_PROP,
      REPLACE_URL_PROP,
    ],
  },
  {
    selector: 'z-breadcrumb-link, [z-breadcrumb-link]',
    description:
      'A clickable breadcrumb link. Apply the attribute to a native `<a>` or `<button>` to reuse its interactive semantics. Set routerLink to navigate through the Angular Router (href is generated and kept in sync), or set href directly for a plain link.',
    props: [
      CLASS_PROP,
      {
        name: '[routerLink]',
        description: 'Router-compatible command array, string, or UrlTree; navigates via the Router and computes href',
        type: 'string | any[] | UrlTree',
        default: '-',
      },
      QUERY_PARAMS_PROP,
      FRAGMENT_PROP,
      QUERY_PARAMS_HANDLING_PROP,
      STATE_PROP,
      INFO_PROP,
      RELATIVE_TO_PROP,
      PRESERVE_FRAGMENT_PROP,
      SKIP_LOCATION_CHANGE_PROP,
      REPLACE_URL_PROP,
      { name: '[href]', description: 'Plain link URL, used when routerLink is not set', type: 'string', default: '-' },
    ],
  },
  {
    selector: 'z-breadcrumb-page, [z-breadcrumb-page]',
    description: 'The current page in the breadcrumb trail. Renders non-clickable content with `aria-current="page"`.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-breadcrumb-separator, [z-breadcrumb-separator]',
    description:
      'A decorative separator between breadcrumb items (`aria-hidden`, `role="presentation"`). Project it manually — e.g. on an `<li>` — to override the default chevron and suppress the automatic separators; project custom content inside it to change the glyph.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-breadcrumb-ellipsis, [z-breadcrumb-ellipsis]',
    description: 'A control that stands in for one or more collapsed items in a long breadcrumb trail.',
    props: [
      CLASS_PROP,
      { name: '[zColor]', description: 'Icon color', type: "'muted' | 'strong'", default: "'muted'" },
      {
        name: '[zLabel]',
        description: 'Screen-reader label for the collapsed items',
        type: 'string',
        default: "'More breadcrumbs'",
      },
    ],
  },
];
