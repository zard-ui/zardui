import { AI_ELEMENTS_TERMINAL_ERROR } from '@generated/ai-elements/terminal/error';
import { AI_ELEMENTS_TERMINAL_TERMINAL } from '@generated/ai-elements/terminal/terminal';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/terminal';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsTerminalErrorComponent } from '../demos/terminal/error';
import { ZardAiElementsTerminalComponent } from '../demos/terminal/terminal';

export const TERMINAL: AiElementData = {
  slug: 'terminal',
  preview: { name: 'terminal', component: ZardAiElementsTerminalComponent, codeData: AI_ELEMENTS_TERMINAL_TERMINAL },
  intro: [
    'Terminal is a shell command the agent runs, such as a lint, a test run or a build. The line shows the command, and its output streams in underneath while it runs.',
    'Terminal is a `z-trace` with a `z-trace-collapsible` for each command, and a [Code Block](/docs/components/code-block) for its output.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'exit-code',
      title: 'Exit Code',
      blocks: [
        { prose: 'A command that exits with any code other than `0` failed. Set `zStatus="error"`.' },
        {
          example: {
            name: 'error',
            component: ZardAiElementsTerminalErrorComponent,
            codeData: AI_ELEMENTS_TERMINAL_ERROR,
          },
        },
        {
          table: {
            columns: ['Command', '`zStatus`', 'Title'],
            rows: [
              ['Running', '`running`', 'Running ng build'],
              ['Exited with `0`', 'none', 'Ran ng build'],
              ['Exited with another code', '`error`', 'ng lint exited with code 1'],
            ],
          },
        },
        {
          prose:
            'The command is a tool call, so its states map the same way as in [Tool](/docs/ai-elements/tool#states).',
        },
      ],
    },
    {
      id: 'open-while-running',
      title: 'Open While Running',
      blocks: [
        {
          prose:
            'Open the line once the first output arrives, so the output is visible while the command runs. Leave it open or closed after that, as in [Trace](/docs/components/trace#open).',
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'A tool result arrives only once the command exits. To stream the output while it runs, have the tool send it under the id of its call, and replace the output with the same id as it grows.',
        },
        { code: BLOCK_3 },
      ],
    },
  ],
};
