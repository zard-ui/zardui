import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '../hover-card.component';

/** Demonstrates every supported hover card placement. */
@Component({
  selector: 'z-demo-hover-card-placements',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="leftContent"
        zPlacement="left"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Left
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="topContent"
        zPlacement="top"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Top
      </button>

      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="bottomContent"
        zPlacement="bottom"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Bottom
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        [zHoverCard]="rightContent"
        zPlacement="right"
        [zOpenDelay]="100"
        [zCloseDelay]="100"
      >
        Right
      </button>
    </div>

    <ng-template #leftContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the left side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #topContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the top side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #bottomContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the bottom side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>

    <ng-template #rightContent>
      <z-hover-card>
        <div class="flex flex-col gap-1">
          <h4 class="font-medium">Hover Card</h4>
          <p>This hover card appears on the right side of the trigger.</p>
        </div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardSidesComponent {}
