import { AI_ELEMENTS_CHECKPOINT_CHECKPOINT } from '@generated/ai-elements/checkpoint/checkpoint';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/checkpoint';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsCheckpointComponent } from '../demos/checkpoint/checkpoint';

export const CHECKPOINT: AiElementData = {
  slug: 'checkpoint',
  preview: {
    name: 'checkpoint',
    component: ZardAiElementsCheckpointComponent,
    codeData: AI_ELEMENTS_CHECKPOINT_CHECKPOINT,
  },
  intro: [
    'Checkpoint is a point in the conversation you can return to. It is a [Marker](/docs/components/marker) after a turn, with a Restore button. Restore keeps that turn and drops every message after it.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [
        { prose: 'Render a marker after the turn, with a button that restores it.' },
        { code: BLOCK_1 },
        { code: BLOCK_2 },
        { prose: 'See [Marker](/docs/components/marker#separator).' },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'Restore replaces the thread with the messages up to and including that turn. Every later turn is removed. Send a new message to continue from there.',
        },
        { code: BLOCK_3 },
      ],
    },
  ],
};
