import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideCircleStop } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardMarkerImports } from '@zard/components/marker/marker.imports';
import { ZardMessageImports } from '@zard/components/message/message.imports';
import { ZardMessageScrollerImports } from '@zard/components/message-scroller/message-scroller.imports';
import { ZardSpinnerComponent } from '@zard/components/spinner';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';
import { injectScriptedChat, type ChatScriptStep } from '@zard/demo-utils/scripted-chat';

import { ExampleImports } from './example.component';

const SCRIPT: ChatScriptStep[] = [
  { role: 'user', text: 'Hello there!' },
  { role: 'assistant', delay: 2000, text: "Hey, how's it going?" },
  {
    role: 'user',
    text: `I'm prototyping an AI chat surface for our product docs.

Can you sketch a sensible component breakdown and call out anything I'd regret baking into v1?`,
  },
  {
    role: 'assistant',
    delay: 2000,
    text: `## Recommended layout

Treat the chat as three layers so scrolling and the composer never fight each other:

| Layer | Responsibility |
| --- | --- |
| **Shell** | Card or page frame, title, status indicator |
| **Transcript** | \`overflow-y-auto\` message list |
| **Composer** | Input group, send, stop |

### Message rendering

- **User messages**: right-aligned, muted background, \`max-w-[80%]\`.
- **Assistant messages**: full width within the column; use \`whitespace-pre-wrap\` for text.

### Suggested component split

\`\`\`tsx
<ChatCard>
  <ChatHeader status={status} />
  <ChatTranscript messages={messages} />
  <ChatComposer onSubmit={sendMessage} onStop={stop} />
</ChatCard>
\`\`\`

### v1 pitfalls to avoid

1. **Inlining transport logic in the UI** — keep scripted/demo transport beside your example, not inside shared components.
2. **Fixed transcript height without \`overflow-hidden\`** — parent must clip, child must scroll, or the composer jumps.
3. **Not giving the scroller a ref or auto-scroll flag** — long replies should stay pinned to the bottom unless the user scrolls up.

### Practical next step

Start with plain \`whitespace-pre-wrap\` text to validate spacing and scroll behavior. Once the transcript feels right, you can swap assistant text rendering to a richer renderer if you need it.

Want me to walk through auto-scroll vs. manual scroll-to-bottom next?`,
  },
  { role: 'user', text: 'What about message spacing when one reply is short and the next is really long?' },
  {
    role: 'assistant',
    delay: 2000,
    text: `Good question. The scroll container should own vertical rhythm, not individual bubbles.

Use a consistent \`gap\` on the message list (something like \`gap-4\` or \`gap-6\`) so short and long messages sit on the same grid. For assistant replies that span many paragraphs, keep everything in one bubble rather than splitting on every line break — otherwise the transcript feels choppy when you're skimming.

When a long reply streams in, pin the viewport to the bottom with \`zAutoScroll\` until the user scrolls up. If they've scrolled away, show a scroll-to-bottom affordance instead of yanking them back mid-read.

That's usually enough for v1. Fancy diff animations or per-paragraph fade-ins can wait until you've validated that the base scroll + composer layout holds up on real devices.`,
  },
  { role: 'user', text: 'Thanks, that helps.' },
  {
    role: 'assistant',
    delay: 1000,
    text: "Happy to help — send another message when you're ready to keep stepping through the demo.",
  },
];

/** shadcn/ui's `message-scroller-example`, in zard: a scripted chat that streams each reply into the scroller. */
@Component({
  selector: 'z-message-scroller-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardBubbleImports,
    ZardCardImports,
    ZardInputGroupImports,
    ZardMarkerImports,
    ZardMessageImports,
    ZardMessageScrollerImports,
    ZardSpinnerComponent,
    ZardTextareaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucideCircleStop })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Chat" zContainerClass="self-start">
        <z-card class="h-140 w-full">
          <z-card-header>
            <z-card-title zTitle="How can I help you today?" />
            <z-card-description [zDescription]="'Status: ' + chat.status()" />
          </z-card-header>
          <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
            <z-message-scroller zAutoScroll [zBusy]="chat.busy()" zContentClass="p-(--card-spacing)">
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                  <z-message [zAlign]="message.role === 'user' ? 'end' : 'start'">
                    <z-message-content>
                      <z-bubble [zVariant]="message.role === 'user' ? 'default' : 'muted'">
                        <z-bubble-content class="whitespace-pre-wrap">{{ message.text }}</z-bubble-content>
                      </z-bubble>
                    </z-message-content>
                  </z-message>
                </z-message-scroller-item>
              }
              @if (chat.status() === 'submitted') {
                <z-message-scroller-item>
                  <z-marker role="status">
                    <z-marker-icon><z-spinner /></z-marker-icon>
                    <z-marker-content>Thinking...</z-marker-content>
                  </z-marker>
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          </z-card-content>
          <z-card-footer>
            <form class="w-full" (submit)="$event.preventDefault(); chat.send()">
              <z-input-group>
                <textarea
                  z-textarea
                  readonly
                  placeholder="Ask me anything..."
                  aria-label="Next message"
                  class="h-10 min-h-10 overflow-y-auto"
                  [value]="chat.busy() ? '' : (chat.next()?.text ?? '')"
                ></textarea>
                <z-input-group-addon zAlign="block-end" class="p-2">
                  @if (chat.busy()) {
                    <button type="button" z-input-group-button zSize="icon-sm" class="ms-auto" (click)="chat.reset()">
                      <ng-icon name="lucideCircleStop" />
                      <span class="sr-only">Stop</span>
                    </button>
                  } @else {
                    <button
                      type="submit"
                      z-input-group-button
                      zVariant="default"
                      zSize="icon-sm"
                      class="ms-auto"
                      [disabled]="!chat.next()"
                    >
                      <ng-icon name="lucideArrowUp" />
                      <span class="sr-only">Send</span>
                    </button>
                  }
                </z-input-group-addon>
              </z-input-group>
            </form>
          </z-card-footer>
        </z-card>
      </z-example>
    </z-example-wrapper>
  `,
})
export class MessageScrollerExampleComponent {
  protected readonly chat = injectScriptedChat(SCRIPT, { delayMs: 10 });
}
