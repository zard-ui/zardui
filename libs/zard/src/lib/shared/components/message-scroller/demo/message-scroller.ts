import { MESSAGE_SCROLLER_DEMO_ANCHORING } from '@generated/components/message-scroller/demo/anchoring';
import { MESSAGE_SCROLLER_DEMO_ANIMATION } from '@generated/components/message-scroller/demo/animation';
import { MESSAGE_SCROLLER_DEMO_COMMANDS } from '@generated/components/message-scroller/demo/commands';
import { MESSAGE_SCROLLER_DEMO_GROUP_CHAT } from '@generated/components/message-scroller/demo/group-chat';
import { MESSAGE_SCROLLER_DEMO_LOAD_HISTORY } from '@generated/components/message-scroller/demo/load-history';
import { MESSAGE_SCROLLER_DEMO_OPENING_POSITION } from '@generated/components/message-scroller/demo/opening-position';
import { MESSAGE_SCROLLER_DEMO_PREVIEW } from '@generated/components/message-scroller/demo/preview';
import { MESSAGE_SCROLLER_DEMO_PREVIOUS_CONTEXT } from '@generated/components/message-scroller/demo/previous-context';
import { MESSAGE_SCROLLER_DEMO_RTL } from '@generated/components/message-scroller/demo/rtl';
import { MESSAGE_SCROLLER_DEMO_SCROLLABLE } from '@generated/components/message-scroller/demo/scrollable';
import { MESSAGE_SCROLLER_DEMO_STREAMING } from '@generated/components/message-scroller/demo/streaming';
import { MESSAGE_SCROLLER_DEMO_VISIBILITY } from '@generated/components/message-scroller/demo/visibility';
import {
  MESSAGE_SCROLLER_SNIPPET_ANCHORING,
  MESSAGE_SCROLLER_SNIPPET_ANIMATION,
  MESSAGE_SCROLLER_SNIPPET_COMMANDS,
  MESSAGE_SCROLLER_SNIPPET_COMPOSITION,
  MESSAGE_SCROLLER_SNIPPET_GROUP_CHAT,
  MESSAGE_SCROLLER_SNIPPET_OPENING_POSITION,
  MESSAGE_SCROLLER_SNIPPET_PREVIOUS_CONTEXT,
  MESSAGE_SCROLLER_SNIPPET_SCROLLABLE,
  MESSAGE_SCROLLER_SNIPPET_STREAMING,
  MESSAGE_SCROLLER_SNIPPET_VIRTUALIZATION,
  MESSAGE_SCROLLER_SNIPPET_VISIBILITY,
} from '@generated/components/message-scroller/snippets';
import { MESSAGE_SCROLLER_CLI_ADD } from '@generated/installation/cli/add-message-scroller';
import { MESSAGE_SCROLLER_MANUAL_CODE } from '@generated/installation/manual/message-scroller';
import {
  MESSAGE_SCROLLER_USAGE_ADDITIONAL,
  MESSAGE_SCROLLER_USAGE_CODE,
  MESSAGE_SCROLLER_USAGE_DESCRIPTION,
  MESSAGE_SCROLLER_USAGE_IMPORT,
} from '@generated/usage/message-scroller';

import { ZardDemoMessageScrollerAnchoringComponent } from './anchoring';
import { ZardDemoMessageScrollerAnimationComponent } from './animation';
import { ZardDemoMessageScrollerCommandsComponent } from './commands';
import { ZardDemoMessageScrollerGroupChatComponent } from './group-chat';
import { ZardDemoMessageScrollerLoadHistoryComponent } from './load-history';
import { ZardDemoMessageScrollerOpeningPositionComponent } from './opening-position';
import { ZardDemoMessageScrollerPreviewComponent } from './preview';
import { ZardDemoMessageScrollerPreviousContextComponent } from './previous-context';
import { ZardDemoMessageScrollerRtlComponent } from './rtl';
import { ZardDemoMessageScrollerScrollableComponent } from './scrollable';
import { ZardDemoMessageScrollerStreamingComponent } from './streaming';
import { ZardDemoMessageScrollerVisibilityComponent } from './visibility';
import { MESSAGE_SCROLLER_API } from '../doc/api';

