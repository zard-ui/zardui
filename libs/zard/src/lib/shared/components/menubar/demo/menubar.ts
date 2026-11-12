import { MENUBAR_DEMO_APP_BAR } from '@generated/components/menubar/demo/app-bar';
import { MENUBAR_DEMO_CHECKBOX_RADIO } from '@generated/components/menubar/demo/checkbox-radio';
import { MENUBAR_DEMO_DISABLED } from '@generated/components/menubar/demo/disabled';
import { MENUBAR_DEMO_PREVIEW } from '@generated/components/menubar/demo/preview';
import { MENUBAR_DEMO_RTL } from '@generated/components/menubar/demo/rtl';
import { MENUBAR_DEMO_SHORTCUTS } from '@generated/components/menubar/demo/shortcuts';
import { MENUBAR_DEMO_SUBMENU } from '@generated/components/menubar/demo/submenu';
import { MENUBAR_CLI_ADD } from '@generated/installation/cli/add-menubar';
import { MENUBAR_MANUAL_CODE } from '@generated/installation/manual/menubar';
import { MENUBAR_USAGE_CODE, MENUBAR_USAGE_IMPORT } from '@generated/usage/menubar';

import { ZardDemoMenubarAppBarComponent } from '@/shared/components/menubar/demo/app-bar';
import { ZardDemoMenubarCheckboxRadioComponent } from '@/shared/components/menubar/demo/checkbox-radio';
import { ZardDemoMenubarDisabledComponent } from '@/shared/components/menubar/demo/disabled';
import { ZardDemoMenubarShortcutsComponent } from '@/shared/components/menubar/demo/shortcuts';
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
      name: 'shortcuts',
      description: 'Add `z-dropdown-menu-shortcut` to show keyboard hints.',
      component: ZardDemoMenubarShortcutsComponent,
      codeData: MENUBAR_DEMO_SHORTCUTS,
    },
    {
      name: 'checkbox-radio',
      description:
        'Use `z-dropdown-menu-checkbox-item` for toggles and `z-dropdown-menu-radio-group` for exclusive choices.',
      component: ZardDemoMenubarCheckboxRadioComponent,
      codeData: MENUBAR_DEMO_CHECKBOX_RADIO,
    },
    {
      name: 'submenu',
      description: 'Use `z-dropdown-menu-sub-trigger` with a `z-dropdown-menu-sub-content` to nest secondary actions.',
      component: ZardDemoMenubarSubmenuComponent,
      codeData: MENUBAR_DEMO_SUBMENU,
    },
    {
      name: 'disabled',
      description: 'A trigger with `zDisabled` stays in the bar but is skipped by the arrow keys and the hover switch.',
      component: ZardDemoMenubarDisabledComponent,
      codeData: MENUBAR_DEMO_DISABLED,
    },
    {
      name: 'app-bar',
      description:
        'Every piece together: shortcuts, submenus, checkbox items and a radio group in a full application bar.',
      component: ZardDemoMenubarAppBarComponent,
      codeData: MENUBAR_DEMO_APP_BAR,
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
