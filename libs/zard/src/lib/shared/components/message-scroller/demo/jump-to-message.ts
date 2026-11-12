import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardMessageImports } from '@/shared/components/message/message.imports';
import { ZardMessageScrollerComponent } from '@/shared/components/message-scroller/message-scroller.component';
import { ZardMessageScrollerImports } from '@/shared/components/message-scroller/message-scroller.imports';
import { ZardMessageScrollerService } from '@/shared/components/message-scroller/message-scroller.service';

@Component({
  selector: 'z-demo-message-scroller-jump-to-message',
  imports: [ZardButtonComponent, ...ZardMessageImports, ...ZardMessageScrollerImports],
  template: `
    <div class="flex w-full max-w-md flex-col gap-3">
      <div class="flex flex-wrap gap-2">
        @for (id of targets; track id) {
          <button z-button zType="outline" zSize="sm" type="button" [attr.data-target]="id" (click)="jump(id)">
            Message {{ id }}
          </button>
        }
      </div>

      <z-message-scroller class="h-80 rounded-lg border">
        @for (id of ids; track id) {
          <z-message-scroller-item [zMessageId]="'m' + id">
            <z-message [zAlign]="id % 2 === 0 ? 'end' : 'start'" [zVariant]="id % 2 === 0 ? 'default' : 'muted'">
              Message {{ id }}
            </z-message>
          </z-message-scroller-item>
        }

        <button z-message-scroller-button zDirection="end" aria-label="Jump to latest"></button>
      </z-message-scroller>

      <p class="text-muted-foreground text-xs" data-testid="visible-ids">Visible: {{ visible() }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class ZardDemoMessageScrollerJumpToMessageComponent {
  // The service is provided by the scroller, so a control outside it reads it from the component.
  private readonly scroller = viewChild.required(ZardMessageScrollerComponent, { read: ZardMessageScrollerService });

  protected readonly ids = Array.from({ length: 40 }, (_, i) => i + 1);
  protected readonly targets = [3, 20, 38];

  protected visible(): string {
    return this.scroller().visibleMessageIds().join(', ') || '-';
  }

  protected jump(id: number): void {
    this.scroller().scrollToMessage(`m${id}`, { align: 'center', behavior: 'smooth' });
  }
}
