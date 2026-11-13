import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideRotateCw } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCardImports } from '@/shared/components/card/card.imports';
import { ZardMarkerImports } from '@/shared/components/marker/marker.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardSonnerService } from '@/shared/components/sonner/sonner.service';
import { ZardTooltipImports } from '@/shared/components/tooltip/tooltip.imports';
import { type ChatScriptStep, scriptMessages, ZardDemoChatRowComponent } from '@/shared/demo-utils/scripted-chat';

const HISTORY = scriptMessages([
  { role: 'user', text: 'Can you summarize the incident channel?' },
  {
    role: 'assistant',
    text: 'The first alert was a delayed export job. It started backing up around 09:42 UTC and triggered the warning once the retry queue crossed the threshold.\n\nNo customer-facing checkout paths were affected, but exports for larger workspaces were running about 12 minutes behind.',
  },
  { role: 'user', text: 'Was checkout affected?' },
  {
    role: 'assistant',
    text: 'No checkout errors were reported. Payment authorization, order creation, and confirmation emails stayed inside their normal latency bands.\n\nThe only elevated metric was export queue depth, which maps to analytics downloads instead of checkout.',
  },
  { role: 'user', text: 'What changed in the last deploy?' },
  {
    role: 'assistant',
    text: 'Only the export queue worker changed. The deploy moved large CSV jobs onto the shared retry policy, which made each failed attempt hold a worker slot longer than before.\n\nThe app deploy did not include checkout, pricing, or billing API changes.',
  },
  { role: 'user', text: 'Do we need to roll back?' },
  {
    role: 'assistant',
    text: 'Not yet. Queue depth is recovering after we reduced retry concurrency, and the oldest pending job is now under five minutes old.\n\nKeep rollback ready if the queue starts climbing again, but the current trend points toward recovery.',
  },
  { role: 'user', text: 'Keep watching for customer-visible issues.' },
  {
    role: 'assistant',
    text: 'I will watch the queue and support tags for another 15 minutes. I am tracking export failures, delayed download requests, and any support thread that mentions missing reports.\n\nIf those stay quiet through the next batch window, we can close this as an internal degradation.',
  },
] satisfies ChatScriptStep[]);

const INITIAL_VISIBLE_COUNT = 5;

@Component({
  selector: 'z-demo-message-scroller-load-history',
  imports: [
    NgIcon,
    ZardButtonComponent,
    ZardDemoChatRowComponent,
    ...ZardCardImports,
    ...ZardMarkerImports,
    ...ZardMessageScrollerImports,
    ...ZardTooltipImports,
  ],
  template: `
    <div class="relative flex w-full flex-col gap-4">
      <z-card class="mx-auto h-140 w-full max-w-sm gap-0">
        <z-card-header class="gap-1 border-b">
          <z-card-title zTitle="Load History" />
          <z-card-description zDescription="Prepended messages keep your place." />
          <z-card-action>
            <button
              type="button"
              z-button
              zType="outline"
              zSize="icon"
              aria-label="Reset loaded messages"
              zTooltip="Reset"
              [disabled]="visibleCount() === initialCount"
              (click)="reset()"
            >
              <ng-icon name="lucideRotateCw" />
            </button>
          </z-card-action>
        </z-card-header>

        <z-card-content class="min-h-0 flex-1 overflow-hidden p-0">
          @for (run of runs(); track run) {
            <z-message-scroller zContentClass="p-(--card-spacing)">
              @for (message of visibleMessages(); track message.id) {
                <z-message-scroller-item [zMessageId]="message.id">
                  <z-demo-chat-row [zMessage]="message" />
                </z-message-scroller-item>
              }
              <z-message-scroller-item>
                <z-marker zVariant="separator">
                  <z-marker-content>End of Conversation</z-marker-content>
                </z-marker>
              </z-message-scroller-item>
              <button type="button" z-message-scroller-button></button>
            </z-message-scroller>
          }
        </z-card-content>

        <z-card-footer class="flex flex-col items-center gap-2 border-t">
          <button type="button" z-button zType="secondary" class="w-full" [disabled]="!canLoad()" (click)="load()">
            {{ canLoad() ? 'Load History' : 'History Loaded' }}
          </button>
          <p class="text-muted-foreground text-xs">Restore earlier messages while keeping your place.</p>
        </z-card-footer>
      </z-card>
      <p class="text-muted-foreground mx-auto max-w-sm px-0.5 text-center text-xs text-balance">
        Click Load History to load the entire conversation
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideRotateCw })],
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerLoadHistoryComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly initialCount = INITIAL_VISIBLE_COUNT;
  protected readonly visibleCount = signal(INITIAL_VISIBLE_COUNT);
  /** Bumped on reset so the scroller starts over at its opening position. */
  protected readonly runs = signal([0]);

  protected readonly visibleMessages = computed(() => HISTORY.slice(-this.visibleCount()));
  protected readonly canLoad = computed(() => this.visibleCount() < HISTORY.length);

  protected load(): void {
    // The older rows are prepended above the ones on screen; the scroller keeps the visible row in place.
    this.visibleCount.set(HISTORY.length);
    this.sonner.show('History loaded', { description: 'Scroll up to see earlier messages.' });
  }

  protected reset(): void {
    this.visibleCount.set(INITIAL_VISIBLE_COUNT);
    this.runs.update(([run]) => [run + 1]);
  }
}
