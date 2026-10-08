import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardCheckboxComponent } from '@/shared/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';

@Component({
  selector: 'z-demo-checkbox-reactive-forms',
  imports: [ZardCheckboxComponent, ...ZardFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="mx-auto w-64">
        <div z-field zOrientation="horizontal">
          <z-checkbox zId="newsletter-checkbox" formControlName="newsletter" />
          <label z-field-label for="newsletter-checkbox">Subscribe to newsletter</label>
        </div>
        <div z-field zOrientation="horizontal" data-disabled="true">
          <z-checkbox zId="beta-checkbox" formControlName="betaFeatures" />
          <label z-field-label for="beta-checkbox">Beta features (locked)</label>
        </div>
        <p class="text-muted-foreground text-sm">
          Newsletter: {{ form.controls.newsletter.value ? 'subscribed' : 'not subscribed' }}
        </p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoCheckboxReactiveFormsComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    newsletter: [true],
    betaFeatures: [{ value: false, disabled: true }],
  });
}
