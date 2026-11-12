import { MENUBAR_DEMO_CHECKBOX } from '@generated/components/menubar/demo/checkbox';
import { MENUBAR_DEMO_ICONS } from '@generated/components/menubar/demo/icons';
import { MENUBAR_DEMO_PREVIEW } from '@generated/components/menubar/demo/preview';
import { MENUBAR_DEMO_RADIO } from '@generated/components/menubar/demo/radio';
import { MENUBAR_DEMO_RTL } from '@generated/components/menubar/demo/rtl';
import { MENUBAR_DEMO_SUBMENU } from '@generated/components/menubar/demo/submenu';
import { MENUBAR_CLI_ADD } from '@generated/installation/cli/add-menubar';
import { MENUBAR_MANUAL_CODE } from '@generated/installation/manual/menubar';
import { MENUBAR_USAGE_CODE, MENUBAR_USAGE_IMPORT } from '@generated/usage/menubar';

import { ZardDemoMenubarCheckboxComponent } from '@/shared/components/menubar/demo/checkbox';
import { ZardDemoMenubarIconsComponent } from '@/shared/components/menubar/demo/icons';
import { ZardDemoMenubarRadioComponent } from '@/shared/components/menubar/demo/radio';
import { ZardDemoMenubarSubmenuComponent } from '@/shared/components/menubar/demo/submenu';

import { ZardDemoMenubarPreviewComponent } from './preview';
import { ZardDemoMenubarRtlComponent } from './rtl';
import { MENUBAR_API } from '../doc/api';

export const MENUBAR = {
  componentName: 'menubar',
  componentType: 'menubar',
  description: 'A visually persistent bar of command menus, as found in desktop applications.',
  api: MENUBAR_API,
  installData: {
    cliAdd: MENUBAR_CLI_ADD,
    manualCode: MENUBAR_MANUAL_CODE,
  },
  usage: { importBlock: MENUBAR_USAGE_IMPORT, codeBlock: MENUBAR_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoMenubarPreviewComponent,
    codeData: MENUBAR_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'checkbox',
      description: 'Use `z-dropdown-menu-checkbox-item` for toggleable options.',
      component: ZardDemoMenubarCheckboxComponent,
      codeData: MENUBAR_DEMO_CHECKBOX,
    },
    {
      name: 'radio',
      description: 'Use `z-dropdown-menu-radio-group` with `z-dropdown-menu-radio-item` for exclusive choices.',
      component: ZardDemoMenubarRadioComponent,
      codeData: MENUBAR_DEMO_RADIO,
    },
    {
      name: 'submenu',
      description: 'Use `z-dropdown-menu-sub-trigger` with a `z-dropdown-menu-sub-content` to nest secondary actions.',
      component: ZardDemoMenubarSubmenuComponent,
      codeData: MENUBAR_DEMO_SUBMENU,
    },
    {
      name: 'icons',
      description: 'Place an icon before the label of an item; `zType="destructive"` marks a dangerous action.',
      component: ZardDemoMenubarIconsComponent,
      codeData: MENUBAR_DEMO_ICONS,
    },
    {
      name: 'rtl',
      description: 'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).',
      type: 'rtl' as const,
      component: ZardDemoMenubarRtlComponent,
      codeData: MENUBAR_DEMO_RTL,
    },
  ],
};
