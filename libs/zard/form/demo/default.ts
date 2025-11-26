import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ZardButtonComponent } from '@ngzard/ui/button';
import { generateId } from '@ngzard/ui/core';
import { ZardInputDirective } from '@ngzard/ui/input';

import { ZardFormModule } from '../form.module';

@Component({
  selector: 'zard-demo-form-default',
  imports: [FormsModule, ZardButtonComponent, ZardInputDirective, ZardFormModule],
  standalone: true,
  template: `
    <form class="max-w-sm space-y-6">
      <z-form-field>
        <label z-form-label zRequired [for]="idFullName">Full Name</label>
        <z-form-control>
          <input
            z-input
            type="text"
            [id]="idFullName"
            placeholder="Enter your full name"
            [(ngModel)]="fullName"
            name="fullName"
          />
        </z-form-control>
        <z-form-message>This is your display name.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label zRequired [for]="idEmail">Email</label>
        <z-form-control>
          <input z-input type="email" [id]="idEmail" placeholder="Enter your email" [(ngModel)]="email" name="email" />
        </z-form-control>
        <z-form-message>We'll never share your email with anyone else.</z-form-message>
      </z-form-field>

      <z-form-field>
        <label z-form-label [for]="idBio">Bio</label>
        <z-form-control>
          <textarea
            z-input
            [id]="idBio"
            placeholder="Tell us about yourself"
            rows="3"
            [(ngModel)]="bio"
            name="bio"
          ></textarea>
        </z-form-control>
        <z-form-message>Optional: Brief description about yourself.</z-form-message>
      </z-form-field>

      <button z-button zType="default" type="submit">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ZardDemoFormDefaultComponent {
  protected readonly idFullName = generateId('fullName');
  protected readonly idEmail = generateId('email');
  protected readonly idBio = generateId('bio');

  fullName = '';
  email = '';
  bio = '';
}
