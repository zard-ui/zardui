import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MESSAGE_SCROLLER_API: ApiSection[] = [
  {
    selector: 'z-message-scroller',
    description:
      'Scroll container for a chat transcript. It fills its parent, so give it a height. Its viewport is a labelled `region` named "Messages"; set `aria-label` on the element to rename it.',
    props: [
      {
        name: '[zAutoScroll]',
        description: 'Follow new content while the reader is at the live edge. Any manual scroll releases it',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zDefaultPosition]',
        description:
          'Opening position on the first non-empty render, applied once. `last-anchor` opens at the last `zAnchor` row, and falls back to `end` when that turn fits',
        type: "'start' | 'end' | 'last-anchor'",
        default: "'end'",
      },
      {
        name: '[zPreserveScrollOnPrepend]',
        description: 'Keep the visible row stable when older messages are prepended',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zEdgeThreshold]',
        description: 'Distance in px that still counts as being at an edge',
        type: 'number',
        default: '8',
      },
      {
        name: '[zScrollMargin]',
        description: 'Margin applied to the aligned edge when scrolling to a message',
        type: 'number',
        default: '0',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-message-scroller-item',
    description:
      'One transcript row: a message, marker, typing row or "load earlier" row. Wrap every direct child of the transcript in one.',
    props: [
      {
        name: '[zMessageId]',
        description: 'Stable row id used by `scrollToMessage`, `visibleMessageIds` and prepend preservation',
        type: 'string',
        default: '-',
      },
      {
        name: '[zAnchor]',
        description: 'Marks the row as a turn boundary that anchors newly appended turns',
        type: 'boolean',
        default: 'false',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: '[z-message-scroller-button]',
    description:
      'Scrolls to an edge. It is inert and out of the tab order when there is nothing to scroll toward. Give it an `aria-label`.',
    props: [
      {
        name: '[zDirection]',
        description: 'Edge of the transcript the button scrolls toward',
        type: "'start' | 'end'",
        default: "'end'",
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'ZardMessageScrollerService',
    description:
      'Scroll state and commands of one scroller. Provided by `z-message-scroller`: inject it inside the scroller, or read it from outside with `viewChild(ZardMessageScrollerComponent, { read: ZardMessageScrollerService })`.',
    props: [
      {
        name: 'scrollToEnd(options?)',
        description: 'Scroll to the latest message and resume following. Returns `false` when it cannot be applied',
        type: '(options?: ZardScrollOptions) => boolean',
        default: '-',
      },
      {
        name: 'scrollToStart(options?)',
        description: 'Scroll to the top. Returns `false` when it cannot be applied',
        type: '(options?: ZardScrollOptions) => boolean',
        default: '-',
      },
      {
        name: 'scrollToMessage(messageId, options?)',
        description:
          'Scroll to a mounted message id and release the live edge. Returns `false` when the id is not mounted',
        type: '(messageId: string, options?: ZardScrollOptions) => boolean',
        default: '-',
      },
      {
        name: 'scrollable',
        description: 'Which edges can still be scrolled toward. `end` stays `false` while following the live edge',
        type: 'Signal<{ start: boolean; end: boolean }>',
        default: '-',
      },
      {
        name: 'visibleMessageIds',
        description: 'Ids of the rows intersecting the viewport, in document order',
        type: 'Signal<string[]>',
        default: '-',
      },
      {
        name: 'currentAnchorId',
        description: 'The anchored turn at or above the reading line',
        type: 'Signal<string | null>',
        default: '-',
      },
    ],
  },
  {
    selector: 'ZardScrollOptions',
    description: 'Options of the scroll commands.',
    props: [
      {
        name: 'align',
        description: 'How a message target aligns in the viewport',
        type: "'start' | 'center' | 'end' | 'nearest'",
        default: "'start'",
      },
      {
        name: 'behavior',
        description: 'Native scroll behavior. `smooth` falls back to `auto` under `prefers-reduced-motion`',
        type: 'ScrollBehavior',
        default: "'auto'",
      },
      {
        name: 'scrollMargin',
        description: 'Margin applied to the aligned edge for this command',
        type: 'number',
        default: 'zScrollMargin',
      },
    ],
  },
];
