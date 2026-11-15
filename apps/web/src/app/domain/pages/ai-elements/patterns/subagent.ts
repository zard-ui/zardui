import { AI_ELEMENTS_SUBAGENT_DETAILS } from '@generated/ai-elements/subagent/details';
import { AI_ELEMENTS_SUBAGENT_SUBAGENT } from '@generated/ai-elements/subagent/subagent';
import { BLOCK_1, BLOCK_2, TABS_0 } from '@generated/pages/ai-elements/subagent';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsSubagentDetailsComponent } from '../demos/subagent/details';
import { ZardAiElementsSubagentComponent } from '../demos/subagent/subagent';

export const SUBAGENT: AiElementData = {
  slug: 'subagent',
  preview: { name: 'subagent', component: ZardAiElementsSubagentComponent, codeData: AI_ELEMENTS_SUBAGENT_SUBAGENT },
  intro: [
    'Subagent is a line for work the agent hands to a subagent. The run is the title, like "Ran the research agent". Open it for the tool calls the subagent made and what it found.',
    'Subagent is a `z-trace` with a `z-trace-collapsible` for the run and a nested `z-trace` for its tool calls.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'running',
      title: 'Running',
      blocks: [
        {
          prose:
            'While the subagent runs, the line has `zStatus="running"` and its content shows the tool calls so far. Add the result when the subagent finishes. Press Replay on the example at the top to watch it.',
        },
      ],
    },
    {
      id: 'details',
      title: 'Details',
      blocks: [
        {
          prose:
            'Put the task the subagent was given at the top of the content, with its model and tools as [Badge](/docs/components/badge) items. Show how long it ran in a `z-trace-description` after the title.',
        },
        {
          example: {
            name: 'details',
            component: ZardAiElementsSubagentDetailsComponent,
            codeData: AI_ELEMENTS_SUBAGENT_DETAILS,
          },
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'A subagent is a tool that streams the subagent’s own messages as preliminary results. Render the tool call as the line and those messages as the nested trace. The final result replaces the preliminary ones, so only show "Ran" once it arrives.',
        },
        {
          table: {
            columns: ['Subagent call', '`zStatus`', 'Title'],
            rows: [
              ['Input streaming or available', '`running` while the reply streams', 'Running …'],
              ['Preliminary result', '`running` while the reply streams', 'Running …'],
              ['Final result', 'none', 'Ran …'],
              ['Error, or still running after the reply stops', '`error`', 'Failed to run …'],
            ],
          },
        },
      ],
    },
  ],
};
