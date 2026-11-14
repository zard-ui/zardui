import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideCircleCheck,
  lucideLoaderCircle,
  lucideMessageCircleDashed,
  lucidePlus,
  lucideRotateCw,
  lucideTerminal,
} from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCodeBlockImports } from '@/shared/components/code-block/code-block.imports';
import { ZardEmptyComponent } from '@/shared/components/empty/empty.component';
import { ZardInputGroupImports } from '@/shared/components/input-group/input-group.imports';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

/** The reply, already split into blocks. With a real model, render its markdown instead. */
interface Reply {
  text: string;
  list?: string[];
  code?: string;
}

interface Turn {
  question: string;
  reasoning?: string;
  command: string;
  output: string;
  reply: Reply;
}

interface AgentMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  reasoning?: string;
  thinking?: boolean;
  tool?: { command: string; output?: string };
  reply?: Reply;
}

const TURNS: Turn[] = [
  {
    question: 'Add a dark mode toggle to the settings page.',
    reasoning:
      'I need to know how themes are set up before I add a toggle. If a theme service already exists, the toggle only has to call it.',
    command: 'grep -rl ThemeService src/app',
    output: 'src/app/core/theme.service.ts',
    reply: {
      text: 'A ThemeService is already set up in src/app/core, so the toggle only has to call setTheme.',
      list: [
        'Added mode-toggle.ts with a Light and Dark option.',
        'Put <z-mode-toggle /> next to the Appearance heading in settings.ts.',
      ],
      code: 'private readonly theme = inject(ThemeService);',
    },
  },
  {
    question: 'Make it follow the system setting by default.',
    reasoning: 'The default theme lives in the ThemeService. I should check what it is set to now.',
    command: 'grep -n defaultTheme src/app/core/theme.service.ts',
    output: "12:  private readonly defaultTheme = 'light';",
    reply: {
      text: 'It was set to light. I changed the default in theme.service.ts so new visitors get the theme from their OS, and added a System option to the toggle.',
      code: "private readonly defaultTheme: Theme = 'system';",
    },
  },
  {
    question: 'Run the build before I ship it.',
    command: 'ng build',
    output: 'Application bundle generation complete. [4.218 seconds]\n\nOutput location: dist/acme/browser',
    reply: {
      text: 'The build passes, so it is ready to ship.',
      list: ['Compiled in 4.2s.', 'No lint or type errors.'],
    },
  },
];
const FALLBACK = 'This demo only knows the scripted turns. Press reset to start over.';

