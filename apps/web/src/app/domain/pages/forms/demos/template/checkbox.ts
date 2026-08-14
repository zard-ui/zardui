import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const TASKS = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
] as const;

/** Keys match the control names, so `resetForm()` can restore the whole form at once. */
const INITIAL_VALUE: Record<string, boolean> = { responses: true, push: false, email: false };

@Component({
  selector: 'z-forms-template-checkbox',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Notifications</z-card-title>
        <z-card-description>Manage your notification preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form
          novalidate
          id="forms-template-checkbox"
          #notificationsForm="ngForm"
          (ngSubmit)="onSubmit(notificationsForm)"
        >
          <div z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Responses</legend>
              <p z-field-description>Get notified for requests that take time, like research or image generation.</p>

              <div z-field-group data-slot="checkbox-group">
                <div z-field zOrientation="horizontal">
                  <span
                    z-checkbox
                    disabled
                    name="responses"
                    zId="forms-template-checkbox-responses"
                    [(ngModel)]="model['responses']"
                  ></span>
                  <label z-field-label for="forms-template-checkbox-responses" class="font-normal">
                    Push notifications
                  </label>
                </div>
              </div>
            </fieldset>

            <z-field-separator />

            @let tasksInvalid = submitted && selectedTasks.length === 0;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Tasks</legend>
              <p z-field-description>Get notified when tasks you've created have updates.</p>

              <div z-field-group data-slot="checkbox-group">
                @for (task of allTasks; track task.id) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="tasksInvalid || null">
                    <span
                      z-checkbox
                      [name]="task.id"
                      [zId]="'forms-template-checkbox-' + task.id"
                      [zInvalid]="tasksInvalid"
                      [(ngModel)]="model[task.id]"
                    ></span>
                    <label z-field-label [for]="'forms-template-checkbox-' + task.id" class="font-normal">
                      {{ task.label }}
                    </label>
                  </div>
                }
              </div>
              @if (tasksInvalid) {
                <z-field-error>Please select at least one notification type.</z-field-error>
              }
            </fieldset>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset(notificationsForm)">Reset</button>
          <button z-button type="submit" form="forms-template-checkbox">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateCheckboxComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly allTasks = TASKS;
  protected submitted = false;

  protected model: Record<string, boolean> = { ...INITIAL_VALUE };

  /** Template-driven forms have no group validator, so the rule lives in the component. */
  protected get selectedTasks(): string[] {
    return TASKS.filter(task => this.model[task.id]).map(task => task.id);
  }

  protected onSubmit(form: NgForm): void {
    this.submitted = true;

    if (form.invalid || this.selectedTasks.length === 0) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify({ responses: this.model['responses'], tasks: this.selectedTasks }, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    this.submitted = false;
    form.resetForm({ ...INITIAL_VALUE });
  }
}
