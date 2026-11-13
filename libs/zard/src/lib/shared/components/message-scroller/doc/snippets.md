# Message Scroller snippets

Code fragments shown on the message scroller docs page: the composition tree and the `codeBefore` blocks.
Each fenced block is exported as `MESSAGE_SCROLLER_SNIPPET_<ID>` via the snippet generator.

```angular-html id="fill-parent" copyButton
<div class="flex h-screen flex-col">
  <z-message-scroller class="flex-1"><!-- transcript --></z-message-scroller>
</div>
```

```angular-html id="composition" copyButton
<z-message-scroller>
  <z-message-scroller-item>
    <!-- a message, marker, or row -->
  </z-message-scroller-item>
  <z-message-scroller-item />
  <z-message-scroller-item />
  <button type="button" z-message-scroller-button></button>
</z-message-scroller>
```

```angular-html id="anchoring" copyButton
<!-- This tells the scroller to anchor the user's message for the next turn. -->
<z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'" />
```

```angular-html id="group-chat" copyButton
<z-message-scroller-item zMessageId="marcus-joined" zAnchor>
  <z-marker zVariant="separator">
    <z-marker-content>Marcus joined the chat</z-marker-content>
  </z-marker>
</z-message-scroller-item>
```

```angular-html id="previous-context" copyButton
<!-- Keep 64px of the previous turn visible above the newly anchored row. -->
<z-message-scroller [zPreviousItemPeek]="64"><!-- anchored turns --></z-message-scroller>
```

```angular-html id="streaming" copyButton
<z-message-scroller zAutoScroll><!-- streamed turns --></z-message-scroller>
```

```angular-html id="opening-position" copyButton
<z-message-scroller zDefaultPosition="last-anchor"><!-- transcript --></z-message-scroller>
```

```angular-html id="animation" copyButton
<!-- Transform and opacity only: the row keeps a stable height while it animates in. -->
<z-message-scroller-item
  [zMessageId]="message.id"
  zAnchor
  class="animate-in fade-in-0 slide-in-from-bottom-2.5 duration-300 motion-reduce:animate-none"
/>
```

```angular-ts id="commands" copyButton
// The service is provided by the scroller: read it from the component, or from a template
// reference (`#scroller="zMessageScroller"` then `scroller.service`).
private readonly scroller = viewChild.required(ZardMessageScrollerComponent, { read: ZardMessageScrollerService });

this.scroller().scrollToMessage(id, { align: 'start', behavior: 'smooth' });
this.scroller().scrollToEnd();
this.scroller().scrollToStart();
```

```angular-ts id="visibility" copyButton
// Signals: the anchored turn being read, and the rows on screen in document order.
const current = this.scroller().currentAnchorId();
const visible = this.scroller().visibleMessageIds();
```

```angular-ts id="scrollable" copyButton
// Which edges the viewport can still scroll toward.
const { start, end } = this.scroller().scrollable();
```

```angular-ts id="virtualization" copyButton
import { ScrollingModule, type CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { afterNextRender, Component, viewChild } from '@angular/core';

@Component({
  selector: 'app-virtual-transcript',
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport
      #viewport
      itemSize="56"
      role="region"
      aria-label="Messages"
      class="h-96 rounded-lg border"
    >
      <div *cdkVirtualFor="let message of messages" class="flex h-14 items-center px-4">{{ message.text }}</div>
    </cdk-virtual-scroll-viewport>
  `,
})
export class VirtualTranscript {
  private readonly viewport = viewChild.required<CdkVirtualScrollViewport>('viewport');
  protected readonly messages = Array.from({ length: 5000 }, (_, i) => ({ id: i, text: `Message ${i + 1}` }));

  constructor() {
    // Open at the latest message once the viewport has measured itself.
    afterNextRender(() => requestAnimationFrame(() => this.viewport().scrollToIndex(this.messages.length - 1)));
  }
}
```
