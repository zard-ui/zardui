import { COLLAPSIBLE_DEMO_BASIC } from '@generated/components/collapsible/demo/basic';
import { COLLAPSIBLE_DEMO_CONTROLLED } from '@generated/components/collapsible/demo/controlled';
import { COLLAPSIBLE_DEMO_DISABLED } from '@generated/components/collapsible/demo/disabled';
import { COLLAPSIBLE_DEMO_FILE_TREE } from '@generated/components/collapsible/demo/file-tree';
import { COLLAPSIBLE_DEMO_PREVIEW } from '@generated/components/collapsible/demo/preview';
import { COLLAPSIBLE_DEMO_SETTINGS_PANEL } from '@generated/components/collapsible/demo/settings-panel';
import { COLLAPSIBLE_CLI_ADD } from '@generated/installation/cli/add-collapsible';
import { COLLAPSIBLE_MANUAL_CODE } from '@generated/installation/manual/collapsible';
import { COLLAPSIBLE_USAGE_CODE, COLLAPSIBLE_USAGE_IMPORT } from '@generated/usage/collapsible';

import { ZardDemoCollapsibleBasicComponent } from './basic';
import { ZardDemoCollapsibleControlledComponent } from './controlled';
import { ZardDemoCollapsibleDisabledComponent } from './disabled';
import { ZardDemoCollapsibleFileTreeComponent } from './file-tree';
import { ZardDemoCollapsiblePreviewComponent } from './preview';
import { ZardDemoCollapsibleSettingsPanelComponent } from './settings-panel';
import { COLLAPSIBLE_API } from '../doc/api';

export const COLLAPSIBLE = {
  componentName: 'collapsible',
  componentType: 'collapsible',
  description: 'An interactive component which expands and collapses a panel.',
  api: COLLAPSIBLE_API,
  installData: {
    cliAdd: COLLAPSIBLE_CLI_ADD,
    manualCode: COLLAPSIBLE_MANUAL_CODE,
  },
  usage: { importBlock: COLLAPSIBLE_USAGE_IMPORT, codeBlock: COLLAPSIBLE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoCollapsiblePreviewComponent,
    column: false,
    codeData: COLLAPSIBLE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'basic',
      description:
        "A minimal `[z-collapsible]` wrapped in a `z-card`. The trigger is a full-width ghost `z-button` whose chevron rotates through `group-data-[state=open]`, driven entirely by the directive's own `data-state` — no host state needed.",
      component: ZardDemoCollapsibleBasicComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_BASIC,
    },
    {
      name: 'settings-panel',
      description:
        'A collapsible that grows a form in place: the first two radius fields are always visible, and `z-collapsible-content` reveals the other two inside the same `z-field-group` grid. The icon trigger flips between maximize and minimize with the `zOpen`/`zOpenChange` pair.',
      component: ZardDemoCollapsibleSettingsPanelComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_SETTINGS_PANEL,
    },
    {
      name: 'file-tree',
      description:
        'A recursive file explorer: every folder is its own `z-collapsible` whose content renders the same template again, so nested folders open and close independently of one another.',
      component: ZardDemoCollapsibleFileTreeComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_FILE_TREE,
    },
    {
      name: 'controlled',
      description:
        'Bind `zOpen` to a signal and listen to `zOpenChange` to drive the panel from outside the component.',
      component: ZardDemoCollapsibleControlledComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_CONTROLLED,
    },
    {
      name: 'disabled',
      description: 'Use `zDisabled` to block the trigger. The panel keeps whatever state it was rendered with.',
      component: ZardDemoCollapsibleDisabledComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_DISABLED,
    },
  ],
};
