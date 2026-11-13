/**
 * The AI Elements: patterns for agentic interfaces, each one a copy-paste composition of components
 * the library already ships. There is no package and no `z-*` component per pattern — a pattern is a
 * documented demo whose code people take away.
 *
 * The sidebar section (`AI_ELEMENTS_PATH` in routes.constant.ts) lists the same patterns as literal
 * entries, because the prerender script reads that file with a regular expression.
 */
export interface AiElementEntry {
  /** The URL segment: `/docs/ai-elements/<slug>`. */
  slug: string;
  name: string;
  /** The line on the overview card. */
  description: string;
  /** The line under the page heading, when it reads differently from the card. */
  pageDescription?: string;
  /** The components the pattern is composed of, as `zard-cli add` names. */
  builtWith: string[];
  /**
   * Components the pattern needs that are not in the library yet. While any is listed the pattern has no
   * page: the overview shows it as coming soon, and the sidebar entry is disabled.
   */
  requires?: string[];
}

export const AI_ELEMENTS: AiElementEntry[] = [
  {
    slug: 'chain-of-thought',
    name: 'Chain of Thought',
    description: 'A summary that expands into the steps an agent took.',
    pageDescription: 'Displays a summary that expands into the steps an agent took.',
    builtWith: ['trace', 'code-block', 'badge'],
    requires: ['code-block'],
  },
  {
    slug: 'chat',
    name: 'Chat',
    description: 'The thread. Message Scroller keeps your place while the reply streams.',
    builtWith: ['message-scroller', 'message', 'bubble', 'input-group'],
    requires: ['message-scroller'],
  },
  {
    slug: 'checkpoint',
    name: 'Checkpoint',
    description: 'A point in the conversation you can return to.',
    pageDescription: 'Marks a point in the conversation you can return to.',
    builtWith: ['marker', 'button'],
  },
  {
    slug: 'confirmation',
    name: 'Confirmation',
    description: 'A prompt to approve or deny a tool before it runs.',
    pageDescription: 'Asks for approval before a tool runs.',
    builtWith: ['item', 'button'],
  },
  {
    slug: 'context',
    name: 'Context',
    description: 'How much of the context window the conversation has used.',
    builtWith: ['hover-card', 'progress'],
  },
  {
    slug: 'file-tree',
    name: 'File Tree',
    description: 'The files the agent changed, as a folder tree.',
    builtWith: ['collapsible', 'button'],
  },
  {
    slug: 'inline-citation',
    name: 'Inline Citation',
    description: 'A source in the sentence that opens on hover.',
    builtWith: ['hover-card', 'button'],
  },
  {
    slug: 'message',
    name: 'Message',
    description: "One turn. The person's message, and the agent's reply with its actions.",
    builtWith: ['message', 'bubble', 'tooltip'],
  },
  {
    slug: 'model-selector',
    name: 'Model Selector',
    description: 'Two menus. One picks the model the agent runs, the other picks how hard it thinks.',
    builtWith: ['dropdown', 'input-group'],
  },
  {
    slug: 'plan',
    name: 'Plan',
    description: 'The steps the agent plans to take, and how far it has got.',
    pageDescription: 'Displays the steps the agent plans to take, and how far it has got.',
    builtWith: ['trace'],
  },
  {
    slug: 'prompt-input',
    name: 'Prompt Input',
    description: 'A message field with attachments and a send button.',
    builtWith: ['input-group', 'attachment', 'dropdown'],
  },
  {
    slug: 'queue',
    name: 'Queue',
    description: "The agent's todo list, split into what is left and what is done.",
    pageDescription: "Displays the agent's todo list, split into what is left and what is done.",
    builtWith: ['trace'],
  },
  {
    slug: 'reasoning',
    name: 'Reasoning',
    description: "The agent's thinking as it streams.",
    pageDescription: "Displays the agent's thinking as it streams.",
    builtWith: ['trace'],
  },
  {
    slug: 'sources',
    name: 'Sources',
    description: 'The links the agent used for a reply.',
    pageDescription: 'Displays the links the agent used for a reply.',
    builtWith: ['trace'],
  },
  {
    slug: 'stack-trace',
    name: 'Stack Trace',
    description: 'A failed tool call and its stack frames.',
    pageDescription: 'Displays a failed tool call and its stack frames.',
    builtWith: ['trace', 'code-block'],
    requires: ['code-block'],
  },
  {
    slug: 'subagent',
    name: 'Subagent',
    description: 'A subagent run, with its tool calls and result.',
    pageDescription: 'Displays a subagent run, with its tool calls and result.',
    builtWith: ['trace', 'code-block', 'badge'],
    requires: ['code-block'],
  },
  {
    slug: 'suggestion',
    name: 'Suggestion',
    description: 'A short prompt you can send to the agent in one click.',
    builtWith: ['button'],
  },
  {
    slug: 'task',
    name: 'Task',
    description: 'The steps the agent takes, as it takes them.',
    pageDescription: 'Displays the steps the agent takes, as it takes them.',
    builtWith: ['trace'],
  },
  {
    slug: 'terminal',
    name: 'Terminal',
    description: 'A command the agent runs, with its output as it streams.',
    pageDescription: 'Displays a command the agent runs, with its output as it streams.',
    builtWith: ['trace', 'code-block'],
    requires: ['code-block'],
  },
  {
    slug: 'test-results',
    name: 'Test Results',
    description: 'A test run by the agent, with its suites and failures.',
    pageDescription: 'Displays a test run by the agent, with its suites and failures.',
    builtWith: ['trace', 'code-block'],
    requires: ['code-block'],
  },
  {
    slug: 'tool',
    name: 'Tool',
    description: 'A tool call the agent makes, from input to output.',
    pageDescription: 'Displays a tool call the agent makes, from input to output.',
    builtWith: ['trace', 'code-block'],
    requires: ['code-block'],
  },
];

export const isAiElementAvailable = (entry: AiElementEntry): boolean => !entry.requires?.length;

export const findAiElement = (slug: string): AiElementEntry | undefined =>
  AI_ELEMENTS.find(entry => entry.slug === slug);

/** `input-group` -> `Input Group`, the way the components are named in the sidebar. */
export const componentLabel = (name: string): string =>
  name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
