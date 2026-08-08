import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, maxLength, minLength, required, submit } from '@angular/forms/signals';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-forms-signal-textarea',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardTextareaComponent],
  template: `
    <z-card class="w-full sm:max-w-md">
      <z-card-header>
        <z-card-title>Personalization</z-card-title>
        <z-card-description>Customize your experience by telling us more about yourself.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-textarea" (submit)="onSubmit($event)">
          <div z-field-group>
            @let about = profileForm.about();
            @let aboutInvalid = about.invalid() && about.touched();
            <div z-field [attr.data-invalid]="aboutInvalid || null">
              <label z-field-label for="forms-signal-textarea-about">More about you</label>
              <textarea
                z-textarea
                id="forms-signal-textarea-about"
                class="min-h-[120px]"
                placeholder="I'm a software engineer..."
                [formField]="profileForm.about"
                [attr.aria-invalid]="aboutInvalid || null"
              ></textarea>
              <p z-field-description>
                Tell us more about yourself. This will be used to help us personalize your experience.
              </p>
              @if (aboutInvalid) {
                <z-field-error [zErrors]="about.errors()" />
              }
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-textarea">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalTextareaComponent {
  private readonly sonner = inject(ZardSonnerService);

  private readonly model = signal({ about: '' });

  protected readonly profileForm = form(this.model, schemaPath => {
    required(schemaPath.about, { message: 'Please provide at least 10 characters.' });
    minLength(schemaPath.about, 10, { message: 'Please provide at least 10 characters.' });
    maxLength(schemaPath.about, 200, { message: 'Please keep it under 200 characters.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.profileForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.profileForm().reset({ about: '' });
  }
}
