import { NAVIGATION_MENU_DEMO_LINK } from '@generated/components/navigation-menu/demo/link';
import { NAVIGATION_MENU_DEMO_NO_VIEWPORT } from '@generated/components/navigation-menu/demo/no-viewport';
import { NAVIGATION_MENU_DEMO_PREVIEW } from '@generated/components/navigation-menu/demo/preview';
import { NAVIGATION_MENU_DEMO_SIMPLE } from '@generated/components/navigation-menu/demo/simple';
import { NAVIGATION_MENU_CLI_ADD } from '@generated/installation/cli/add-navigation-menu';
import { NAVIGATION_MENU_MANUAL_CODE } from '@generated/installation/manual/navigation-menu';
import { NAVIGATION_MENU_USAGE_CODE, NAVIGATION_MENU_USAGE_IMPORT } from '@generated/usage/navigation-menu';
import type { CodeBlockData } from '@highlight/types';

import { ZardDemoNavigationMenuLinkComponent } from '@/shared/components/navigation-menu/demo/link';
import { ZardDemoNavigationMenuNoViewportComponent } from '@/shared/components/navigation-menu/demo/no-viewport';
import { ZardDemoNavigationMenuPreviewComponent } from '@/shared/components/navigation-menu/demo/preview';
import { ZardDemoNavigationMenuSimpleComponent } from '@/shared/components/navigation-menu/demo/simple';

import { NAVIGATION_MENU_API } from '../doc/api';

const NAVIGATION_MENU_COMPOSITION_CODE = `z-navigation-menu
├── ul[z-navigation-menu-list]
│   └── li[z-navigation-menu-item]
│       ├── button[z-navigation-menu-trigger]
│       └── ng-template
│           └── div[z-navigation-menu-content]
│               ├── a[z-navigation-menu-link]
│               └── a[z-navigation-menu-link]
└── z-navigation-menu-indicator`;

const NAVIGATION_MENU_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${NAVIGATION_MENU_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: NAVIGATION_MENU_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const NAVIGATION_MENU = {
  componentName: 'navigation-menu',
  componentType: 'navigation-menu',
  description: 'A collection of links for navigating websites.',
  api: NAVIGATION_MENU_API,
  about: {
    description:
      'Built on the Angular CDK Menu: `z-navigation-menu-trigger` opens `z-navigation-menu-content` (a list of `z-navigation-menu-link` entries), and by default every trigger inside a root shares one animated `z-navigation-menu-viewport` — set `[zViewport]="false"` to give each trigger its own popup instead. Triggers sit in the normal Tab order (there is no roving arrow-key focus between them); `Enter`/`Space` opens the focused trigger, `ArrowDown` opens it and moves focus straight to its first link, and `Escape` closes the open panel and returns focus to the trigger that owns it. Reach for `z-navigation-menu` for a page\'s persistent top-level navigation with rich dropdown panels; use `z-dropdown` for an action menu attached to a single control.',
    link: { label: 'Angular CDK Menu', href: 'https://material.angular.dev/cdk/menu/overview' },
  },
  installData: {
    cliAdd: NAVIGATION_MENU_CLI_ADD,
    manualCode: NAVIGATION_MENU_MANUAL_CODE,
  },
  usage: { importBlock: NAVIGATION_MENU_USAGE_IMPORT, codeBlock: NAVIGATION_MENU_USAGE_CODE },
  composition: NAVIGATION_MENU_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardDemoNavigationMenuPreviewComponent,
    codeData: NAVIGATION_MENU_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'link',
      description: 'Use `routerLink` on the `[z-navigation-menu-link]` element to compose with the Angular Router.',
      component: ZardDemoNavigationMenuLinkComponent,
      codeData: NAVIGATION_MENU_DEMO_LINK,
    },
    {
      name: 'simple',
      description:
        'A bar of plain links, with no dropdown. Reuse `navigationMenuTriggerVariants()` to keep the height and spacing of a trigger.',
      component: ZardDemoNavigationMenuSimpleComponent,
      codeData: NAVIGATION_MENU_DEMO_SIMPLE,
    },
    {
      name: 'no-viewport',
      description:
        'Set `[zViewport]="false"` so each item opens its own popup, with its own background and ring, instead of sharing the animated viewport. The markup is the same in both modes — only the input changes.',
      component: ZardDemoNavigationMenuNoViewportComponent,
      codeData: NAVIGATION_MENU_DEMO_NO_VIEWPORT,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