const PRINCIPLES = [
  '1. **Move only when the reader asked to move.** If someone is reading, don’t pull them somewhere else. Auto-scroll should never be the default.',
  '2. **Follow only while they’re following.** If they’re at the live edge, keep the stream in view. If they scroll away, leave them there.',
  '3. **Every interaction is a signal.** Scrolling is not the only one. Selecting text, using the keyboard, opening a link, or searching should all stop the interface from moving.',
  '4. **Start a new turn near the top of the viewport.** This gives the new turn somewhere it can be read from the beginning.',
  '5. **Then stream in the answer.** The answer should grow into the screen, not immediately push everything away.',
  '6. **Keep part of the previous conversation in context.** The prompt and reply should stay visually connected, and enough of the previous turn should remain visible so the reader knows where they are.',
  '7. **Let new content arrive offscreen.** The conversation can keep streaming without changing what the reader is looking at.',
  '8. **Show what’s happening out of view.** Make it clear when a response is still streaming or when new messages have arrived.',
  '9. **Make it easy to return to the latest reply.** A “Jump to latest” action should bring the reader back and resume following.',
  '10. **Let people jump anywhere in the conversation.** Long threads need message links, search, unread markers, and direct navigation.',
  '11. **Reopen where the reader left off.** A saved conversation should open at the last meaningful turn. Often this is the last user message. Not the absolute bottom.',
  '12. **Keep the reader’s place when layout changes.** Images load. Markdown expands. Code blocks render. Older messages appear above. None of that should make the reader lose their place.',
  '13. **Handle interruptions without stealing position.** Stopping, retrying, regenerating, branching, or errors should not unexpectedly move the conversation.',
  '14. **Stay responsive in long threads.** Streaming text, markdown, code, images, and long history should still feel responsive.',
  '15. **Be accessible without the noise.** Keep the transcript navigable, preserve keyboard focus, and announce important events at a comfortable pace.',
].join('\n');

/**
 * Laid out like the shadcn/ui page: the case for a streaming-aware scroller first, then the API, then the core
 * concepts, each with its own demo. Each concept's section id is its example name, which is where the e2e tests
 * look for it.
 */
