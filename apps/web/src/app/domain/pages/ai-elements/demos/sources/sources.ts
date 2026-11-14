import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideGlobe } from '@ng-icons/lucide';

import { ZardBubbleImports } from '@/shared/components/bubble/bubble.imports';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardTraceImports } from '@/shared/components/trace/trace.imports';

interface Source {
  url: string;
  title?: string;
}

const QUESTION = 'How do I start an Angular project with pnpm?';
const ANSWER =
  'Run pnpm dlx @angular/cli new and follow the prompts. It scaffolds the project and installs the dependencies.';
/** What the agent cites, in order. It can cite the same page twice. */
const CITED: Source[] = [
  { url: 'https://angular.dev/installation', title: 'Installation | angular.dev' },
  { url: 'https://www.npmjs.com/package/@angular/cli', title: '@angular/cli | npmjs.com' },
  { url: 'https://angular.dev/installation', title: 'Installation | angular.dev' },
  { url: 'https://pnpm.io/cli/dlx', title: 'pnpm dlx | pnpm.io' },
];

@Component({
  selector: 'z-ai-elements-sources',
  imports: [NgIcon, ZardButtonComponent, ...ZardBubbleImports, ...ZardMessageImports, ...ZardTraceImports],
  template: `
    <div class="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <z-message zAlign="end">
        <z-message-content>
          <z-bubble zAlign="end" zVariant="muted">
            <z-bubble-content>{{ question }}</z-bubble-content>
          </z-bubble>
        </z-message-content>
      </z-message>

      <z-message>
        <z-message-content class="gap-4">
          @if (answer()) {
            <p>{{ answer() }}</p>
          }

          @if (sources().length) {
            <z-trace>
              <z-trace-collapsible zOpen>
                <z-trace-collapsible-trigger>
                  <z-trace-line>
                    <z-trace-icon><ng-icon name="lucideGlobe" /></z-trace-icon>
                    <z-trace-title>Used {{ sources().length }} sources</z-trace-title>
                  </z-trace-line>
                </z-trace-collapsible-trigger>
                <z-trace-collapsible-content>
                  <z-trace>
                    @for (source of sources(); track source.url) {
                      <a [href]="source.url" target="_blank" rel="noreferrer">
                        <z-trace-line>
                          <z-trace-title>
                            {{ source.title ?? hostname(source.url) }}
                            <span class="sr-only">(opens in a new tab)</span>
                          </z-trace-title>
                          <z-trace-icon><ng-icon name="lucideArrowUpRight" /></z-trace-icon>
                        </z-trace-line>
                      </a>
                    }
                  </z-trace>
                </z-trace-collapsible-content>
              </z-trace-collapsible>
            </z-trace>
          }
        </z-message-content>
      </z-message>

      @if (!busy()) {
        <button type="button" z-button zType="outline" zSize="sm" class="mt-auto self-start" (click)="replay()">
          Replay
        </button>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpRight, lucideGlobe })],
  host: { class: 'contents' },
})
export class ZardAiElementsSourcesComponent {
  protected readonly question = QUESTION;

  /** Starts at the end of the run, so the reply reads in full until it is replayed. */
  protected readonly answer = signal(ANSWER);
  protected readonly cited = signal<Source[]>(CITED);
  protected readonly busy = signal(false);

  /** The agent can cite a page more than once: list each URL once. */
  protected readonly sources = computed(() =>
    this.cited().filter((source, index, all) => all.findIndex(other => other.url === source.url) === index),
  );

  /** Bumped on every run and on destroy, so a stale run stops at its next step. */
  private run = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.run++);
  }

  /** `title` is optional on a source: fall back to the hostname of its URL. */
  protected hostname(url: string): string {
    return new URL(url).hostname;
  }

  /**
   * Simulates the agent. With a real model, append each source your stream sends to `cited`
   * and each text chunk to `answer` instead — the template only reads the signals.
   */
  protected async replay(): Promise<void> {
    const run = ++this.run;
    this.busy.set(true);
    this.answer.set('');
    this.cited.set([]);

    let shown = '';
    for (const word of ANSWER.split(/(?<=\s)/)) {
      if (!(await this.wait(20, run))) return;
      shown += word;
      this.answer.set(shown);
    }

    for (const source of CITED) {
      if (!(await this.wait(300, run))) return;
      this.cited.update(cited => [...cited, source]);
    }
    this.busy.set(false);
  }

  private wait(ms: number, run: number): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(run === this.run), ms));
  }
}
