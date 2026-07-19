import { DROPDOWN_DEMO_AVATAR } from '@generated/components/dropdown/demo/avatar';
import { DROPDOWN_DEMO_CHECKBOXES } from '@generated/components/dropdown/demo/checkboxes';
import { DROPDOWN_DEMO_COMPLEX } from '@generated/components/dropdown/demo/complex';
import { DROPDOWN_DEMO_DEFAULT } from '@generated/components/dropdown/demo/default';
import { DROPDOWN_DEMO_DESTRUCTIVE } from '@generated/components/dropdown/demo/destructive';
import { DROPDOWN_DEMO_HOVER } from '@generated/components/dropdown/demo/hover';
import { DROPDOWN_DEMO_ICONS } from '@generated/components/dropdown/demo/icons';
import { DROPDOWN_DEMO_RADIO_GROUP } from '@generated/components/dropdown/demo/radio-group';
import { DROPDOWN_DEMO_SHORTCUTS } from '@generated/components/dropdown/demo/shortcuts';
import { DROPDOWN_DEMO_SUBMENU } from '@generated/components/dropdown/demo/submenu';
import { DROPDOWN_CLI_ADD } from '@generated/installation/cli/add-dropdown';
import { DROPDOWN_MANUAL_CODE } from '@generated/installation/manual/dropdown';
import { DROPDOWN_USAGE_IMPORT, DROPDOWN_USAGE_CODE } from '@generated/usage/dropdown';

import { ZardDropdownAvatarDemoComponent } from '@/shared/components/dropdown/demo/avatar';
import { ZardDropdownCheckboxesDemoComponent } from '@/shared/components/dropdown/demo/checkboxes';
import { ZardDropdownComplexDemoComponent } from '@/shared/components/dropdown/demo/complex';
import { ZardDropdownDestructiveDemoComponent } from '@/shared/components/dropdown/demo/destructive';
import { ZardDropdownHoverDemoComponent } from '@/shared/components/dropdown/demo/hover';
import { ZardDropdownIconsDemoComponent } from '@/shared/components/dropdown/demo/icons';
import { ZardDropdownRadioGroupDemoComponent } from '@/shared/components/dropdown/demo/radio-group';
import { ZardDropdownShortcutsDemoComponent } from '@/shared/components/dropdown/demo/shortcuts';
import { ZardDropdownSubmenuDemoComponent } from '@/shared/components/dropdown/demo/submenu';

import { ZardDropdownDemoComponent } from './default';
import { DROPDOWN_API } from '../doc/api';

export const DROPDOWN = {
  componentName: 'dropdown',
  componentType: 'dropdown',
  description: 'Displays a menu to the user — such as a set of actions or functions — triggered by a button.',
  api: DROPDOWN_API,
  installData: {
    cliAdd: DROPDOWN_CLI_ADD,
    manualCode: DROPDOWN_MANUAL_CODE,
  },
  usage: { importBlock: DROPDOWN_USAGE_IMPORT, codeBlock: DROPDOWN_USAGE_CODE },
  examples: [
    {
      name: 'basic',
      component: ZardDropdownDemoComponent,
      codeData: DROPDOWN_DEMO_DEFAULT,
    },
    {
      name: 'shortcuts',
      component: ZardDropdownShortcutsDemoComponent,
      codeData: DROPDOWN_DEMO_SHORTCUTS,
    },
    {
      name: 'icons',
      component: ZardDropdownIconsDemoComponent,
      codeData: DROPDOWN_DEMO_ICONS,
    },
    {
      name: 'checkboxes',
      component: ZardDropdownCheckboxesDemoComponent,
      codeData: DROPDOWN_DEMO_CHECKBOXES,
    },
    {
      name: 'radio-group',
      component: ZardDropdownRadioGroupDemoComponent,
      codeData: DROPDOWN_DEMO_RADIO_GROUP,
    },
    {
      name: 'destructive',
      component: ZardDropdownDestructiveDemoComponent,
      codeData: DROPDOWN_DEMO_DESTRUCTIVE,
    },
    {
      name: 'submenu',
      description: 'Compose with `z-menu` for nested flyout behavior.',
      component: ZardDropdownSubmenuDemoComponent,
      codeData: DROPDOWN_DEMO_SUBMENU,
    },
    {
      name: 'avatar',
      component: ZardDropdownAvatarDemoComponent,
      codeData: DROPDOWN_DEMO_AVATAR,
    },
    {
      name: 'complex',
      component: ZardDropdownComplexDemoComponent,
      codeData: DROPDOWN_DEMO_COMPLEX,
    },
    {
      name: 'hover',
      description: 'Use `zTrigger="hover"` when the menu should open on pointer hover.',
      component: ZardDropdownHoverDemoComponent,
      codeData: DROPDOWN_DEMO_HOVER,
    },
  ],
};
