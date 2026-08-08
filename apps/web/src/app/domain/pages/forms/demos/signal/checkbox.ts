import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled, form, FormField, minLength, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const TASKS = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
] as const;

const INITIAL_VALUE = { responses: true, tasks: [] as string[] };

@Component({
  selector: 'z-forms-signal-checkbox',
  imports: [FormField, FormsModule, ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Notifications</z-card-title>
        <z-card-description>Manage your notification preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-checkbox" (submit)="onSubmit($event)">
          <div z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Responses</legend>
              <p z-field-description>Get notified for requests that take time, like research or image generation.</p>

              <div z-field-group data-slot="checkbox-group">
                <div z-field zOrientation="horizontal">
                  <span
                    z-checkbox
                    zId="forms-signal-checkbox-responses"
                    [formField]="notificationsForm.responses"
                  ></span>
                  <label z-field-label for="forms-signal-checkbox-responses" class="font-normal">
                    Push notifications
                  </label>
                </div>
              </div>
            </fieldset>

            <z-field-separator />

            @let tasks = notificationsForm.tasks();
            @let tasksInvalid = tasks.invalid() && tasks.touched();
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Tasks</legend>
              <p z-field-description>Get notified when tasks you've created have updates.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (task of allTasks; track task.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="tasksInvalid || null">
                    <span
                      z-checkbox
                      [zId]="'forms-signal-checkbox-' + task.id"
                      [zInvalid]="tasksInvalid"
                      [ngModel]="tasks.value().includes(task.id)"
                      [ngModelOptions]="{ standalone: true }"
                      (ngModelChange)="toggleTask(task.id, $event)"
                    ></span>
                    <label z-field-label [for]="'forms-signal-checkbox-' + task.id" class="font-normal">
                      {{ task.label }}
                    </label>
                  </div>
                }
              </div>
              @if (tasksInvalid) {
                <z-field-error [zErrors]="tasks.errors()" />
              }
            </fieldset>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-checkbox">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalCheckboxComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly allTasks = TASKS;

  private readonly model = signal({ ...INITIAL_VALUE });

  protected readonly notificationsForm = form(this.model, schemaPath => {
    disabled(schemaPath.responses);
    minLength(schemaPath.tasks, 1, { message: 'Please select at least one notification type.' });
  });

  protected toggleTask(id: string, checked: boolean): void {
    const field = this.notificationsForm.tasks();
    field.value.update(tasks => (checked ? [...tasks, id] : tasks.filter(task => task !== id)));
    field.markAsTouched();
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.notificationsForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.notificationsForm().reset({ ...INITIAL_VALUE });
  }
}
