import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-shorthand',
  imports: [...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zVariant="muted">
        How can I help you today?
      </z-message>

      <z-message zAlign="end" zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFooter="Delivered">
        Send me the release notes.
      </z-message>

      <z-message zFallback="OL" zVariant="muted" zHeader="Olivia" zFooter="Read Yesterday">
        The notes are in the shared doc.
      </z-message>

      <z-message zAlign="end" zSrc="https://github.com/srizzon.png" zAlt="@srizzon">
        <z-message-content>
          <z-bubble zVariant="outline">
            <z-bubble-content>Project the content when the turn needs more than a bubble.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageShorthandComponent {}
