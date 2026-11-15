import { AI_ELEMENTS_MESSAGE_MESSAGE } from '@generated/ai-elements/message/message';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/message';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsMessageComponent } from '../demos/message/message';

export const MESSAGE: AiElementData = {
  slug: 'message',
  preview: { name: 'message', component: ZardAiElementsMessageComponent, codeData: AI_ELEMENTS_MESSAGE_MESSAGE },
  intro: [
    'Use Message for one turn in a thread. The person’s text is a [Bubble](/docs/components/bubble) on a [Message](/docs/components/message) with `zAlign="end"`. The agent’s reply is markdown on a Message, with actions under it. A thread of these turns is [Chat](/docs/ai-elements/chat).',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }, { prose: 'See [Message](/docs/components/message).' }],
    },
    {
      id: 'actions',
      title: 'Actions',
      blocks: [
        {
          prose: [
            'Put actions in `z-message-footer`. It follows the message alignment, so on the person’s turn the actions sit on the right. Use ghost icon buttons with a tooltip for each.',
            '- **Copy** writes the reply to the clipboard and swaps to a check for two seconds.',
            '- **Good response** and **Bad response** are toggles. Set `aria-pressed` so screen readers announce the state.',
            '- **Retry** runs the turn again.',
            '- **Edit** on the person’s turn puts the text back in the field.',
          ].join('\n'),
        },
      ],
    },
    {
      id: 'markdown',
      title: 'Markdown',
      blocks: [
        {
          prose:
            'The reply streams as markdown. Render it with a markdown library, like [ngx-markdown](https://github.com/jfcere/ngx-markdown), and style the result with [Typeset](/docs/typeset).',
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'Branch on the message role. The person’s turn is the bubble. The agent’s turn is the reply, and Retry runs it again with the message id.',
        },
        { code: BLOCK_3 },
      ],
    },
  ],
};
