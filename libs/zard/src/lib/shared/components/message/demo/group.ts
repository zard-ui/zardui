import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-group',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message-group>
        <z-message>
          <z-message-avatar />
          <z-message-content>
            <z-bubble zVariant="muted">
              <z-bubble-content>I checked the registry addresses.</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
        <z-message>
          <z-message-avatar>
            <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
          </z-message-avatar>
          <z-message-content>
            <z-bubble zVariant="muted">
              <z-bubble-content>The component and example JSON now live under the UI registry.</z-bubble-content>
            </z-bubble>
          </z-message-content>
        </z-message>
      </z-message-group>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageGroupComponent {}
