import { SIDEBAR_DEMO_COLLAPSIBLE_ICON } from '@generated/components/sidebar/demo/collapsible-icon';
import { SIDEBAR_DEMO_COLLAPSIBLE_NONE } from '@generated/components/sidebar/demo/collapsible-none';
import { SIDEBAR_DEMO_COLLAPSIBLE_OFFCANVAS } from '@generated/components/sidebar/demo/collapsible-offcanvas';
import { SIDEBAR_DEMO_CONTROLLED } from '@generated/components/sidebar/demo/controlled';
import { SIDEBAR_DEMO_CUSTOM_TRIGGER } from '@generated/components/sidebar/demo/custom-trigger';
import { SIDEBAR_DEMO_CUSTOM_WIDTH } from '@generated/components/sidebar/demo/custom-width';
import { SIDEBAR_DEMO_FOOTER } from '@generated/components/sidebar/demo/footer';
import { SIDEBAR_DEMO_GROUP_ACTION } from '@generated/components/sidebar/demo/group-action';
import { SIDEBAR_DEMO_GROUP_COLLAPSIBLE } from '@generated/components/sidebar/demo/group-collapsible';
import { SIDEBAR_DEMO_HEADER } from '@generated/components/sidebar/demo/header';
import { SIDEBAR_DEMO_KEYBOARD_SHORTCUT } from '@generated/components/sidebar/demo/keyboard-shortcut';
import { SIDEBAR_DEMO_MENU_ACTION } from '@generated/components/sidebar/demo/menu-action';
import { SIDEBAR_DEMO_MENU_BADGE } from '@generated/components/sidebar/demo/menu-badge';
import { SIDEBAR_DEMO_MENU_SKELETON } from '@generated/components/sidebar/demo/menu-skeleton';
import { SIDEBAR_DEMO_MENU_SUB } from '@generated/components/sidebar/demo/menu-sub';
import { SIDEBAR_DEMO_PREVIEW } from '@generated/components/sidebar/demo/preview';
import { SIDEBAR_DEMO_RAIL } from '@generated/components/sidebar/demo/rail';
import { SIDEBAR_DEMO_SIDE_RIGHT } from '@generated/components/sidebar/demo/side-right';
import { SIDEBAR_DEMO_STRUCTURE } from '@generated/components/sidebar/demo/structure';
import { SIDEBAR_DEMO_USE_SIDEBAR } from '@generated/components/sidebar/demo/use-sidebar';
import { SIDEBAR_DEMO_VARIANT_FLOATING } from '@generated/components/sidebar/demo/variant-floating';
import { SIDEBAR_DEMO_VARIANT_INSET } from '@generated/components/sidebar/demo/variant-inset';
import {
  SIDEBAR_SNIPPET_SSR_COOKIE,
  SIDEBAR_SNIPPET_STYLING,
  SIDEBAR_SNIPPET_THEMING,
  SIDEBAR_SNIPPET_WIDTH_CONSTANTS,
} from '@generated/components/sidebar/snippets';
import { SIDEBAR_CLI_ADD } from '@generated/installation/cli/add-sidebar';
import { SIDEBAR_MANUAL_CODE } from '@generated/installation/manual/sidebar';
import { SIDEBAR_USAGE_CODE, SIDEBAR_USAGE_IMPORT } from '@generated/usage/sidebar';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoSidebarCollapsibleIconComponent } from './collapsible-icon';
import { ZardDemoSidebarCollapsibleNoneComponent } from './collapsible-none';
import { ZardDemoSidebarCollapsibleOffcanvasComponent } from './collapsible-offcanvas';
import { ZardDemoSidebarControlledComponent } from './controlled';
import { ZardDemoSidebarCustomTriggerComponent } from './custom-trigger';
import { ZardDemoSidebarCustomWidthComponent } from './custom-width';
import { ZardDemoSidebarFooterComponent } from './footer';
import { ZardDemoSidebarGroupActionComponent } from './group-action';
import { ZardDemoSidebarGroupCollapsibleComponent } from './group-collapsible';
import { ZardDemoSidebarHeaderComponent } from './header';
import { ZardDemoSidebarKeyboardShortcutComponent } from './keyboard-shortcut';
import { ZardDemoSidebarMenuActionComponent } from './menu-action';
import { ZardDemoSidebarMenuBadgeComponent } from './menu-badge';
import { ZardDemoSidebarMenuSkeletonComponent } from './menu-skeleton';
import { ZardDemoSidebarMenuSubComponent } from './menu-sub';
import { ZardDemoSidebarPreviewComponent } from './preview';
import { ZardDemoSidebarRailComponent } from './rail';
import { ZardDemoSidebarSideRightComponent } from './side-right';
import { ZardDemoSidebarStructureComponent } from './structure';
import { ZardDemoSidebarUseSidebarComponent } from './use-sidebar';
import { ZardDemoSidebarVariantFloatingComponent } from './variant-floating';
import { ZardDemoSidebarVariantInsetComponent } from './variant-inset';
import { SIDEBAR_API } from '../doc/api';

