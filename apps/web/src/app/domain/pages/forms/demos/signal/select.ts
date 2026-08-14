import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, required, submit, validate } from '@angular/forms/signals';

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

@Component({
  selector: 'z-forms-signal-select',
  imports: [FormField, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSelectImports],
  template: `
    <z-card class="w-full sm:max-w-lg">
      <z-card-header>
        <z-card-title>Language Preferences</z-card-title>
        <z-card-description>Select your preferred spoken language.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-signal-select" (submit)="onSubmit($event)">
          <div z-field-group>
            @let language = preferencesForm.language();
            @let languageInvalid = language.invalid() && language.touched();
            <div z-field zOrientation="responsive" [attr.data-invalid]="languageInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-signal-select-language">Spoken Language</label>
                <p z-field-description>For best results, select the language you speak.</p>
                @if (languageInvalid) {
                  <z-field-error [zErrors]="language.errors()" />
                }
              </div>
              <z-select
                id="forms-signal-select-language"
                class="min-w-[120px]"
                zPlaceholder="Select"
                [formField]="preferencesForm.language"
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
          <button z-button zType="outline" type="button" (click)="onReset()">Reset</button>
          <button z-button type="submit" form="forms-signal-select">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsSignalSelectComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly languages = LANGUAGES;

  private readonly model = signal({ language: '' });

  protected readonly preferencesForm = form(this.model, schemaPath => {
    required(schemaPath.language, { message: 'Please select your spoken language.' });

    // `auto` is offered in the list, but it is not an acceptable answer.
    validate(schemaPath.language, ({ value }) =>
      value() === 'auto'
        ? { kind: 'autoNotAllowed', message: 'Auto-detection is not allowed. Please select a specific language.' }
        : undefined,
    );
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.preferencesForm, async submitted => {
      this.sonner.show('You submitted the following values:', {
        description: JSON.stringify(submitted().value(), null, 2),
      });
    });
  }

  protected onReset(): void {
    this.preferencesForm().reset({ language: '' });
  }
}
