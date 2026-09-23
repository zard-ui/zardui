import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-controlled',
  imports: [ZardCollapsibleImports, ZardButtonComponent],
  template: `
    <div class="flex w-[350px] flex-col gap-3">
      <div class="flex items-center justify-between gap-4">
        <span class="text-muted-foreground text-sm">The panel is {{ open() ? 'open' : 'closed' }}</span>

        <button z-button zType="outline" zSize="sm" (click)="open.set(!open())">
          {{ open() ? 'Close' : 'Open' }} from outside
        </button>
      </div>

      <z-collapsible class="flex flex-col gap-2" [zOpen]="open()" (zOpenChange)="open.set($event)">
        <button z-button z-collapsible-trigger zType="secondary" zSize="sm">Toggle from inside</button>

        <z-collapsible-content>
          <div class="text-muted-foreground rounded-md border px-4 py-3 text-sm">
            Both buttons drive the same signal, so the component stays in sync with the host state.
          </div>
        </z-collapsible-content>
      </z-collapsible>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCollapsibleControlledComponent {
  readonly open = signal(true);
}