const SIDEBAR_COMPOSITION_CODE = [
  'z-sidebar-provider',
  '├── z-sidebar',
  '│   ├── [z-sidebar-header]',
  '│   ├── z-sidebar-content',
  '│   │   ├── [z-sidebar-group]',
  '│   │   │   ├── [z-sidebar-group-label]',
  '│   │   │   ├── button[z-sidebar-group-action]',
  '│   │   │   ├── [z-sidebar-group-content]',
  '│   │   │   └── ul[z-sidebar-menu]',
  '│   │   │       ├── li[z-sidebar-menu-item]',
  '│   │   │       │   ├── button[z-sidebar-menu-button]',
  '│   │   │       │   ├── button[z-sidebar-menu-action]',
  '│   │   │       │   └── [z-sidebar-menu-badge]',
  '│   │   │       └── li[z-sidebar-menu-item]',
  '│   │   │           ├── button[z-sidebar-menu-button]',
  '│   │   │           └── ul[z-sidebar-menu-sub]',
  '│   │   │               ├── li[z-sidebar-menu-sub-item]',
  '│   │   │               └── li[z-sidebar-menu-sub-item]',
  '│   │   └── [z-sidebar-group]',
  '│   │       └── ul[z-sidebar-menu]',
  '│   │           ├── li[z-sidebar-menu-item]',
  '│   │           └── li[z-sidebar-menu-item]',
  '│   ├── [z-sidebar-footer]',
  '│   └── button[z-sidebar-rail]',
  '├── main[z-sidebar-inset]',
  '└── button[z-sidebar-trigger]',
].join('\n');

const SHIKI_PRE_OPEN =
  '<pre class="shiki shiki-themes github-dark github-light" ' +
  'style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" ' +
  'tabindex="0"><code>';

