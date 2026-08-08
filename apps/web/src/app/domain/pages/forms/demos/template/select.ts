import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

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
  selector: 'z-forms-template-select',
  imports: [FormsModule, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardSelectImports],
  template: `
    <z-card class="w-full sm:max-w-lg">
      <z-card-header>
        <z-card-title>Language Preferences</z-card-title>
        <z-card-description>Select your preferred spoken language.</z-card-description>
      </z-card-header>
      <z-card-content>
        <form novalidate id="forms-template-select" #preferencesForm="ngForm" (ngSubmit)="onSubmit(preferencesForm)">
          <div z-field-group>
            @let languageInvalid = (language.invalid || autoSelected) && language.touched;
            <div z-field zOrientation="responsive" [attr.data-invalid]="languageInvalid || null">
              <div z-field-content>
                <label z-field-label for="forms-template-select-language">Spoken Language</label>
                <p z-field-description>For best results, select the language you speak.</p>
                @if (languageInvalid) {
                  <z-field-error>
                    @if (autoSelected) {
                      Auto-detection is not allowed. Please select a specific language.
                    } @else {
                      Please select your spoken language.
                    }
                  </z-field-error>
                }
              </div>
              <z-select
                required
                name="language"
                #language="ngModel"
                id="forms-template-select-language"
                class="min-w-[120px]"
                zPlaceholder="Select"
                [(ngModel)]="model.language"
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
          <button z-button zType="outline" type="button" (click)="onReset(preferencesForm)">Reset</button>
          <button z-button type="submit" form="forms-template-select">Save</button>
        </div>
      </z-card-footer>
    </z-card>
  `,
  host: { class: 'flex w-full justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardFormsTemplateSelectComponent {
  private readonly sonner = inject(ZardSonnerService);

  protected readonly languages = LANGUAGES;

  protected model = { language: '' };

  /** Value rules have no declarative home in template-driven forms — they live here. */
  protected get autoSelected(): boolean {
    return this.model.language === 'auto';
  }

  protected onSubmit(form: NgForm): void {
    if (form.invalid || this.autoSelected) {
      form.control.markAllAsTouched();
      return;
    }

    this.sonner.show('You submitted the following values:', {
      description: JSON.stringify(this.model, null, 2),
    });
  }

  protected onReset(form: NgForm): void {
    form.resetForm({ language: '' });
  }
}