export const MESSAGE_SCROLLER = {
  componentName: 'message-scroller',
  componentType: 'message-scroller',
  description:
    'A chat scroll container that anchors turns, opens saved transcripts, follows streamed responses, loads history without jumping, and jumps to any message.',
  api: MESSAGE_SCROLLER_API,
  installData: {
    cliAdd: MESSAGE_SCROLLER_CLI_ADD,
    manualCode: MESSAGE_SCROLLER_MANUAL_CODE,
  },
  usage: {
    importBlock: MESSAGE_SCROLLER_USAGE_IMPORT,
    codeBlock: MESSAGE_SCROLLER_USAGE_CODE,
    description: MESSAGE_SCROLLER_USAGE_DESCRIPTION,
    additionalBlocks: MESSAGE_SCROLLER_USAGE_ADDITIONAL,
  },
  composition: MESSAGE_SCROLLER_SNIPPET_COMPOSITION,
  compositionNote: [
    '- **`z-message-scroller`** — the frame, the scrollable viewport and the transcript in one. It owns the scroll state and the behavior inputs for opening position, auto-scroll, anchoring and the previous-turn peek. The viewport is a labelled, focusable region; the transcript is a `role="log"` live region.',
    '- **`z-message-scroller-item`** — the transcript row boundary. Wrap every row so the scroller can measure, anchor, preserve position, track visibility, and jump to it. A row can be a message, marker, typing indicator, separator, join/leave event, or "load earlier" row.',
    '- **`[z-message-scroller-button]`** — the scroll control. Scrolls to the start or end of the transcript and is inert until there is content in its direction.',
    '- **`ZardMessageScrollerService`** — the commands and signals of one scroller (`scrollToMessage`, `scrollToEnd`, `scrollable`, `currentAnchorId`...), for controls outside the transcript.',
  ].join('\n'),
  preview: {
    name: 'preview',
    component: ZardDemoMessageScrollerPreviewComponent,
    codeData: MESSAGE_SCROLLER_DEMO_PREVIEW,
  },
  examples: [],
  sections: [
    {
      id: 'great-streaming-chat',
      title: 'What Makes a Great Streaming Chat Experience',
      position: 'intro' as const,
      description: [
        'Building a chat interface used to be simple. You create an inverted list with an input. Type a message, it appends at the bottom. When a reply comes in, the list grows and scrolls. Done.',
        '',
        'Streaming breaks that model. Messages arrive in chunks while you may still be reading, scrolling, or looking somewhere else entirely.',
        '',
        'Now the challenge is preserving the reader’s place while the conversation keeps changing. Get that wrong and the experience feels jumpy: people are pulled to the bottom, lose context, and have to find their way back.',
        '',
        'In practice, this comes down to scroll: when to follow, when to hold, and when to let the reader decide. A great streaming chat should:',
        PRINCIPLES,
        '',
        '**Never move the reader against their intent.**',
      ].join('\n'),
    },
    {
      id: 'message-scroller',
      title: 'Message Scroller',
      position: 'intro' as const,
      description: [
        '`z-message-scroller` is a chat transcript scroller built for these behaviors. It owns the scroll state and the transcript-row behavior: opening position, streamed output, new-turn anchoring, prepended history, visibility, and scroll controls.',
        '',
        'It is scoped to the scroll viewport. It does not own messages, AI state, transport, persistence, branching, or model state. Your product code stays focused on composing messages, markers, tools, attachments, and prompt inputs.',
        '',
        'It gives you the scroll behavior that chat needs, without taking over the rest of the chat UI. And it stays fast, even in long conversations with rich markdown.',
      ].join('\n'),
    },
    {
      id: 'core-concepts',
      title: 'Core Concepts',
    },
    {
      id: 'anchoring',
      title: 'Anchoring Turns',
      level: 3 as const,
      description: [
        'A turn is the part of the conversation that starts a new exchange. In a simple AI chat, that is usually the user’s message and the assistant reply that follows.',
        '',
        'An anchor is the row the viewport should treat as the start of that turn. Mark that row with `zAnchor`. When a new anchor is appended, the viewport moves it near the top and keeps a peek of the previous item above it, so the new turn does not feel detached from its context.',
        '',
        'Scroll anchors are not tied to message role. You can turn any row into an anchor: a user message, a system marker, a handoff event, or anything else that starts a meaningful turn. `z-message-scroller` only needs to know which row should anchor the viewport.',
        '',
        'In the following example, the user’s message is anchored. When you send a new message, the viewport anchors it near the top and appends the assistant reply below it. Toggle the anchor to the assistant’s message to see the difference.',
      ].join('\n'),
      examples: [
        {
          name: 'anchoring',
          component: ZardDemoMessageScrollerAnchoringComponent,
          codeData: MESSAGE_SCROLLER_DEMO_ANCHORING,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_ANCHORING },
        },
      ],
    },
    {
      id: 'group-chat',
      title: 'Group Chat',
      level: 3 as const,
      description: [
        'In a group chat, the turn boundary is more specific than “the user message”. It is often the message that asks the model to respond, or a marker like “Marcus joined the chat”. Typing indicators and history controls usually should not anchor.',
        '',
        'Because anchoring is role-independent, you can anchor a marker just as easily as a message.',
      ].join('\n'),
      examples: [
        {
          name: 'group-chat',
          component: ZardDemoMessageScrollerGroupChatComponent,
          codeData: MESSAGE_SCROLLER_DEMO_GROUP_CHAT,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_GROUP_CHAT },
        },
      ],
    },
    {
      id: 'previous-context',
      title: 'Keeping Context Visible',
      level: 3 as const,
      description: [
        'When a new turn starts, it should still feel like part of the same continuous thread. `zPreviousItemPeek` keeps a slice of the previous item visible above the anchor, so the reader keeps their context instead of feeling like the conversation restarted on a blank page.',
        '',
        'Adjust the peek amount in the example below to see how it affects the conversation.',
      ].join('\n'),
      examples: [
        {
          name: 'previous-context',
          component: ZardDemoMessageScrollerPreviousContextComponent,
          codeData: MESSAGE_SCROLLER_DEMO_PREVIOUS_CONTEXT,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_PREVIOUS_CONTEXT },
        },
      ],
    },
    {
      id: 'streaming',
      title: 'Following the Live Edge',
      level: 3 as const,
      description: [
        'When the reader is at the live edge, either because they stayed there or returned there, `zAutoScroll` keeps streamed replies in view as they grow. Scrolling away from the live edge releases the view, whether by wheel, touch, keyboard scroll keys, or dragging the scrollbar. An explicit message jump releases it too. New chunks can then arrive without moving the reader.',
        '',
        '`zAutoScroll` composes with turn anchoring. When a new turn anchors near the top, the view stays put while the reply streams into the room below it. Once the reply fills the viewport, the reader is back at the live edge and follow-output takes over from the anchor.',
      ].join('\n'),
      examples: [
        {
          name: 'streaming',
          component: ZardDemoMessageScrollerStreamingComponent,
          codeData: MESSAGE_SCROLLER_DEMO_STREAMING,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_STREAMING },
        },
      ],
      note: 'Calling `scrollToEnd`, or pressing the `z-message-scroller-button`, re-engages follow-output when `zAutoScroll` is enabled, so a reader who scrolled away can return to the live edge and keep following. The scroller and its viewport expose `data-autoscrolling` while that programmatic scroll to the latest message runs, so you can conditionally apply styles during the transition.',
    },
    {
      id: 'opening-position',
      title: 'Opening Saved Threads',
      level: 3 as const,
      description: [
        'It can seem reasonable to reopen a saved thread at the absolute end of the transcript, but that often drops the reader into the conversation without enough context. A better default is `"last-anchor"`: show the last meaningful turn, like the user’s latest message, with the reply below it.',
        '',
        'That gives the reader an immediate place in the thread. They can see what they asked, where the answer starts, and continue from there without reconstructing the conversation from the bottom edge.',
      ].join('\n'),
      examples: [
        {
          name: 'opening-position',
          component: ZardDemoMessageScrollerOpeningPositionComponent,
          codeData: MESSAGE_SCROLLER_DEMO_OPENING_POSITION,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_OPENING_POSITION },
          onlyDemo: true,
        },
      ],
      note: [
        '`"last-anchor"` is keyed on `zAnchor`, not message role. If no anchor exists, or the last anchored turn already fits in the viewport, it falls back to `"end"`.',
        '',
        'Use `"start"` when you want to resume at the beginning of a conversation, or `"end"` when the absolute latest message is the right place to land.',
      ].join('\n'),
    },
    {
      id: 'avoiding-a-flash',
      title: 'Avoiding a Flash on Reload',
      level: 3 as const,
      description: [
        'A scroll container always opens at the top. HTML has no way to set `scrollTop`, so a server-rendered transcript shows the oldest messages first. Once the app hydrates, `zDefaultPosition` moves the view, and you would see a jump.',
        '',
        'When `zDefaultPosition` is `"end"` or `"last-anchor"`, the viewport has `data-pending-scroll` until that position is applied. The viewport stays hidden while the attribute is present, so you see the frame instead of the jump. `"start"` does not need this.',
      ].join('\n'),
    },
    {
      id: 'load-history',
      title: 'Loading Earlier Messages',
      level: 3 as const,
      description: [
        'Loading earlier messages should not move the conversation the reader is already looking at. When older rows are prepended above the current transcript, the scroller preserves the visible row so the reader stays in the same place while history loads above them.',
        '',
        'This is enabled by default through `zPreserveScrollOnPrepend`.',
      ].join('\n'),
      examples: [
        {
          name: 'load-history',
          component: ZardDemoMessageScrollerLoadHistoryComponent,
          codeData: MESSAGE_SCROLLER_DEMO_LOAD_HISTORY,
        },
      ],
      note: 'Use stable `zMessageId` values for message rows. That gives the scroller a specific row to preserve instead of guessing from whichever pixel happens to sit at the viewport edge.',
    },
    {
      id: 'animation',
      title: 'Animating New Messages',
      level: 3 as const,
      description: [
        '`z-message-scroller-item` can be animated directly. Keep `zMessageId` and `zAnchor` on it, and use transform and opacity for the entrance.',
        '',
        'A common chat pattern is to animate the user’s message when it is sent, then let the assistant reply stream into a regular row below it. Start the user row below its final position so it feels like it rises from the live edge of the viewport.',
      ].join('\n'),
      examples: [
        {
          name: 'animation',
          component: ZardDemoMessageScrollerAnimationComponent,
          codeData: MESSAGE_SCROLLER_DEMO_ANIMATION,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_ANIMATION },
        },
      ],
      note: 'Avoid animating height, margin, or padding for row entrances; those changes can fight the scroller’s positioning work. If the reader prefers reduced motion, skip the entrance animation and keep the scroll behavior the same.',
    },
    {
      id: 'commands',
      title: 'Jumping to Messages',
      level: 3 as const,
      description:
        'Search results, permalinks, outline items, and toolbar buttons often need to drive the transcript from outside the message list. Use the scroller’s `ZardMessageScrollerService` for those controls: it is provided by the scroller, so read it from the component, or from a template reference, anywhere in the same view, including controls rendered outside the transcript.',
      examples: [
        {
          name: 'commands',
          component: ZardDemoMessageScrollerCommandsComponent,
          codeData: MESSAGE_SCROLLER_DEMO_COMMANDS,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_COMMANDS },
          onlyDemo: true,
        },
      ],
      note: [
        '`scrollToMessage` targets the `zMessageId` on `z-message-scroller-item`, so rows that need to be addressable should have stable ids. It returns `false` when the scroller is not mounted or the target row is not in the DOM.',
        '',
        'A `true` result means the scroll ran, not that the row is already in view: a smooth scroll is still on its way.',
      ].join('\n'),
    },
    {
      id: 'visibility',
      title: 'Tracking the Reader’s Position',
      level: 3 as const,
      description:
        'Use the `currentAnchorId` and `visibleMessageIds` signals to track the reader’s position in the conversation. A common example is a table of contents or a jump menu that highlights the current anchored turn.',
      examples: [
        {
          name: 'visibility',
          component: ZardDemoMessageScrollerVisibilityComponent,
          codeData: MESSAGE_SCROLLER_DEMO_VISIBILITY,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_VISIBILITY },
          onlyDemo: true,
        },
      ],
      note: [
        '`currentAnchorId` answers “where am I” by reporting the current anchored turn, and it stays set after that anchor scrolls above the viewport. `visibleMessageIds` answers “what is on screen”, in document order.',
        '',
        'Rows need a `zMessageId` to take part.',
      ].join('\n'),
    },
    {
      id: 'scrollable',
      title: 'Reading Scroll State',
      level: 3 as const,
      description:
        'Use the `scrollable` signal when you need scroll state in code, such as a status indicator or a custom “jump to latest” control. It reports which edges the viewport can still scroll toward; “at the start/end” is the negation (`!start` / `!end`), and “scrollable at all” is `start || end`. For styling the scroller itself, prefer the `data-scrollable` attribute.',
      examples: [
        {
          name: 'scrollable',
          component: ZardDemoMessageScrollerScrollableComponent,
          codeData: MESSAGE_SCROLLER_DEMO_SCROLLABLE,
          codeBefore: { codeData: MESSAGE_SCROLLER_SNIPPET_SCROLLABLE },
        },
      ],
    },
    {
      id: 'performance',
      title: 'Performance',
      description: [
        '`z-message-scroller` is built to stay fast with large transcripts made of markdown and composed message rows.',
        '',
        'The scroll hot path stays outside change detection: scroll position, anchoring, and follow-output are tracked imperatively by the service and mirrored onto the scroller through `data-*` attributes, so scrolling and streaming do not re-render transcript rows. Only the few signals you read (`scrollable`, `visibleMessageIds`, `currentAnchorId`) change, and only when their value does.',
        '',
        'Visibility tracking only reports rows that have a `zMessageId`, and a jump menu or active turn indicator costs nothing until something reads those signals.',
        '',
        'This is comfortable for the expected range of a chat transcript: hundreds to low thousands of turns, including messages with markdown and composed components.',
      ].join('\n'),
    },
    {
      id: 'virtualization',
      title: 'Virtualization',
      description: [
        'Virtualization is intentionally left outside the component. `z-message-scroller` renders real DOM rows, which is what anchoring, prepend preservation and jumping measure, and it stays fast well into the thousands of turns (see [Performance](/docs/components/message-scroller#performance)), so most transcripts never need it.',
        '',
        'When a transcript does, put the rows in a `cdk-virtual-scroll-viewport` with a fixed `itemSize` and let it own the scrolling, with `scrollToIndex` standing in for `scrollToMessage`. You give up the live-edge and anchoring behavior, so reach for it only once you have measured the need.',
      ].join('\n'),
      examples: [{ name: 'virtualization', codeData: MESSAGE_SCROLLER_SNIPPET_VIRTUALIZATION }],
    },
    {
      id: 'rtl',
      title: 'RTL',
      examples: [
        {
          name: 'rtl',
          description:
            'To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl). The scroll button stays centered and the rows mirror.',
          type: 'rtl' as const,
          component: ZardDemoMessageScrollerRtlComponent,
          codeData: MESSAGE_SCROLLER_DEMO_RTL,
        },
      ],
    },
  ],
  accessibility: [
    '`z-message-scroller` keeps the scroll container keyboard reachable and the transcript announceable without forcing a specific message UI.',
    'Its viewport is a labelled, keyboard-focusable scroll region by default. It uses `role="region"`, `aria-label="Messages"` (set `aria-label` on the scroller to rename it), and `tabindex="0"`, so keyboard users can focus the transcript and scroll it directly.',
    'The transcript is a live region with `role="log"` and `aria-relevant="additions"`. New rows can be announced, but streamed text mutations do not have to be announced token by token.',
    'Set `zBusy` while a turn streams if announcements should wait for the completed message row; it sets `aria-busy` on the transcript.',
    '`[z-message-scroller-button]` is a real button. When there is nothing to scroll toward, it sets `inert`, uses `tabindex="-1"`, and exposes `data-active="false"` so inactive scroll controls do not create extra focus stops.',
  ],
};
