import type { AiElementData } from './ai-element.types';

/**
 * The page data of every pattern that has a page, loaded on demand so each pattern's demos stay in a chunk
 * of their own. A pattern listed in AI_ELEMENTS but missing here has no page, and its route goes back to the overview.
 */
export const AI_ELEMENT_LOADERS: Record<string, () => Promise<AiElementData>> = {
  'chain-of-thought': () => import('./patterns/chain-of-thought').then(m => m.CHAIN_OF_THOUGHT),
  chat: () => import('./patterns/chat').then(m => m.CHAT),
  checkpoint: () => import('./patterns/checkpoint').then(m => m.CHECKPOINT),
  confirmation: () => import('./patterns/confirmation').then(m => m.CONFIRMATION),
  context: () => import('./patterns/context').then(m => m.CONTEXT),
  'file-tree': () => import('./patterns/file-tree').then(m => m.FILE_TREE),
  'inline-citation': () => import('./patterns/inline-citation').then(m => m.INLINE_CITATION),
  message: () => import('./patterns/message').then(m => m.MESSAGE),
  'model-selector': () => import('./patterns/model-selector').then(m => m.MODEL_SELECTOR),
  plan: () => import('./patterns/plan').then(m => m.PLAN),
  'prompt-input': () => import('./patterns/prompt-input').then(m => m.PROMPT_INPUT),
  queue: () => import('./patterns/queue').then(m => m.QUEUE),
  reasoning: () => import('./patterns/reasoning').then(m => m.REASONING),
  sources: () => import('./patterns/sources').then(m => m.SOURCES),
  'stack-trace': () => import('./patterns/stack-trace').then(m => m.STACK_TRACE),
  subagent: () => import('./patterns/subagent').then(m => m.SUBAGENT),
  suggestion: () => import('./patterns/suggestion').then(m => m.SUGGESTION),
  task: () => import('./patterns/task').then(m => m.TASK),
  terminal: () => import('./patterns/terminal').then(m => m.TERMINAL),
  'test-results': () => import('./patterns/test-results').then(m => m.TEST_RESULTS),
  tool: () => import('./patterns/tool').then(m => m.TOOL),
};
