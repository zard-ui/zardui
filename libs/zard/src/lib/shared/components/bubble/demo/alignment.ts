import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-alignment',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>This bubble is aligned to the start. This is the default alignment.</z-bubble-content>
      </z-bubble>
      <z-bubble zAlign="end">
        <z-bubble-content>This bubble is aligned to the end. Use this for user messages.</z-bubble-content>
      </z-bubble>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoBubbleAlignmentComponent {}
