import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-bubble-reactions',
  host: { class: 'contents' },
  imports: [ZardButtonComponent, ...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-12 py-12">
      <z-bubble zVariant="muted" zAlign="end">
        <z-bubble-content>I don't need tests, I know my code works.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: thumbs up, surprised" zAlign="start">
          <span>👍</span>
          <span>😮</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="muted">
        <z-bubble-content>Bold. Fine I'll add some tests. I'll let you know when they're done.</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: eyes, rocket, and 2 more">
          <span>👀</span>
          <span>🚀</span>
          <span>+2</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="default" zAlign="end">
        <z-bubble-content>Tests passed on the first try. All 142 of them. Looking good!</z-bubble-content>
        <z-bubble-reactions role="img" aria-label="Reactions: party popper, clapping hands" zSide="top" zAlign="start">
          <span>🎉</span>
          <span>👏</span>
        </z-bubble-reactions>
      </z-bubble>
      <z-bubble zVariant="destructive">
        <z-bubble-content>Are you sure I can run this command?</z-bubble-content>
        <z-bubble-reactions>
          <button type="button" z-button zType="ghost" zSize="xs" (click)="runCommand()">Yes, run it</button>
        </z-bubble-reactions>
      </z-bubble>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBubbleReactionsComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected runCommand() {
    this.sonner.success('You clicked yes, running command...');
  }
}
