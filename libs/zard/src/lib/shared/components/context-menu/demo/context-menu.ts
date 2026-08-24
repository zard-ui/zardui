import { CONTEXT_MENU_DEMO_BASIC } from '@generated/components/context-menu/demo/basic';
import { CONTEXT_MENU_DEMO_CHECKBOXES } from '@generated/components/context-menu/demo/checkboxes';
import { CONTEXT_MENU_DEMO_DEFAULT } from '@generated/components/context-menu/demo/default';
import { CONTEXT_MENU_DEMO_DESTRUCTIVE } from '@generated/components/context-menu/demo/destructive';
import { CONTEXT_MENU_DEMO_DISABLED } from '@generated/components/context-menu/demo/disabled';
import { CONTEXT_MENU_DEMO_GROUPS } from '@generated/components/context-menu/demo/groups';
import { CONTEXT_MENU_DEMO_ICONS } from '@generated/components/context-menu/demo/icons';
import { CONTEXT_MENU_DEMO_RADIO } from '@generated/components/context-menu/demo/radio';
import { CONTEXT_MENU_DEMO_SHORTCUTS } from '@generated/components/context-menu/demo/shortcuts';
import { CONTEXT_MENU_DEMO_SUBMENU } from '@generated/components/context-menu/demo/submenu';
import { CONTEXT_MENU_DEMO_TABLE_ROWS } from '@generated/components/context-menu/demo/table-rows';
import { CONTEXT_MENU_CLI_ADD } from '@generated/installation/cli/add-context-menu';
import { CONTEXT_MENU_MANUAL_CODE } from '@generated/installation/manual/context-menu';
import { CONTEXT_MENU_USAGE_CODE, CONTEXT_MENU_USAGE_IMPORT } from '@generated/usage/context-menu';
import type { CodeBlockData } from '@highlight/types';

import { ZardContextMenuBasicDemoComponent } from '@/shared/components/context-menu/demo/basic';
import { ZardContextMenuCheckboxesDemoComponent } from '@/shared/components/context-menu/demo/checkboxes';
import { ZardContextMenuDestructiveDemoComponent } from '@/shared/components/context-menu/demo/destructive';
import { ZardContextMenuDisabledDemoComponent } from '@/shared/components/context-menu/demo/disabled';
import { ZardContextMenuGroupsDemoComponent } from '@/shared/components/context-menu/demo/groups';
import { ZardContextMenuIconsDemoComponent } from '@/shared/components/context-menu/demo/icons';
import { ZardContextMenuRadioDemoComponent } from '@/shared/components/context-menu/demo/radio';
import { ZardContextMenuShortcutsDemoComponent } from '@/shared/components/context-menu/demo/shortcuts';
import { ZardContextMenuSubmenuDemoComponent } from '@/shared/components/context-menu/demo/submenu';
import { ZardContextMenuTableRowsDemoComponent } from '@/shared/components/context-menu/demo/table-rows';

import { ZardContextMenuDemoComponent } from './default';
import { CONTEXT_MENU_API } from '../doc/api';

const CONTEXT_MENU_COMPOSITION_CODE = `div[z-context-menu]
└── z-dropdown-menu-content
    ├── z-dropdown-menu-group
    │   ├── z-dropdown-menu-label
    │   └── z-dropdown-menu-item
    │       └── z-dropdown-menu-shortcut
    ├── z-dropdown-menu-sub-trigger
    ├── z-dropdown-menu-sub-content
    │   └── z-dropdown-menu-item
    ├── z-dropdown-menu-separator
    ├── z-dropdown-menu-checkbox-item
    ├── z-dropdown-menu-separator
    └── z-dropdown-menu-radio-group
        ├── z-dropdown-menu-label
        └── z-dropdown-menu-radio-item`;

