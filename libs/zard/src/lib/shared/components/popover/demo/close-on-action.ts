import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';
import { ZardPopoverDirective } from '@/shared/components/popover/popover.component';
import { ZardPopoverImports } from '@/shared/components/popover/popover.imports';

@Component({
  selector: 'z-demo-popover-close-on-action',
  imports: [FormsModule, ZardButtonComponent, ZardInputComponent, ...ZardFieldImports, ...ZardPopoverImports],
  template: `
    <button type="button" z-button zPopover zType="outline" [zContent]="popoverContent" #popoverTrigger>
      Settings
    </button>

    <ng-template #popoverContent>
      <z-popover>
        <div z-popover-header>
          <h4 z-popover-title>Settings</h4>
          <p z-popover-description>Manage your account settings.</p>
        </div>

        <div z-field-group class="gap-3">
          <div z-field>
            <label z-field-label for="close-on-action-width">Width</label>
            <input id="close-on-action-width" z-input type="text" placeholder="100%" [(ngModel)]="width" />
          </div>

          <div z-field>
            <label z-field-label for="close-on-action-height">Height</label>
            <input id="close-on-action-height" z-input type="text" placeholder="25px" [(ngModel)]="height" />
          </div>
        </div>

        <button type="button" z-button class="w-full" zSize="sm" (click)="saveChanges()">Save changes</button>
      </z-popover>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPopoverCloseOnActionComponent {
  readonly popoverDirective = viewChild.required('popoverTrigger', { read: ZardPopoverDirective });

  readonly width = signal('100%');
  readonly height = signal('25px');

  saveChanges() {
    this.popoverDirective().hide();
  }
}
