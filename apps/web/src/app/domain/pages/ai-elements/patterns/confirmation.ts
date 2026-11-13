import { AI_ELEMENTS_CONFIRMATION_CONFIRMATION } from '@generated/ai-elements/confirmation/confirmation';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/confirmation';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsConfirmationComponent } from '../demos/confirmation/confirmation';

export const CONFIRMATION: AiElementData = {
  slug: 'confirmation',
  preview: {
    name: 'confirmation',
    component: ZardAiElementsConfirmationComponent,
    codeData: AI_ELEMENTS_CONFIRMATION_CONFIRMATION,
  },
  intro: [
    'Confirmation asks the person for a yes or no before a tool runs. The question is an [Item](/docs/components/item) with Deny and Approve buttons. Once the person answers, the call becomes a [Tool](/docs/ai-elements/tool) line.',
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
            'While the tool call waits for approval, answer it with the id of the call. The agent continues once every approval has an answer.',
        },
        { code: BLOCK_3 },
        {
          prose:
            'Approve runs the tool and streams its output. Deny skips it. Either way, the call becomes a Tool line. See [Tool](/docs/ai-elements/tool#approval).',
        },
      ],
    },
  ],
};
