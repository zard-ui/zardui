import { AI_ELEMENTS_PROMPT_INPUT_PROMPT_INPUT } from '@generated/ai-elements/prompt-input/prompt-input';
import { BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, BLOCK_5, TABS_0 } from '@generated/pages/ai-elements/prompt-input';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsPromptInputComponent } from '../demos/prompt-input/prompt-input';

export const PROMPT_INPUT: AiElementData = {
  slug: 'prompt-input',
  preview: {
    name: 'prompt-input',
    component: ZardAiElementsPromptInputComponent,
    codeData: AI_ELEMENTS_PROMPT_INPUT_PROMPT_INPUT,
  },
  intro: [
    'Prompt Input is the field the person types into to message the agent. It is an [Input Group](/docs/components/input-group) with a textarea, an attach button, the [Model Selector](/docs/ai-elements/model-selector) menus and a send button. Attached files show as [Attachment](/docs/components/attachment) chips above the text.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'attachments',
      title: 'Attachments',
      blocks: [
        {
          prose:
            'The attach button opens a hidden file input. Show each file as a `z-attachment` in an addon with `zAlign="block-start"`, with a button to remove it.',
        },
      ],
    },
    {
      id: 'model-and-effort',
      title: 'Model and Effort',
      blocks: [
        {
          prose:
            'Put the two [Model Selector](/docs/ai-elements/model-selector) menus in the `block-end` addon, between the attach and send buttons. Move `ms-auto` from the send button to the first menu trigger, so both menus sit next to the send button.',
        },
      ],
    },
    {
      id: 'keyboard',
      title: 'Keyboard',
      blocks: [{ prose: 'Enter sends the message. Shift+Enter adds a new line.' }, { code: BLOCK_3 }, { code: BLOCK_4 }],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [{ prose: 'Send the text and the files from the file input.' }, { code: BLOCK_5 }],
    },
  ],
};
