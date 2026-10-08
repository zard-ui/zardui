import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '../hover-card.component';

/** Contrasts the default hover intent delay with an instant, tooltip-like open. */
@Component({
  selector: 'z-demo-hover-card-delay',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <div class="flex flex-wrap gap-2">
      <button type="button" z-button zType="outline" [zHoverCard]="instantContent" [zOpenDelay]="0" [zCloseDelay]="0">
        No delay
      </button>
      <button type="button" z-button zType="outline" [zHoverCard]="slowContent" [zOpenDelay]="1000" [zCloseDelay]="500">
        1s delay
      </button>
    </div>

    <ng-template #instantContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">No delay</h4>
          <p>Opens immediately, like a tooltip — a quick pass of the cursor is enough to trigger it.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #slowContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">1s delay</h4>
          <p>Opens after a full second and closes after 500ms, set with [zOpenDelay] and [zCloseDelay].</p>
        </div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardDelayComponent {}