const SIDEBAR_COMPOSITION: CodeBlockData = {
  html:
    SHIKI_PRE_OPEN +
    SIDEBAR_COMPOSITION_CODE.split('\n')
      .map(line => '<span class="line">' + escapeCompositionHtml(line) + '</span>')
      .join('\n') +
    '</code></pre>',
  code: SIDEBAR_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const SIDEBAR = {
  componentName: 'sidebar',
  componentType: 'sidebar',
  description: 'A composable, themeable and customizable sidebar component.',
  about: {
    description:
      'Sidebars are one of the most complex components to build. They are central to any application and often contain a lot of moving parts. This is a solid foundation to build on top of — composable, themeable, customizable.',
    link: { label: 'Browse the Blocks Library', href: '/blocks/sidebar' },
  },
  api: SIDEBAR_API,
  fullWidth: true,
  installData: {
    cliAdd: SIDEBAR_CLI_ADD,
    manualCode: SIDEBAR_MANUAL_CODE,
  },
  usage: { importBlock: SIDEBAR_USAGE_IMPORT, codeBlock: SIDEBAR_USAGE_CODE },
  composition: SIDEBAR_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoSidebarPreviewComponent,
    codeData: SIDEBAR_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'structure',
      description:
        'The regions a sidebar is made of. Every one of them is optional, and they can be composed in any order.',
      component: ZardDemoSidebarStructureComponent,
      codeData: SIDEBAR_DEMO_STRUCTURE,
    },
    {
      name: 'custom-width',
      description:
        'The provider writes `--sidebar-width` and `--sidebar-width-icon` inline on its own host. Pass `style` to override them for a single provider, without touching the constants.',
      component: ZardDemoSidebarCustomWidthComponent,
      codeData: SIDEBAR_DEMO_CUSTOM_WIDTH,
      codeAfter: {
        title: 'The defaults',
        codeData: SIDEBAR_SNIPPET_WIDTH_CONSTANTS,
      },
    },
    {
      name: 'keyboard-shortcut',
      description: 'The provider registers `⌘/Ctrl + B` on the document while it is alive.',
      component: ZardDemoSidebarKeyboardShortcutComponent,
      codeData: SIDEBAR_DEMO_KEYBOARD_SHORTCUT,
    },
    {
      name: 'side-right',
      description:
        'Use `zSide="right"` and declare the inset **before** the sidebar, so the gap the sidebar reserves lands on the correct side.',
      component: ZardDemoSidebarSideRightComponent,
      codeData: SIDEBAR_DEMO_SIDE_RIGHT,
    },
    {
      name: 'variant-floating',
      description: 'Use `zVariant="floating"` to detach the panel from the viewport edge.',
      component: ZardDemoSidebarVariantFloatingComponent,
      codeData: SIDEBAR_DEMO_VARIANT_FLOATING,
    },
    {
      name: 'variant-inset',
      description:
        'Use `zVariant="inset"` together with `main[z-sidebar-inset]`. The inset wrapper is what paints the sidebar background behind the floating page, so the variant does nothing without it.',
      component: ZardDemoSidebarVariantInsetComponent,
      codeData: SIDEBAR_DEMO_VARIANT_INSET,
    },
    {
      name: 'collapsible-icon',
      description:
        'Use `zCollapsible="icon"` to shrink the sidebar down to its icons. Pass `zTooltip` on the menu buttons — the tooltip only shows while collapsed on desktop.',
      component: ZardDemoSidebarCollapsibleIconComponent,
      codeData: SIDEBAR_DEMO_COLLAPSIBLE_ICON,
    },
    {
      name: 'collapsible-offcanvas',
      description: 'The default. The panel slides fully out of view and the rail brings it back.',
      component: ZardDemoSidebarCollapsibleOffcanvasComponent,
      codeData: SIDEBAR_DEMO_COLLAPSIBLE_OFFCANVAS,
    },
    {
      name: 'collapsible-none',
      description: 'Use `zCollapsible="none"` for a static column: no gap, no rail, no collapsing.',
      component: ZardDemoSidebarCollapsibleNoneComponent,
      codeData: SIDEBAR_DEMO_COLLAPSIBLE_NONE,
    },
    {
      name: 'use-sidebar',
      description:
        "Inject `ZardSidebarService` from any component inside the provider — the Angular counterpart of shadcn's `useSidebar()` hook.",
      component: ZardDemoSidebarUseSidebarComponent,
      codeData: SIDEBAR_DEMO_USE_SIDEBAR,
    },
    {
      name: 'header',
      description: 'A workspace switcher in `[z-sidebar-header]`, built with `z-dropdown`.',
      component: ZardDemoSidebarHeaderComponent,
      codeData: SIDEBAR_DEMO_HEADER,
    },
    {
      name: 'footer',
      description: 'A user menu in `[z-sidebar-footer]`, built with `z-avatar` and `z-dropdown`.',
      component: ZardDemoSidebarFooterComponent,
      codeData: SIDEBAR_DEMO_FOOTER,
    },
    {
      name: 'group-collapsible',
      description:
        'Wrap `[z-sidebar-group]` in `z-collapsible` and use the group label as the trigger. The chevron rotates through `group-data-[state=open]/collapsible:rotate-180`.',
      component: ZardDemoSidebarGroupCollapsibleComponent,
      codeData: SIDEBAR_DEMO_GROUP_COLLAPSIBLE,
    },
    {
      name: 'group-action',
      description: 'Use `button[z-sidebar-group-action]` for an action pinned to the group heading.',
      component: ZardDemoSidebarGroupActionComponent,
      codeData: SIDEBAR_DEMO_GROUP_ACTION,
    },
    {
      name: 'menu-action',
      description: 'Use `button[z-sidebar-menu-action]` with `zShowOnHover` for a per-row action.',
      component: ZardDemoSidebarMenuActionComponent,
      codeData: SIDEBAR_DEMO_MENU_ACTION,
    },
    {
      name: 'menu-sub',
      description:
        "Use `ul[z-sidebar-menu-sub]` inside a collapsible menu item. Applying `[z-collapsible]` to the `li` is the idiomatic translation of shadcn's `asChild`.",
      component: ZardDemoSidebarMenuSubComponent,
      codeData: SIDEBAR_DEMO_MENU_SUB,
    },
    {
      name: 'menu-badge',
      description: 'Use `[z-sidebar-menu-badge]` for counters.',
      component: ZardDemoSidebarMenuBadgeComponent,
      codeData: SIDEBAR_DEMO_MENU_BADGE,
    },
    {
      name: 'menu-skeleton',
      description: 'Use `z-sidebar-menu-skeleton` while the menu is loading.',
      component: ZardDemoSidebarMenuSkeletonComponent,
      codeData: SIDEBAR_DEMO_MENU_SKELETON,
    },
    {
      name: 'custom-trigger',
      description: 'Any element can toggle the sidebar — call `toggleSidebar()` on the injected service.',
      component: ZardDemoSidebarCustomTriggerComponent,
      codeData: SIDEBAR_DEMO_CUSTOM_TRIGGER,
    },
    {
      name: 'rail',
      description: 'Use `button[z-sidebar-rail]` for the draggable-looking edge handle.',
      component: ZardDemoSidebarRailComponent,
      codeData: SIDEBAR_DEMO_RAIL,
    },
    {
      name: 'controlled',
      description: 'Pass `zOpen` and listen to `zOpenChange` to own the state yourself.',
      component: ZardDemoSidebarControlledComponent,
      codeData: SIDEBAR_DEMO_CONTROLLED,
    },
    {
      name: 'theming',
      description:
        'The sidebar has its own colour scale so it can sit on a different background than the page it frames.',
      codeData: SIDEBAR_SNIPPET_THEMING,
    },
    {
      name: 'styling',
      description:
        'The sidebar publishes its state through data attributes, so anything inside it can react with plain Tailwind variants.',
      codeData: SIDEBAR_SNIPPET_STYLING,
    },
    {
      name: 'ssr-cookie',
      description:
        'New in the Angular port: the open state is persisted in the `sidebar_state` cookie and read back on the server, so there is no layout flash on hydration.',
      codeData: SIDEBAR_SNIPPET_SSR_COOKIE,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
