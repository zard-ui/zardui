import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideRefreshCcw, lucideThumbsDown, lucideThumbsUp } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';

@Component({
  selector: 'z-demo-message-actions',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardMessageImports],
  template: `
    <div class="flex w-full max-w-sm flex-col gap-8 py-12">
      <z-message>
        <z-message-content>
          <z-bubble zVariant="muted">
            <z-bubble-content>The install failure is coming from the workspace package.</z-bubble-content>
          </z-bubble>
          <z-message-footer>
            <button type="button" z-button zType="ghost" zSize="icon" aria-label="Copy" title="Copy">
              <ng-icon name="lucideCopy" />
            </button>
            <button type="button" z-button zType="ghost" zSize="icon" aria-label="Like" title="Like">
              <ng-icon name="lucideThumbsUp" />
            </button>
            <button type="button" z-button zType="ghost" zSize="icon" aria-label="Dislike" title="Dislike">
              <ng-icon name="lucideThumbsDown" />
            </button>
          </z-message-footer>
        </z-message-content>
      </z-message>

      <z-message zAlign="end">
        <z-message-content>
          <z-bubble>
            <z-bubble-content>Okay drop me a link. Taking a look...</z-bubble-content>
          </z-bubble>
          <z-message-footer class="gap-2">
            <span class="text-destructive font-normal">Failed to send</span>
            <button type="button" z-button zType="ghost" zSize="icon-xs" aria-label="Retry" title="Retry">
              <ng-icon name="lucideRefreshCcw" />
            </button>
          </z-message-footer>
        </z-message-content>
      </z-message>
    </div>
  `,
  viewProviders: [provideIcons({ lucideCopy, lucideRefreshCcw, lucideThumbsDown, lucideThumbsUp })],
  host: { class: 'contents' },
})
export class ZardDemoMessageActionsComponent {}
