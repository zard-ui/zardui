import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverDirective } from '@/shared/components/popover/popover.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-popover-interactive-demo',
  imports: [FormsModule, ZardButtonComponent, ZardInputComponent, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="interactiveContent" #popoverTrigger>
      Settings
    </button>

    <ng-template #interactiveContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Settings</h4>
          <p z-popover-description>Manage your account settings.</p>
        </div>

        <div class="space-y-2">
          <label for="interactive-width" class="text-sm font-medium">Width</label>
          <input id="interactive-width" z-input type="text" placeholder="100%" class="w-full" [(ngModel)]="width" />
        </div>

        <div class="space-y-2">
          <label for="interactive-height" class="text-sm font-medium">Height</label>
          <input id="interactive-height" z-input type="text" placeholder="25px" class="w-full" [(ngModel)]="height" />
        </div>

        <button type="button" z-button class="w-full" zSize="sm" (click)="saveChanges()">Save changes</button>
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
