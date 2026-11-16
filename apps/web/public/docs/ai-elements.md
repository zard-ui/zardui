---
title: AI Elements
description: Patterns for agentic interfaces, built from Zard UI components.
---

# AI Elements

Patterns for agentic interfaces, built from Zard UI components.

AI Elements are patterns for building agentic interfaces. Each one is a composition of Zard UI components that you copy into your project. There is no package to install and no new component to learn. The code is yours.

A chat is a list of [Message](/docs/ai-elements/message) turns. The steps an agent takes inside a turn, like [Reasoning](/docs/ai-elements/reasoning), [Plan](/docs/ai-elements/plan) and [Task](/docs/ai-elements/task), are built on [Trace](/docs/components/trace), so every step has the same shape.

## Patterns

- [Chain of Thought A summary that expands into the steps an agent took.](/docs/ai-elements/chain-of-thought)
- [Chat The thread. Message Scroller keeps your place while the reply streams.](/docs/ai-elements/chat)
- [Checkpoint A point in the conversation you can return to.](/docs/ai-elements/checkpoint)
- [Confirmation A prompt to approve or deny a tool before it runs.](/docs/ai-elements/confirmation)
- [Context How much of the context window the conversation has used.](/docs/ai-elements/context)
- [File Tree The files the agent changed, as a folder tree.](/docs/ai-elements/file-tree)
- [Inline Citation A source in the sentence that opens on hover.](/docs/ai-elements/inline-citation)
- [Message One turn. The person's message, and the agent's reply with its actions.](/docs/ai-elements/message)
- [Model Selector Two menus. One picks the model the agent runs, the other picks how hard it thinks.](/docs/ai-elements/model-selector)
- [Plan The steps the agent plans to take, and how far it has got.](/docs/ai-elements/plan)
- [Prompt Input A message field with attachments and a send button.](/docs/ai-elements/prompt-input)
- [Queue The agent's todo list, split into what is left and what is done.](/docs/ai-elements/queue)
- [Reasoning The agent's thinking as it streams.](/docs/ai-elements/reasoning)
- [Sources The links the agent used for a reply.](/docs/ai-elements/sources)
- [Stack Trace A failed tool call and its stack frames.](/docs/ai-elements/stack-trace)
- [Subagent A subagent run, with its tool calls and result.](/docs/ai-elements/subagent)
- [Suggestion A short prompt you can send to the agent in one click.](/docs/ai-elements/suggestion)
- [Task The steps the agent takes, as it takes them.](/docs/ai-elements/task)
- [Terminal A command the agent runs, with its output as it streams.](/docs/ai-elements/terminal)
- [Test Results A test run by the agent, with its suites and failures.](/docs/ai-elements/test-results)
- [Tool A tool call the agent makes, from input to output.](/docs/ai-elements/tool)

## Get started

### Add the components

Most patterns are built on Trace. Add it, and any other component a pattern lists on its page.

```
npx zard-cli add trace
```

### Copy a pattern

Open a pattern above and copy the code of its example into your project. Every example is a standalone component, so it runs as soon as the components it imports are installed. Or ask your coding agent to do it:

**Prompt**

```
Add the Reasoning pattern from https://zardui.com/docs/ai-elements/reasoning.md to my chat.
```

## Streaming

The examples that stream, like [Reasoning](/docs/ai-elements/reasoning) and [Task](/docs/ai-elements/task), simulate the agent in the browser with signals and timers. There is no backend and no AI SDK.

To plug in a real model, keep the template and replace the simulated run: write each chunk your stream sends into the same signals. The pattern does not care where the text comes from, only that the signals change.
