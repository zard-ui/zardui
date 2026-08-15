import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-signal-demo',
  imports: [
    FormField,
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardInputGroupImports,
    ZardTextareaComponent,
  ],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Bug Report</z-card-title>
        <z-card-description>Help us improve by reporting bugs you encounter.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-demo" (submit)="onSubmit($event)">
          <div z-field-group>
            @let title = bugForm.title();
            @let titleInvalid = title.invalid() && title.touched();
            <div z-field [attr.data-invalid]="titleInvalid || null">
              <label z-field-label for="forms-signal-demo-title">Bug Title</label>
              <input
                z-input
                id="forms-signal-demo-title"
                autocomplete="off"
                placeholder="Login button not working on mobile"
                [formField]="bugForm.title"
                [attr.aria-invalid]="titleInvalid || null"
              />
              @if (titleInvalid) {
                <z-field-error [zErrors]="title.errors()" />
              }
            </div>

            @let description = bugForm.description();
            @let descriptionInvalid = description.invalid() && description.touched();
            <div z-field [attr.data-invalid]="descriptionInvalid || null">
              <label z-field-label for="forms-signal-demo-description">Description</label>
              <z-input-group>
                <textarea
                  z-textarea
                  rows="6"
                  id="forms-signal-demo-description"
                  class="min-h-24 resize-none"
                  placeholder="I'm having an issue with the login button on mobile."
                  [formField]="bugForm.description"
                  [attr.aria-invalid]="descriptionInvalid || null"
                ></textarea>
                <z-input-group-addon zAlign="block-end">
                  <span z-input-group-text class="tabular-nums">{{ description.value().length }}/100 characters</span>
                </z-input-group-addon>
              </z-input-group>
              <p z-field-description>Include steps to reproduce, expected behavior, and what actually happened.</p>
              @if (descriptionInvalid) {
                <z-field-error [zErrors]="description.errors()" />
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-demo">Submit</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalDemoComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ title: '', description: '' });

  protected readonly bugForm = form(this.model, schemaPath => {
    required(schemaPath.title, { message: 'Bug title must be at least 5 characters.' });
    minLength(schemaPath.title, 5, { message: 'Bug title must be at least 5 characters.' });
    maxLength(schemaPath.title, 32, { message: 'Bug title must be at most 32 characters.' });

    required(schemaPath.description, { message: 'Description must be at least 20 characters.' });
    minLength(schemaPath.description, 20, { message: 'Description must be at least 20 characters.' });
    maxLength(schemaPath.description, 100, { message: 'Description must be at most 100 characters.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.bugForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    // `reset(value)` writes the value back into the model and clears touched/dirty in one call.
    this.bugForm().reset({ title: '', description: '' });
  }
}
