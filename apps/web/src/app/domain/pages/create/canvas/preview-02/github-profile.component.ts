import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardNativeSelectDirective } from '@zard/components/native-select/native-select.directive';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

@Component({
  selector: 'z-preview-02-github-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardCardImports,
    ZardFieldImports,
    ZardInputComponent,
    ZardNativeSelectDirective,
    ZardTextareaComponent,
  ],
  host: { class: 'block' },
  template: `
    <z-card class="mx-auto w-full max-w-md">
      <z-card-header>
        <z-card-title zTitle="Profile" />
        <z-card-description zDescription="Manage your profile information." />
      </z-card-header>
      <z-card-content>
        <form id="p2-profile" (submit)="$event.preventDefault()">
          <z-field-group>
            <z-field>
              <label z-field-label for="p2-name">Name</label>
              <input z-input id="p2-name" placeholder="shadcn" />
              <p z-field-description>
                Your name may appear around GitHub where you contribute or are mentioned. You can remove it at any time.
              </p>
            </z-field>
            <z-field>
              <label z-field-label for="p2-email">Public Email</label>
              <select z-native-select id="p2-email">
                <option value="m@shadcn.com">m&#64;shadcn.com</option>
                <option value="m@gmail.com">m&#64;gmail.com</option>
              </select>
              <!-- prettier-ignore -->
              <p z-field-description>
                You can manage verified email addresses in your
                <a href="#email-settings" (click)="$event.preventDefault()">email settings</a>.
              </p>
            </z-field>
            <z-field>
              <label z-field-label for="p2-bio">Bio</label>
              <textarea z-textarea id="p2-bio" placeholder="Tell us a little bit about yourself"></textarea>
              <p z-field-description>
                You can
                <span>&#64;mention</span>
                other users and organizations to link to them.
              </p>
            </z-field>
          </z-field-group>
        </form>
      </z-card-content>
      <z-card-footer>
        <button type="submit" form="p2-profile" z-button class="style-sera:w-full">Save Profile</button>
      </z-card-footer>
    </z-card>
  `,
})
export class Preview02GithubProfileComponent {}
