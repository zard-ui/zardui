import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMessageCircleDashed, lucidePlus, lucideRefreshCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardEmptyComponent } from '@zard/components/empty/empty.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';

@Component({
  selector: 'z-card-new-chat',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardCardImports, ZardEmptyComponent, ZardButtonComponent, ZardInputGroupImports, NgIcon],
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucidePlus, lucideRefreshCw })],
  host: { class: 'block w-full' },
  template: `
    <z-card class="mx-auto h-[560px] w-full max-w-sm gap-0!">
      <z-card-header class="gap-1! border-b pb-5!">
        <z-card-title zTitle="New Chat" />
        <p z-card-description zDescription="How can I help you today?"></p>
        <div z-card-action>
          <button type="button" z-button zType="outline" zSize="icon" aria-label="Reset conversation">
            <ng-icon name="lucideRefreshCw" />
          </button>
        </div>
      </z-card-header>

      <z-card-content class="flex-1 overflow-hidden px-0!">
        <z-empty
          class="h-full p-12"
          zIcon="lucideMessageCircleDashed"
          zTitle="Morning, developer!"
          zDescription="What are we working on today? Press send to start a new conversation"
        />
      </z-card-content>

      <z-card-content class="flex flex-col gap-2">
        <z-input-group>
          <div class="h-14 w-full px-3 py-2.5">
            <span class="line-clamp-2">{{ draft }}</span>
          </div>
          <z-input-group-addon zAlign="block-end" class="pt-1">
            <button
              type="button"
              z-input-group-button
              zVariant="outline"
              zSize="icon-sm"
              class="dark:border-border dark:bg-transparent"
              aria-label="Add files"
            >
              <ng-icon name="lucidePlus" />
            </button>
            <button
              type="button"
              z-input-group-button
              zVariant="default"
              zSize="icon-sm"
              class="ml-auto"
              aria-label="Send"
            >
              <ng-icon name="lucideArrowUp" />
            </button>
          </z-input-group-addon>
        </z-input-group>
      </z-card-content>
    </z-card>
  `,
})
export class CardNewChatComponent {
  readonly draft =
    "I'm building a chat for our app and the scroll behavior is driving me nuts. Every time the AI streams a reply, the whole thread jumps around.";
}
