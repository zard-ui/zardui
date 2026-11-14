import { AI_ELEMENTS_CONTEXT_CONTEXT } from '@generated/ai-elements/context/context';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/context';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsContextComponent } from '../demos/context/context';

export const CONTEXT: AiElementData = {
  slug: 'context',
  preview: { name: 'context', component: ZardAiElementsContextComponent, codeData: AI_ELEMENTS_CONTEXT_CONTEXT },
  intro: [
    'Context shows how much of the model’s context window the conversation has used. It is a [Hover Card](/docs/components/hover-card) with a [Progress](/docs/components/progress) bar.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'Read the token usage your model reports when a reply finishes, and keep it in a signal. The percentage follows from it.',
        },
        { code: BLOCK_3 },
        { prose: 'The limit is the model’s context window. Models do not send it, so set it from the model you use.' },
      ],
    },
  ],
};
