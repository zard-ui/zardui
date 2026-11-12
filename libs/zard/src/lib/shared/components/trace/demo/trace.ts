import { TRACE_DEMO_CHAIN_OF_THOUGHT } from '@generated/components/trace/demo/chain-of-thought';
import { TRACE_DEMO_COLLAPSIBLE } from '@generated/components/trace/demo/collapsible';
import { TRACE_DEMO_COMMIT } from '@generated/components/trace/demo/commit';
import { TRACE_DEMO_DESCRIPTION } from '@generated/components/trace/demo/description';
import { TRACE_DEMO_DIALOG } from '@generated/components/trace/demo/dialog';
import { TRACE_DEMO_GROUP } from '@generated/components/trace/demo/group';
import { TRACE_DEMO_LINE } from '@generated/components/trace/demo/line';
import { TRACE_DEMO_LINK } from '@generated/components/trace/demo/link';
import { TRACE_DEMO_PREVIEW } from '@generated/components/trace/demo/preview';
import { TRACE_DEMO_RTL } from '@generated/components/trace/demo/rtl';
import { TRACE_DEMO_SHEET } from '@generated/components/trace/demo/sheet';
import { TRACE_DEMO_SOURCES } from '@generated/components/trace/demo/sources';
import { TRACE_DEMO_STATUS } from '@generated/components/trace/demo/status';
import { TRACE_CLI_ADD } from '@generated/installation/cli/add-trace';
import { TRACE_MANUAL_CODE } from '@generated/installation/manual/trace';
import { TRACE_USAGE_CODE, TRACE_USAGE_IMPORT } from '@generated/usage/trace';

import { ZardDemoTraceChainOfThoughtComponent } from './chain-of-thought';
import { ZardDemoTraceCollapsibleComponent } from './collapsible';
import { ZardDemoTraceCommitComponent } from './commit';
import { ZardDemoTraceDescriptionComponent } from './description';
import { ZardDemoTraceDialogComponent } from './dialog';
import { ZardDemoTraceGroupComponent } from './group';
import { ZardDemoTraceLineComponent } from './line';
import { ZardDemoTraceLinkComponent } from './link';
import { ZardDemoTracePreviewComponent } from './preview';
import { ZardDemoTraceRtlComponent } from './rtl';
import { ZardDemoTraceSheetComponent } from './sheet';
import { ZardDemoTraceSourcesComponent } from './sources';
import { ZardDemoTraceStatusComponent } from './status';
import { TRACE_API } from '../doc/api';

export const TRACE = {
  componentName: 'trace',
  componentType: 'trace',
  description: 'Displays the steps an agent takes as a list of lines: tool calls, reasoning, sources and file changes.',
  api: TRACE_API,
  installData: {
    cliAdd: TRACE_CLI_ADD,
    manualCode: TRACE_MANUAL_CODE,
  },
  usage: { importBlock: TRACE_USAGE_IMPORT, codeBlock: TRACE_USAGE_CODE },
  preview: {
    name: 'preview',
    component: ZardDemoTracePreviewComponent,
    codeData: TRACE_DEMO_PREVIEW,
  },
  examples: [
    {
      name: 'line',
      description:
        'Plain text rows: an icon and a one-line title. A `z-trace-line` is a span-like box, so on its own it is read as text and is not a tab stop.',
      component: ZardDemoTraceLineComponent,
      codeData: TRACE_DEMO_LINE,
    },
    {
      name: 'status',
      description:
        'Set `zStatus` to `running`, `error` or `pending` when a step is in progress, failed or not started. Completed work has no status. Say the state in the title as well ("Running", "Failed to run"), because the color and the shimmer are not read out.',
      component: ZardDemoTraceStatusComponent,
      codeData: TRACE_DEMO_STATUS,
    },
    {
      name: 'description',
      description:
        'Put secondary text such as a duration, a count or diff stats in `z-trace-description`, after the title. It does not truncate.',
      component: ZardDemoTraceDescriptionComponent,
      codeData: TRACE_DEMO_DESCRIPTION,
    },
    {
      name: 'collapsible',
      description:
        'Wrap the line in `z-trace-collapsible-trigger` to expand it into `z-trace-collapsible-content`. Bind `[(zOpen)]` to control a row, and set `zKeepMounted` to keep the detail in the DOM while it is closed.',
      component: ZardDemoTraceCollapsibleComponent,
      codeData: TRACE_DEMO_COLLAPSIBLE,
    },
    {
      name: 'link',
      description:
        'Wrap the line in an anchor. For a new tab, add an arrow-up-right icon and an `sr-only` "(opens in a new tab)" to the title.',
      component: ZardDemoTraceLinkComponent,
      codeData: TRACE_DEMO_LINK,
    },
    {
      name: 'dialog',
      description:
        'Wrap the line in the button that opens the dialog. The dialog owns its open state, Escape and focus return.',
      component: ZardDemoTraceDialogComponent,
      codeData: TRACE_DEMO_DIALOG,
    },
    {
      name: 'sheet',
      description:
        'The same shape as the dialog: a button around the line opens a sheet. Drawer and popover triggers work the same way.',
      component: ZardDemoTraceSheetComponent,
      codeData: TRACE_DEMO_SHEET,
    },
    {
      name: 'group',
      description:
        'Put rows that sit next to each other in a `z-trace`. It also styles any trigger or link that directly wraps a `z-trace-line`.',
      component: ZardDemoTraceGroupComponent,
      codeData: TRACE_DEMO_GROUP,
    },
    {
      name: 'sources',
      description: 'A collapsible row whose detail is a `z-trace` of link rows.',
      component: ZardDemoTraceSourcesComponent,
      codeData: TRACE_DEMO_SOURCES,
    },
    {
      name: 'chain-of-thought',
      description: 'A collapsible row with step rows inside. Set the parent status and title from its children.',
      component: ZardDemoTraceChainOfThoughtComponent,
      codeData: TRACE_DEMO_CHAIN_OF_THOUGHT,
    },
    {
      name: 'commit',
      description:
        'A collapsible row with a line per changed file. Say what changed in the title and put the line counts in the description; each file opens its diff in a sheet.',
      component: ZardDemoTraceCommitComponent,
      codeData: TRACE_DEMO_COMMIT,
    },
    {
      name: 'rtl',
      description: 'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).',
      type: 'rtl' as const,
      component: ZardDemoTraceRtlComponent,
      codeData: TRACE_DEMO_RTL,
    },
  ],
};
