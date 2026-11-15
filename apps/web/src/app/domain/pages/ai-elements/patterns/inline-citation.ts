import { AI_ELEMENTS_INLINE_CITATION_INLINE_CITATION } from '@generated/ai-elements/inline-citation/inline-citation';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/inline-citation';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsInlineCitationComponent } from '../demos/inline-citation/inline-citation';

export const INLINE_CITATION: AiElementData = {
  slug: 'inline-citation',
  preview: {
    name: 'inline-citation',
    component: ZardAiElementsInlineCitationComponent,
    codeData: AI_ELEMENTS_INLINE_CITATION_INLINE_CITATION,
  },
  intro: [
    'Inline Citation is a source that sits in the sentence it supports. It is a [Hover Card](/docs/components/hover-card) on a [Button](/docs/components/button).',
    'To show a list of sources after the reply, use [Sources](/docs/ai-elements/sources).',
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
        { prose: 'Each source the agent sends with its reply is a citation. Keep them in a signal.' },
        { code: BLOCK_3 },
      ],
    },
  ],
};
