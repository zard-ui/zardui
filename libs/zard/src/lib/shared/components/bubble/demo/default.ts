import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-default',
  host: { class: 'contents' },
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zAlign="end">
        <z-bubble-content>Hey there! what's up?</z-bubble-content>
      </z-bubble>
      <z-bubble-group>
        <z-bubble zVariant="muted">
          <z-bubble-content>Hey! Want to see chat bubbles?</z-bubble-content>
        </z-bubble>
        <z-bubble zVariant="muted">
          <z-bubble-content>
            I can group messages, switch sides, and keep the whole thread easy to scan.
          </z-bubble-content>
          <z-bubble-reactions role="img" aria-label="Reaction: thumbs up">
            <span>👍</span>
          </z-bubble-reactions>
        </z-bubble>
      </z-bubble-group>
      <z-bubble zAlign="end">
        <z-bubble-content>Sure. Hit me with your best demo.</z-bubble-content>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>
          Yes. You are reading a demo that is demoing itself. Very meta. Very on-brand.
        </z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: thumbs up, fire, eyes, and 2 more">
          <span>👍</span>
          <span>🔥</span>
          <span>👀</span>
          <span>+2</span>
        </z-bubble-reactions>
      </z-bubble>
    </div>
  `,
})
export class ZardDemoBubbleDefaultComponent {}
