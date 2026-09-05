import { COMMAND_DEMO_BASIC } from '@generated/components/command/demo/basic';
import { COMMAND_DEMO_GROUPS } from '@generated/components/command/demo/groups';
import { COMMAND_DEMO_PREVIEW } from '@generated/components/command/demo/preview';
import { COMMAND_DEMO_SCROLLABLE } from '@generated/components/command/demo/scrollable';
import { COMMAND_DEMO_SHORTCUTS } from '@generated/components/command/demo/shortcuts';
import { COMMAND_CLI_ADD } from '@generated/installation/cli/add-command';
import { COMMAND_MANUAL_CODE } from '@generated/installation/manual/command';
import { COMMAND_USAGE_CODE, COMMAND_USAGE_IMPORT } from '@generated/usage/command';

import { ZardDemoCommandBasicComponent } from './basic';
import { ZardDemoCommandGroupsComponent } from './groups';
import { ZardDemoCommandPreviewComponent } from './preview';
import { ZardDemoCommandScrollableComponent } from './scrollable';
import { ZardDemoCommandShortcutsComponent } from './shortcuts';
import { COMMAND_API } from '../doc/api';

export const COMMAND = {
  api: COMMAND_API,
  componentName: 'command',
  componentType: 'command',
  description: 'Fast, composable, unstyled command menu for Angular.',
  installData: {
    cliAdd: COMMAND_CLI_ADD,
    manualCode: COMMAND_MANUAL_CODE,
  },
  usage: { importBlock: COMMAND_USAGE_IMPORT, codeBlock: COMMAND_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoCommandPreviewComponent,
    codeData: COMMAND_DEMO_PREVIEW,
    column: false,
  },
  examples: [
    {
      name: 'basic',
      description:
        '`z-command` has no dialog of its own, so the palette is built by composing it with `ZardDialogService`: the button opens a dialog whose content is a `z-command`, with `zClosable`/`zHideFooter`/`zOkText`/`zCancelText` turned off so only the command menu shows. A `document:keydown` listener on the trigger opens the same dialog on `⌘K` / `Ctrl+K`, with the hint rendered by `z-kbd-group` and `z-kbd` — never a hand-rolled `<kbd>`.',
      component: ZardDemoCommandBasicComponent,
      codeData: COMMAND_DEMO_BASIC,
    },
    {
      name: 'shortcuts',
      description:
        '`zShortcut` on `z-command-option` (see `preview`) renders a plain-text hint. For a styled, per-key hint, project into the `[data-slot=command-option-trailing]` slot instead — here each option carries a `z-kbd-group` of `z-kbd`s rather than the `zShortcut` string.',
      component: ZardDemoCommandShortcutsComponent,
      codeData: COMMAND_DEMO_SHORTCUTS,
    },
    {
      name: 'groups',
      description:
        'Options organised into named sections with `z-command-option-group`, divided by `z-command-divider`. Typing in `z-command-input` filters every group at once; a group hides itself once none of its options match, and a divider hides itself during a search rather than sit next to an empty group.',
      component: ZardDemoCommandGroupsComponent,
      codeData: COMMAND_DEMO_GROUPS,
    },
    {
      name: 'scrollable',
      description:
        'A `z-command-list` with more options than fit the `max-h-72` viewport scrolls internally. Arrow-key navigation calls `scrollIntoView()` on the active `z-command-option`, so the highlighted row stays visible while keyboard focus remains on `z-command-input`.',
      component: ZardDemoCommandScrollableComponent,
      codeData: COMMAND_DEMO_SCROLLABLE,
    },
  ],
};
