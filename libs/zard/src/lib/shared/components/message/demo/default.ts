import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardAvatarComponent } from '@/shared/components/avatar';
import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-default',
  imports: [ZardAvatarComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-6 py-12">
      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Deploying to prod real quick.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>It's 4:55 PM. On a Friday.</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/srizzon.png" zAlt="@srizzon" zFallback="SR" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble>
            <z-bubble-content>It's a one-line change.</z-bubble-content>
          </z-bubble>
          <z-message-footer>Delivered</z-message-footer>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-avatar>
          <z-avatar zSrc="https://github.com/Luizgomess.png" zAlt="@luizgomess" zFallback="LG" />
        </z-message-avatar>
        <z-message-content>
          <z-bubble-group>
            <z-bubble zVariant="muted">
              <z-bubble-content>It's always a one-line change 😭.</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="muted">
              <z-bubble-content>Alright, let me take a look.</z-bubble-content>
              <z-bubble-reactions role="img" aria-label="Reactions: thumbs up">
                <span>👍</span>
              </z-bubble-reactions>
            </z-bubble>
          </z-bubble-group>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageDefaultComponent {}
