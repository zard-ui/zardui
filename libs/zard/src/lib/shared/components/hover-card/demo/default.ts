import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardHoverCardComponent, ZardHoverCardDirective } from '../hover-card.component';

/** Demonstrates the default hover card behavior and content composition. */
@Component({
  selector: 'z-demo-hover-card-default',
  imports: [ZardButtonComponent, ZardHoverCardComponent, ZardHoverCardDirective],
  template: `
    <button type="button" z-button zType="link" [zHoverCard]="content" [zOpenDelay]="100">Hover Here</button>

    <ng-template #content>
      <z-hover-card>
        <div class="space-y-1">
          <h4 class="text-sm font-semibold">Next.js</h4>
          <p class="text-sm">The React Framework - created and maintained by @vercel.</p>
          <div class="text-muted-foreground text-xs">Released December 2021</div>
        </div>
      </z-hover-card>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoHoverCardDefaultComponent {}
