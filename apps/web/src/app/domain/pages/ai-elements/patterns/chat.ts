import { AI_ELEMENTS_CHAT_CHAT } from '@generated/ai-elements/chat/chat';
import { BLOCK_1, BLOCK_2, TABS_0 } from '@generated/pages/ai-elements/chat';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsChatComponent } from '../demos/chat/chat';

export const CHAT: AiElementData = {
  slug: 'chat',
  preview: { name: 'chat', component: ZardAiElementsChatComponent, codeData: AI_ELEMENTS_CHAT_CHAT },
  intro: [
    'Chat is the thread of a conversation with the agent. Each turn is a [Message](/docs/ai-elements/message) inside [Message Scroller](/docs/components/message-scroller). The person’s message is the scroll anchor, so a new question settles near the top and the reply streams in under it. The field is a [Prompt Input](/docs/ai-elements/prompt-input).',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [
        { code: BLOCK_1 },
        { code: BLOCK_2 },
        {
          prose:
            '`zAnchor` goes on the person’s turn. `zAutoScroll` follows the reply while the person stays at the live edge. See [Message Scroller](/docs/components/message-scroller).',
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'The example scripts the conversation with signals and timers: each agent turn streams reasoning, a tool call and a reply, and the field fills with the next scripted message. With a real model, append each part your stream sends to the last message instead.',
        },
      ],
    },
  ],
};
