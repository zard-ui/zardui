import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardFieldImports } from '@/shared/components/field/field.imports';
import { ZardInputComponent } from '@/shared/components/input/input.component';

@Component({
  selector: 'z-demo-field-responsive',
  imports: [...ZardFieldImports, ZardInputComponent, ZardButtonComponent],
  template: `
    <div class="w-full min-w-md">
      <fieldset z-field-set>
        <legend z-field-legend>Profile</legend>
        <p z-field-description>Fill in your profile information.</p>

        <div z-field-group>
          <div z-field zOrientation="responsive">
            <div z-field-content>
              <label z-field-label for="responsive-name">Name</label>
              <p z-field-description>Provide your full name for identification.</p>
            </div>
            <input z-input id="responsive-name" placeholder="Evil Rabbit" />
          </div>

          <div z-field zOrientation="responsive">
            <button z-button type="submit">Submit</button>
            <button z-button zType="outline" type="button">Cancel</button>
          </div>
        </div>
      </fieldset>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoFieldResponsiveComponent {}
