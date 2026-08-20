import { Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-avatar',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>The build failed during dependency installation.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Can you share the exact error?</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble-group>
            <z-bubble zVariant="muted">
              <z-bubble-content>Here's the error from the logs</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="muted">
              <z-bubble-content>
                Something went wrong with the build. The libraries are not installed correctly. Try running the build
                again.
              </z-bubble-content>
            </z-bubble>
          </z-bubble-group>
        </z-message-content>
      </z-message>
    </div>
  `,
  host: { class: 'contents' },
})
export class ZardDemoMessageAvatarComponent {}
