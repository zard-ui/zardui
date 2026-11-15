import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCopy,
  lucidePencil,
  lucideRefreshCcw,
  lucideThumbsDown,
  lucideThumbsUp,
} from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { injectHighlightedCode } from '@/shared/components/code-block/code-block.highlight';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';

const QUESTION = 'How do I add a settings dialog? It should open from the gear icon in the header.';
const COMMAND = 'npx zard-cli add dialog';
const CODE = 'class="bg-muted rounded px-1 py-0.5 font-mono text-[0.8rem]"';
/** The reply around the command, as the HTML its markdown renders to. */
const INTRO = `Install Dialog, then open it from the gear button in <code ${CODE}>site-header.ts</code>.`;
const OUTRO = `Wrap the button in a <code ${CODE}>z-dialog-trigger</code> and put the settings form in the dialog content. Focus moves into the dialog when it opens, and <strong>Esc</strong> closes it.`;

@Component({
  selector: 'z-ai-elements-message',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
    ...ZardMessageImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="mx-auto flex w-full max-w-md flex-col gap-8 py-6 text-sm">
      <z-message zAlign="end">
        <z-message-content class="gap-2">
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>{{ question }}</z-bubble-content>
          </z-bubble>
          <z-message-footer>
            <button type="button" z-button zType="ghost" zSize="icon-sm" aria-label="Copy" zTooltip="Copy">
              <ng-icon name="lucideCopy" />
            </button>
            <button type="button" z-button zType="ghost" zSize="icon-sm" aria-label="Edit" zTooltip="Edit">
              <ng-icon name="lucidePencil" />
            </button>
          </z-message-footer>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-content class="gap-2">
          <!-- The reply streams as markdown. Render it to HTML, and route fenced code to a code block. -->
          <div class="flex flex-col gap-3 leading-relaxed">
            <p [innerHTML]="intro"></p>
            <z-code-block zSize="sm">
              <z-code-block-header>
                <z-code-block-title>bash</z-code-block-title>
                <z-code-block-actions>
                  <z-code-block-copy-button [zValue]="command" />
                </z-code-block-actions>
              </z-code-block-header>
              <z-code-block-content zLineNumbers>
                @for (line of commandLines(); track $index) {
                  <z-code-block-line [zTokens]="line" />
                }
              </z-code-block-content>
            </z-code-block>
            <p [innerHTML]="outro"></p>
          </div>
          <z-message-footer class="px-0">
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="icon-sm"
              [attr.aria-label]="copied() ? 'Copied' : 'Copy'"
              [zTooltip]="copied() ? 'Copied' : 'Copy'"
              (click)="copy()"
            >
              <ng-icon [name]="copied() ? 'lucideCheck' : 'lucideCopy'" />
            </button>
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="icon-sm"
              aria-label="Good response"
              zTooltip="Good response"
              [attr.aria-pressed]="feedback() === 'like'"
              (click)="toggle('like')"
            >
              <ng-icon name="lucideThumbsUp" [class]="feedback() === 'like' ? filled : ''" />
            </button>
            <button
              type="button"
              z-button
              zType="ghost"
              zSize="icon-sm"
              aria-label="Bad response"
              zTooltip="Bad response"
              [attr.aria-pressed]="feedback() === 'dislike'"
              (click)="toggle('dislike')"
            >
              <ng-icon name="lucideThumbsDown" [class]="feedback() === 'dislike' ? filled : ''" />
            </button>
            <button type="button" z-button zType="ghost" zSize="icon-sm" aria-label="Retry" zTooltip="Retry">
              <ng-icon name="lucideRefreshCcw" />
            </button>
          </z-message-footer>
        </z-message-content>
      </z-message>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({ lucideCheck, lucideCopy, lucidePencil, lucideRefreshCcw, lucideThumbsDown, lucideThumbsUp }),
  ],
  host: { class: 'contents' },
})
export class ZardAiElementsMessageComponent {
  protected readonly question = QUESTION;
  protected readonly command = COMMAND;

  protected readonly intro = INTRO;
  protected readonly outro = OUTRO;
  protected readonly commandLines = injectHighlightedCode(COMMAND, 'bash');
  /** Fills the outlined icon of a pressed toggle. */
  protected readonly filled = '[&_svg]:fill-current';

  protected readonly copied = signal(false);
  protected readonly feedback = signal<'like' | 'dislike' | null>(null);

  private timeout?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timeout));
  }

  /** Writes the reply to the clipboard and swaps to a check for two seconds. */
  protected copy(): void {
    void navigator.clipboard?.writeText(`Install Dialog, then open it from the gear button.\n\n${COMMAND}`);
    this.copied.set(true);
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.copied.set(false), 2000);
  }

  protected toggle(value: 'like' | 'dislike'): void {
    this.feedback.update(current => (current === value ? null : value));
  }
}
