import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };

/**
 * Router-compatible inputs shared by `z-breadcrumb-item` and `z-breadcrumb-link`. Both selectors
 * forward these straight to Angular's `Router` when `routerLink` is set, mirroring the `RouterLink`
 * directive's own input surface so neither selector needs it imported.
 */
const QUERY_PARAMS_PROP = {
  name: '[queryParams]',
  description: 'Query params for the generated URL',
  type: 'Params',
  default: '-',
};
const FRAGMENT_PROP = {
  name: '[fragment]',
  description: 'URL fragment for the generated URL',
  type: 'string',
  default: '-',
};
const QUERY_PARAMS_HANDLING_PROP = {
  name: '[queryParamsHandling]',
  description: 'How current query params are kept',
  type: "'merge' | 'preserve' | ''",
  default: '-',
};
const STATE_PROP = {
  name: '[state]',
  description: 'Navigation state for the Router',
  type: 'unknown',
  default: '-',
};
const INFO_PROP = {
  name: '[info]',
  description: 'Navigation info for the Router',
  type: 'unknown',
  default: '-',
};
const RELATIVE_TO_PROP = {
  name: '[relativeTo]',
  description: 'Route the commands resolve against',
  type: 'ActivatedRoute',
  default: '-',
};
const PRESERVE_FRAGMENT_PROP = {
  name: '[preserveFragment]',
  description: 'Keeps the current URL fragment',
  type: 'boolean',
  default: 'false',
};
const SKIP_LOCATION_CHANGE_PROP = {
  name: '[skipLocationChange]',
  description: 'Navigates without a new history entry',
  type: 'boolean',
  default: 'false',
};
const REPLACE_URL_PROP = {
  name: '[replaceUrl]',
  description: 'Replaces the current history entry',
  type: 'boolean',
  default: 'false',
};

export const BREADCRUMB_API: ApiSection[] = [
  {
    selector: 'z-breadcrumb',
    description: 'Navigation trail with automatic separators.',
    props: [
      CLASS_PROP,
      { name: '[zLabel]', description: 'Accessible label for the nav', type: 'string', default: "'breadcrumb'" },
      { name: '[zSize]', description: 'Text size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: '[zAlign]', description: 'Horizontal alignment', type: "'start' | 'center' | 'end'", default: "'start'" },
      { name: '[zWrap]', description: 'Line wrapping', type: "'wrap' | 'nowrap'", default: "'wrap'" },
      {
        name: '[zSeparator]',
        description: 'Custom content for automatic separators',
        type: 'string | TemplateRef<void>',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-breadcrumb-item, [z-breadcrumb-item]',
    description: 'Trail item; without projected content it generates a link or page.',
    props: [
      CLASS_PROP,
      {
        name: '[routerLink]',
        description: 'Target of the generated link',
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
    description: 'Clickable link; use on a native `<a>` or `<button>`.',
    props: [
      CLASS_PROP,
      {
        name: '[routerLink]',
        description: 'Router target; also computes `href`',
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
      { name: '[href]', description: 'Plain URL when `routerLink` is unset', type: 'string', default: '-' },
    ],
  },
  {
    selector: 'z-breadcrumb-page, [z-breadcrumb-page]',
    description: 'Current page, marked with `aria-current="page"`.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-breadcrumb-separator, [z-breadcrumb-separator]',
    description: 'Decorative separator; projecting one disables the automatic ones.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-breadcrumb-ellipsis, [z-breadcrumb-ellipsis]',
    description: 'Stands in for collapsed items.',
    props: [
      CLASS_PROP,
      { name: '[zColor]', description: 'Icon color', type: "'muted' | 'strong'", default: "'muted'" },
      { name: '[zLabel]', description: 'Screen-reader label', type: 'string', default: "'More breadcrumbs'" },
    ],
  },
];
