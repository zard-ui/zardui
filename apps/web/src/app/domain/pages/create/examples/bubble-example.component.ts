import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideThumbsDown, lucideThumbsUp } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@zard/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCollapsibleImports } from '@zard/components/collapsible/collapsible.imports';
import { ZardMarkerImports } from '@zard/components/marker/marker.imports';
import { ZardSonnerComponent, ZardSonnerService } from '@zard/components/sonner';
import { ZardDarkMode } from '@zard/services/dark-mode';

import { ExampleImports } from './example.component';

const GHOST_TEXT = `Ghost bubbles work for assistant text and other content that should not be framed.

This is perfect for assistant messages that should not have a frame and can take the full width of the container.

Ghost bubbles are full width and can take the full width of the container.
`;

const GHOST_TEXT_ROW = `Ghost bubbles work for assistant text and other content that should not be framed.

This is perfect for assistant messages that should not have a frame and can take the full width of the container.

Use this for content that needs the whole row.`;

const TEXT = `The accessibility review found two focus states that were visually too subtle in dark mode.

I checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.

The dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.

I also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;

const PREVIEW_LENGTH = 180;

const QUICK_REPLIES = [
  { label: 'I need help with my account.', message: 'I need help with my account.' },
  { label: 'I forgot my password.', message: 'I forgot my password.' },
  {
    label: "I have another question. I'd like to talk to a human. Can you help me?",
    message: 'I have another question.',
  },
] as const;

/** shadcn/ui's `bubble-example`, in zard. */
@Component({
  selector: 'z-bubble-example',
  imports: [
    ExampleImports,
    NgIcon,
    ZardBubbleImports,
    ZardButtonComponent,
    ZardCollapsibleImports,
    ZardMarkerImports,
    ZardSonnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown, lucideThumbsDown, lucideThumbsUp })],
  template: `
    <z-example-wrapper>
      <z-example zTitle="Sizes">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-bubble>
            <z-bubble-content>This is a one line bubble.</z-bubble-content>
          </z-bubble>
          <z-bubble>
            <z-bubble-content>
              This bubble has multiple lines. It should wrap to the next line and you should see a different radius on
              the corners.
            </z-bubble-content>
          </z-bubble>
          <z-bubble>
            <z-bubble-content>
              <p>This bubble has multiple lines.</p>
              <p>It should wrap to the next line and you should see a different radius on the corners.</p>
              <p>Here is some more text to see how it wraps.</p>
            </z-bubble-content>
          </z-bubble>
        </div>
      </z-example>

      <z-example zTitle="Variants">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-bubble>
            <z-bubble-content>
              Default bubbles use the primary color for the active user side of a chat.
            </z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="secondary">
            <z-bubble-content>
              Secondary bubbles are the standard neutral surface for assistant and conversation content.
            </z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="muted">
            <z-bubble-content>
              Muted bubbles lower the emphasis for quiet system notes or for displaying supporting content.
            </z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="tinted" zAlign="end">
            <z-bubble-content>
              Tinted bubbles use a softer primary tint when primary fill is too strong.
            </z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="outline">
            <z-bubble-content>
              Outline bubbles can be used to frame message content and give it a border.
            </z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="destructive">
            <z-bubble-content>Destructive bubbles flag errors or failed actions in a conversation.</z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="ghost">
            <z-bubble-content>
              <span class="whitespace-pre-wrap">{{ ghostText }}</span>
            </z-bubble-content>
          </z-bubble>
        </div>
      </z-example>

      <z-example zTitle="Alignment">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-bubble zVariant="muted">
            <z-bubble-content>This bubble is aligned to the start.</z-bubble-content>
          </z-bubble>
          <z-bubble zAlign="end">
            <z-bubble-content>This bubble is aligned to the end.</z-bubble-content>
          </z-bubble>
          <z-bubble zVariant="muted">
            <z-bubble-content>
              This multiline bubble is aligned to the start. The corners should adjust when the text wraps to show the
              grouped side of the conversation.
            </z-bubble-content>
          </z-bubble>
          <z-bubble zAlign="end">
            <z-bubble-content>
              This multiline bubble is aligned to the end. It should sit on the opposite side with the matching corner
              radius for wrapped text.
            </z-bubble-content>
          </z-bubble>
        </div>
      </z-example>

      <z-example zTitle="Grouped">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-bubble-group>
            <z-bubble zVariant="secondary">
              <z-bubble-content>I finished the audit pass.</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="secondary">
              <z-bubble-content>The registry output looks clean, but I found one stale route.</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="secondary">
              <z-bubble-content>Want me to remove it now?</z-bubble-content>
            </z-bubble>
          </z-bubble-group>
          <z-bubble-group>
            <z-bubble zVariant="tinted" zAlign="end">
              <z-bubble-content>Yes, clean that up.</z-bubble-content>
            </z-bubble>
            <z-bubble zVariant="tinted" zAlign="end">
              <z-bubble-content>Then rerun the registry build.</z-bubble-content>
            </z-bubble>
          </z-bubble-group>
        </div>
      </z-example>

      <z-example zTitle="Collapsible">
        <div class="flex w-full max-w-md flex-col gap-8">
          <div z-collapsible #turn="zCollapsible" [zOpen]="open()" (zOpenChange)="open.set($event)">
            <z-bubble zVariant="muted" zAlign="end">
              <z-bubble-content class="whitespace-pre-line">
                <div [id]="turn.contentId()">{{ visibleText() }}</div>
                @if (isLong) {
                  <button
                    type="button"
                    z-button
                    z-collapsible-trigger
                    zType="link"
                    class="text-muted-foreground gap-1 p-0"
                  >
                    {{ open() ? 'Show less' : 'Show more' }}
                    <ng-icon name="lucideChevronDown" data-icon="inline-end" [class.rotate-180]="open()" />
                  </button>
                }
              </z-bubble-content>
            </z-bubble>
          </div>
          <z-bubble zVariant="ghost">
            <z-bubble-content>
              <span class="whitespace-pre-wrap">{{ ghostTextRow }}</span>
            </z-bubble-content>
          </z-bubble>
        </div>
      </z-example>

      <z-example zTitle="Button & Links">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-bubble>
            <a z-bubble-content href="#">This bubble is a link.</a>
          </z-bubble>
          <z-bubble zVariant="secondary">
            <button type="button" z-bubble-content>This one is a button you can click.</button>
          </z-bubble>
          <z-bubble zVariant="muted">
            <button type="button" z-bubble-content>
              You can also do tinted buttons. Even ones that are multilines.
            </button>
          </z-bubble>
          <z-marker zVariant="separator">
            <z-marker-content>Chat Suggestions</z-marker-content>
          </z-marker>
          <z-bubble>
            <z-bubble-content>How can I help you today?</z-bubble-content>
          </z-bubble>
          <z-bubble-group>
            @for (reply of quickReplies; track reply.label) {
              <z-bubble zVariant="outline" zAlign="end">
                <button
                  type="button"
                  z-bubble-content
                  class="border-primary border-dashed"
                  (click)="notify(reply.message)"
                >
                  {{ reply.label }}
                </button>
              </z-bubble>
            }
          </z-bubble-group>
        </div>
      </z-example>

      <z-example zTitle="Reaction Placement">
        <div class="flex w-full max-w-md flex-col gap-12">
          <z-marker zVariant="separator">
            <z-marker-content>side=bottom align=end</z-marker-content>
          </z-marker>
          <z-bubble>
            <z-bubble-content>This is a one line message.</z-bubble-content>
            <z-bubble-reactions zSide="bottom" zAlign="end" role="img" aria-label="Reaction: thumbs up">
              <span>👍</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zVariant="secondary" zAlign="end">
            <z-bubble-content>
              A longer message that wraps across lines so the reaction offset is easier to inspect.
            </z-bubble-content>
            <z-bubble-reactions zSide="bottom" zAlign="start" role="img" aria-label="Reactions: thumbs up, surprised">
              <span>👍</span>
              <span>😮</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zVariant="tinted">
            <z-bubble-content>
              A longer message that wraps across lines so the reaction offset is easier to inspect.
            </z-bubble-content>
            <z-bubble-reactions
              zSide="bottom"
              zAlign="end"
              role="img"
              aria-label="Reactions: thumbs up, surprised, fire, eyes, and 8 more"
            >
              <span>👍</span>
              <span>😮</span>
              <span>🔥</span>
              <span>👀</span>
              <span>+8</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-marker zVariant="separator">
            <z-marker-content>side=bottom align=start</z-marker-content>
          </z-marker>
          <z-bubble zVariant="secondary">
            <z-bubble-content>This is a one line message.</z-bubble-content>
            <z-bubble-reactions zSide="bottom" zAlign="start" role="img" aria-label="Reaction: fire">
              <span>🔥</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zVariant="secondary">
            <z-bubble-content>
              A longer message that wraps across lines so the reaction offset is easier to inspect.
            </z-bubble-content>
            <z-bubble-reactions
              zSide="bottom"
              zAlign="start"
              role="img"
              aria-label="Reactions: thumbs up, surprised, fire, eyes"
            >
              <span>👍</span>
              <span>😮</span>
              <span>🔥</span>
              <span>👀</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-marker zVariant="separator">
            <z-marker-content>side=top align=start</z-marker-content>
          </z-marker>
          <z-bubble zVariant="secondary">
            <z-bubble-content>This is a one line message.</z-bubble-content>
            <z-bubble-reactions zSide="top" zAlign="start" role="img" aria-label="Reaction: fire">
              <span>🔥</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zVariant="secondary">
            <z-bubble-content>
              A longer message that wraps across lines so the reaction offset is easier to inspect.
            </z-bubble-content>
            <z-bubble-reactions
              zSide="top"
              zAlign="start"
              role="img"
              aria-label="Reactions: thumbs up, surprised, fire, eyes"
            >
              <span>👍</span>
              <span>😮</span>
              <span>🔥</span>
              <span>👀</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-marker zVariant="separator">
            <z-marker-content>side=bottom align=end</z-marker-content>
          </z-marker>
          <z-bubble zVariant="muted">
            <z-bubble-content>This is a one line message.</z-bubble-content>
            <z-bubble-reactions zSide="top" zAlign="end" role="img" aria-label="Reaction: thumbs up">
              <span>👍</span>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zVariant="muted">
            <z-bubble-content>A longer message that wraps across lines so the reaction offset.</z-bubble-content>
            <z-bubble-reactions
              zSide="top"
              zAlign="end"
              role="img"
              aria-label="Reactions: thumbs up, surprised, fire, eyes"
              class="px-1.5 py-0.5"
            >
              <span>👍</span>
              <span>😮</span>
              <span>🔥</span>
              <span>👀</span>
            </z-bubble-reactions>
          </z-bubble>
        </div>
      </z-example>

      <z-example zTitle="Reactions Buttons">
        <div class="flex w-full max-w-md flex-col gap-8">
          <z-bubble>
            <z-bubble-content>This is a one line message.</z-bubble-content>
            <z-bubble-reactions>
              <button
                type="button"
                z-button
                zType="outline"
                zSize="xs"
                (click)="notify('You clicked the button in the bubble reaction')"
              >
                Button
              </button>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zAlign="end">
            <z-bubble-content>This is a one line message.</z-bubble-content>
            <z-bubble-reactions zAlign="start">
              <button type="button" z-button zType="ghost" zSize="icon-xs" (click)="notify('Confetti!')">🎉</button>
            </z-bubble-reactions>
          </z-bubble>
          <z-bubble zVariant="tinted">
            <z-bubble-content>We are going to the movies first then dinner. Are you in?</z-bubble-content>
            <z-bubble-reactions class="bg-background gap-1">
              <button
                type="button"
                z-button
                zType="secondary"
                zSize="icon-xs"
                aria-label="Thumbs up"
                (click)="notify('You agree!')"
              >
                <ng-icon name="lucideThumbsUp" />
              </button>
              <button
                type="button"
                z-button
                zType="secondary"
                zSize="icon-xs"
                aria-label="Thumbs down"
                (click)="notify('You disagree!')"
              >
                <ng-icon name="lucideThumbsDown" />
              </button>
            </z-bubble-reactions>
          </z-bubble>
        </div>
      </z-example>
    </z-example-wrapper>
    <z-sonner position="bottom-right" [theme]="darkMode.themeMode()" />
  `,
})
export class BubbleExampleComponent {
  private readonly sonner = inject(ZardSonnerService);
  protected readonly darkMode = inject(ZardDarkMode);

  protected readonly ghostText = GHOST_TEXT;
  protected readonly ghostTextRow = GHOST_TEXT_ROW;
  protected readonly quickReplies = QUICK_REPLIES;

  protected readonly open = signal(false);
  protected readonly isLong = TEXT.length > PREVIEW_LENGTH;
  protected readonly visibleText = computed(() =>
    this.open() || !this.isLong ? TEXT : `${TEXT.slice(0, PREVIEW_LENGTH)}...`,
  );

  protected notify(message: string): void {
    this.sonner.show(message);
  }
}
