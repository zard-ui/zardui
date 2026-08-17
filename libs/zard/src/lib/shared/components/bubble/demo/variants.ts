import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-variants',
  host: { class: 'contents' },
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
      <z-bubble>
        <z-bubble-content>This is the default primary bubble.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="secondary" zAlign="end">
        <z-bubble-content>This is the secondary variant.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>This one is muted. It uses a lower emphasis color for the chat bubble.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reaction: thumbs up">
          <span>👍</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="tinted" zAlign="end">
        <z-bubble-content>
          This one is tinted. The tint is a softer color derived from the primary color.
        </z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="outline">
        <z-bubble-content>We can also use an outlined variant.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="destructive" zAlign="end">
        <z-bubble-content>Or a destructive variant with a reaction.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reaction: fire">
          <span>🔥</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="ghost">
        <z-bubble-content class="flex flex-col gap-4">
          <!-- prettier-ignore -->
          <p>Ghost bubbles work for assistant text, <strong class="font-semibold">markdown</strong>, and other content that should not be framed.</p>
          <!-- prettier-ignore -->
          <p>This is perfect for assistant messages that should not have a frame and can take the full width of the container. You can also render <code class="bg-muted rounded px-1 py-0.5 font-mono text-[0.8rem]">code</code> in it.</p>
          <p>Ghost bubbles are full width and can take the full width of the container.</p>
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
})
export class ZardDemoBubbleVariantsComponent {}
