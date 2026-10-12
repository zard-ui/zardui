import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardCheckboxComponent } from '@zard/components/checkbox/checkbox.component';
import { ZardFieldImports } from '@zard/components/field/field.imports';

@Component({
  selector: 'z-preview-02-contributions-activity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ZardButtonComponent, ZardCardImports, ZardCheckboxComponent, ZardFieldImports],
  host: { class: 'block' },
  template: `
    <z-card>
      <z-card-header>
        <z-card-title zTitle="Contributions & Activity" />
        <z-card-description zDescription="Manage your contributions and activity visibility." />
      </z-card-header>
      <z-card-content>
        <form id="p2-contributions-activity" (submit)="$event.preventDefault()">
          <z-field-group>
            <fieldset z-field-set>
              <legend z-field-legend class="sr-only">Contributions & activity</legend>
              <z-field-group>
                <z-field zOrientation="horizontal">
                  <z-checkbox zId="p2-activity-private-profile" />
                  <z-field-content>
                    <label z-field-label for="p2-activity-private-profile">
                      Make profile private and hide activity
                    </label>
                    <p z-field-description>
                      Enabling this will hide your contributions and activity from your GitHub profile and from social
                      features like followers, stars, feeds, leaderboards and releases.
                    </p>
                  </z-field-content>
                </z-field>
              </z-field-group>
            </fieldset>
          </z-field-group>
        </form>
      </z-card-content>
      <z-card-footer>
        <button type="submit" form="p2-contributions-activity" z-button class="style-sera:w-full">Save Changes</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02ContributionsActivityComponent {}
