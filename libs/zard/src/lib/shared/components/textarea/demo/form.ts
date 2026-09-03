import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardTextareaComponent } from '@/shared/components/textarea/textarea.component';

@Component({
  selector: 'z-demo-textarea-form',
  imports: [ZardTextareaComponent, ZardButtonComponent, ReactiveFormsModule, ...ZardFieldImports],
  template: `
    <form class="grid w-72 gap-4" [formGroup]="form" (ngSubmit)="onSubmit()">
      @let feedbackControl = form.controls.feedback;
      @let feedbackInvalid = feedbackControl.invalid && feedbackControl.touched;
      <div z-field [attr.data-invalid]="feedbackInvalid || null">
        <label z-field-label for="textarea-form-feedback">Feedback</label>
        <textarea
          z-textarea
          id="textarea-form-feedback"
          placeholder="Tell us what you think..."
          formControlName="feedback"
          [attr.aria-invalid]="feedbackInvalid || null"
        ></textarea>
        @if (feedbackInvalid) {
          <z-field-error>
            @if (feedbackControl.hasError('required')) {
              Feedback is required.
            } @else if (feedbackControl.hasError('minlength')) {
              Feedback must be at least 10 characters.
            }
          </z-field-error>
        } @else {
          <p z-field-description>Share as much detail as you can.</p>
        }
      </div>
      <button z-button type="submit">Submit feedback</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoTextareaFormComponent {
  protected readonly form = new FormGroup({
    feedback: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      console.log('Feedback submitted:', this.form.getRawValue());
    }
  }
}
