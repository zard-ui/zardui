import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardInputGroupImports } from '@zard/components/input-group/input-group.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-reactive-demo',
  imports: [
    ReactiveFormsModule,
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
        <form novalidate id="forms-reactive-demo" [formGroup]="bugForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let title = bugForm.controls.title;
            @let titleInvalid = title.invalid && title.touched;
            <div z-field [attr.data-invalid]="titleInvalid || null">
              <label z-field-label for="forms-reactive-demo-title">Bug Title</label>
              <input
                z-input
                formControlName="title"
                id="forms-reactive-demo-title"
                autocomplete="off"
                placeholder="Login button not working on mobile"
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

            @let description = bugForm.controls.description;
            @let descriptionInvalid = description.invalid && description.touched;
            <div z-field [attr.data-invalid]="descriptionInvalid || null">
              <label z-field-label for="forms-reactive-demo-description">Description</label>
              <z-input-group>
                <textarea
                  z-textarea
                  rows="6"
                  formControlName="description"
                  id="forms-reactive-demo-description"
                  class="min-h-24 resize-none"
                  placeholder="I'm having an issue with the login button on mobile."
                  [attr.aria-invalid]="descriptionInvalid || null"
                ></textarea>
                <z-input-group-addon zAlign="block-end">
                  <span z-input-group-text class="tabular-nums">{{ description.value.length }}/100 characters</span>
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
          <button z-button zType="outline" type="button" (click)="bugForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-demo">Submit</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveDemoComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly bugForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(32)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(20), Validators.maxLength(100)],
    }),
  });

  protected onSubmit(): void {
    if (this.bugForm.invalid) {
      this.bugForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.bugForm.getRawValue(), null, 2),
    });
  }
}