const CONTEXT_MENU_COMPOSITION: CodeBlockData = {
  html: `<pre class="shiki shiki-themes github-dark github-light" style="--shiki-dark:#e1e4e8;--shiki-light:#24292e;--shiki-dark-bg:#24292e;--shiki-light-bg:#fff" tabindex="0"><code>${CONTEXT_MENU_COMPOSITION_CODE.split(
    '\n',
  )
    .map(line => `<span class="line">${escapeCompositionHtml(line)}</span>`)
    .join('\n')}</code></pre>`,
  code: CONTEXT_MENU_COMPOSITION_CODE,
  language: 'text',
  showLineNumbers: false,
  copyButton: true,
  expandable: false,
};

export const CONTEXT_MENU = {
  componentName: 'context-menu',
  componentType: 'context-menu',
  description: 'Displays a menu of actions triggered by a right click.',
  api: CONTEXT_MENU_API,
  about: {
    description:
      "The menu surface and every row are the dropdown primitives, so one vocabulary covers the dropdown and the context menu. The trigger is declarative for the common case; for the dynamic one — a single menu serving many rows — inject the service, mirroring ng-zorro's",
    link: { label: 'NzContextMenuService', href: 'https://ng.ant.design/components/dropdown/en' },
  },
  installData: {
    cliAdd: CONTEXT_MENU_CLI_ADD,
    manualCode: CONTEXT_MENU_MANUAL_CODE,
  },
  usage: { importBlock: CONTEXT_MENU_USAGE_IMPORT, codeBlock: CONTEXT_MENU_USAGE_CODE },
  composition: CONTEXT_MENU_COMPOSITION,
  preview: {
    name: 'preview',
    component: ZardContextMenuDemoComponent,
    codeData: CONTEXT_MENU_DEMO_DEFAULT,
  },
  examples: [
    {
      name: 'basic',
      description: 'A few actions, one of them disabled. Right click the area to open the menu.',
      component: ZardContextMenuBasicDemoComponent,
      codeData: CONTEXT_MENU_DEMO_BASIC,
    },
    {
      name: 'submenu',
      description: 'Use `z-dropdown-menu-sub-trigger` with a `z-dropdown-menu-sub-content` to nest secondary actions.',
      component: ZardContextMenuSubmenuDemoComponent,
      codeData: CONTEXT_MENU_DEMO_SUBMENU,
    },
    {
      name: 'shortcuts',
      description: 'Add `z-dropdown-menu-shortcut` to show keyboard hints.',
      component: ZardContextMenuShortcutsDemoComponent,
      codeData: CONTEXT_MENU_DEMO_SHORTCUTS,
    },
    {
      name: 'groups',
      description: 'Group related actions and separate them with dividers.',
      component: ZardContextMenuGroupsDemoComponent,
      codeData: CONTEXT_MENU_DEMO_GROUPS,
    },
    {
      name: 'icons',
      description: 'Combine icons with labels for quick scanning.',
      component: ZardContextMenuIconsDemoComponent,
      codeData: CONTEXT_MENU_DEMO_ICONS,
    },
    {
      name: 'checkboxes',
      description: 'Use `z-dropdown-menu-checkbox-item` for toggles.',
      component: ZardContextMenuCheckboxesDemoComponent,
      codeData: CONTEXT_MENU_DEMO_CHECKBOXES,
    },
    {
      name: 'radio',
      description: 'Use `z-dropdown-menu-radio-item` for exclusive choices.',
      component: ZardContextMenuRadioDemoComponent,
      codeData: CONTEXT_MENU_DEMO_RADIO,
    },
    {
      name: 'destructive',
      description: 'Use `zType="destructive"` to style the row as destructive.',
      component: ZardContextMenuDestructiveDemoComponent,
      codeData: CONTEXT_MENU_DEMO_DESTRUCTIVE,
    },
    {
      name: 'table-rows',
      description:
        'One menu serving many rows: inject `ZardContextMenuService` and call `create($event, menu)` from the row that was clicked.',
      component: ZardContextMenuTableRowsDemoComponent,
      codeData: CONTEXT_MENU_DEMO_TABLE_ROWS,
    },
    {
      name: 'disabled',
      description: 'With `zDisabled` the trigger stands down and the browser shows its own menu.',
      component: ZardContextMenuDisabledDemoComponent,
      codeData: CONTEXT_MENU_DEMO_DISABLED,
    },
  ],
};

function escapeCompositionHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
