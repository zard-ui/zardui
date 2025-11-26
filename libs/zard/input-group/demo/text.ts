import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardInputDirective } from '@ngzard/ui/input';

import { ZardInputGroupComponent } from '../input-group.component';

@Component({
  selector: 'z-demo-input-group-text',
  imports: [ZardInputGroupComponent, ZardInputDirective, ZardButtonComponent],
  template: `
    <z-input-group zAddonBefore="$" zAddonAfter="USD" class="mb-4">
      <input z-input placeholder="0.00" type="number" />
    </z-input-group>

    <z-input-group zAddonBefore="https://" zAddonAfter=".com" class="mb-4">
      <input z-input placeholder="example.com" />
    </z-input-group>

    <z-input-group zAddonAfter="@company.com" class="mb-4">
      <input z-input placeholder="Enter your username" />
    </z-input-group>

    <z-input-group [zAddonAfter]="actions" class="mb-4">
      <textarea z-input class="resize-none" placeholder="Enter your message"></textarea>
    </z-input-group>

    <ng-template #actions>
      <div class="flex w-full items-center justify-between">
        <span class="text-muted-foreground text-xs">120 characters left</span>
        <button type="submit" z-button zSize="sm">Submit</button>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoInputGroupTextComponent {}
