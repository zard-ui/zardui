import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { ZardInputDirective } from '@ngzard/ui/input';

import { ZardPopoverComponent, ZardPopoverDirective } from '../popover.component';

@Component({
  selector: 'z-popover-interactive-demo',
  imports: [FormsModule, ZardButtonComponent, ZardPopoverComponent, ZardPopoverDirective, ZardInputDirective],
  standalone: true,
  template: `
    <button z-button zPopover [zContent]="interactiveContent" zType="outline" #popoverTrigger>Settings</button>

    <ng-template #interactiveContent>
      <z-popover>
        <div class="space-y-4">
          <div class="space-y-2">
            <h4 class="leading-none font-medium">Settings</h4>
            <p class="text-muted-foreground text-sm">Manage your account settings.</p>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
