import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" };

export const SIDEBAR_API: ApiSection[] = [
  {
    selector: 'z-sidebar-provider',
    description: 'Wraps sidebar and page, and provides `ZardSidebarService`.',
    props: [
      {
        name: '[zDefaultOpen]',
        description: 'Initial open state. Overrides the `sidebar_state` cookie',
        type: 'boolean | undefined',
        default: 'undefined',
      },
      { name: '[zOpen]', description: 'Controlled open state', type: 'boolean | undefined', default: 'undefined' },
      { name: '[style]', description: 'Inline style; can override the width variables', type: 'string', default: "''" },
      CLASS_PROP,
      { name: '(zOpenChange)', description: 'Emits on open state requests', type: 'boolean', default: '' },
    ],
  },
  {
    selector: 'z-sidebar',
    description: 'Fixed panel on desktop, drawer on mobile.',
    props: [
      {
        name: '[zSide]',
        description: 'Docking edge, physical in RTL too',
        type: "'left' | 'right'",
        default: "'left'",
      },
      {
        name: '[zVariant]',
        description: 'Panel style',
        type: "'sidebar' | 'floating' | 'inset'",
        default: "'sidebar'",
      },
      {
        name: '[zCollapsible]',
        description: "Collapse mode; `'none'` is always visible",
        type: "'offcanvas' | 'icon' | 'none'",
        default: "'offcanvas'",
      },
      { name: '[dir]', description: 'Writing direction', type: "'ltr' | 'rtl' | undefined", default: 'undefined' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'button[z-sidebar-trigger]',
    description: 'Icon button that toggles the sidebar.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-sidebar-rail]',
    description: 'Thin edge strip that toggles the sidebar.',
    props: [CLASS_PROP],
  },
  {
    selector: 'main[z-sidebar-inset]',
    description: 'Page area next to the sidebar; required for the `inset` variant.',
    props: [CLASS_PROP],
  },
  {
    selector: 'input[z-sidebar-input]',
    description: 'Sidebar styling for a `z-input`.',
    props: [],
  },
  {
    selector: '[z-sidebar-header]',
    description: 'Sticky top region.',
    props: [CLASS_PROP],
  },
  {
    selector: '[z-sidebar-footer]',
    description: 'Sticky bottom region.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-separator',
    description: 'Inset separator.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-content',
    description: 'Scrollable area between header and footer.',
    props: [CLASS_PROP],
  },
  {
    selector: '[z-sidebar-group]',
    description: 'Section inside the content.',
    props: [CLASS_PROP],
  },
  {
    selector: '[z-sidebar-group-label]',
    description: 'Group heading, hidden when collapsed to icons.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-sidebar-group-action]',
    description: 'Action button in the group corner.',
    props: [CLASS_PROP],
  },
  {
    selector: '[z-sidebar-group-content]',
    description: 'Group content wrapper.',
    props: [CLASS_PROP],
  },
  {
    selector: 'ul[z-sidebar-menu]',
    description: 'List of menu items.',
    props: [CLASS_PROP],
  },
  {
    selector: 'li[z-sidebar-menu-item]',
    description: 'A single menu row.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-sidebar-menu-button]',
    description: 'Clickable menu row; use the anchor form for `routerLink`.',
    props: [
      { name: '[zType]', description: 'Visual style', type: "'default' | 'outline'", default: "'default'" },
      { name: '[zSize]', description: 'Row height', type: "'default' | 'sm' | 'lg'", default: "'default'" },
      { name: '[zActive]', description: 'Marks the current row', type: 'boolean', default: 'false' },
      {
        name: '[zTooltip]',
        description: 'Tooltip shown while collapsed on desktop',
        type: 'string | TemplateRef<void> | { content: string | TemplateRef<void>; hidden?: boolean } | null',
        default: 'null',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'button[z-sidebar-menu-action]',
    description: 'Secondary action at the end of a menu row.',
    props: [
      { name: '[zShowOnHover]', description: 'Shows only on hover or focus', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: '[z-sidebar-menu-badge]',
    description: 'Non-interactive counter on a menu row.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-menu-skeleton',
    description: 'Hydration-safe placeholder row.',
    props: [
      { name: '[zShowIcon]', description: 'Adds an icon placeholder', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'ul[z-sidebar-menu-sub]',
    description: 'Nested list, hidden when collapsed to icons.',
    props: [CLASS_PROP],
  },
  {
    selector: 'li[z-sidebar-menu-sub-item]',
    description: 'A submenu row.',
    props: [CLASS_PROP],
  },
  {
    selector: 'a[z-sidebar-menu-sub-button]',
    description: 'Clickable submenu row.',
    props: [
      { name: '[zSize]', description: 'Text size', type: "'sm' | 'md'", default: "'md'" },
      { name: '[zActive]', description: 'Marks the current row', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'ZardSidebarService',
    description: 'Controls the sidebar; provided by `z-sidebar-provider`.',
    props: [
      { name: 'state', description: 'Current state', type: "Signal<'expanded' | 'collapsed'>", default: '' },
      { name: 'open', description: 'Open on desktop', type: 'Signal<boolean>', default: '' },
      {
        name: 'setOpen',
        description: 'Sets the open state',
        type: '(open: boolean | ((open: boolean) => boolean)) => void',
        default: '',
      },
      { name: 'openMobile', description: 'Open on mobile', type: 'Signal<boolean>', default: '' },
      {
        name: 'setOpenMobile',
        description: 'Sets the mobile open state',
        type: '(open: boolean) => void',
        default: '',
      },
      { name: 'isMobile', description: 'Mobile viewport', type: 'Signal<boolean>', default: '' },
      { name: 'toggleSidebar', description: 'Toggles on desktop and mobile', type: '() => void', default: '' },
    ],
  },
];
