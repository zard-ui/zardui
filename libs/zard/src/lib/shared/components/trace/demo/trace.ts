import { TRACE_DEMO_CHAIN_OF_THOUGHT } from '@generated/components/trace/demo/chain-of-thought';
import { TRACE_DEMO_COLLAPSIBLE } from '@generated/components/trace/demo/collapsible';
import { TRACE_DEMO_COMMIT } from '@generated/components/trace/demo/commit';
import { TRACE_DEMO_DESCRIPTION } from '@generated/components/trace/demo/description';
import { TRACE_DEMO_DIALOG } from '@generated/components/trace/demo/dialog';
import { TRACE_DEMO_GROUP } from '@generated/components/trace/demo/group';
import { TRACE_DEMO_LINE } from '@generated/components/trace/demo/line';
import { TRACE_DEMO_LINK } from '@generated/components/trace/demo/link';
import { TRACE_DEMO_OPEN } from '@generated/components/trace/demo/open';
import { TRACE_DEMO_PREVIEW } from '@generated/components/trace/demo/preview';
import { TRACE_DEMO_REASONING } from '@generated/components/trace/demo/reasoning';
import { TRACE_DEMO_RTL } from '@generated/components/trace/demo/rtl';
import { TRACE_DEMO_SHEET } from '@generated/components/trace/demo/sheet';
import { TRACE_DEMO_SOURCES } from '@generated/components/trace/demo/sources';
import { TRACE_DEMO_STATUS } from '@generated/components/trace/demo/status';
import { TRACE_DEMO_TOOL } from '@generated/components/trace/demo/tool';
import { TRACE_DEMO_WHOLE_TURN } from '@generated/components/trace/demo/whole-turn';
import {
  TRACE_SNIPPET_COMPOSITION_COLLAPSIBLE,
  TRACE_SNIPPET_COMPOSITION_LINE,
  TRACE_SNIPPET_DIALOG,
  TRACE_SNIPPET_LINK,
  TRACE_SNIPPET_OPEN_STATE,
  TRACE_SNIPPET_OPEN_STATE_TEMPLATE,
} from '@generated/components/trace/snippets';
import { TRACE_CLI_ADD } from '@generated/installation/cli/add-trace';
import { TRACE_MANUAL_CODE } from '@generated/installation/manual/trace';
import {
  TRACE_USAGE_ADDITIONAL,
  TRACE_USAGE_CODE,
  TRACE_USAGE_DESCRIPTION,
  TRACE_USAGE_IMPORT,
} from '@generated/usage/trace';

import { ZardDemoTraceChainOfThoughtComponent } from './chain-of-thought';
import { ZardDemoTraceCollapsibleComponent } from './collapsible';
import { ZardDemoTraceCommitComponent } from './commit';
import { ZardDemoTraceDescriptionComponent } from './description';
import { ZardDemoTraceDialogComponent } from './dialog';
import { ZardDemoTraceGroupComponent } from './group';
import { ZardDemoTraceLineComponent } from './line';
import { ZardDemoTraceLinkComponent } from './link';
import { ZardDemoTraceOpenComponent } from './open';
import { ZardDemoTracePreviewComponent } from './preview';
import { ZardDemoTraceReasoningComponent } from './reasoning';
import { ZardDemoTraceRtlComponent } from './rtl';
import { ZardDemoTraceSheetComponent } from './sheet';
import { ZardDemoTraceSourcesComponent } from './sources';
import { ZardDemoTraceStatusComponent } from './status';
import { ZardDemoTraceToolComponent } from './tool';
import { ZardDemoTraceWholeTurnComponent } from './whole-turn';
import { TRACE_API } from '../doc/api';

/**
 * Laid out like the shadcn/ui page: every example is its own section, so it gets its own heading and anchor.
 * Each section id is its example name, which is also where the e2e tests look for it.
 */
