import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardSelectImports } from '@zard/components/select/select.imports';
import { ZardSonnerService } from '@zard/components/sonner/sonner.service';

const LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'de', label: 'German' },
  { id: 'it', label: 'Italian' },
  { id: 'zh', label: 'Chinese' },
  { id: 'ja', label: 'Japanese' },
] as const;

/** `auto` is offered in the list, but it is not an acceptable answer. */
function specificLanguage(control: AbstractControl): ValidationErrors | null {
  return control.value === 'auto' ? { autoNotAllowed: true } : null;
}

@Component({
  selector: 'z-forms-reactive-select',
  imports: [ReactiveFormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSelectImports],
  template: `
    <z-card class="w-full sm:max-w-lg">
      <z-card-header>
        <z-card-title>Language Preferences</z-card-title>
        <z-card-description>Select your preferred spoken language.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-reactive-select" [formGroup]="preferencesForm" (ngSubmit)="onSubmit()">
          <div z-field-group>
            @let language = preferencesForm.controls.language;
            @let languageInvalid = language.invalid && language.touched;
            <div z-field zOrientation="responsive" [attr.data-invalid]="languageInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-reactive-select-language">Spoken Language</label>
                <p z-field-description>For best results, select the language you speak.</p>
                @if (languageInvalid) {
                  <z-field-error>
                    @if (language.hasError('required')) {
                      Please select your spoken language.
                    } @else if (language.hasError('autoNotAllowed')) {
                      Auto-detection is not allowed. Please select a specific language.
                    }
                  </z-field-error>
                }
              </div>
              <z-select
                formControlName="language"
                id="forms-reactive-select-language"
                class="min-w-[120px]"
                zPlaceholder="Select"
                [zInvalid]="languageInvalid"
              >
                <z-select-item zValue="auto">Auto</z-select-item>
                <z-select-separator />
                @for (option of languages; track option.id) {
                  <z-select-item [zValue]="option.id">{{ option.label }}</z-select-item>
                }
              </z-select>
            </div>
          </div>
        </form>
      </z-card-content>
      <z-card-footer>
        <div z-field zOrientation="horizontal">
          <button z-button zType="outline" type="button" (click)="preferencesForm.reset()">Reset</button>
          <button z-button type="submit" form="forms-reactive-select">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsReactiveSelectComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly languages = LANGUAGES;

  protected readonly preferencesForm = new FormGroup({
    language: new FormControl('', { nonNullable: true, validators: [Validators.required, specificLanguage] }),
  });

  protected onSubmit(): void {
    if (this.preferencesForm.invalid) {
      this.preferencesForm.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.preferencesForm.getRawValue(), null, 2),
    });
  }
}
