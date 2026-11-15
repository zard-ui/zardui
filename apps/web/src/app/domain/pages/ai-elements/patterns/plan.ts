import { AI_ELEMENTS_PLAN_DESCRIPTION } from '@generated/ai-elements/plan/description';
import { AI_ELEMENTS_PLAN_PLAN } from '@generated/ai-elements/plan/plan';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/plan';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsPlanDescriptionComponent } from '../demos/plan/description';
import { ZardAiElementsPlanComponent } from '../demos/plan/plan';

export const PLAN: AiElementData = {
  slug: 'plan',
  preview: { name: 'plan', component: ZardAiElementsPlanComponent, codeData: AI_ELEMENTS_PLAN_PLAN },
  intro: [
    'Plan is the list of steps the agent decides on before it starts, such as the steps of a migration. Each step is done, running or pending, and the title counts how many are done.',
    'Plan is a `z-trace` with a `z-trace-collapsible` for the plan and a nested `z-trace` for its steps.',
    'When the steps are not known up front, use [Task](/docs/ai-elements/task) instead.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'details',
      title: 'Details',
      blocks: [
        { prose: 'Put a description above the steps, inside `z-trace-collapsible-content`.' },
        {
          example: {
            name: 'description',
            component: ZardAiElementsPlanDescriptionComponent,
            codeData: AI_ELEMENTS_PLAN_DESCRIPTION,
          },
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'The example simulates the agent with a timer. With a real model, have it send the whole plan each time a step changes, and set it on a signal. Setting, not appending, is what makes the plan update in place.',
        },
        { code: BLOCK_3 },
      ],
    },
  ],
};
