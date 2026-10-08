import { DROPDOWN_DEMO_AVATAR } from '@generated/components/dropdown/demo/avatar';
import { DROPDOWN_DEMO_BASIC } from '@generated/components/dropdown/demo/basic';
import { DROPDOWN_DEMO_CHECKBOXES } from '@generated/components/dropdown/demo/checkboxes';
import { DROPDOWN_DEMO_CHECKBOXES_ICONS } from '@generated/components/dropdown/demo/checkboxes-icons';
import { DROPDOWN_DEMO_COMPLEX } from '@generated/components/dropdown/demo/complex';
import { DROPDOWN_DEMO_DESTRUCTIVE } from '@generated/components/dropdown/demo/destructive';
import { DROPDOWN_DEMO_HOVER } from '@generated/components/dropdown/demo/hover';
import { DROPDOWN_DEMO_ICONS } from '@generated/components/dropdown/demo/icons';
import { DROPDOWN_DEMO_PREVIEW } from '@generated/components/dropdown/demo/preview';
import { DROPDOWN_DEMO_RADIO_GROUP } from '@generated/components/dropdown/demo/radio-group';
import { DROPDOWN_DEMO_RADIO_ICONS } from '@generated/components/dropdown/demo/radio-icons';
import { DROPDOWN_DEMO_SHORTCUTS } from '@generated/components/dropdown/demo/shortcuts';
import { DROPDOWN_DEMO_SUBMENU } from '@generated/components/dropdown/demo/submenu';
import { DROPDOWN_CLI_ADD } from '@generated/installation/cli/add-dropdown';
import { DROPDOWN_MANUAL_CODE } from '@generated/installation/manual/dropdown';
import { DROPDOWN_USAGE_IMPORT, DROPDOWN_USAGE_CODE } from '@generated/usage/dropdown';

import { ZardDemoDropdownAvatarComponent } from '@/shared/components/dropdown/demo/avatar';
import { ZardDemoDropdownBasicComponent } from '@/shared/components/dropdown/demo/basic';
import { ZardDemoDropdownCheckboxesComponent } from '@/shared/components/dropdown/demo/checkboxes';
import { ZardDemoDropdownCheckboxesIconsComponent } from '@/shared/components/dropdown/demo/checkboxes-icons';
import { ZardDemoDropdownComplexComponent } from '@/shared/components/dropdown/demo/complex';
import { ZardDemoDropdownDestructiveComponent } from '@/shared/components/dropdown/demo/destructive';
import { ZardDemoDropdownHoverComponent } from '@/shared/components/dropdown/demo/hover';
import { ZardDemoDropdownIconsComponent } from '@/shared/components/dropdown/demo/icons';
import { ZardDemoDropdownRadioGroupComponent } from '@/shared/components/dropdown/demo/radio-group';
import { ZardDemoDropdownRadioIconsComponent } from '@/shared/components/dropdown/demo/radio-icons';
import { ZardDemoDropdownShortcutsComponent } from '@/shared/components/dropdown/demo/shortcuts';
import { ZardDemoDropdownSubmenuComponent } from '@/shared/components/dropdown/demo/submenu';

import { ZardDemoDropdownPreviewComponent } from './preview';
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
  preview: {
    name: 'preview',
    component: ZardDemoDropdownPreviewComponent,
    codeData: DROPDOWN_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description: 'A basic dropdown menu with a label and a separator.',
      component: ZardDemoDropdownBasicComponent,
      codeData: DROPDOWN_DEMO_BASIC,
    },
    {
      name: 'submenu',
      description: 'Use `z-dropdown-menu-sub-trigger` with a `z-dropdown-menu-sub-content` to nest secondary actions.',
      component: ZardDemoDropdownSubmenuComponent,
      codeData: DROPDOWN_DEMO_SUBMENU,
    },
    {
      name: 'shortcuts',
      description: 'Add `z-dropdown-menu-shortcut` to show keyboard hints.',
      component: ZardDemoDropdownShortcutsComponent,
      codeData: DROPDOWN_DEMO_SHORTCUTS,
    },
    {
      name: 'icons',
      description: 'Combine icons with labels for quick scanning.',
      component: ZardDemoDropdownIconsComponent,
      codeData: DROPDOWN_DEMO_ICONS,
    },
    {
      name: 'checkboxes',
      description: 'Use `z-dropdown-menu-checkbox-item` for toggles.',
      component: ZardDemoDropdownCheckboxesComponent,
      codeData: DROPDOWN_DEMO_CHECKBOXES,
    },
    {
      name: 'checkboxes-icons',
      description: 'Add icons to checkbox items.',
      component: ZardDemoDropdownCheckboxesIconsComponent,
      codeData: DROPDOWN_DEMO_CHECKBOXES_ICONS,
    },
    {
      name: 'radio-group',
      description: 'Use `z-dropdown-menu-radio-group` for exclusive choices.',
      component: ZardDemoDropdownRadioGroupComponent,
      codeData: DROPDOWN_DEMO_RADIO_GROUP,
    },
    {
      name: 'radio-icons',
      description: 'Show radio options with icons.',
      component: ZardDemoDropdownRadioIconsComponent,
      codeData: DROPDOWN_DEMO_RADIO_ICONS,
    },
    {
      name: 'destructive',
      description: 'Use `zType="destructive"` to style a row as destructive.',
      component: ZardDemoDropdownDestructiveComponent,
      codeData: DROPDOWN_DEMO_DESTRUCTIVE,
    },
    {
      name: 'avatar',
      description: "Compose with `z-avatar` for an account menu triggered from the user's picture.",
      component: ZardDemoDropdownAvatarComponent,
      codeData: DROPDOWN_DEMO_AVATAR,
    },
    {
      name: 'complex',
      description: 'Groups, shortcuts, separators and a disabled row combined in one menu.',
      component: ZardDemoDropdownComplexComponent,
      codeData: DROPDOWN_DEMO_COMPLEX,
    },
    {
      name: 'hover',
      description: 'Use `zTrigger="hover"` when the menu should open on pointer hover.',
      component: ZardDemoDropdownHoverComponent,
      codeData: DROPDOWN_DEMO_HOVER,
    },
  ],
};
