import { AI_ELEMENTS_SOURCES_SOURCES } from '@generated/ai-elements/sources/sources';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/sources';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsSourcesComponent } from '../demos/sources/sources';

export const SOURCES: AiElementData = {
  slug: 'sources',
  preview: { name: 'sources', component: ZardAiElementsSourcesComponent, codeData: AI_ELEMENTS_SOURCES_SOURCES },
  intro: [
    'Sources is a line that lists the links the agent used for a reply. It says how many there are, like "Used 3 sources", and opens into a link for each one.',
    'Sources is a `z-trace` with a `z-trace-collapsible` for the list.',
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
            'Collect the sources of a message and render them after the text. The agent can cite the same page more than once, so dedupe them by `url`.',
        },
        { code: BLOCK_3 },
        { prose: 'A source may come without a `title`. Fall back to the hostname of the URL.' },
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      blocks: [
        {
          prose: [
            'Each source is a plain link inside the list.',
            '- Links open in a new tab. Add `sr-only` text, like "(opens in a new tab)", so screen readers announce it.',
            '- The arrow icon is decorative. The title is the name of the link.',
            '- The count in the trigger, like "Used 3 sources", tells the person what opens before they open it.',
          ].join('\n'),
        },
      ],
    },
  ],
};
