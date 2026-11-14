import { AI_ELEMENTS_TEST_RESULTS_SUITES } from '@generated/ai-elements/test-results/suites';
import { AI_ELEMENTS_TEST_RESULTS_TEST_RESULTS } from '@generated/ai-elements/test-results/test-results';
import { BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, TABS_0 } from '@generated/pages/ai-elements/test-results';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsTestResultsSuitesComponent } from '../demos/test-results/suites';
import { ZardAiElementsTestResultsComponent } from '../demos/test-results/test-results';

export const TEST_RESULTS: AiElementData = {
  slug: 'test-results',
  preview: {
    name: 'test-results',
    component: ZardAiElementsTestResultsComponent,
    codeData: AI_ELEMENTS_TEST_RESULTS_TEST_RESULTS,
  },
  intro: [
    'Test Results is a test run by the agent. The summary line counts what passed and failed. Open it to see each suite, its tests, and the error for each failure.',
    'Test Results is a `z-trace` with a `z-trace-collapsible` for the run and for each suite.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'suites',
      title: 'Suites',
      blocks: [
        {
          prose:
            'Group tests by file. Each suite is a collapsible line with a `z-trace` of its tests. Open the suites that have a failure.',
        },
        {
          example: {
            name: 'suites',
            component: ZardAiElementsTestResultsSuitesComponent,
            codeData: AI_ELEMENTS_TEST_RESULTS_SUITES,
          },
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
            'Run the tests as a tool and render its result. The tool states map the same way as in [Tool](/docs/ai-elements/tool#states).',
        },
        { code: BLOCK_4 },
      ],
    },
  ],
};
