import { Component } from '@angular/core';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-header-footer',
  imports: [...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-message>
        <z-message-content>
          <z-message-header>Olivia</z-message-header>
          <z-bubble zVariant="muted">
            <z-bubble-content>I already checked the logs.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Send the report to the team. Ping &#64;srizzon if you need help.</z-bubble-content>
          </z-bubble>
          <z-message-footer>
            <div>
              Read
              <span class="font-normal">Yesterday</span>
            </div>
          </z-message-footer>
        </z-message-content>
      </z-message>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageHeaderFooterComponent {}
