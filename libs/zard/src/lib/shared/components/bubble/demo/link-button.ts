import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';

@Component({
  selector: 'z-demo-bubble-link-button',
  host: { class: 'contents' },
  imports: [...ZardBubbleImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-bubble zVariant="muted">
        <z-bubble-content>How can I help you today?</z-bubble-content>
      </z-bubble>
      <z-bubble-group>
        <z-bubble zVariant="tinted" zAlign="end">
          <button type="button" z-bubble-content (click)="notify('You clicked forgot password')">
            I forgot my password
          </button>
        </z-bubble>
        <z-bubble zVariant="tinted" zAlign="end">
          <button type="button" z-bubble-content (click)="notify('You clicked help with subscription')">
            I need help with my subscription
          </button>
        </z-bubble>
        <z-bubble zVariant="tinted" zAlign="end">
          <button type="button" z-bubble-content (click)="notify('You clicked something else. Talk to a human.')">
            Something else. Talk to a human.
          </button>
        </z-bubble>
      </z-bubble-group>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoBubbleLinkButtonComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected notify(message: string) {
    this.sonner.show(message);
  }
}
