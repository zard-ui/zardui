import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

interface BugReport {
  title: string;
  description: string;
}

@Component({
  selector: 'z-forms-template-demo',
  imports: [
    FormsModule,
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
        <form novalidate id="forms-template-demo" #bugForm="ngForm" (ngSubmit)="onSubmit(bugForm)">
          <div z-field-group>
            @let titleInvalid = title.invalid && title.touched;
            <div z-field [attr.data-invalid]="titleInvalid || null">
              <label z-field-label for="forms-template-demo-title">Bug Title</label>
              <input
                z-input
                required
                minlength="5"
                maxlength="32"
                name="title"
                #title="ngModel"
                id="forms-template-demo-title"
                autocomplete="off"
                placeholder="Login button not working on mobile"
                [(ngModel)]="model.title"
                [attr.aria-invalid]="titleInvalid || null"
              />
              @if (titleInvalid) {
                <z-field-error>
                  @if (title.hasError('required') || title.hasError('minlength')) {
                    Bug title must be at least 5 characters.
                  } @else if (title.hasError('maxlength')) {
                    Bug title must be at most 32 characters.
                  }
                </z-field-error>
              }
            </div>

            @let descriptionInvalid = description.invalid && description.touched;
            <div z-field [attr.data-invalid]="descriptionInvalid || null">
              <label z-field-label for="forms-template-demo-description">Description</label>
              <z-input-group>
                <textarea
                  z-textarea
                  required
                  rows="6"
                  minlength="20"
                  maxlength="100"
                  name="description"
                  #description="ngModel"
                  id="forms-template-demo-description"
                  class="min-h-24 resize-none"
                  placeholder="I'm having an issue with the login button on mobile."
                  [(ngModel)]="model.description"
                  [attr.aria-invalid]="descriptionInvalid || null"
                ></textarea>
                <z-input-group-addon zAlign="block-end">
                  <span z-input-group-text class="tabular-nums">{{ model.description.length }}/100 characters</span>
                </z-input-group-addon>
              </z-input-group>
              <p z-field-description>Include steps to reproduce, expected behavior, and what actually happened.</p>
              @if (descriptionInvalid) {
                <z-field-error>
                  @if (description.hasError('required') || description.hasError('minlength')) {
                    Description must be at least 20 characters.
                  } @else if (description.hasError('maxlength')) {
                    Description must be at most 100 characters.
                  }
                </z-field-error>
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset(bugForm)">Reset</button>
          <button z-button type="submit" form="forms-template-demo">Submit</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateDemoComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected model: BugReport = { title: '', description: '' };

  protected onSubmit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ title: '', description: '' });
  }
}
