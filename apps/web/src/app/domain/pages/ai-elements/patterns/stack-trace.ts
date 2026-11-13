import { AI_ELEMENTS_STACK_TRACE_FRAMES } from '@generated/ai-elements/stack-trace/frames';
import { AI_ELEMENTS_STACK_TRACE_STACK_TRACE } from '@generated/ai-elements/stack-trace/stack-trace';
import { BLOCK_1, BLOCK_2, BLOCK_3, BLOCK_4, TABS_0 } from '@generated/pages/ai-elements/stack-trace';

import type { AiElementData } from '../ai-element.types';
import { ZardAiElementsStackTraceFramesComponent } from '../demos/stack-trace/frames';
import { ZardAiElementsStackTraceComponent } from '../demos/stack-trace/stack-trace';

export const STACK_TRACE: AiElementData = {
  slug: 'stack-trace',
  preview: {
    name: 'stack-trace',
    component: ZardAiElementsStackTraceComponent,
    codeData: AI_ELEMENTS_STACK_TRACE_STACK_TRACE,
  },
  intro: [
    'Stack Trace is a line for a tool call that failed. The error is the title, like "Failed: TypeError". Open it for the stack frames, which can link to the file and line.',
    'Stack Trace is a `z-trace` with a `z-trace-collapsible` for the frames.',
  ],
  install: TABS_0,
  sections: [
    {
      id: 'usage',
      title: 'Usage',
      blocks: [
        { code: BLOCK_1 },
        { code: BLOCK_2 },
        { code: BLOCK_3 },
        {
          prose:
            'The title truncates, so repeat the full error at the top of the content. Frames from `node_modules` stay muted, so your own frames stand out.',
        },
      ],
    },
    {
      id: 'frame-links',
      title: 'Frame Links',
      blocks: [
        {
          prose:
            'Turn your own frames into links that open the file at the line. Fold the framework frames into a collapsible line of their own, so the frames you can fix come first.',
        },
        {
          example: {
            name: 'frames',
            component: ZardAiElementsStackTraceFramesComponent,
            codeData: AI_ELEMENTS_STACK_TRACE_FRAMES,
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
            'When a tool throws, send the stack as its error text, not only the message. Split it into the error and the frames when you render it.',
        },
        { code: BLOCK_4 },
        { prose: 'Map the other tool states as in [Tool](/docs/ai-elements/tool#states).' },
      ],
    },
  ],
};
