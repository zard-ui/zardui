import { KBD_DEMO_BUTTON } from '@generated/components/kbd/demo/button';
import { KBD_DEMO_GROUP } from '@generated/components/kbd/demo/group';
import { KBD_DEMO_INPUT_GROUP } from '@generated/components/kbd/demo/input-group';
import { KBD_DEMO_PREVIEW } from '@generated/components/kbd/demo/preview';
import { KBD_DEMO_TOOLTIP } from '@generated/components/kbd/demo/tooltip';
import { KBD_CLI_ADD } from '@generated/installation/cli/add-kbd';
import { KBD_MANUAL_CODE } from '@generated/installation/manual/kbd';
import { KBD_USAGE_IMPORT, KBD_USAGE_CODE } from '@generated/usage/kbd';

import { ZardDemoKbdButtonComponent } from '@/shared/components/kbd/demo/button';

import { ZardDemoKbdGroupComponent } from './group';
import { ZardDemoKbdInputGroupComponent } from './input-group';
import { ZardDemoKbdPreviewComponent } from './preview';
import { ZardDemoKbdTooltipComponent } from './tooltip';
import { KBD_API } from '../doc/api';

export const KBD = {
  componentName: 'kbd',
  componentType: 'kbd',
  description: 'Used to display textual user input from keyboard.',
  api: KBD_API,
  fullWidth: true,
  installData: {
    cliAdd: KBD_CLI_ADD,
    manualCode: KBD_MANUAL_CODE,
  },
  usage: { importBlock: KBD_USAGE_IMPORT, codeBlock: KBD_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoKbdPreviewComponent,
    column: true,
    codeData: KBD_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'group',
      description:
        'Wrap several `z-kbd` elements (and any surrounding text) in `z-kbd-group` to keep a multi-key shortcut or an inline instruction aligned and spaced as one unit.',
      component: ZardDemoKbdGroupComponent,
      column: true,
      codeData: KBD_DEMO_GROUP,
    },
    {
      name: 'button',
      description: 'Project a `z-kbd` inside `button[z-button]` to show the key that triggers the action.',
      component: ZardDemoKbdButtonComponent,
      column: true,
      codeData: KBD_DEMO_BUTTON,
    },
    {
      name: 'tooltip',
      description:
        'Compose `z-kbd` and `z-kbd-group` inside the `ng-template` passed to `[zTooltip]` to show the shortcut for an action; `z-kbd` detects the tooltip content data-slot and switches to a transparent, tooltip-matching background automatically.',
      component: ZardDemoKbdTooltipComponent,
      column: true,
      codeData: KBD_DEMO_TOOLTIP,
    },
    {
      name: 'input-group',
      description:
        'Compose `z-kbd` inside a `z-input-group-addon` (aligned `inline-end`) next to `input[z-input]` to hint at the shortcut that focuses the field, such as ⌘K for a search box.',
      component: ZardDemoKbdInputGroupComponent,
      column: true,
      codeData: KBD_DEMO_INPUT_GROUP,
    },
  ],
};
