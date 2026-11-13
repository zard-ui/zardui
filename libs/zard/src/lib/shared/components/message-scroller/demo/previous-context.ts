import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePlus, lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardSliderComponent } from '@/shared/components/slider/slider.component';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { SCROLL_BEHAVIOR_SCRIPT } from '@/shared/demo-utils/chat-scripts';
import { injectScriptedChat, messageAnimationClass, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const DEFAULT_PEEK = 64;

@Component({
  selector: 'z-demo-message-scroller-previous-context',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ZardSliderComponent,
    ...ZardCardImports,
    ...ZardInputGroupImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Keeping Context Visible" />
          <z-card-description zDescription="New turns keep part of the previous reply in view." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset context example"
              zTooltip="Reset"
              [disabled]="chat.busy()"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @for (run of runs(); track run) {
            <z-message-scroller
              zContentClass="p-(--card-spacing)"
              [zScrollMargin]="24"
              [zPreviousItemPeek]="peek()"
              [zBusy]="chat.busy()"
            >
              @for (message of chat.messages(); track message.id) {
                <z-message-scroller-item
                  [zMessageId]="message.id"
                  [zAnchor]="message.role === 'user'"
                  [class]="message.role === 'user' ? entrance : ''"
                >
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <button type="button" z-message-scroller-button></button>
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
                    <span class="text-muted-foreground">No messages queued. Reset the context.</span>
                  }
                </span>
              </div>
              <z-input-group-addon zAlign="block-end" class="pt-1">
                <button type="button" z-input-group-button zVariant="outline" zSize="icon-sm" aria-label="Add files">
                  <ng-icon name="lucidePlus" />
                </button>
                <div class="flex w-28 items-center gap-2">
                  <span class="text-muted-foreground text-xs tabular-nums">{{ peek() }}px</span>
                  <z-slider
                    class="flex-1"
                    aria-label="Previous context peek"
                    [zMin]="64"
                    [zMax]="128"
                    [zValue]="[peek()]"
                    [zDisabled]="chat.busy()"
                    (zSlideIndexChange)="peek.set($event[0] ?? defaultPeek)"
                  />
                </div>
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
      <p class="text-muted-foreground px-0.5 text-center text-xs">
        Adjust the slider and send. Observe the previous message peek.
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucidePlus, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerPreviousContextComponent {
  protected readonly defaultPeek = DEFAULT_PEEK;
  protected readonly chat = injectScriptedChat(SCROLL_BEHAVIOR_SCRIPT, { initial: 2, delayMs: 35 });
  protected readonly entrance = messageAnimationClass('slide-up');
  protected readonly peek = signal(DEFAULT_PEEK);
  /** Bumped on reset so the scroller starts over at its opening position. */
  protected readonly runs = signal([0]);

  protected reset(): void {
    this.chat.reset();
    this.peek.set(DEFAULT_PEEK);
    this.runs.update(([run]) => [run + 1]);
  }
}
