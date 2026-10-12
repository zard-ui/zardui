import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';

import { ZardButtonComponent } from '@zard/components/button/button.component';
import { ZardCardImports } from '@zard/components/card/card.imports';
import { ZardFieldImports } from '@zard/components/field/field.imports';
import { ZardInputComponent } from '@zard/components/input/input.component';
import { ZardTextareaComponent } from '@zard/components/textarea/textarea.component';

/** zard has no NativeSelect: a plain `<select>` styled as an input, with the same chevron shadcn draws. */
@Component({
  selector: 'z-preview-02-github-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, ZardButtonComponent, ZardCardImports, ZardFieldImports, ZardInputComponent, ZardTextareaComponent],
  viewProviders: [provideIcons({ lucideChevronDown })],
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
              <div data-slot="native-select-wrapper" class="group/native-select relative w-full">
                <select id="p2-email" data-slot="native-select" class="cn-input appearance-none pr-8 outline-none">
                  <option value="m@shadcn.com" class="bg-[Canvas] text-[CanvasText]">m&#64;shadcn.com</option>
                  <option value="m@gmail.com" class="bg-[Canvas] text-[CanvasText]">m&#64;gmail.com</option>
                </select>
                <ng-icon
                  name="lucideChevronDown"
                  aria-hidden="true"
                  class="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 opacity-50 select-none"
                />
              </div>
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
