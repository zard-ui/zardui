import { AI_ELEMENTS_CHAIN_OF_THOUGHT_CHAIN_OF_THOUGHT } from '@generated/ai-elements/chain-of-thought/chain-of-thought';
import { BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, TABS_0 } from '@generated/pages/ai-elements/chain-of-thought';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsChainOfThoughtComponent } from '../demos/chain-of-thought/chain-of-thought';

export const CHAIN_OF_THOUGHT: AiElementData = {
  slug: 'chain-of-thought',
  preview: {
    name: 'chain-of-thought',
    component: ZardAiElementsChainOfThoughtComponent,
    codeData: AI_ELEMENTS_CHAIN_OF_THOUGHT_CHAIN_OF_THOUGHT,
  },
  intro: [
    'Chain of Thought is a summary line that expands into the steps an agent took. The summary says what happened, like "Researched in 3 steps". The steps sit inside it, each one a line of its own.',
    'Chain of Thought is a `z-trace` with a `z-trace-collapsible` for the summary.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'steps',
      title: 'Steps',
      blocks: [
        { prose: 'Each step is a `z-trace-line`. Set its `zStatus` and write the title in the matching tense.' },
        {
          table: {
            columns: ['Step', '`zStatus`', 'Title'],
            rows: [
              ['Running', '`running`', 'Searching for …'],
              ['Done, with detail', 'none', 'Searched for …'],
              ['Done, links out', 'none', 'Read the image optimization guide'],
              ['Failed', '`error`', 'Failed to search for …'],
            ],
          },
        },
        {
          prose:
            'Add `zKeepMounted` to the summary’s `z-trace-collapsible-content`. Steps keep their open state when the summary closes.',
        },
      ],
    },
    {
      id: 'search-results',
      title: 'Search Results',
      blocks: [
        {
          prose:
            'When a step runs a web search, show the results as a [Badge](/docs/components/badge) for each hostname in the step’s content.',
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
            'Render each tool call as a step. The steps are running while tool calls stream and before the reply starts. Set the summary’s status and title from the steps. The summary opens while the steps run, as in [Trace](/docs/components/trace#open).',
        },
        { code: BLOCK_4 },
      ],
    },
  ],
};
