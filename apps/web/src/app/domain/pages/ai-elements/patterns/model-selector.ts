import { AI_ELEMENTS_MODEL_SELECTOR_MODEL_SELECTOR } from '@generated/ai-elements/model-selector/model-selector';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/model-selector';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsModelSelectorComponent } from '../demos/model-selector/model-selector';

export const MODEL_SELECTOR: AiElementData = {
  slug: 'model-selector',
  preview: {
    name: 'model-selector',
    component: ZardAiElementsModelSelectorComponent,
    codeData: AI_ELEMENTS_MODEL_SELECTOR_MODEL_SELECTOR,
  },
  intro: [
    'Model Selector is two [Dropdown](/docs/components/dropdown) menus in the footer of an [Input Group](/docs/components/input-group). One picks the model the agent runs, the other picks how hard it thinks. Each menu is a radio group, and its trigger shows the current choice.',
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
            'Send the model and the effort with the message. Map them to a model and its options on the server: each provider reads its own option and ignores the rest.',
        },
        { code: BLOCK_3 },
      ],
    },
  ],
};
