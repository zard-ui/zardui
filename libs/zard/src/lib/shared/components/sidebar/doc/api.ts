import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

const CLASS_PROP = { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" };

export const SIDEBAR_API: ApiSection[] = [
  {
    selector: 'z-sidebar-provider',
    description: 'Wraps the sidebar and the page, provides ZardSidebarService and registers the keyboard shortcut.',
    props: [
      {
        name: 'zDefaultOpen',
        description: 'Initial open state. A persisted sidebar_state cookie always wins over it',
        type: 'boolean',
        default: 'true',
      },
      {
        name: 'zOpen',
        description: 'When set, the provider is controlled: the state is owned by the consumer',
        type: 'boolean | undefined',
        default: 'undefined',
      },
      {
        name: 'style',
        description:
          'Extra inline style, applied after --sidebar-width and --sidebar-width-icon so it can override them',
        type: 'string',
        default: "''",
      },
      CLASS_PROP,
      {
        name: 'zOpenChange',
        description: 'Emits whenever the open state is requested, including in controlled mode',
        type: 'boolean',
        default: '',
      },
    ],
  },
  {
    selector: 'z-sidebar',
    description: 'The sidebar itself. Renders as a fixed panel on desktop, as a drawer on mobile.',
    props: [
      { name: 'zSide', description: 'Which edge the sidebar docks to', type: "'left' | 'right'", default: "'left'" },
      {
        name: 'zVariant',
        description: 'Visual treatment of the panel',
        type: "'sidebar' | 'floating' | 'inset'",
        default: "'sidebar'",
      },
      {
        name: 'zCollapsible',
        description: 'How the sidebar collapses. "none" renders a plain, always-visible column',
        type: "'offcanvas' | 'icon' | 'none'",
        default: "'offcanvas'",
      },
      {
        name: 'dir',
        description: 'Writing direction. Mirrors the rail and the trigger icon when set to rtl',
        type: "'ltr' | 'rtl' | undefined",
        default: 'undefined',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'button[z-sidebar-trigger]',
    description: 'Ghost icon button that toggles the sidebar. Renders the panel icon and an sr-only label.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-sidebar-rail]',
    description:
      'The thin strip on the sidebar edge. Toggles the sidebar, shows a resize cursor and stays out of the tab order.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-inset, main[z-sidebar-inset]',
    description: 'The page area next to the sidebar. Required when zVariant is "inset".',
    props: [CLASS_PROP],
  },
  {
    selector: 'input[z-sidebar-input]',
    description: 'Adds the sidebar treatment to a Zard input. Use as <input z-input z-sidebar-input />.',
    props: [],
  },
  {
    selector: 'z-sidebar-header, [z-sidebar-header]',
    description: 'Sticky region at the top of the sidebar.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-footer, [z-sidebar-footer]',
    description: 'Sticky region at the bottom of the sidebar.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-separator',
    description: 'A separator inset to the sidebar padding, painted with --sidebar-border.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-content, [z-sidebar-content]',
    description: 'Scrollable area between the header and the footer.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-group, [z-sidebar-group]',
    description: 'A section inside the content. Wrap it in z-collapsible to make it collapsible.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-group-label, [z-sidebar-group-label]',
    description: 'The group heading. Fades out when the sidebar collapses to icons.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-sidebar-group-action]',
    description: 'Action button pinned to the top-right corner of a group.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-group-content, [z-sidebar-group-content]',
    description: 'Content wrapper inside a group.',
    props: [CLASS_PROP],
  },
  {
    selector: 'ul[z-sidebar-menu]',
    description: 'The list that holds the menu items.',
    props: [CLASS_PROP],
  },
  {
    selector: 'li[z-sidebar-menu-item]',
    description: 'A single menu row. Carries group/menu-item, which the action and badge react to.',
    props: [CLASS_PROP],
  },
  {
    selector: 'button[z-sidebar-menu-button], a[z-sidebar-menu-button]',
    description:
      "The clickable menu row. Use the anchor form with routerLink instead of shadcn's asChild. Carries peer/menu-button.",
    props: [
      { name: 'zType', description: 'Visual treatment', type: "'default' | 'outline'", default: "'default'" },
      { name: 'zSize', description: 'Row height', type: "'default' | 'sm' | 'lg'", default: "'default'" },
      { name: 'zActive', description: 'Marks the row as the current one', type: 'boolean', default: 'false' },
      {
        name: 'zTooltip',
        description: 'Label shown as a tooltip, but only while the sidebar is collapsed on desktop',
        type: 'string | TemplateRef<void> | null',
        default: 'null',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'button[z-sidebar-menu-action], a[z-sidebar-menu-action]',
    description: 'Secondary action pinned to the right of a menu row.',
    props: [
      {
        name: 'zShowOnHover',
        description: 'Reveal the action only on hover or keyboard focus',
        type: 'boolean',
        default: 'false',
      },
      CLASS_PROP,
    ],
  },
  {
    selector: 'z-sidebar-menu-badge, [z-sidebar-menu-badge]',
    description: 'A counter pinned to the right of a menu row. Not interactive.',
    props: [CLASS_PROP],
  },
  {
    selector: 'z-sidebar-menu-skeleton',
    description:
      'Placeholder row. The text width is derived from the element id rather than Math.random(), so the server and the client agree during hydration.',
    props: [
      { name: 'zShowIcon', description: 'Also render a square icon placeholder', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'ul[z-sidebar-menu-sub]',
    description: 'Nested list under a menu item. Hidden when the sidebar collapses to icons.',
    props: [CLASS_PROP],
  },
  {
    selector: 'li[z-sidebar-menu-sub-item]',
    description: 'A row inside a submenu.',
    props: [CLASS_PROP],
  },
  {
    selector: 'a[z-sidebar-menu-sub-button], button[z-sidebar-menu-sub-button]',
    description: 'The clickable row inside a submenu.',
    props: [
      { name: 'zSize', description: 'Row text size', type: "'sm' | 'md'", default: "'md'" },
      { name: 'zActive', description: 'Marks the row as the current one', type: 'boolean', default: 'false' },
      CLASS_PROP,
    ],
  },
  {
    selector: 'ZardSidebarService',
    description: 'Injectable service that controls the sidebar. Provided by z-sidebar-provider.',
    props: [
      {
        name: 'state',
        description: 'Current state of the sidebar',
        type: "Signal<'expanded' | 'collapsed'>",
        default: '',
      },
      { name: 'open', description: 'Whether the sidebar is open', type: 'Signal<boolean>', default: '' },
      {
        name: 'setOpen',
        description: 'Sets the open state of the sidebar',
        type: '(open: boolean | ((open: boolean) => boolean)) => void',
        default: '',
      },
      {
        name: 'openMobile',
        description: 'Whether the sidebar is open on mobile',
        type: 'Signal<boolean>',
        default: '',
      },
      {
        name: 'setOpenMobile',
        description: 'Sets the open state on mobile',
        type: '(open: boolean) => void',
        default: '',
      },
      { name: 'isMobile', description: 'Whether the viewport is mobile', type: 'Signal<boolean>', default: '' },
      {
        name: 'toggleSidebar',
        description: 'Toggles the sidebar on desktop and mobile',
        type: '() => void',
        default: '',
      },
    ],
  },
];