export const TRACE = {
  componentName: 'trace',
  componentType: 'trace',
  description: 'The building block for reasoning, tool calls, sources and more.',
  api: TRACE_API,
  installData: {
    cliAdd: TRACE_CLI_ADD,
    manualCode: TRACE_MANUAL_CODE,
  },
  intro: [
    '`z-trace` is a list of lines. Each line has an icon, a title, and an optional description and status. A line can expand to show more detail, link to a page, or open a dialog or sheet.',
    'Every line has the same shape, so reasoning, tool calls, sources and plans built from `z-trace` look and behave the same.',
    'Use `z-trace` for the steps an agent takes, like calling a tool, running a subagent or editing a file. Use [Message](/docs/components/message) for its reply, and [Marker](/docs/components/marker) for notes and dividers between turns.',
  ],
  usage: {
    intro: 'Use a `z-trace-line` for a single step:',
    importBlock: TRACE_USAGE_IMPORT,
    codeBlock: TRACE_USAGE_CODE,
    description: TRACE_USAGE_DESCRIPTION,
    additionalBlocks: TRACE_USAGE_ADDITIONAL,
  },
  composition: TRACE_SNIPPET_COMPOSITION_LINE,
  compositionMore: [
    {
      description: 'Wrap the line in a `z-trace-collapsible` to show more detail when it expands:',
      codeData: TRACE_SNIPPET_COMPOSITION_COLLAPSIBLE,
    },
  ],
  compositionNote: '`z-trace-line` is always the line. To make a line do something, wrap it in that thing’s trigger.',
  features: [
    'One row for reasoning, tool calls, sources, plans and tasks',
    'Rows that expand, link out, or open a dialog, sheet, drawer or popover',
    '`running`, `error` and `pending` states, with a shimmer while running',
    'Nested rows, so a summary expands into steps and a step into its output',
    'Keyboard and screen reader support from the trigger that wraps each row',
    'Customizable styling through the `class` input on every part',
  ],
  preview: {
    name: 'preview',
    component: ZardDemoTracePreviewComponent,
    codeData: TRACE_DEMO_PREVIEW,
  },
  examples: [],
  sections: [
    {
      id: 'line',
      title: 'Trace Line',
      description: 'Use a `z-trace-line` on its own for a step with no detail to show. It reads as plain text.',
      examples: [{ name: 'line', component: ZardDemoTraceLineComponent, codeData: TRACE_DEMO_LINE }],
    },
    {
      id: 'status',
      title: 'Status',
      description: 'Set `zStatus` on `z-trace-line` when a step is running, has failed or hasn’t started yet.',
      examples: [{ name: 'status', component: ZardDemoTraceStatusComponent, codeData: TRACE_DEMO_STATUS }],
      tableAfterExamples: true,
      table: {
        columns: ['Status', 'Use for'],
        rows: [
          ['none', 'Work that is done: "Ran pnpm install".'],
          ['`error`', 'Work that failed. Say so in the title: "Failed to run pnpm lint".'],
          ['`running`', 'Work in progress. Write the title in the present tense: "Running pnpm build".'],
          ['`pending`', 'Work that has not started, such as a plan step: "Run pnpm test".'],
        ],
      },
    },
    {
      id: 'description',
      title: 'Description',
      description:
        'Put secondary text such as a diff stat, a duration or a count in a `z-trace-description` after the `z-trace-title`. It does not truncate.',
      examples: [
        { name: 'description', component: ZardDemoTraceDescriptionComponent, codeData: TRACE_DEMO_DESCRIPTION },
      ],
    },
    {
      id: 'collapsible',
      title: 'Collapsible',
      description:
        'Wrap the line in a `z-trace-collapsible` to show more detail when it expands. Put the `z-trace-line` inside `z-trace-collapsible-trigger` and the detail in `z-trace-collapsible-content`.',
      examples: [
        { name: 'collapsible', component: ZardDemoTraceCollapsibleComponent, codeData: TRACE_DEMO_COLLAPSIBLE },
      ],
    },
    {
      id: 'open',
      title: 'Open State',
      description:
        'Rows start closed. Set `zOpen` on `z-trace-collapsible` to start open, or bind `[(zOpen)]` to control a row.',
      examples: [
        {
          name: 'open',
          component: ZardDemoTraceOpenComponent,
          codeData: TRACE_DEMO_OPEN,
          codeAfter: [
            {
              description:
                'To open a row while it streams and let the reader’s click win, keep the reader’s choice in a signal that starts `undefined` and bind `open() ?? running()`.',
              codeData: TRACE_SNIPPET_OPEN_STATE,
            },
            { codeData: TRACE_SNIPPET_OPEN_STATE_TEMPLATE },
          ],
        },
      ],
    },
    {
      id: 'link',
      title: 'Link',
      description:
        'Wrap the `z-trace-line` in an anchor. For a new tab, use an arrow-up-right icon and an `sr-only` "(opens in a new tab)".',
      examples: [
        {
          name: 'link',
          component: ZardDemoTraceLinkComponent,
          codeData: TRACE_DEMO_LINK,
          codeAfter: { codeData: TRACE_SNIPPET_LINK },
        },
      ],
    },
    {
      id: 'dialog',
      title: 'Dialog',
      description:
        'Wrap the `z-trace-line` in the button that opens the dialog. The dialog owns its open state, Escape and focus return.',
      examples: [
        {
          name: 'dialog',
          component: ZardDemoTraceDialogComponent,
          codeData: TRACE_DEMO_DIALOG,
          codeAfter: { codeData: TRACE_SNIPPET_DIALOG },
        },
      ],
    },
    {
      id: 'sheet',
      title: 'Sheet',
      description: 'The same shape as the dialog. Drawer and Popover work the same way.',
      examples: [{ name: 'sheet', component: ZardDemoTraceSheetComponent, codeData: TRACE_DEMO_SHEET }],
    },
    {
      id: 'group',
      title: 'Group',
      description:
        'Put rows that sit next to each other in a `z-trace`. It also styles any trigger or link that wraps a `z-trace-line`.',
      examples: [{ name: 'group', component: ZardDemoTraceGroupComponent, codeData: TRACE_DEMO_GROUP }],
    },
    {
      id: 'sources',
      title: 'Sources',
      description: 'A collapsible row whose detail is a `z-trace` of link rows.',
      examples: [{ name: 'sources', component: ZardDemoTraceSourcesComponent, codeData: TRACE_DEMO_SOURCES }],
    },
    {
      id: 'chain-of-thought',
      title: 'Chain of Thought',
      description:
        'A chain of thought is a collapsible row with step rows inside. Set the parent’s status and title from its children.',
      examples: [
        {
          name: 'chain-of-thought',
          component: ZardDemoTraceChainOfThoughtComponent,
          codeData: TRACE_DEMO_CHAIN_OF_THOUGHT,
        },
      ],
    },
    {
      id: 'commit',
      title: 'Commit',
      description:
        'A commit is a collapsible row with a line for each changed file. Say what changed in the title, Added, Edited or Deleted, and put the line counts in the description. Each file opens its diff in a [Sheet](/docs/components/trace#sheet).',
      examples: [{ name: 'commit', component: ZardDemoTraceCommitComponent, codeData: TRACE_DEMO_COMMIT }],
    },
    {
      id: 'whole-turn',
      title: 'Whole Turn',
      description:
        'Three levels: the turn, a summary, and the rows. Text between steps sits between two `z-trace` lists.',
      examples: [{ name: 'whole-turn', component: ZardDemoTraceWholeTurnComponent, codeData: TRACE_DEMO_WHOLE_TURN }],
    },
    {
      id: 'reasoning',
      title: 'Reasoning',
      description:
        'Render the reasoning of a streamed reply. The row is a `z-trace-line` until the first text arrives. See [Open State](/docs/components/trace#open).',
      examples: [{ name: 'reasoning', component: ZardDemoTraceReasoningComponent, codeData: TRACE_DEMO_REASONING }],
    },
    {
      id: 'tool',
      title: 'Tool',
      description:
        'Render the tool calls of a streamed reply: a running line while the call runs, then a row that expands into its output.',
      examples: [{ name: 'tool', component: ZardDemoTraceToolComponent, codeData: TRACE_DEMO_TOOL }],
    },
    {
      id: 'rtl',
      title: 'RTL',
      examples: [
        {
          name: 'rtl',
          description: 'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).',
          type: 'rtl' as const,
          component: ZardDemoTraceRtlComponent,
          codeData: TRACE_DEMO_RTL,
        },
      ],
    },
  ],
  accessibility: [
    '`z-trace` adds no roles of its own. Each line gets its semantics from the element that wraps it.',
    [
      '- A `z-trace-line` on its own is a span-like box. It is read as text and is not a tab stop.',
      '- Wrap it in a `z-trace-collapsible-trigger` and it becomes a button with `aria-expanded`. Wrap it in a link, or in the trigger for a dialog or sheet, and it takes the keyboard and focus behavior of that element.',
      '- `z-trace-icon` is hidden from assistive tech, so `z-trace-title` is the accessible name. Write it as a sentence that says what happened, like "Edited trace.component.ts", not just "trace.component.ts".',
      '- When a link opens a new tab, add "(opens in a new tab)" to the title with `sr-only`.',
      '- Status is shown with color and motion, so put it in the title too. Write "Running pnpm build" while it runs and "Failed to run pnpm build" when it errors.',
      '- The shimmer on a running title stops when the reader prefers reduced motion. The title still says what is happening.',
      '- `z-trace-collapsible-content` mutes its text. If you put a block with a muted background inside it, give the block `text-foreground` so it keeps its contrast.',
    ].join('\n'),
  ],
};
