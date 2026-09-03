import { TABS_DEMO_DISABLED } from '@generated/components/tabs/demo/disabled';
import { TABS_DEMO_ICONS } from '@generated/components/tabs/demo/icons';
import { TABS_DEMO_LINE } from '@generated/components/tabs/demo/line';
import { TABS_DEMO_PREVIEW } from '@generated/components/tabs/demo/preview';
import { TABS_DEMO_VERTICAL } from '@generated/components/tabs/demo/vertical';
import { TABS_CLI_ADD } from '@generated/installation/cli/add-tabs';
import { TABS_MANUAL_CODE } from '@generated/installation/manual/tabs';
import { TABS_USAGE_CODE, TABS_USAGE_IMPORT } from '@generated/usage/tabs';

import { ZardDemoTabsDisabledComponent } from './disabled';
import { ZardDemoTabsIconsComponent } from './icons';
import { ZardDemoTabsLineComponent } from './line';
import { ZardDemoTabsPreviewComponent } from './preview';
import { ZardDemoTabsVerticalComponent } from './vertical';
import { TABS_API } from '../doc/api';

export const TABS = {
  componentName: 'tabs',
  componentType: 'tabs',
  api: TABS_API,
  description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  about: {
    description:
      "`z-tab-group` composes `z-tab` children directly — there is no separate list, trigger or content selector; each `z-tab`'s `label` renders the button and its projected content becomes that tab's panel. Navigation uses a roving `tabindex`: only the active trigger sits in the page's Tab order and activation happens on click — `ArrowLeft`/`ArrowRight` (or `ArrowUp`/`ArrowDown` when `zOrientation=\"vertical\"`) and `Home`/`End` do not move focus or selection between triggers.",
  },
  installData: {
    cliAdd: TABS_CLI_ADD,
    manualCode: TABS_MANUAL_CODE,
  },
  preview: {
    name: 'preview',
    component: ZardDemoTabsPreviewComponent,
    codeData: TABS_DEMO_PREVIEW,
    column: false,
  },
  usage: { importBlock: TABS_USAGE_IMPORT, codeBlock: TABS_USAGE_CODE },
  examples: [
    {
      name: 'line',
      description: 'Use the `zVariant="line"` input on `z-tab-group` for a line style.',
      component: ZardDemoTabsLineComponent,
      codeData: TABS_DEMO_LINE,
    },
    {
      name: 'vertical',
      description: 'Use `zOrientation="vertical"` for vertical tabs.',
      component: ZardDemoTabsVerticalComponent,
      codeData: TABS_DEMO_VERTICAL,
    },
    {
      name: 'disabled',
      description: 'Set `zDisabled` on a `z-tab` to remove it from the tab order and prevent activation.',
      component: ZardDemoTabsDisabledComponent,
      codeData: TABS_DEMO_DISABLED,
    },
    {
      name: 'icons',
      description: 'Set `zIcon` on a `z-tab` to render an `ng-icon` before the label.',
      component: ZardDemoTabsIconsComponent,
      codeData: TABS_DEMO_ICONS,
    },
  ],
};
