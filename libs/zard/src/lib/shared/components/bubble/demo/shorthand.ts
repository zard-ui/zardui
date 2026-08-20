import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';

@Component({
  selector: 'z-demo-bubble-shorthand',
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">Short turns do not need the content wrapper.</z-bubble>
      <z-bubble zAlign="end">Hey there! what's up?</z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content class="font-medium">
          Project the content when you need to style it, or render it as a button or link.
        </z-bubble-content>
      </z-bubble>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoBubbleShorthandComponent {}
