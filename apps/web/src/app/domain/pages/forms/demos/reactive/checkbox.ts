import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const TASKS = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
] as const;

/** A `FormArray` of booleans is valid only when at least one entry is checked. */
function atLeastOneSelected(control: AbstractControl): ValidationErrors | null {
  const selected = (control.value as boolean[]).filter(Boolean).length;
  return selected > 0 ? null : { atLeastOneSelected: true };
}

@Component({
  selector: 'z-forms-reactive-checkbox',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Notifications</z-card-title>
        <z-card-description>Manage your notification preferences.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-checkbox" [formGroup]="notificationsForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Responses</legend>
              <p z-field-description>Get notified for requests that take time, like research or image generation.</p>

              <div z-field-group data-slot="checkbox-group">
                <div z-field zOrientation="horizontal">
                  <span z-checkbox formControlName="responses" zId="forms-reactive-checkbox-responses"></span>
                  <label z-field-label for="forms-reactive-checkbox-responses" class="font-normal">
                    Push notifications
                  </label>
                </div>
              </div>
            </fieldset>

            <z-field-separator />

            @let tasks = notificationsForm.controls.tasks;
            @let tasksInvalid = tasks.invalid && tasks.touched;
            <fieldset z-field-set>
              <legend z-field-legend zVariant="label">Tasks</legend>
              <p z-field-description>Get notified when tasks you've created have updates.</p>

              <div z-field-group data-slot="checkbox-group" formArrayName="tasks">
                @for (task of allTasks; track task.id; let index = $index) {
                  <div z-field zOrientation="horizontal" [attr.data-invalid]="tasksInvalid || null">
                    <span
                      z-checkbox
                      [formControlName]="index"
                      [zId]="'forms-reactive-checkbox-' + task.id"
                      [zInvalid]="tasksInvalid"
                    ></span>
                    <label z-field-label [for]="'forms-reactive-checkbox-' + task.id" class="font-normal">
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
          <button z-button zType="outline" type="button" (click)="notificationsForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-checkbox">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveCheckboxComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly allTasks = TASKS;

  protected readonly notificationsForm = new FormGroup({
    responses: new FormControl({ value: true, disabled: true }, { nonNullable: true }),
    tasks: new FormArray(
      TASKS.map(() => new FormControl(false, { nonNullable: true })),
      atLeastOneSelected,
    ),
  });

  protected onSubmit(): void {
    if (this.notificationsForm.invalid) {
      this.notificationsForm.markAllAsTouched();
      return;
    }

    // `getRawValue()` is what reads the disabled `responses` control.
    const { responses, tasks } = this.notificationsForm.getRawValue();
    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(
        { responses, tasks: TASKS.filter((_, index) => tasks[index]).map(task => task.id) },
        null,
        2,
      ),
    });
  }
}
