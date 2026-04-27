import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-field-field-group',
  imports: [...ZardFieldImports, ZardCheckboxComponent, FormsModule],
  template: `
    <div class="w-full min-w-md">
      <div z-field-group>
        <fieldset z-field-set>
          <label z-field-label>Responses</label>
          <p z-field-description>
            Get notified when ChatGPT responds to requests that take time, like research or image generation.
          </p>

          <div z-field-group data-slot="checkbox-group">
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="responses-push" [(ngModel)]="responsesPush" name="responsesPush" zDisabled></span>
              <label z-field-label for="responses-push" class="font-normal">Push notifications</label>
            </div>
          </div>
        </fieldset>

        <z-field-separator />

        <fieldset z-field-set>
          <label z-field-label>Tasks</label>
          <p z-field-description>
            Get notified when tasks you've created have updates.
            <a href="#">Manage tasks</a>
          </p>

          <div z-field-group data-slot="checkbox-group">
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="tasks-push" [(ngModel)]="tasksPush" name="tasksPush"></span>
              <label z-field-label for="tasks-push" class="font-normal">Push notifications</label>
            </div>
            <div z-field zOrientation="horizontal">
              <span z-checkbox zId="tasks-email" [(ngModel)]="tasksEmail" name="tasksEmail"></span>
              <label z-field-label for="tasks-email" class="font-normal">Email notifications</label>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldFieldGroupComponent {
  protected responsesPush = true;
  protected tasksPush = false;
  protected tasksEmail = false;
}
