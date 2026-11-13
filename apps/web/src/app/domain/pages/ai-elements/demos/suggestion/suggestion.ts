import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePlus } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

const SUGGESTIONS = [
  'Add a dark mode toggle',
  'Fix the failing build',
  'Write tests for the form',
  'Upgrade to Angular 22',
  'Add a loading state',
  'Find unused dependencies',
];

const REPLIES: Record<string, string> = {
  'Add a dark mode toggle': 'Added a ModeToggle to the site header. It switches the dark class on the document.',
  'Fix the failing build': 'The build failed on a missing import in src/app/app.ts. I added it and the build passes.',
  'Write tests for the form':
    'Added four tests in signup-form.spec.ts. They cover the empty, invalid and valid states.',
  'Upgrade to Angular 22': 'Ran ng update and bumped @angular/core to 22. Two components needed new inputs, so I updated them.',
  'Add a loading state': 'Added a @defer block with a placeholder to the dashboard. It shows skeletons while the data loads.',
  'Find unused dependencies':
    'Three packages are not imported anywhere: lodash, moment and classnames. Should I remove them?',
};

@Component({
  selector: 'z-ai-elements-suggestion',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardTextareaComponent,
    ...ZardBubbleImports,
    ...ZardInputGroupImports,
    ...ZardMessageImports,
  ],
  template: `
    <div class="mx-auto flex w-full max-w-lg flex-col gap-6 py-6 text-sm">
      @if (turn(); as turn) {
        <div class="flex flex-col gap-4">
          <z-message zAlign="end">
            <z-message-content>
              <z-bubble zAlign="end" zVariant="muted">
                <z-bubble-content>{{ turn.prompt }}</z-bubble-content>
              </z-bubble>
            </z-message-content>
          </z-message>
          <z-message>
            <z-message-content>
              <p>{{ turn.reply }}</p>
            </z-message-content>
          </z-message>
        </div>
      }

      <div class="flex flex-col gap-2">
        <div class="scroll-fade-x flex gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none]">
          @for (suggestion of suggestions; track suggestion) {
            <button type="button" z-button zType="outline" zSize="sm" class="shrink-0" (click)="send(suggestion)">
              {{ suggestion }}
            </button>
          }
        </div>

        <form (submit)="$event.preventDefault(); submit()">
          <z-input-group>
            <textarea
              z-textarea
              class="p-3"
              aria-label="Message"
              placeholder="Ask the agent to change your code..."
              [value]="text()"
              (input)="text.set($any($event.target).value)"
              (keydown.enter)="onEnter($any($event))"
            ></textarea>
            <z-input-group-addon zAlign="block-end">
              <button
                type="button"
                z-input-group-button
                zVariant="outline"
                zSize="icon-sm"
                class="rounded-full"
                aria-label="Attach files"
              >
                <ng-icon name="lucidePlus" />
              </button>
              <button
                type="submit"
                z-input-group-button
                zVariant="default"
                zSize="icon-sm"
                class="ms-auto rounded-full"
                aria-label="Send"
                [disabled]="!canSend()"
              >
                <ng-icon name="lucideArrowUp" />
              </button>
            </z-input-group-addon>
          </z-input-group>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUp, lucidePlus })],
  host: { class: 'contents' },
})
export class ZardAiElementsSuggestionComponent {
  protected readonly suggestions = SUGGESTIONS;

  protected readonly text = signal('');
  protected readonly turn = signal<{ prompt: string; reply: string } | null>(null);
  protected readonly canSend = computed(() => this.text().trim().length > 0);

  /** The label is the message: send it as is. */
  protected send(prompt: string): void {
    this.turn.set({ prompt, reply: REPLIES[prompt] ?? 'This demo only knows the suggestions. Pick one.' });
    this.text.set('');
  }

  protected submit(): void {
    if (this.canSend()) this.send(this.text().trim());
  }

  /** Enter sends, Shift+Enter adds a line. */
  protected onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) return;
    event.preventDefault();
    this.submit();
  }
}
