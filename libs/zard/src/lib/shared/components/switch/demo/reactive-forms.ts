import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardSwitchComponent } from '@/shared/components/switch/switch.component';

@Component({
  selector: 'z-demo-switch-reactive-forms',
  imports: [ZardSwitchComponent, ...ZardFieldImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <div z-field-group class="mx-auto w-64">
        <div z-field zOrientation="horizontal">
          <z-switch zId="newsletter-switch" formControlName="newsletter" />
          <label z-field-label for="newsletter-switch">Subscribe to newsletter</label>
        </div>
        <div z-field zOrientation="horizontal" data-disabled="true">
          <z-switch zId="beta-switch" formControlName="betaFeatures" />
          <label z-field-label for="beta-switch">Beta features (locked)</label>
        </div>
        <p class="text-muted-foreground text-sm">
          Newsletter: {{ form.controls.newsletter.value ? 'subscribed' : 'not subscribed' }}
        </p>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoSwitchReactiveFormsComponent {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    newsletter: [true],
    betaFeatures: [{ value: false, disabled: true }],
  });
}
