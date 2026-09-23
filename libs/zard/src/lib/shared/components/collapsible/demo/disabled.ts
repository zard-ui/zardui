import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardCollapsibleImports } from '@/shared/components/collapsible/collapsible.imports';

@Component({
  selector: 'z-demo-collapsible-disabled',
  imports: [ZardCollapsibleImports, ZardButtonComponent],
  template: `
    <z-collapsible class="flex w-[350px] flex-col gap-2" zDisabled zOpen>
      <button z-button z-collapsible-trigger zType="outline" zSize="sm">Cannot be toggled</button>

      <z-collapsible-content>
        <div class="text-muted-foreground rounded-md border px-4 py-3 text-sm">
          The trigger is disabled, so this panel stays exactly as it was rendered.
        </div>
      </z-collapsible-content>
    </z-collapsible>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCollapsibleDisabledComponent {}
