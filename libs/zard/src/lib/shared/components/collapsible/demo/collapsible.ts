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
  about: {
    title: 'One panel vs. a list of panels',
    description:
      'A collapsible is a single `[z-collapsible]` toggling one region of content — use it to progressively disclose details, a settings block, or a nested tree. An accordion is the multi-item cousin: a list of collapsibles that share exclusivity rules (`z-accordion-item` inside `z-accordion`). Reach for a collapsible when there is exactly one thing to show or hide; reach for an accordion when there are several sibling sections.',
  },
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
        'A `[z-collapsible-trigger]` button reveals a real configuration block instead of a paragraph — a `z-radio-group` for corner radius, a `z-switch`, and a `z-checkbox`, each composed with `z-field`/`z-field-label` the same way they would be outside a collapsible.',
      component: ZardDemoCollapsibleSettingsPanelComponent,
      column: true,
      codeData: COLLAPSIBLE_DEMO_SETTINGS_PANEL,
    },
    {
      name: 'file-tree',
      description:
        'Collapsibles nested inside a collapsible\'s content: each folder is its own `[z-collapsible]`, so "components" and "ui" open and close independently of one another.',
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