/** One step of an agent turn: its thinking, then the command it ran. */
@Component({
  selector: 'z-ai-elements-chat-steps',
  imports: [NgIcon, ...ZardCodeBlockImports, ...ZardTraceImports],
  template: `
    <z-trace>
      @if (message().reasoning; as reasoning) {
        <z-trace-collapsible [zOpen]="open() ?? !!message().thinking" (zOpenChange)="open.set($event)">
          <z-trace-collapsible-trigger>
            <z-trace-line [zStatus]="message().thinking ? 'running' : undefined">
              <z-trace-title>{{ message().thinking ? 'Thinking' : 'Thought' }}</z-trace-title>
            </z-trace-line>
          </z-trace-collapsible-trigger>
          <z-trace-collapsible-content class="whitespace-pre-wrap">{{ reasoning }}</z-trace-collapsible-content>
        </z-trace-collapsible>
      }
      @if (message().tool; as tool) {
        @if (tool.output === undefined) {
          <z-trace-line [zStatus]="streaming() ? 'running' : 'error'">
            <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
            <z-trace-title>{{ streaming() ? 'Running' : 'Failed to run' }} {{ tool.command }}</z-trace-title>
          </z-trace-line>
        } @else {
          <z-trace-collapsible>
            <z-trace-collapsible-trigger>
              <z-trace-line>
                <z-trace-icon><ng-icon name="lucideTerminal" /></z-trace-icon>
                <z-trace-title>Ran {{ tool.command }}</z-trace-title>
              </z-trace-line>
            </z-trace-collapsible-trigger>
            <z-trace-collapsible-content>
              <z-code-block zSize="sm">
                <z-code-block-content zWrap class="max-h-64">{{ tool.output }}</z-code-block-content>
              </z-code-block>
            </z-trace-collapsible-content>
          </z-trace-collapsible>
        }
      }
    </z-trace>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCircleCheck, lucideLoaderCircle, lucideTerminal })],
  host: { class: 'contents' },
})
export class ZardAiElementsChatStepsComponent {
  readonly message = input.required<AgentMessage>();
  readonly streaming = input(false);

  /** The reader's choice, which wins over the stream once they toggle the thinking. */
  protected readonly open = signal<boolean | undefined>(undefined);
}

@Component({
  selector: 'z-ai-elements-chat',
  imports: [
    NgIcon,
    ZardAiElementsChatStepsComponent,
    ZardButtonComponent,
    ZardEmptyComponent,
    ZardTextareaComponent,
    ...ZardBubbleImports,
    ...ZardCodeBlockImports,
    ...ZardInputGroupImports,
    ...ZardMessageImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="flex h-200 w-full flex-col gap-4">
      <div class="flex items-start justify-between gap-4 p-8 pb-4">
        <div class="flex flex-col gap-1">
          <div class="font-medium">New Thread</div>
          <div class="text-muted-foreground text-sm">Ask the agent to change your code.</div>
        </div>
        <button
          type="button"
          z-button
          zType="outline"
          zSize="icon"
          aria-label="Reset conversation"
          zTooltip="Reset"
          [disabled]="busy()"
          (click)="reset()"
        >
          <ng-icon name="lucideRotateCw" />
        </button>
      </div>

      <div class="min-h-0 flex-1">
        @if (messages().length === 0) {
          <z-empty
            class="h-full"
            zIcon="lucideMessageCircleDashed"
            zTitle="What should we build?"
            zDescription="The agent can read your code, run commands and make changes. Press send to start."
          />
        } @else {
          <!-- The person's turn is the scroll anchor, so a new question settles near the top and the reply streams under it. -->
          <z-message-scroller zAutoScroll zContentClass="gap-6 px-8 py-0" [zBusy]="busy()">
            @for (message of messages(); track message.id; let last = $last) {
              <z-message-scroller-item [zMessageId]="message.id" [zAnchor]="message.role === 'user'">
                @if (message.role === 'user') {
                  <z-message zAlign="end">
                    <z-message-content>
                      <z-bubble zAlign="end" zVariant="muted">
                        <z-bubble-content>{{ message.text }}</z-bubble-content>
                      </z-bubble>
                    </z-message-content>
                  </z-message>
                } @else {
                  <z-message>
                    <z-message-content class="gap-3 text-sm">
                      @if (message.reasoning || message.tool) {
                        <z-ai-elements-chat-steps [message]="message" [streaming]="busy() && last" />
                      }
                      @if (message.reply; as reply) {
                        <p class="leading-relaxed">{{ reply.text }}</p>
                        @if (reply.list) {
                          <ul class="list-disc space-y-1 ps-5 leading-relaxed">
                            @for (item of reply.list; track item) {
                              <li>{{ item }}</li>
                            }
                          </ul>
                        }
                        @if (reply.code) {
                          <z-code-block zSize="sm">
                            <z-code-block-content zWrap>{{ reply.code }}</z-code-block-content>
                          </z-code-block>
                        }
                      } @else if (message.text) {
                        <p class="leading-relaxed">{{ message.text }}</p>
                      }
                    </z-message-content>
                  </z-message>
                }
              </z-message-scroller-item>
            }
            <button type="button" z-message-scroller-button aria-label="Scroll to latest message"></button>
          </z-message-scroller>
        }
      </div>

      <div class="p-8 pt-0">
        <form class="w-full" (submit)="$event.preventDefault(); submit()">
          <z-input-group>
            <textarea
              z-textarea
              class="min-h-14"
              aria-label="Message"
              placeholder="Ask the agent..."
              [value]="text()"
              (input)="draft.set($any($event.target).value)"
              (keydown.enter)="onEnter($any($event))"
            ></textarea>
            <z-input-group-addon zAlign="block-end" class="pt-1">
              <button type="button" z-input-group-button zVariant="outline" zSize="icon-sm" aria-label="Add context">
                <ng-icon name="lucidePlus" />
              </button>
              <button
                type="submit"
                z-input-group-button
                zVariant="default"
                zSize="icon-sm"
                class="ms-auto"
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
  viewProviders: [provideIcons({ lucideArrowUp, lucideMessageCircleDashed, lucidePlus, lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardAiElementsChatComponent {
  protected readonly messages = signal<AgentMessage[]>([]);
  protected readonly busy = signal(false);
  /** What the person typed. `null` until they type, so the field shows the next scripted message. */
  protected readonly draft = signal<string | null>(null);

  /** The next scripted turn, while there is one. */
  private readonly nextTurn = computed(() => TURNS[this.messages().filter(message => message.role === 'user').length]);
  protected readonly text = computed(() => this.draft() ?? this.nextTurn()?.question ?? '');
  protected readonly canSend = computed(() => this.text().trim().length > 0 && !this.busy());

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;
  private nextId = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  protected reset(): void {
    this.run++;
    this.busy.set(false);
    this.messages.set([]);
    this.draft.set(null);
  }

  /** Enter sends, Shift+Enter adds a line. */
  protected onEnter(event: KeyboardEvent): void {
    if (event.shiftKey) return;
    event.preventDefault();
    void this.submit();
  }

  /**
   * Sends the message and simulates the agent's turn. With a real model, append each part your stream
   * sends (reasoning, tool calls, text) to the last message — the template only reads the signals.
   */
  protected async submit(): Promise<void> {
    if (!this.canSend()) return;

    const question = this.text().trim();
    const turn = this.draft() === null ? this.nextTurn() : undefined;
    const run = ++this.run;
    const id = `assistant-${this.nextId}`;
    this.draft.set(null);
    this.busy.set(true);
    this.messages.update(messages => [...messages, { id: `user-${this.nextId++}`, role: 'user', text: question }]);

    if (!(await this.wait(600, run))) return;
    this.messages.update(messages => [...messages, { id, role: 'assistant', text: '' }]);

    if (!turn) {
      if (!(await this.stream(FALLBACK, text => this.patch(id, { text }), run))) return;
      this.busy.set(false);
      return;
    }

    if (turn.reasoning) {
      this.patch(id, { thinking: true, reasoning: '' });
      if (!(await this.stream(turn.reasoning, reasoning => this.patch(id, { reasoning }), run))) return;
      this.patch(id, { thinking: false });
      if (!(await this.wait(400, run))) return;
    }

    this.patch(id, { tool: { command: turn.command } });
    if (!(await this.wait(800, run))) return;
    this.patch(id, { tool: { command: turn.command, output: turn.output } });

    if (!(await this.wait(500, run))) return;
    if (!(await this.stream(turn.reply.text, text => this.patch(id, { reply: { text } }), run))) return;
    this.patch(id, { reply: turn.reply });
    this.busy.set(false);
  }

  private patch(id: string, patch: Partial<AgentMessage>): void {
    this.messages.update(messages => messages.map(message => (message.id === id ? { ...message, ...patch } : message)));
  }

  /** Reveals `text` a word at a time, like a streamed response. Resolves `false` if the run was replaced. */
  private async stream(text: string, set: (value: string) => void, run: number): Promise<boolean> {
    let shown = '';
    for (const word of text.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return false;
      shown += word;
      set(shown);
    }
    return true;
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
