import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-reactive-textarea',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardTextareaComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Personalization</z-card-title>
        <z-card-description>Customize your experience by telling us more about yourself.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-textarea" [formGroup]="profileForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let about = profileForm.controls.about;
            @let aboutInvalid = about.invalid && about.touched;
            <div z-field [attr.data-invalid]="aboutInvalid || null">
              <label z-field-label for="forms-reactive-textarea-about">More about you</label>
              <textarea
                z-textarea
                formControlName="about"
                id="forms-reactive-textarea-about"
                class="min-h-[120px]"
                placeholder="I'm a software engineer..."
                [attr.aria-invalid]="aboutInvalid || null"
              ></textarea>
              <p z-field-description>
                Tell us more about yourself. This will be used to help us personalize your experience.
              </p>
              @if (aboutInvalid) {
                <z-field-error>
                  @if (about.hasError('required') || about.hasError('minlength')) {
                    Please provide at least 10 characters.
                  } @else if (about.hasError('maxlength')) {
                    Please keep it under 200 characters.
                  }
                </z-field-error>
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="profileForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-textarea">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveTextareaComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly profileForm = new FormGroup({
    about: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(200)],
    }),
  });

  protected onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.profileForm.getRawValue(), null, 2),
    });
  }
}
