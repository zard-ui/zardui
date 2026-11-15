import { AI_ELEMENTS_SUGGESTION_SUGGESTION } from '@generated/ai-elements/suggestion/suggestion';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/suggestion';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsSuggestionComponent } from '../demos/suggestion/suggestion';

export const SUGGESTION: AiElementData = {
  slug: 'suggestion',
  preview: {
    name: 'suggestion',
    component: ZardAiElementsSuggestionComponent,
    codeData: AI_ELEMENTS_SUGGESTION_SUGGESTION,
  },
  intro: [
    'Suggestion is a prompt you send without typing. Each one is a [Button](/docs/components/button) with the prompt as its label. Put a row of them above the [Prompt Input](/docs/ai-elements/prompt-input).',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'scrolling',
      title: 'Scrolling',
      blocks: [
        {
          prose:
            'The row scrolls sideways when the suggestions do not fit. [`scroll-fade-x`](/docs/utils/scroll-fade) fades the edge that has more to show, and `shrink-0` keeps each label on one line.',
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [{ prose: 'The label is the message. Send it as is.' }, { code: BLOCK_3 }],
    },
  ],
};
