import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';

interface Turn {
  id: number;
  mine: boolean;
}

const PAGE = 6;
const TOTAL = 30;

const page = (from: number, to: number): Turn[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({ id: from + i, mine: (from + i) % 2 === 0 }));

@Component({
  selector: 'z-demo-message-scroller-load-earlier',
  imports: [ZardButtonComponent, ...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <z-message-scroller class="h-96 w-full max-w-md rounded-lg border">
      <z-message-scroller-item zMessageId="load-earlier" class="flex justify-center">
        <button z-button zType="outline" zSize="sm" type="button" [disabled]="loading() || !hasMore()" (click)="load()">
          {{ loading() ? 'Loading…' : hasMore() ? 'Load earlier messages' : 'Start of the conversation' }}
        </button>
      </z-message-scroller-item>

      @for (turn of turns(); track turn.id) {
        <z-message-scroller-item [zMessageId]="'m' + turn.id">
          <z-message [zAlign]="turn.mine ? 'end' : 'start'" [zVariant]="turn.mine ? 'default' : 'muted'">
            Message {{ turn.id }} of {{ total }}
          </z-message>
        </z-message-scroller-item>
      }
    </z-message-scroller>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerLoadEarlierComponent {
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly total = TOTAL;
  protected readonly loading = signal(false);
  protected readonly turns = signal<Turn[]>(page(TOTAL - 11, TOTAL));

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected hasMore(): boolean {
    return this.turns()[0].id > 1;
  }

  protected load(): void {
    this.loading.set(true);
    // Stands in for a network request; the older rows land above the ones being read.
    this.timer = setTimeout(() => {
      const first = this.turns()[0].id;
      this.turns.update(turns => [...page(Math.max(1, first - PAGE), first - 1), ...turns]);
      this.loading.set(false);
    }, 400);
  }
}
