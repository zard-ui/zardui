import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideGlobe,
  lucideImage,
  lucideMessageCircleDashed,
  lucidePaperclip,
  lucidePlus,
  lucideRotateCw,
  lucideTelescope,
} from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { SCROLL_BEHAVIOR_SCRIPT } from '@/shared/demo-utils/chat-scripts';
import { injectScriptedChat, messageAnimationClass, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

@Component({
  selector: 'z-demo-message-scroller-preview',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardEmptyComponent,
    ...ZardCardImports,
    ...ZardDropdownImports,
    ...ZardInputGroupImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="New Chat" />
          <z-card-description zDescription="How can I help you today?" />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset conversation"
              zTooltip="Reset"
              [disabled]="chat.busy()"
              (click)="chat.reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @if (chat.messages().length === 0) {
            <z-empty
              class="h-full"
              zIcon="lucideMessageCircleDashed"
              zTitle="Morning, zard!"
              zDescription="What are we working on today? Press send to start a new conversation"
            />
          } @else {
            <z-message-scroller zContentClass="p-(--card-spacing)" [zBusy]="chat.busy()">
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex-col gap-2">
          <form class="w-full" (submit)="$event.preventDefault(); chat.send()">
            <z-input-group>
              <div class="h-14 w-full px-3 py-2.5 text-sm">
                <span class="line-clamp-2" [class.opacity-60]="chat.busy()">
                  @if (chat.next(); as next) {
                    {{ next.text }}
                  } @else {
                    <span class="text-muted-foreground">No messages queued. Reset the conversation.</span>
                  }
                </span>
              </div>
              <z-input-group-addon zAlign="block-end" class="pt-1">
                <button
                  type="button"
                  z-input-group-button
                  zVariant="outline"
                  zSize="icon-sm"
                  aria-label="Add files"
                  z-dropdown
                  [zDropdownMenu]="attachMenu"
                >
                  <ng-icon name="lucidePlus" />
                </button>
                <button
                  type="submit"
                  z-input-group-button
                  zVariant="default"
                  zSize="icon-sm"
                  class="ms-auto"
                  [disabled]="!chat.next() || chat.busy()"
                >
                  <ng-icon name="lucideArrowUp" />
                  <span class="sr-only">Send</span>
                </button>
              </z-input-group-addon>
            </z-input-group>
          </form>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground px-0.5 text-center text-xs">Demo is read only. Press send to send messages.</p>
    </div>

    <z-dropdown-menu-content #attachMenu="zDropdownMenuContent" zSide="top" class="w-44">
      <z-dropdown-menu-item>
        <ng-icon name="lucidePaperclip" />
        Add Photos & Files
      </z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>
        <ng-icon name="lucideImage" />
        Create Image
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        <ng-icon name="lucideTelescope" />
        Deep Research
      </z-dropdown-menu-item>
      <z-dropdown-menu-item>
        <ng-icon name="lucideGlobe" />
        Web Search
      </z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      lucideArrowUp,
      lucideGlobe,
      lucideImage,
      lucideMessageCircleDashed,
      lucidePaperclip,
      lucidePlus,
      lucideRotateCw,
      lucideTelescope,
    }),
  ],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerPreviewComponent {
  protected readonly chat = injectScriptedChat(SCROLL_BEHAVIOR_SCRIPT, { delayMs: 20 });
  protected readonly entrance = messageAnimationClass('slide-up');
}
