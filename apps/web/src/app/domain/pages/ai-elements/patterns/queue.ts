import { AI_ELEMENTS_QUEUE_DESCRIPTIONS } from '@generated/ai-elements/queue/descriptions';
import { AI_ELEMENTS_QUEUE_QUEUE } from '@generated/ai-elements/queue/queue';
import { BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, TABS_0 } from '@generated/pages/ai-elements/queue';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsQueueDescriptionsComponent } from '../demos/queue/descriptions';
import { ZardAiElementsQueueComponent } from '../demos/queue/queue';

export const QUEUE: AiElementData = {
  slug: 'queue',
  preview: { name: 'queue', component: ZardAiElementsQueueComponent, codeData: AI_ELEMENTS_QUEUE_QUEUE },
  intro: [
    'Queue is the agent’s todo list. Todos sit in two sections, To do and Completed, and the icon on each todo shows its status. The agent updates the list as it works, so a todo moves from one section to the other when it is done.',
    'Queue is a `z-trace` with a `z-trace-collapsible` for each section.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'descriptions',
      title: 'Descriptions',
      blocks: [
        {
          prose:
            'A todo with a description is a `z-trace-collapsible` that opens to show it. A todo without one stays a `z-trace-line`.',
        },
        {
          example: {
            name: 'descriptions',
            component: ZardAiElementsQueueDescriptionsComponent,
            codeData: AI_ELEMENTS_QUEUE_DESCRIPTIONS,
          },
        },
        { code: BLOCK_3 },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'The agent writes its todos with a tool. Each call sends the whole list, so set the list from the last call, and skip a call whose input is still streaming.',
        },
        { code: BLOCK_4 },
        {
          prose:
            'Map each todo status to a section, an icon and a `zStatus`. Set `running` on the todo in progress only while the reply streams, so its title stops shimmering when the agent stops.',
        },
        {
          table: {
            columns: ['Todo status', 'Section', 'Icon', '`zStatus`'],
            rows: [
              ['`pending`', 'To do', '`lucideCircle`', 'none'],
              ['`in_progress`', 'To do', '`lucideCircleDot`', '`running` while the reply streams'],
              ['`completed`', 'Completed', '`lucideCircleCheck`', 'none'],
            ],
          },
        },
      ],
    },
  ],
};
