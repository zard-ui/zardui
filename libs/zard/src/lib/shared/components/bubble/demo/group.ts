import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-group',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>Can you tell me what's the issue?</z-bubble-content>
      </z-bubble>
      <z-bubble-group>
        <z-bubble zAlign="end">
          <z-bubble-content>You tell me!</z-bubble-content>
        </z-bubble>
        <z-bubble zAlign="end">
          <z-bubble-content>It worked yesterday. You broke it!</z-bubble-content>
        </z-bubble>
        <z-bubble zAlign="end">
          <z-bubble-content>Find the bug and fix it.</z-bubble-content>
          <z-bubble-reactions role="img" aria-label="Reactions: eyes" zAlign="start">
            <span>👀</span>
          </z-bubble-reactions>
        </z-bubble>
      </z-bubble-group>
      <z-bubble zVariant="muted">
        <z-bubble-content>
          Want me to diff yesterday's you against today's you? It's a bit embarrassing.
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleGroupComponent {}
