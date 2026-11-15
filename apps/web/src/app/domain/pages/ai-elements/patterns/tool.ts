import { AI_ELEMENTS_CONFIRMATION_CONFIRMATION } from '@generated/ai-elements/confirmation/confirmation';
import { AI_ELEMENTS_TOOL_SHEET } from '@generated/ai-elements/tool/sheet';
import { AI_ELEMENTS_TOOL_STATES } from '@generated/ai-elements/tool/states';
import { AI_ELEMENTS_TOOL_TOOL } from '@generated/ai-elements/tool/tool';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/tool';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsConfirmationComponent } from '../demos/confirmation/confirmation';
import { ZardAiElementsToolSheetComponent } from '../demos/tool/sheet';
import { ZardAiElementsToolStatesComponent } from '../demos/tool/states';
import { ZardAiElementsToolComponent } from '../demos/tool/tool';

export const TOOL: AiElementData = {
  slug: 'tool',
  preview: { name: 'tool', component: ZardAiElementsToolComponent, codeData: AI_ELEMENTS_TOOL_TOOL },
  intro: [
    'Tool is a tool call the agent makes, such as running a command or reading a file. The line follows the call from input to output, including errors and calls that wait for approval.',
    'Tool is a `z-trace` with a `z-trace-collapsible` for each call that has output, and a [Code Block](/docs/components/code-block) for the output.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'states',
      title: 'States',
      blocks: [
        { prose: 'Trace does not know about tool calls. Map the state of each call to a `zStatus` and a title.' },
        {
          example: { name: 'states', component: ZardAiElementsToolStatesComponent, codeData: AI_ELEMENTS_TOOL_STATES },
        },
        {
          table: {
            columns: ['Tool call', '`zStatus`', 'Title'],
            rows: [
              ['Input streaming or available', '`running` while the reply streams', 'Running …'],
              ['Still waiting after the reply stops', '`error`', 'Failed to run …'],
              ['Waiting for approval', '-', 'Not a line. An `Item` outside the trace, with Approve and Deny buttons.'],
              ['Approved or denied', '`running` if approved, none if not', 'Running … if approved, Denied … if not'],
              ['Output available', 'none', 'Ran …'],
              ['Output error', '`error`', 'Failed to run …'],
            ],
          },
        },
        {
          prose: 'A tool is a plain `z-trace-line` while it runs, and a `z-trace-collapsible` once its output arrives.',
        },
        { code: BLOCK_3 },
        {
          prose:
            'A tool that runs in the browser stays waiting after the reply stops, until you send its result. Treat it as waiting, not failed.',
        },
      ],
    },
    {
      id: 'sheet',
      title: 'Output in a Sheet',
      blocks: [
        {
          prose:
            'For long output, wrap the `z-trace-line` in the button that opens a [Sheet](/docs/components/sheet) and show the output in the sheet. See [Trace](/docs/components/trace#sheet).',
        },
        { example: { name: 'sheet', component: ZardAiElementsToolSheetComponent, codeData: AI_ELEMENTS_TOOL_SHEET } },
      ],
    },
    {
      id: 'approval',
      title: 'Approval',
      blocks: [
        {
          prose:
            'A pending approval is a question for the person, not a step the agent took, so it sits outside `z-trace` as an [Item](/docs/components/item). Once the person answers, the tool goes back to being a line. See [Confirmation](/docs/ai-elements/confirmation).',
        },
        {
          example: {
            name: 'approval',
            component: ZardAiElementsConfirmationComponent,
            codeData: AI_ELEMENTS_CONFIRMATION_CONFIRMATION,
          },
        },
      ],
    },
  ],
};
