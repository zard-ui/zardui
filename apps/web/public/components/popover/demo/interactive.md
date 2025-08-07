```angular-ts showLineNumbers
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-interactive-demo',
  standalone: true,
  imports: [FormsModule, ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective, ZardInputDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button z-button zPopover [zContent]="interactiveContent" zType="outline" #popoverTrigger>Settings</button>

    <ng-template #interactiveContent>
      <z-popover>
        <div class="space-y-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">Settings</h4>
            <p class="text-sm text-muted-foreground">Manage your account settings.</p>
          </div>
          <div class="space-y-2">
            <label for="width" class="text-sm font-medium">Width</label>
            <input id="width" z-input type="text" placeholder="100%" class="w-full" [(ngModel)]="width" />
          </div>
          <div class="space-y-2">
            <label for="height" class="text-sm font-medium">Height</label>
            <input id="height" z-input type="text" placeholder="25px" class="w-full" [(ngModel)]="height" />
          </div>
          <button z-button class="w-full" zSize="sm" (click)="saveChanges()">Save changes</button>
        </div>
      </z-popover>
    </ng-template>
  `,
})
export class ZardDemoPopoverInteractiveComponent {
  readonly popoverDirective = viewChild.required('popoverTrigger', { read: ZardPopoverDirective });

  readonly width = signal('100%');
  readonly height = signal('25px');

  saveChanges() {
    console.log('Settings saved:', { width: this.width(), height: this.height() });
    this.popoverDirective().hide();
  }
}

```