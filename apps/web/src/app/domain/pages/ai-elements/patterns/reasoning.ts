import { AI_ELEMENTS_REASONING_DURATION } from '@generated/ai-elements/reasoning/duration';
import { AI_ELEMENTS_REASONING_REASONING } from '@generated/ai-elements/reasoning/reasoning';
import { BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, BLOCK_5, TABS_0 } from '@generated/pages/ai-elements/reasoning';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsReasoningDurationComponent } from '../demos/reasoning/duration';
import { ZardAiElementsReasoningComponent } from '../demos/reasoning/reasoning';

export const REASONING: AiElementData = {
  slug: 'reasoning',
  preview: {
    name: 'reasoning',
    component: ZardAiElementsReasoningComponent,
    codeData: AI_ELEMENTS_REASONING_REASONING,
  },
  intro: [
    'Reasoning is a line for the agent’s thinking. It reads "Thinking" and opens while the model thinks, then reads "Thought" and closes when it is done. The thinking itself sits inside, and the line can show how long it took.',
    'Reasoning is a `z-trace` with a `z-trace-collapsible` for the thinking.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'duration',
      title: 'Duration',
      blocks: [
        {
          prose:
            'Models do not time their reasoning. Measure it on the server, send it with the message, and show it in a `z-trace-description` after the title.',
        },
        {
          example: {
            name: 'duration',
            component: ZardAiElementsReasoningDurationComponent,
            codeData: AI_ELEMENTS_REASONING_DURATION,
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
            'Render each reasoning part as a line. It starts as a plain `z-trace-line` and becomes a `z-trace-collapsible` once text arrives, so there is nothing to open before the model has written anything. It opens while the model thinks and closes when it finishes. If the person opens or closes it, their choice wins. See [Open State](/docs/components/trace#open).',
        },
        { code: BLOCK_4 },
        { code: BLOCK_5 },
      ],
    },
  ],
};
