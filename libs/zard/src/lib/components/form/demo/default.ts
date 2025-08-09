import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '../../button/button.component';
import { ZardInputDirective } from '../../input/input.directive';
import { ZardFormModule } from '../form.module';

@Component({
  selector: 'zard-demo-form-default',
  standalone: true,
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective, ZardFormModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <form class="space-y-6 max-w-sm">
      <z-form-field>
        <label z-form-label zRequired for="fullName">Full Name</label>
        <z-form-control>
          <input z-input type="text" id="fullName" placeholder="Enter your full name" [(ngModel)]="fullName" name="fullName" />
        </z-form-control>
        <z-form-message>This is your display name.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label zRequired for="email">Email</label>
        <z-form-control>
          <input z-input type="email" id="email" placeholder="Enter your email" [(ngModel)]="email" name="email" />
        </z-form-control>
        <z-form-message>We'll never share your email with anyone else.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label for="bio">Bio</label>
        <z-form-control>
          <textarea z-input id="bio" placeholder="Tell us about yourself" rows="3" [(ngModel)]="bio" name="bio"></textarea>
        </z-form-control>
        <z-form-message>Optional: Brief description about yourself.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit">Submit</button>
    </form>
  `,
})
export class ZardDemoFormDefaultComponent {
  fullName = '';
  email = '';
  bio = '';
}
