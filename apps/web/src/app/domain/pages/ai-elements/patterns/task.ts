import { AI_ELEMENTS_TASK_TASK } from '@generated/ai-elements/task/task';
import { BLOCK_1, BLOCK_2, BLOCK_3, TABS_0 } from '@generated/pages/ai-elements/task';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsTaskComponent } from '../demos/task/task';

export const TASK: AiElementData = {
  slug: 'task',
  preview: { name: 'task', component: ZardAiElementsTaskComponent, codeData: AI_ELEMENTS_TASK_TASK },
  intro: [
    'Task is a piece of work the agent is doing, such as finding the project files or updating a page. Each step, like a search, a read or an edit, appears under the task when the agent takes it.',
    'Task is a `z-trace` with a `z-trace-collapsible` for each task.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'task-or-plan',
      title: 'Task or Plan',
      blocks: [
        { prose: 'Both are a list of steps under a collapsible line. The difference is when the steps are known.' },
        {
          prose:
            'Use [Plan](/docs/ai-elements/plan) when the agent decides the steps before it starts. Use Task when the steps come from the work itself, and the agent only knows the next one once it has taken the last.',
        },
        {
          table: {
            columns: ['', 'Plan', 'Task'],
            rows: [
              ['Steps', 'Every step, from the start', 'Each step, once the agent takes it'],
              ['Pending steps', 'Yes, waiting their turn', 'None'],
              ['Title', 'The goal, with progress: "2 of 4 done"', 'What the agent is doing, then what it did'],
              ['Per reply', 'One plan', 'One or more tasks, each closing when it is done'],
            ],
          },
        },
      ],
    },
    {
      id: 'usage',
      title: 'Usage',
      blocks: [{ code: BLOCK_1 }, { code: BLOCK_2 }],
    },
    {
      id: 'status',
      title: 'Status',
      blocks: [
        {
          prose:
            'Set the task’s status from its steps. Write the title in the present tense while the task runs, and in the past tense once it is done.',
        },
        {
          table: {
            columns: ['Steps', '`zStatus`', 'Title'],
            rows: [
              ['A step is still running', '`running`', 'Updating the page metadata'],
              ['A step failed', '`error`', 'Failed to update the page metadata'],
              ['Every step is done', 'none', 'Updated the page metadata'],
            ],
          },
        },
        {
          prose: 'Put several tasks in one `z-trace`. Keep the running task open, and close each task once it is done.',
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Streaming',
      blocks: [
        {
          prose:
            'Have the agent send the whole task, with its own `id`, each time a step changes. Replace the task with the same `id`, so it updates in place.',
        },
        { code: BLOCK_3 },
      ],
    },
  ],
};
