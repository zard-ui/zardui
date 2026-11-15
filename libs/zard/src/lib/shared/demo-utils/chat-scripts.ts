import type { ChatScriptStep } from './scripted-chat';

/** A developer asking how `z-message-scroller` handles a streaming chat. Shared by several message scroller demos. */
export const SCROLL_BEHAVIOR_SCRIPT: ChatScriptStep[] = [
  {
    role: 'user',
    text: "I'm building a chat for our Angular app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.",
  },
  {
    role: 'assistant',
    delay: 1000,
    text: "That's the classic streaming scroll problem. Wrap your message list in `z-message-scroller` and turn on `zAutoScroll` — the viewport pins to the bottom as tokens arrive, so users always see the latest text land in place.\n\nThe important part: it only auto-scrolls while the reader is already at the bottom. The moment they scroll up to read something earlier, auto-scroll backs off and their position is preserved. You get smooth streaming without fighting the user's intent.",
  },
  {
    role: 'user',
    text: 'Okay, but when someone sends a new message the view still feels jarring — like the whole conversation reloads from the top.',
  },
  {
    role: 'assistant',
    delay: 1000,
    text: "`z-message-scroller-item` fixes that with turn anchoring. Set `zAnchor` on the turn that should settle near the top instead of blindly snapping to the document bottom.\n\nIt also leaves a small peek of the previous exchange visible above the anchor, so context isn't lost. The reply starts in view without that disorienting jump you get from a plain overflow container.",
  },
  {
    role: 'user',
    text: "And if they've scrolled up to re-read an older answer? I don't want to yank them back down.",
  },
  {
    role: 'assistant',
    delay: 1000,
    text: "You won't. Auto-scroll only runs when the viewport is already pinned to the bottom, so scrolling up is a deliberate opt-out — their place in the thread stays put even as new tokens keep arriving below.\n\nWhen there is content they haven't seen yet, the `z-message-scroller-button` appears at the bottom of the viewport. One tap jumps them back to the newest message and re-engages auto-scroll. Same pattern as Slack or iMessage: quiet when you're caught up, helpful when you're not.",
  },
  { role: 'user', text: 'Last one — does this work with assistive tech?' },
  {
    role: 'assistant',
    delay: 1000,
    text: 'The transcript has `role="log"` and `aria-relevant="additions"` by default, so screen readers announce new messages as they stream in.\n\nThe scroll button is a real `<button>` with an sr-only label, and it\'s removed from the tab order when you\'re already at the bottom — no ghost focus stops.',
  },
];
